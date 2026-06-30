package com.ruoyi.system.service.impl;

import com.ruoyi.system.domain.KbDocument;
import com.ruoyi.system.mapper.KbDocumentMapper;
import com.ruoyi.system.service.IKbDocumentService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KbDocumentServiceImpl implements IKbDocumentService
{
    @Autowired
    private KbDocumentMapper kbDocumentMapper;

    @Override
    public KbDocument selectKbDocumentById(Long documentId)
    {
        return kbDocumentMapper.selectKbDocumentById(documentId);
    }

    @Override
    public List<KbDocument> selectKbDocumentList(KbDocument document)
    {
        return kbDocumentMapper.selectKbDocumentList(document);
    }

    @Override
    public int insertKbDocument(KbDocument document)
    {
        return kbDocumentMapper.insertKbDocument(document);
    }

    @Override
    public int updateKbDocument(KbDocument document)
    {
        return kbDocumentMapper.updateKbDocument(document);
    }

    @Override
    public int markProcessing(Long documentId, String updateBy)
    {
        KbDocument document = new KbDocument();
        document.setDocumentId(documentId);
        document.setStatus(KbDocument.STATUS_PROCESSING);
        document.setChunkCount(0);
        document.setErrorMessage("");
        document.setUpdateBy(updateBy);
        return kbDocumentMapper.updateKbDocument(document);
    }

    @Override
    public int markDone(Long documentId, Integer chunkCount, String collectionName, String updateBy)
    {
        KbDocument document = new KbDocument();
        document.setDocumentId(documentId);
        document.setStatus(KbDocument.STATUS_DONE);
        document.setChunkCount(chunkCount);
        document.setCollectionName(collectionName);
        document.setErrorMessage("");
        document.setUpdateBy(updateBy);
        return kbDocumentMapper.updateKbDocument(document);
    }

    @Override
    public int markFailed(Long documentId, String errorMessage, String updateBy)
    {
        KbDocument document = new KbDocument();
        document.setDocumentId(documentId);
        document.setStatus(KbDocument.STATUS_FAILED);
        document.setErrorMessage(errorMessage);
        document.setUpdateBy(updateBy);
        return kbDocumentMapper.updateKbDocument(document);
    }

    @Override
    public int deleteKbDocumentByIds(Long[] documentIds)
    {
        return kbDocumentMapper.deleteKbDocumentByIds(documentIds);
    }
}
