# AGENTS.md

本文件给 Codex/Agent 快速了解项目使用，减少每次进入仓库都全量扫描。它只记录稳定的项目结构、常用命令和协作约定；具体业务细节仍以代码、SQL 和 README 为准。

## 项目概览

这是一个 RuoYi React 后台管理系统，当前仓库包含三部分：

- Java 后端：Spring Boot 3.3、Spring Security、JWT、Redis、MyBatis/MyBatis-Plus、PageHelper、Druid、Quartz。
- React 前端：React 19、Umi Max、Ant Design、ProComponents、TypeScript。
- Python 知识库服务：FastAPI、LangGraph、文档解析、embedding、Chroma 向量库。

## 目录职责

- `ruoyi-admin`：后端启动模块和 Web Controller，启动类是 `com.ruoyi.RuoYiApplication`。
- `ruoyi-framework`：安全认证、Redis、数据源、MyBatis 配置、Web 资源映射、全局基础配置。
- `ruoyi-system`：系统管理业务，包括用户、角色、菜单、部门、岗位、字典、参数等 domain/service/mapper。
- `ruoyi-common`：公共工具、注解、常量、通用实体、文件工具、Excel 工具。
- `ruoyi-quartz`：定时任务和任务日志。
- `ruoyi-generator`：代码生成器。
- `react-ui`：React 前端工程，页面在 `src/pages`，接口在 `src/services`，类型在 `src/types`。
- `python-kb`：Python 知识库服务，FastAPI 路由在 `app/api/routes`，配置在 `app/core`，工作流在 `app/graph`。
- `sql`：数据库初始化脚本，主要是 `ry_react.sql` 和 `quartz.sql`。

## 后端约定

- 使用 JDK 17；如果 Maven 读到 JDK 8，先临时设置 `JAVA_HOME` 到 JDK 17。
- Spring Boot 版本由根目录 `pom.xml` 管理。
- MyBatis 配置在 `ruoyi-framework/src/main/java/com/ruoyi/framework/config/MyBatisConfig.java`。
- 当前同时引入 MyBatis 和 MyBatis-Plus；现有 XML Mapper 继续兼容，新增模块可逐步使用 `BaseMapper<T>`。
- 新增业务表的 Mapper、Search 查询对象和 Service 生成约束见 `doc/mapper.md`。
- MyBatis XML 位于各模块 `src/main/resources/mapper/**`，类型别名和 mapper 扫描配置在 `ruoyi-admin/src/main/resources/application.yml`。
- 新增管理模块通常按 Controller 放 `ruoyi-admin`，domain/service/mapper 放 `ruoyi-system`。
- 改菜单、权限、业务表时，同步维护 `sql/ry_react.sql`。

## 前端约定

- `react-ui/package.json` 要求 Node.js `>=22.0.0`。
- 常用页面基于 Ant Design ProComponents，列表页通常使用 `ProTable`。
- 页面目录：`react-ui/src/pages/<Module>/<Page>`。
- 接口文件：`react-ui/src/services/<module>`。
- 类型文件：`react-ui/src/types/<module>`。
- 路由静态补充在 `react-ui/config/routes.ts`；运行时菜单主要由后端菜单接口返回。
- 权限按钮通常使用 `useAccess()` 和 `access.hasPerms('xxx:yyy:zzz')` 控制。

## Python KB 约定

- `python-kb` 是独立 FastAPI 服务，默认端口 `8001`。
- 启动方式：

```bash
cd python-kb
python -m venv .venv
.venv\Scripts\activate
pip install -e ".[dev]"
copy .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

- 配置通过 `.env` 读取，示例在 `.env.example`。
- 文档解析、embedding 和 Chroma 入库逻辑放在 `app/services`。
- FastAPI 路由放在 `app/api/routes`，Pydantic schema 放在 `app/schemas`。

## 常用验证命令

后端编译：

```powershell
$env:JAVA_HOME='C:\Program Files\Java\jdk-17'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
mvn -pl ruoyi-admin -am -DskipTests compile
```

前端类型检查：

```bash
cd react-ui
npm run tsc
```

Python 测试：

```bash
cd python-kb
python -m pytest
```

## 协作注意

- 工作区可能有用户或其他 Agent 的未提交改动；不要重置、覆盖或回滚无关文件。
- 新增后端接口时同步考虑菜单权限、前端按钮权限和 SQL 初始化。
- 新增文件上传能力时优先复用 RuoYi 的 `RuoYiConfig`、`FileUploadUtils`、`FileUtils`。
- 不要在仓库文件中写入真实密钥、访问令牌、生产数据库地址或其他私密配置。
- 这个文件只记录稳定导航信息，不记录临时需求、当前 diff 或一次性排障过程。
