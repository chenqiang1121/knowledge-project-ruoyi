package com.ruoyi.system.domain;

import com.ruoyi.common.core.domain.BaseEntity;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

public class KbDocument extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    public static final String STATUS_PENDING = "0";
    public static final String STATUS_PROCESSING = "1";
    public static final String STATUS_DONE = "2";
    public static final String STATUS_FAILED = "3";

    private Long documentId;
    private String originalName;
    private String storedName;
    private String fileType;
    private Long fileSize;
    private String filePath;
    private String status;
    private Integer chunkCount;
    private String collectionName;
    private String errorMessage;

    public Long getDocumentId()
    {
        return documentId;
    }

    public void setDocumentId(Long documentId)
    {
        this.documentId = documentId;
    }

    public String getOriginalName()
    {
        return originalName;
    }

    public void setOriginalName(String originalName)
    {
        this.originalName = originalName;
    }

    public String getStoredName()
    {
        return storedName;
    }

    public void setStoredName(String storedName)
    {
        this.storedName = storedName;
    }

    public String getFileType()
    {
        return fileType;
    }

    public void setFileType(String fileType)
    {
        this.fileType = fileType;
    }

    public Long getFileSize()
    {
        return fileSize;
    }

    public void setFileSize(Long fileSize)
    {
        this.fileSize = fileSize;
    }

    public String getFilePath()
    {
        return filePath;
    }

    public void setFilePath(String filePath)
    {
        this.filePath = filePath;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public Integer getChunkCount()
    {
        return chunkCount;
    }

    public void setChunkCount(Integer chunkCount)
    {
        this.chunkCount = chunkCount;
    }

    public String getCollectionName()
    {
        return collectionName;
    }

    public void setCollectionName(String collectionName)
    {
        this.collectionName = collectionName;
    }

    public String getErrorMessage()
    {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage)
    {
        this.errorMessage = errorMessage;
    }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
                .append("documentId", getDocumentId())
                .append("originalName", getOriginalName())
                .append("storedName", getStoredName())
                .append("fileType", getFileType())
                .append("fileSize", getFileSize())
                .append("filePath", getFilePath())
                .append("status", getStatus())
                .append("chunkCount", getChunkCount())
                .append("collectionName", getCollectionName())
                .append("errorMessage", getErrorMessage())
                .append("createBy", getCreateBy())
                .append("createTime", getCreateTime())
                .append("updateBy", getUpdateBy())
                .append("updateTime", getUpdateTime())
                .append("remark", getRemark())
                .toString();
    }
}
