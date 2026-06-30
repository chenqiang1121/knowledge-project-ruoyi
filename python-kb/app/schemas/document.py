from pydantic import BaseModel, Field


class DocumentIngestRequest(BaseModel):
    document_id: int = Field(..., gt=0)
    file_path: str
    file_name: str
    file_type: str
    collection_name: str | None = None


class DocumentIngestResponse(BaseModel):
    document_id: int
    status: str
    chunk_count: int
    collection_name: str


class VectorDeleteResponse(BaseModel):
    document_id: int
    status: str
    deleted: int
