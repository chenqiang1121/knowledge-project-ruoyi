package com.ruoyi.system.service;

import com.ruoyi.system.domain.KbDocument;
import java.util.List;

public interface IKbDocumentService
{
    public KbDocument selectKbDocumentById(Long documentId);

    public List<KbDocument> selectKbDocumentList(KbDocument document);

    public int insertKbDocument(KbDocument document);

    public int updateKbDocument(KbDocument document);

    public int markProcessing(Long documentId, String updateBy);

    public int markDone(Long documentId, Integer chunkCount, String collectionName, String updateBy);

    public int markFailed(Long documentId, String errorMessage, String updateBy);

    public int deleteKbDocumentByIds(Long[] documentIds);
}
