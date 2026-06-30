declare namespace API.Kb {
  export interface Document {
    documentId: number;
    originalName: string;
    storedName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    status: string;
    chunkCount: number;
    collectionName: string;
    errorMessage: string;
    createBy: string;
    createTime: Date;
    updateBy: string;
    updateTime: Date;
    remark: string;
  }

  export interface DocumentListParams {
    originalName?: string;
    fileType?: string;
    status?: string;
    createTime?: string;
    pageSize?: string;
    current?: string;
  }

  export interface DocumentPageResult {
    code: number;
    msg: string;
    total: number;
    rows: Array<Document>;
  }

  export interface DocumentInfoResult {
    code: number;
    msg: string;
    data: Document;
  }
}
