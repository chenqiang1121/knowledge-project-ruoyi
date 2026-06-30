package com.ruoyi.web.controller.kb;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.system.domain.KbDocument;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class PythonKbClient
{
    private final KbProperties kbProperties;

    private final HttpClient httpClient;

    public PythonKbClient(KbProperties kbProperties)
    {
        this.kbProperties = kbProperties;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(kbProperties.getTimeoutSeconds()))
                .build();
    }

    public IngestResult ingest(KbDocument document, String localFilePath)
    {
        Map<String, Object> body = new HashMap<>();
        body.put("document_id", document.getDocumentId());
        body.put("file_path", localFilePath);
        body.put("file_name", document.getOriginalName());
        body.put("file_type", document.getFileType());
        body.put("collection_name", kbProperties.getCollectionName());

        JSONObject json = post("/api/documents/ingest", body);
        IngestResult result = new IngestResult();
        result.setChunkCount(json.getIntValue("chunk_count"));
        result.setCollectionName(json.getString("collection_name"));
        return result;
    }

    public void deleteVectors(Long documentId)
    {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(trimBaseUrl() + "/api/documents/" + documentId + "/vectors"))
                .timeout(Duration.ofSeconds(kbProperties.getTimeoutSeconds()))
                .DELETE()
                .build();
        try
        {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400)
            {
                throw new ServiceException("删除向量失败: " + response.body());
            }
        }
        catch (IOException e)
        {
            throw new ServiceException("无法连接 Python 知识库服务: " + e.getMessage());
        }
        catch (InterruptedException e)
        {
            Thread.currentThread().interrupt();
            throw new ServiceException("删除向量请求被中断");
        }
    }

    private JSONObject post(String path, Map<String, Object> body)
    {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(trimBaseUrl() + path))
                .timeout(Duration.ofSeconds(kbProperties.getTimeoutSeconds()))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(JSON.toJSONString(body)))
                .build();
        try
        {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400)
            {
                throw new ServiceException("Python 知识库服务返回错误: " + response.body());
            }
            return JSON.parseObject(response.body());
        }
        catch (IOException e)
        {
            throw new ServiceException("无法连接 Python 知识库服务: " + e.getMessage());
        }
        catch (InterruptedException e)
        {
            Thread.currentThread().interrupt();
            throw new ServiceException("Python 知识库请求被中断");
        }
    }

    private String trimBaseUrl()
    {
        return kbProperties.getPythonBaseUrl().replaceAll("/+$", "");
    }

    public static class IngestResult
    {
        private Integer chunkCount;
        private String collectionName;

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
    }
}
