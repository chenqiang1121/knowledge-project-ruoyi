import { request } from '@umijs/max';

export async function getDocumentList(params?: API.Kb.DocumentListParams) {
  return request<API.Kb.DocumentPageResult>('/api/kb/document/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params,
  });
}

export function getDocument(documentId: number) {
  return request<API.Kb.DocumentInfoResult>(`/api/kb/document/${documentId}`, {
    method: 'GET',
  });
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request<API.Result>('/api/kb/document/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}

export async function ingestDocument(documentId: number) {
  return request<API.Result>(`/api/kb/document/${documentId}/ingest`, {
    method: 'POST',
  });
}

export async function removeDocument(ids: string) {
  return request<API.Result>(`/api/kb/document/${ids}`, {
    method: 'DELETE',
  });
}

export function downloadDocument(documentId: number) {
  window.location.href = `/api/kb/document/${documentId}/download`;
}
