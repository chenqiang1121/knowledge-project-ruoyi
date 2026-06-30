package com.ruoyi.common.core.domain;

import java.io.Serial;
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

import com.alibaba.fastjson2.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.ruoyi.common.constant.HttpStatus;
import com.ruoyi.common.utils.StringUtils;

/**
 * 操作消息提醒
 *
 * @author ruoyi
 */
public class AjaxResult<T> implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 状态码
     */
    public static final String CODE_TAG = "code";

    /**
     * 返回内容
     */
    public static final String MSG_TAG = "msg";

    /**
     * 数据对象
     */
    public static final String DATA_TAG = "data";

    /**
     * 状态码
     */
    private Integer code;

    /**
     * 返回内容
     */
    private String msg;

    /**
     * 数据对象
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;

    /**
     * 扩展字段，用于兼容原 Map 风格的顶层返回字段
     */
    private final Map<String, Object> extras = new LinkedHashMap<>();

    /**
     * 初始化一个新创建的 AjaxResult 对象，使其表示一个空消息。
     */
    public AjaxResult() {
    }

    /**
     * 初始化一个新创建的 AjaxResult 对象
     *
     * @param code 状态码
     * @param msg  返回内容
     */
    public AjaxResult(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    /**
     * 初始化一个新创建的 AjaxResult 对象
     *
     * @param code 状态码
     * @param msg  返回内容
     * @param data 数据对象
     */
    public AjaxResult(int code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        if (StringUtils.isNotNull(data)) {
            this.data = data;
        }
    }

    /**
     * 返回成功消息
     *
     * @return 成功消息
     */
    public static AjaxResult<Void> success() {
        return AjaxResult.success("操作成功");
    }

    /**
     * 返回成功数据
     *
     * @return 成功消息
     */
    public static <T> AjaxResult<T> success(T data) {
        return AjaxResult.success("操作成功", data);
    }

    /**
     * 返回成功消息
     *
     * @param msg 返回内容
     * @return 成功消息
     */
    public static AjaxResult<Void> success(String msg) {
        return AjaxResult.success(msg, null);
    }

    /**
     * 返回成功消息
     *
     * @param msg  返回内容
     * @param data 数据对象
     * @return 成功消息
     */
    public static <T> AjaxResult<T> success(String msg, T data) {
        return new AjaxResult<>(HttpStatus.SUCCESS, msg, data);
    }

    /**
     * 返回警告消息
     *
     * @param msg 返回内容
     * @return 警告消息
     */
    public static AjaxResult<Void> warn(String msg) {
        return AjaxResult.warn(msg, null);
    }

    /**
     * 返回警告消息
     *
     * @param msg  返回内容
     * @param data 数据对象
     * @return 警告消息
     */
    public static <T> AjaxResult<T> warn(String msg, T data) {
        return new AjaxResult<>(HttpStatus.WARN, msg, data);
    }

    /**
     * 返回错误消息
     *
     * @return 错误消息
     */
    public static AjaxResult<Void> error() {
        return AjaxResult.error("操作失败");
    }

    /**
     * 返回错误消息
     *
     * @param msg 返回内容
     * @return 错误消息
     */
    public static AjaxResult<Void> error(String msg) {
        return AjaxResult.error(msg, null);
    }

    /**
     * 返回错误消息
     *
     * @param msg  返回内容
     * @param data 数据对象
     * @return 错误消息
     */
    public static <T> AjaxResult<T> error(String msg, T data) {
        return new AjaxResult<>(HttpStatus.ERROR, msg, data);
    }

    /**
     * 返回错误消息
     *
     * @param code 状态码
     * @param msg  返回内容
     * @return 错误消息
     */
    public static AjaxResult<Void> error(int code, String msg) {
        return new AjaxResult<>(code, msg, null);
    }

    /**
     * 是否为成功消息
     *
     * @return 结果
     */
    @JsonIgnore
    @JSONField(serialize = false)
    public boolean isSuccess() {
        return Objects.equals(HttpStatus.SUCCESS, this.code);
    }

    /**
     * 是否为警告消息
     *
     * @return 结果
     */
    @JsonIgnore
    @JSONField(serialize = false)
    public boolean isWarn() {
        return Objects.equals(HttpStatus.WARN, this.code);
    }

    /**
     * 是否为错误消息
     *
     * @return 结果
     */
    @JsonIgnore
    @JSONField(serialize = false)
    public boolean isError() {
        return Objects.equals(HttpStatus.ERROR, this.code);
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    /**
     * 获取指定返回字段
     *
     * @param key 键
     * @return 值
     */
    public Object get(String key) {
        if (CODE_TAG.equals(key)) {
            return code;
        }
        if (MSG_TAG.equals(key)) {
            return msg;
        }
        if (DATA_TAG.equals(key)) {
            return data;
        }
        return extras.get(key);
    }

    @JsonAnyGetter
    @JSONField(unwrapped = true)
    public Map<String, Object> getExtras() {
        return extras;
    }

    /**
     * 方便链式调用
     *
     * @param key   键
     * @param value 值
     * @return 数据对象
     */
    @JsonAnySetter
    @SuppressWarnings("unchecked")
    public AjaxResult<T> put(String key, Object value) {
        if (CODE_TAG.equals(key)) {
            this.code = (Integer) value;
        } else if (MSG_TAG.equals(key)) {
            this.msg = (String) value;
        } else if (DATA_TAG.equals(key)) {
            this.data = (T) value;
        } else {
            this.extras.put(key, value);
        }
        return this;
    }
}
