package com.ruoyi.web.controller.kb;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.config.RuoYiConfig;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.file.FileUploadUtils;
import com.ruoyi.common.utils.file.FileUtils;
import com.ruoyi.common.utils.file.MimeTypeUtils;
import com.ruoyi.system.domain.KbDocument;
import com.ruoyi.system.service.IKbDocumentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.List;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/kb/document")
public class KbDocumentController extends BaseController
{
    private static final String[] KB_ALLOWED_EXTENSION = { "pdf", "docx", "txt", "md" };

    @Autowired
    private IKbDocumentService kbDocumentService;

    @Autowired
    private PythonKbClient pythonKbClient;

    @PreAuthorize("@ss.hasPermi('kb:document:list')")
    @GetMapping("/list")
    public TableDataInfo list(KbDocument document)
    {
        startPage();
        List<KbDocument> list = kbDocumentService.selectKbDocumentList(document);
        return getDataTable(list);
    }

    @PreAuthorize("@ss.hasPermi('kb:document:query')")
    @GetMapping("/{documentId}")
    public AjaxResult getInfo(@PathVariable Long documentId)
    {
        return success(kbDocumentService.selectKbDocumentById(documentId));
    }

    @PreAuthorize("@ss.hasPermi('kb:document:upload')")
    @Log(title = "知识库文件", businessType = BusinessType.INSERT)
    @PostMapping("/upload")
    public AjaxResult upload(@RequestParam("file") MultipartFile file) throws Exception
    {
        if (file.isEmpty())
        {
            return error("上传文件不能为空");
        }
        String extension = FileUploadUtils.getExtension(file).toLowerCase();
        if (!FileUploadUtils.isAllowedExtension(extension, KB_ALLOWED_EXTENSION))
        {
            return error("仅支持 pdf、docx、txt、md 文件");
        }

        String filePath = FileUploadUtils.upload(RuoYiConfig.getUploadPath() + "/kb", file, KB_ALLOWED_EXTENSION);
        KbDocument document = new KbDocument();
        document.setOriginalName(file.getOriginalFilename());
        document.setStoredName(FileUtils.getName(filePath));
        document.setFileType(extension);
        document.setFileSize(file.getSize());
        document.setFilePath(filePath);
        document.setStatus(KbDocument.STATUS_PENDING);
        document.setChunkCount(0);
        document.setCollectionName("");
        document.setErrorMessage("");
        document.setCreateBy(getUsername());
        kbDocumentService.insertKbDocument(document);

        AjaxResult ajax = success(document);
        ajax.put("documentId", document.getDocumentId());
        return ajax;
    }

    @PreAuthorize("@ss.hasPermi('kb:document:ingest')")
    @Log(title = "知识库文件解析入库", businessType = BusinessType.UPDATE)
    @PostMapping("/{documentId}/ingest")
    public AjaxResult ingest(@PathVariable Long documentId)
    {
        KbDocument document = kbDocumentService.selectKbDocumentById(documentId);
        if (document == null)
        {
            return error("文件不存在");
        }

        kbDocumentService.markProcessing(documentId, getUsername());
        try
        {
            String localFilePath = toLocalFilePath(document.getFilePath());
            PythonKbClient.IngestResult result = pythonKbClient.ingest(document, localFilePath);
            kbDocumentService.markDone(documentId, result.getChunkCount(), result.getCollectionName(), getUsername());
            return success("解析入库成功");
        }
        catch (ServiceException e)
        {
            kbDocumentService.markFailed(documentId, StringUtils.substring(e.getMessage(), 0, 1000), getUsername());
            throw e;
        }
        catch (Exception e)
        {
            kbDocumentService.markFailed(documentId, StringUtils.substring(e.getMessage(), 0, 1000), getUsername());
            throw new ServiceException("解析入库失败: " + e.getMessage());
        }
    }

    @PreAuthorize("@ss.hasPermi('kb:document:download')")
    @GetMapping("/{documentId}/download")
    public void download(@PathVariable Long documentId, HttpServletResponse response, HttpServletRequest request)
            throws Exception
    {
        KbDocument document = kbDocumentService.selectKbDocumentById(documentId);
        if (document == null)
        {
            throw new ServiceException("文件不存在");
        }
        String localFilePath = toLocalFilePath(document.getFilePath());
        response.setContentType(MimeTypeUtils.getExtension(document.getFileType()));
        FileUtils.setAttachmentResponseHeader(response, document.getOriginalName());
        FileUtils.writeBytes(localFilePath, response.getOutputStream());
    }

    @PreAuthorize("@ss.hasPermi('kb:document:remove')")
    @Log(title = "知识库文件", businessType = BusinessType.DELETE)
    @DeleteMapping("/{documentIds}")
    public AjaxResult remove(@PathVariable Long[] documentIds)
    {
        for (Long documentId : documentIds)
        {
            KbDocument document = kbDocumentService.selectKbDocumentById(documentId);
            if (document == null)
            {
                continue;
            }
            pythonKbClient.deleteVectors(documentId);
            FileUtils.deleteFile(toLocalFilePath(document.getFilePath()));
        }
        return toAjax(kbDocumentService.deleteKbDocumentByIds(documentIds));
    }

    private String toLocalFilePath(String resourcePath)
    {
        if (StringUtils.isEmpty(resourcePath) || !resourcePath.startsWith(Constants.RESOURCE_PREFIX))
        {
            throw new ServiceException("文件路径非法");
        }
        String relativePath = resourcePath.substring(Constants.RESOURCE_PREFIX.length()).replace("/", File.separator);
        return FilenameUtils.normalize(RuoYiConfig.getProfile() + relativePath);
    }
}
