# MyBatis-Plus Mapper / Service 生成规则

本文档约束 Java 后端新增业务表时的 Mapper、Search 查询对象和 Service 生成方式。目标是让新代码优先使用 MyBatis-Plus 的基础能力，同时保持项目现有 RuoYi 分层风格。

## 适用范围

- 适用于新建业务表、新增管理模块、新增独立 CRUD 模块。
- 不强制改造历史模块；旧模块仍可继续使用现有 XML Mapper。
- 复杂 SQL、联表查询、统计查询可以继续补充 XML，但默认 CRUD 不再生成 XML。

## Mapper 规则

新表生成的 Mapper 必须继承 MyBatis-Plus `BaseMapper<Entity>`。

示例：

```java
package com.ruoyi.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ruoyi.system.domain.KbDocument;

public interface KbDocumentMapper extends BaseMapper<KbDocument>
{
}
```

约束：

- Mapper 接口命名为 `{Entity}Mapper`。
- Mapper 泛型实体必须是对应表的 domain/entity 类。
- 默认不生成 `insertXxx`、`updateXxx`、`selectXxxList` 等手写 CRUD 方法。
- 默认不生成 XML CRUD。
- 如果存在复杂 SQL，允许新增 XML，namespace 必须指向对应 Mapper。

## Search 查询对象规则

每个新表必须生成一个查询对象，命名为 `{Entity}Search`，例如 `KbDocumentSearch`。

放置位置：

- 优先放在对应业务包的 `domain` 包中。
- 如果该模块已经有 `search`、`dto` 等明确约定，则按该模块现有约定放置。

字段约束：

- 只包含列表查询和分页查询需要的关键字段。
- 不要完整复制 Entity 的所有字段。
- 常见字段包括：名称/标题关键字、状态、类型、创建时间范围、更新时间范围、业务编号等。
- 时间范围建议使用 `beginTime` / `endTime` 或业务更明确的命名。

方法约束：

- 必须提供 `buildWrapper()` 方法。
- 返回类型优先使用 `LambdaQueryWrapper<Entity>`。
- 查询条件统一在 `buildWrapper()` 中构造。

示例：

```java
package com.ruoyi.system.domain;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ruoyi.common.utils.StringUtils;

public class KbDocumentSearch
{
    private String originalName;
    private String fileType;
    private String status;

    public LambdaQueryWrapper<KbDocument> buildWrapper()
    {
        LambdaQueryWrapper<KbDocument> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.isNotEmpty(originalName), KbDocument::getOriginalName, originalName);
        wrapper.eq(StringUtils.isNotEmpty(fileType), KbDocument::getFileType, fileType);
        wrapper.eq(StringUtils.isNotEmpty(status), KbDocument::getStatus, status);
        wrapper.orderByDesc(KbDocument::getCreateTime);
        return wrapper;
    }

    public String getOriginalName()
    {
        return originalName;
    }

    public void setOriginalName(String originalName)
    {
        this.originalName = originalName;
    }

    public String getFileType()
    {
        return fileType;
    }

    public void setFileType(String fileType)
    {
        this.fileType = fileType;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }
}
```

`buildWrapper()` 约束：

- 字符串模糊查询使用 `like`，精确字段使用 `eq`。
- 状态、类型、枚举类字段默认使用 `eq`。
- 时间范围使用 `ge` / `le` 或 `between`。
- 排序规则在 Search 中统一声明，默认按创建时间倒序。
- 不在 Controller 中拼装 MyBatis-Plus 查询条件。

## Service 规则

Service 不继承 MyBatis-Plus `IService`、`ServiceImpl` 或项目自定义 BaseService。

Service 接口默认只生成 4 个方法：

```java
int insert(Entity entity);

int update(Entity entity);

List<Entity> queryList(EntitySearch search);

Page<Entity> queryPage(EntitySearch search);
```

示例：

```java
package com.ruoyi.system.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ruoyi.system.domain.KbDocument;
import com.ruoyi.system.domain.KbDocumentSearch;
import java.util.List;

public interface IKbDocumentService
{
    int insert(KbDocument document);

    int update(KbDocument document);

    List<KbDocument> queryList(KbDocumentSearch search);

    Page<KbDocument> queryPage(KbDocumentSearch search);
}
```

ServiceImpl 默认通过 Mapper 调用 BaseMapper 能力：

```java
package com.ruoyi.system.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ruoyi.system.domain.KbDocument;
import com.ruoyi.system.domain.KbDocumentSearch;
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
    public int insert(KbDocument document)
    {
        return kbDocumentMapper.insert(document);
    }

    @Override
    public int update(KbDocument document)
    {
        return kbDocumentMapper.updateById(document);
    }

    @Override
    public List<KbDocument> queryList(KbDocumentSearch search)
    {
        return kbDocumentMapper.selectList(search.buildWrapper());
    }

    @Override
    public Page<KbDocument> queryPage(KbDocumentSearch search)
    {
        Page<KbDocument> page = new Page<>();
        return kbDocumentMapper.selectPage(page, search.buildWrapper());
    }
}
```

## 分页约束

- Service 层分页返回 MyBatis-Plus `Page<Entity>`。
- Controller 如果需要继续返回 RuoYi `TableDataInfo`，在 Controller 层适配。
- 不在 Service 接口中直接依赖 Controller 的分页返回对象。

## 命名约束

- Mapper：`{Entity}Mapper`
- 查询对象：`{Entity}Search`
- Service 接口：`I{Entity}Service`
- Service 实现：`{Entity}ServiceImpl`
- Service 方法固定命名：`insert`、`update`、`queryList`、`queryPage`
- 不使用 `insert{Entity}`、`update{Entity}`、`select{Entity}List` 这类旧式方法名。

## 生成器约束

如果后续调整 `ruoyi-generator` 模板：

- Mapper 模板生成 `extends BaseMapper<Entity>`。
- 生成 `{Entity}Search` 类和 `buildWrapper()`。
- Service 模板只生成本文档规定的 4 个方法。
- 默认不生成 Mapper XML CRUD。
- 复杂 SQL 由具体业务按需补充，不作为默认生成内容。
