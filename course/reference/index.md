---
title: 接口文档从哪里开始
---
# 接口文档从哪里开始

这页是日常查阅入口。先选你要完成的动作，再进入 HTTP、CLI、SDK 或包格式的对应资料。**在线目录只覆盖它实际登记的接口，不能替代全部业务合同。**

## 按问题查文档

| 我想做什么 | 先看哪里 | 还要核对什么 |
|---|---|---|
| 保存、读取、修改便签 | [HTTP 记录接口](/reference/http#单条记录) | 对象 API 名、真实 recordId、values、当前身份 |
| 分页、筛选、统计 | [查询合同](/reference/http#查询与统计) | 字段和操作符能力、当前页与总量的区别 |
| 知道当前字段与访问能力 | [元数据接口](/reference/http#元数据与当前身份) | describe 的有效定义和 object.access |
| 确认我是谁、当前租户 | [context](/reference/http#元数据与当前身份) | userId、tenantId、scope；不要输出会话 |
| 用命令完成操作 | [CLI](/reference/tools#cli-命令与安装) | 当前分发版本、对应命令 --help、JSON 输出外层 |
| 在程序中使用平台 | [SDK](/reference/tools#sdk-用公开导出和类型) | 实际安装版本、公开导出、字段精度与错误结构 |
| 编写、构建和安装应用包 | [包格式与操作](/reference/tools#构建导入与安装) | kind/values 与 HTTP DTO 区别、目标版本与修订 |
| 在流程里调用函数 | [自动化](/topics/automation) | 目标 callables、签名、输入与执行资格 |
| 调用外部服务 | [集成](/topics/integration) | 连接器、已登记请求、接口调用路径与远端身份 |
| 找其他能力的资料 | [资料总索引](/reference/sources) | 资料范围、来源版本和验证边界 |

## 当前目标可以告诉你的信息

这些是合同中的相对路径。拼接你实际获准的 `$base`，带该接口认可的身份调用；它们不是匿名文档网站。

| 读取路径 | 用途 |
|---|---|
| `GET /api/metadata/v1/business-objects` | 当前可见的业务对象目录 |
| `GET /api/metadata/v1/entities/{entityCode}/describe` | 该对象当前有效字段、视图与访问信息 |
| `GET /api/metadata/v1/standards/entity-design` | 目标提供的模型设计标准，按管理准入使用 |
| `GET /api/data/v1/query-capabilities` | 字段类型、操作符与查询限制 |
| `GET /api/service/authen/v1/account/context` | 当前身份、租户及地区上下文 |
| `GET /api/service/authen/v1/security/tenant-api-catalog?catalog=external` | 已登记对外接口的准入与可调用信息，按管理资格访问 |
| `GET /api/orchestration/v1/callables` | 编排可调用能力目录；具体输入还要结合签名和专题合同 |

需要 OpenAPI 格式时，先查目标是否实际支持对应格式。历史资料中曾记录目录扩展与 OpenAPI 返回 500；这既不是当前目标必然失败，也不是可以假装拿到了完整规范。保留真实结果，使用已可取得的正式合同。

`api-debug` 和编排调试可能真实写入或触发投递。名称里含“调试”不代表是不会产生副作用的沙盒。

## 已提供的接口族

| 接口族 | 课程入口 | 学习深度 |
|---|---|---|
| 模型、字段、视图、候选、设计标准 | [HTTP](/reference/http)、[B4](/basics/fields) | 基础会读，管理按职责 |
| 记录读写、查询、统计、历史、分享 | [HTTP](/reference/http)、[数据专题](/topics/data) | 基础读写，其余按需 |
| 当前身份、成员、组织、授权 | [B5](/basics/access) | 基础判断，授权管理按职责 |
| 接口目录、Token、调试 | [配置与调用身份](/topics/integration#配置与调用身份) | 先认识用途 |
| 用户设置与平台变量 | [集成专题](/topics/integration#配置与调用身份) | 配置需求出现时使用 |
| 包构建、市场、导入、安装、操作 | [工具与包](/reference/tools) | 基础理解生效链 |
| 函数、编排、应用函数选择 | [自动化](/topics/automation) | 逻辑开发按需 |
| Trigger、Routine、运行记录 | [自动化](/topics/automation) | 事件和定时场景按需 |
| Connector、Request、HTTP Interface | [集成](/topics/integration) | 外部系统接入按需 |
| 地区、当地时刻解析、业务日 | [时间与执行人](/topics/automation#时间与执行人) | 所用类型必须正确处理 |
| 删除影响、失败变更、回收站 | [维护](/topics/operations) | 维护者深入 |
| 应用准入、消息资格、助手资格 | [Workforce](/topics/workforce) | 应用及 AI 接入按需 |
| 组织通知与个人邮箱 | [集成](/topics/integration) | 分别学习，不混身份 |
| 文件上传、查询、访问与业务引用 | [文件与附件](/topics/integration#文件与附件) | 附件功能按需 |
| Workforce 消息、Task、协作与 Runtime | [综合练习](/topics/workforce) | 基础课之后 |

上面各族的原始资料入口和 21 份专题参考见[资料总索引](/reference/sources)。你应能找到所有相关资料；不需要把全部端点一次记住。

## 每次调用前读完这七项

目的、方法与路径、身份与租户、输入位置及类型、成功返回、失败返回、副作用。选一个未直接照抄过的查询，按 [B2 的练习](/basics/api#自己做一次)自己找到合同，再执行和核对。
