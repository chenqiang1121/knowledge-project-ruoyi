package com.ruoyi.web.controller.kb;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "kb")
public class KbProperties
{
    private String pythonBaseUrl = "http://localhost:8001";

    private int timeoutSeconds = 60;

    private String collectionName = "ruoyi_kb";

    public String getPythonBaseUrl()
    {
        return pythonBaseUrl;
    }

    public void setPythonBaseUrl(String pythonBaseUrl)
    {
        this.pythonBaseUrl = pythonBaseUrl;
    }

    public int getTimeoutSeconds()
    {
        return timeoutSeconds;
    }

    public void setTimeoutSeconds(int timeoutSeconds)
    {
        this.timeoutSeconds = timeoutSeconds;
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
