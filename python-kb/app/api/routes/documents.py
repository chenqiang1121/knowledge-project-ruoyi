from fastapi import APIRouter

from app.core.config import settings
from app.schemas.document import (
    DocumentIngestRequest,
    DocumentIngestResponse,
    VectorDeleteResponse,
)
from app.services.document_ingest import delete_document_vectors, ingest_document

router = APIRouter()


@router.get("/health")
async def document_health() -> dict[str, str]:
    return {"status": "ok", "collection": settings.chroma_collection}


@router.post("/ingest", response_model=DocumentIngestResponse)
async def ingest(request: DocumentIngestRequest) -> DocumentIngestResponse:
    chunk_count, collection_name = ingest_document(
        document_id=request.document_id,
        file_path=request.file_path,
        file_name=request.file_name,
        file_type=request.file_type,
        collection_name=request.collection_name,
    )
    return DocumentIngestResponse(
        document_id=request.document_id,
        status="success",
        chunk_count=chunk_count,
        collection_name=collection_name,
    )


@router.delete("/{document_id}/vectors", response_model=VectorDeleteResponse)
async def delete_vectors(document_id: int) -> VectorDeleteResponse:
    deleted = delete_document_vectors(document_id=document_id)
    return VectorDeleteResponse(document_id=document_id, status="success", deleted=deleted)
