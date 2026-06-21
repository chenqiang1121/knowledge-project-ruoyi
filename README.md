## 平台简介

项目链接：https://gitee.com/whiteshader/ruoyi-react

微服务分支：https://gitee.com/whiteshader/ruoyi-react/tree/spring-cloud-v3/

若依(Ruoyi-React)是一套全部开源的快速开发平台，毫无保留给个人及企业免费使用。

* 前端采用React 19、Ant Design Pro 6、TypeScript 6。
* 后端采用JDK17, Spring Boot v3、Spring Security、Redis & Jwt。
* 权限认证使用Jwt，支持多终端认证系统。
* 支持加载动态权限菜单，多方式轻松权限控制。
* 高效率开发，使用代码生成器可以一键生成前后端代码。

## 项目结构与依赖环境

### 项目结构

- `ruoyi-admin`：后端启动模块，入口类为 `com.ruoyi.RuoYiApplication`。
- `ruoyi-framework`：Spring Security、Redis、数据源、全局异常、拦截器等基础框架能力。
- `ruoyi-system`：用户、角色、菜单、部门、岗位、字典、参数等系统管理业务。
- `ruoyi-quartz`：定时任务模块。
- `ruoyi-generator`：代码生成模块。
- `ruoyi-common`：公共工具、注解、常量、通用实体。
- `react-ui`：React + Umi Max + Ant Design Pro 前端工程。
- `sql`：数据库初始化脚本，包含 `ry_react.sql` 与 `quartz.sql`。

### 后端运行依赖

- JDK：17。
- Maven：建议 3.8+。
- MySQL：建议 8.x，当前驱动版本为 `mysql-connector-j 8.2.0`。
- Redis：默认连接 `localhost:6379`。
- Spring Boot：3.3.0。
- 主要后端组件：Spring Security、MyBatis、PageHelper、Druid、Fastjson2、JWT、Springdoc OpenAPI、Quartz、Apache POI、Velocity。

后端启动前需要先导入 `sql/ry_react.sql` 和 `sql/quartz.sql`，并检查 `ruoyi-admin/src/main/resources/application-druid.yml` 中的数据库连接配置。

### 前端运行依赖

- Node.js：`react-ui/package.json` 声明为 `>=22.0.0`；当前依赖链中的 `lint-staged@17`、`listr2@10` 要求 Node 22，建议使用 Node.js 22 LTS。
- npm：建议使用随 Node 22 附带的 npm 10+。
- 前端核心依赖：React 19、React DOM 19、Umi Max 4、Ant Design 6、Ant Design Pro Components 3、TypeScript 6、Tailwind CSS 4、Biome、Jest。

前端安装与启动：

```bash
cd react-ui
npm install
npm run dev
```

### react-ui 中 npm install 失败原因与升级处理

升级前 `react-ui/package.json` 中存在如下配置：

```json
"overrides": {
  "react": "$react",
  "react-dom": "$react-dom"
}
```

在本地使用 Node `v20.19.5`、npm `10.8.2` 执行 `npm install` 时，npm 在构建依赖树阶段报错：

```text
npm error Unable to resolve reference $react
```

直接原因是 npm 无法解析 `overrides` 中的 `$react` / `$react-dom` 引用。当前已按升级方式删除该 `overrides` 配置，并将 `engines.node` 调整为 `>=22.0.0`，使前端依赖声明与升级后的工具链要求保持一致。

重新安装建议：

1. 使用 Node.js 22 LTS。
2. 删除旧的 `node_modules` 和 `package-lock.json`。
3. 执行 `npm install`，重新生成与当前依赖配置一致的锁文件。


## 内置功能

1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.  部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3.  岗位管理：配置系统用户所属担任职务。
4.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。
5.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6.  字典管理：对系统中经常使用的一些较为固定的数据进行维护。
7.  参数管理：对系统动态配置常用参数。
8.  通知公告：系统通知公告信息发布维护。
9.  操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
10. 登录日志：系统登录日志记录查询包含登录异常。
11. 在线用户：当前系统中活跃用户状态监控。
12. 定时任务：在线（添加、修改、删除)任务调度包含执行结果日志。
13. 代码生成：前后端代码的生成（java、html、xml、sql）支持CRUD下载 。
14. 系统接口：根据业务代码自动生成相关的api接口文档。
15. 服务监控：监视当前系统CPU、内存、磁盘、堆栈等相关信息。
16. 在线构建器：拖动表单元素生成相应的HTML代码。
17. 连接池监视：监视当前系统数据库连接池状态，可进行分析SQL找出系统性能瓶颈。

## 在线体验

- admin/admin123  
- ry/123456

演示地址：暂时没有
 
https://gitee.com/whiteshader/ruoyi-cloud-vben/blob/master/ruoyi-react-demo-2023-04-27.gif

## 前端开发注意事项

Node：`package.json` 声明为 `>=22.0.0`，建议使用 Node.js 22 LTS

安装依赖请执行：npm install

正常启动请运行: npm run dev

Mock测试模式请运行: npm run start

发布打包请运行: npm run build

## 相关技术文档

### 后端说明文档
http://doc.ruoyi.vip/ruoyi-cloud/

### TypeScript
https://www.tslang.cn/docs/home.html

### React Js
https://react.docschina.org/docs/getting-started.html

### Ant Design 
https://ant.design/components/overview-cn/

### Ant Design Pro
https://pro.ant.design/zh-CN/docs/overview

### Ant Design Chart
https://charts.ant.design/zh

### Umi Js
https://umijs.org/docs/introduce/introduce

## 部署
http://doc.ruoyi.vip/ruoyi-vue/document/hjbs.html#nginx%E9%85%8D%E7%BD%AE

## 演示图

<table>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-9996b274886e8134066ccee096fde2089dd.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-66afe06885d34482862536e4f00c87c0475.png"/></td>
    </tr>    
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-f279ee4e419e9ba80a77fd898ebd8c9ac45.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-b56c891e29d1dfd0213b000339effd256db.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-26d4a0f56967f4c319d6e95cab9652bdbfe.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-125aed48a8214551cb2ce5aa5a1403d78e9.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-59bc1efe5d8f109e56305aa86192ff56bb0.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-6e081044a6f864c96df9a25aaa26516f7fc.png"/></td>
    </tr>
	<tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-ed2e67f41c8a56e0db1215645a0d9dd1e52.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-2788241f7893ac8fbfd2b84813f60451755.png"/></td>
    </tr>
	<tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-eda1770f6383e0001439b56c3392012213d.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-31c487d7419b16bc79de0d6a6a12789f048.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-31c487d7419b16bc79de0d6a6a12789f048.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-4d8cd86ba198f0263f90a0bd36c47b0317b.png"/></td>
    </tr>
	<tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-6d0ba703a00f8b02a0540931c9e67fe816c.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-376159966aa67e7e2fdd971bf68fb0a3375.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-77b186361c754bd9abc6beac7b2dd371858.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-800aba850793feb11e52720153a801cc2e5.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-8835cf289be21d9ed81974764670d78d120.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-31a968948be45abb0a30bd7b69fd9bee501.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-ed8b654a35b70d5b14281c7d5f086658e27.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-e7f3e329aa2052d32f64a372f25ad9f5df1.png"/></td>
    </tr>
</table>


## 若依(Ruoyi-React)前后端分离交流群

QQ群： [![加入QQ群](https://img.shields.io/badge/201396349-blue.svg)](https://jq.qq.com/?_wv=1027&k=u58VEEQK) 点击按钮入群。


## 感谢捐赠的伙伴,谢谢你们的支持
