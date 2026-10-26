---
title: 接口文档从哪里开始
---
# 接口文档从哪里开始

先选要做的操作，再查请求。平台提供 OpenAPI 3.1 文档，按业务功能分组，支持搜索、接口直达链接和 JSON 下载。基础记录接口也可以使用本课程速查；SDK、CLI 和应用包按各自的文档使用。

## 在线分组文档

使用环境维护者提供的平台地址，先以已有租户管理员账号登录获准租户，再打开左侧导航中的“API 访问 → 接口文档”。也可以在平台地址后加 `/api-center?tab=documentation` 直达。

| 想找什么 | 文档分组 |
|---|---|
| 记录增删改查、分页、统计、导出 | 业务数据 |
| 对象、字段、访问范围 | 对象与字段 |
| 列表视图、选项、记录类型 | 列表视图、选项列表、记录类型 |
| 登录、成员、角色、API Token | 登录与租户、成员与组织、角色与权限、API 凭据与目录 |
| 应用包与应用功能 | 应用包与安装、应用功能 |
| 编排、定时任务和外部接口 | 业务编排、自动化任务、HTTP 集成 |
| 文件、邮件、飞书和短信 | 文件与存储、邮件、飞书消息、短信 |

搜索可以使用中文接口名称、操作标识或路径。选中接口后查看认证方式、请求参数、成功响应和错误响应；复制地址栏链接可直接回到该接口。页面版本对应当前部署，下载的 OpenAPI JSON 包含同一版本。

完整租户规范覆盖平台的租户接口，包括仅接受登录令牌的管理接口；它不表示每个接口都接受 API Token。Host 管理接口不进入租户文档。租户自行配置的业务 HTTP 接口另由“HTTP 集成”中的目录列出输入变量。

### 从分组完成一次只读调用

1. 在“业务数据”中搜索“读取查询能力与限制”，确认方法为 `GET`、路径为 `/api/data/v1/query-capabilities`，并查看所需权限。
2. 完成[正常登录](/help/environment#学习者准备一次正常登录)，沿用终端中的 `$base` 和 `$headers`。
3. 运行下面的请求：

```powershell
$uri = "$base/api/data/v1/query-capabilities"
$capabilities = Invoke-RestMethod -Uri $uri -Headers $headers
$capabilities.limits
$capabilities.fieldTypes.PSObject.Properties.Name
```

成功返回 200，响应包含 `fieldTypes`、`operatorSets`、`operators` 和 `limits`，与文档中的成功响应对照。这个请求只读取查询能力，不创建记录。403 表示当前账号缺少对应权限；由维护者按已有角色处理，不更换身份绕过。

### 下载机器可读规范

在文档页选择下载，也可由有权限的租户管理员使用原登录会话执行：

```powershell
$catalog = '/api/service/authen/v1/security/tenant-api-catalog'
$uri = "$base$catalog" + '?catalog=directory&format=openapi'
Invoke-WebRequest -Uri $uri -Headers $headers `
  -OutFile './xrain-openapi.json'
$spec = Get-Content './xrain-openapi.json' -Raw | ConvertFrom-Json
$spec.info | Select-Object title, version
```

规范下载需要租户管理员登录令牌；API Token 不能代替该管理会话。下载文件可用于接口工具导入和客户端生成；动态业务字段仍应按当前租户的对象 `describe` 核对。

## 按操作查文档

| 我要做什么 | 先看哪里 |
|---|---|
| 创建、读取、修改、删除记录 | [HTTP 单条记录](/reference/http#单条记录) |
| 筛选、分页、统计 | [HTTP 查询与统计](/reference/http#查询与统计) |
| 查字段类型、必填项和当前用户权限 | [元数据与当前身份](/reference/http#元数据与当前身份) |
| 使用命令行 | [CLI 安装与登录](/reference/tools#cli-命令与安装) |
| 在应用代码中调用平台 | [SDK](/reference/tools#sdk-用公开导出和类型) |
| 构建、导入、安装应用包 | [应用包操作](/reference/tools#构建导入与安装) |
| 调用函数、编排、Trigger 或 Routine | [自动化专题](/topics/automation) |
| 调用外部服务、处理文件和消息 | [集成专题](/topics/integration) |
| 找其他功能或原始资料 | [能力地图](/map)、[资料索引](/reference/sources) |

每次调用前，确认**方法与路径、参数、权限、成功返回和错误返回**。写操作还要确认会改变哪些数据。

## 从当前平台查询配置

下面是接口相对路径，需要拼接平台地址并携带登录凭据。

| 路径 | 能查到什么 |
|---|---|
| `GET /api/metadata/v1/business-objects` | 当前可见的业务对象 |
| `GET /api/metadata/v1/entities/{entityCode}/describe` | 指定对象的字段、视图与权限 |
| `GET /api/data/v1/query-capabilities` | 支持的字段类型、操作符和查询限制 |
| `GET /api/service/authen/v1/account/context` | 当前用户、租户和地区设置 |
| `GET /api/orchestration/v1/callables` | 编排可调用的函数 |

具有对应管理权限时，还可以查询：

| 路径 | 用途 |
|---|---|
| `GET /api/metadata/v1/standards/entity-design` | 模型设计标准 |
| `GET /api/service/authen/v1/security/tenant-api-catalog?catalog=external` | 已登记的对外接口及调用权限 |
| `GET /api/service/authen/v1/security/tenant-api-catalog?catalog=directory&format=openapi` | 完整租户接口的 OpenAPI 3.1 规范 |

`catalog=external` 是兼容保留的对外接口子集；查完整租户接口使用上面的分组文档或 `catalog=directory`。目录失败时记录目标地址、部署版本、状态码和错误代码，再由维护者排查；版本与实测范围见[资料索引](/reference/sources#适用范围与真实验证)。

`api-debug` 和编排调试会真实执行代码，其中的写入或发送操作也会生效。

想练习自己查接口，完成 [B2 的查询题](/basics/api#自己做一次)。
