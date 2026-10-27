---
title: 开发资料目录
description: 按开发任务连接 skills-hub 的全部业务专题、AI 技能、CLI 与 HTTP 示例，直接提供公开 Markdown。
---
# 开发资料目录

以下链接直接打开公开 Markdown，AI 无需执行网页脚本。资料来自 [skills-hub](https://github.com/xingshukeji/skills-hub) 默认分支；读取一个专题后，继续打开其中与当前任务有关的相对链接。

**开发任务从业务开发技能进入；准确参数和限制查对应专题。** 当前环境的对象、权限和版本仍由实际平台与项目类型确定。

## 业务与实现选择

| 原始资料 | 解决什么问题 |
|---|---|
| [平台分工](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/platform.md) | 选择 XRain 原生建模、现有系统 API 或混合实现 |
| [业务主线](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/business-mainlines.md) | 从实际工作连接人员、业务动作、实现与继续维护 |
| [初始化基础](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/initialized-platform.md) | 复用全员权限、User 和既有资源，区分内置与业务扩展 |
| [企业销售案例](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/enterprise-case.md) | 对照模型、计算、公共宿主、页面与工具的一种实际组合 |

## 模型、数据与权限 {#模型数据与权限}

| 原始资料 | 解决什么问题 |
|---|---|
| [建模](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/modeling.md) | 对象、字段、关联、源数据与应用包格式 |
| [对象基础](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/object-foundation.md) | 11 个系统字段、默认行为、已有约束及需要业务新增的事实 |
| [数据操作](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/data-operations.md) | CRUD、筛选、分页、统计、批量、并发与返回值 |
| [授权](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/authorization.md) | 参与者、动作、字段、记录范围和执行主体 |
| [组织与协作](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/organization-and-collaboration.md) | 成员、组织、分享、Owner 转移及记录关系 |
| [元数据与前端](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/metadata-and-ui.md) | 字段呈现、视图、有效访问、脱敏及页面消费 |
| [地区与时间](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/regional-context.md) | Date、DateTime、时区、业务日与精确数值 |

## 接口、配置与版本

| 原始资料 | 解决什么问题 |
|---|---|
| [业务 API](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/business-api.md) | 公开 HTTP 方法、路径、请求与返回结构 |
| [配置与 API 身份](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/configuration-and-api.md) | 设置、变量、API Token、目录与调用主体 |
| [生命周期](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/lifecycle.md) | 定义、租户覆盖、安装、变更影响、冲突与恢复 |
| [API 验证范围](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/api-verification.md) | 已验证版本、具体行为、未验证项及历史限制 |

[在线 OpenAPI 与下载方法](/reference/)说明怎样从获准平台取得当前规范。完整租户规范不包含 Host 管理接口，也不表示所有接口接受 API Token。动态字段使用当前对象 describe 核对。

## 自动化、集成与公共服务 {#自动化集成与公共服务}

| 原始资料 | 解决什么问题 |
|---|---|
| [自动化](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/automation.md) | 函数、编排、callable、Before/After Trigger 与 Routine |
| [系统集成](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/integration.md) | Connector、HTTP 请求、身份映射、失败与跨系统结果 |
| [公共服务](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/shared-services.md) | 文件、消息、Task、通知与投递的接入和结果 |
| [个人邮箱](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/personal-email.md) | 个人邮箱身份、邮件引用、读取与草稿等能力 |

## 页面、业务服务与 AI {#页面业务服务与-ai}

| 原始资料 | 解决什么问题 |
|---|---|
| [业务实现与接入](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/implementation.md) | 业务服务、公共包、宿主页面、工具声明与处理器接线 |
| [Workforce SDK](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/workforce-sdk.md) | 官方包取得方式、适用版本、公开导出、记录调用与执行上下文 |
| [智能体使用条件](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/references/agent-access.md) | 定义、助手、使用资格、工具配置及实际业务权限 |

## 按问题选择完整技能

| Skill 原文 | 使用时机 |
|---|---|
| [workforce-business-development](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/SKILL.md) | 从业务需求落实模型、权限、逻辑、页面、集成和工具 |
| [xrain-cli](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-xrain-cli/SKILL.md) | 平台连接、元数据、记录、权限和应用包操作 |
| [xrain-auth](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-xrain-auth/SKILL.md) | 已有固定身份、正常登录与认证接入恢复 |
| [xrain-access-diagnosis](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-xrain-access-diagnosis/SKILL.md) | 登录后 403、准入、角色与数据范围问题 |
| [xrain-business-user-lifecycle](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-xrain-business-user-lifecycle/SKILL.md) | 人员接入、实际使用、协作与职责变化 |
| [xrain-app-operations](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-xrain-app-operations/SKILL.md) | 安装、升级、冲突、中断与卸载 |
| [workforce-runtime](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-runtime/SKILL.md) | 所属应用的启动、恢复、运行版本与性能定位 |
| [workforce-agent-troubleshoot](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-agent-troubleshoot/SKILL.md) | AI 不回复、工具失败、重复消息与会话问题 |
| [cicd](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-cicd/SKILL.md) | 使用目标项目已有流水线执行获准构建与交付 |

技能需要配套脚本时，取得完整目录，保留相对文件结构。CLI 的[安装](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-xrain-cli/references/installation.md)、[配置](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-xrain-cli/references/configuration.md)和[命令参考](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-xrain-cli/references/commands.md)按所用副本查阅。

## 教学输入与结构示例

- [HTTP 数据结构样例](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/shzw-workforce-business-development/assets/http-contract-samples.json)：用于理解各层数据结构，不表示可以向任何环境重放请求。
- [完整便签案例](/ai/note-case)：连接可下载资源、记录读写、权限检查和标签升级。
- [独立数据专题](/topics/data)：包含 Money、选项、Lookup、查询统计、批量及历史等练习。
- [本站 Markdown 全文](/llms-full.txt)：便于一次取得课程和本指南，进一步知识按本页原始资料读取。
