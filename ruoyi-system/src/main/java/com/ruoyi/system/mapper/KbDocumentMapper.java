package com.ruoyi.system.mapper;

import com.ruoyi.system.domain.KbDocument;
import java.util.List;

public interface KbDocumentMapper
{
    public KbDocument selectKbDocumentById(Long documentId);

    public List<KbDocument> selectKbDocumentList(KbDocument document);

    public int insertKbDocument(KbDocument document);

    public int updateKbDocument(KbDocument document);

    public int deleteKbDocumentById(Long documentId);

    public int deleteKbDocumentByIds(Long[] documentIds);
}
