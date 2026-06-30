from pathlib import Path

from fastapi import HTTPException

from app.core.config import settings


def load_document_text(file_path: str, file_type: str) -> str:
    path = Path(file_path)
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

    suffix = file_type.lower().lstrip(".")
    if suffix == "pdf":
        return _load_pdf(path)
    if suffix == "docx":
        return _load_docx(path)
    if suffix in {"txt", "md"}:
        return path.read_text(encoding="utf-8", errors="ignore")
    raise HTTPException(status_code=400, detail="Only pdf, docx, txt and md files are supported")


def split_text(text: str) -> list[str]:
    normalized = "\n".join(line.strip() for line in text.splitlines())
    normalized = "\n".join(line for line in normalized.splitlines() if line)
    if not normalized:
        raise HTTPException(status_code=400, detail="Document has no extractable text")

    chunks: list[str] = []
    start = 0
    chunk_size = max(settings.chunk_size, 200)
    overlap = min(max(settings.chunk_overlap, 0), chunk_size // 2)
    while start < len(normalized):
        end = min(start + chunk_size, len(normalized))
        chunks.append(normalized[start:end])
        if end >= len(normalized):
            break
        start = end - overlap
    return chunks


def ingest_document(
    *,
    document_id: int,
    file_path: str,
    file_name: str,
    file_type: str,
    collection_name: str | None,
) -> tuple[int, str]:
    chunks = split_text(load_document_text(file_path, file_type))
    collection = _get_collection(collection_name)

    delete_document_vectors(document_id=document_id, collection_name=collection.name)
    embeddings = _embed(chunks)
    ids = [f"{document_id}:{index}" for index in range(len(chunks))]
    metadatas = [
        {
            "document_id": str(document_id),
            "chunk_index": index,
            "source_name": file_name,
            "file_type": file_type.lower().lstrip("."),
        }
        for index in range(len(chunks))
    ]
    collection.add(ids=ids, documents=chunks, embeddings=embeddings, metadatas=metadatas)
    return len(chunks), collection.name


def delete_document_vectors(*, document_id: int, collection_name: str | None = None) -> int:
    collection = _get_collection(collection_name)
    existing = collection.get(where={"document_id": str(document_id)}, include=[])
    ids = existing.get("ids", [])
    if ids:
        collection.delete(ids=ids)
    return len(ids)


def _load_pdf(path: Path) -> str:
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def _load_docx(path: Path) -> str:
    from docx import Document

    document = Document(str(path))
    return "\n".join(paragraph.text for paragraph in document.paragraphs)


def _embed(chunks: list[str]) -> list[list[float]]:
    if not settings.openai_api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured")

    from openai import OpenAI

    client = OpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url)
    response = client.embeddings.create(model=settings.embedding_model, input=chunks)
    return [item.embedding for item in response.data]


def _get_collection(collection_name: str | None = None):
    import chromadb

    client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
    return client.get_or_create_collection(name=collection_name or settings.chroma_collection)
