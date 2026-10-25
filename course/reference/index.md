---
title: 接口文档从哪里开始
---
# 接口文档从哪里开始

先选要做的操作，再查请求。基础记录接口可以直接使用本课程速查；SDK、CLI 和应用包按各自的文档使用。

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

在线目录只列出已经登记的接口。需要 OpenAPI 时，先确认当前平台是否支持；目录请求失败可转查本页静态资料，已知版本限制见[资料索引](/reference/sources#适用范围与真实验证)。

`api-debug` 和编排调试会真实执行代码，其中的写入或发送操作也会生效。

想练习自己查接口，完成 [B2 的查询题](/basics/api#自己做一次)。
