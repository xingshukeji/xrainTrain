---
title: 资料总索引与适用版本
---
# 资料总索引与适用版本

课程提供完成基础学习所需的正文、请求说明和完整样例。以下上游资料用于进一步核对正式合同，**skills-hub 和 Workforce 源码链接可能需要组织仓库权限**。本次匿名访问 skills-hub 返回 404；没有权限时不必等待这些链接才能学习 G0—B7。

## 适用范围与真实验证

本版于 2026-10-25 核对 skills-hub 提交 `f6e10f6` 的 9 个技能入口、21 份业务专题及 HTTP 样例。Workforce 消费者示例固定于 `e7f17fc`。目标环境后续升级时，应以实际接口、公开类型和返回核对差异。

| 已核验的内容 | 本次结果 |
|---|---|
| 便签包 1.0.0 | 服务端构建、Host 原包导入、租户预检与安装成功 |
| 便签记录 | 创建、回读、修改、筛选查询、空值拒绝和并发冲突均得到预期结果 |
| 记录可见性 | 固定普通测试身份访问该教学记录被拒绝；维护者使用专门的教学对象权限 |
| 平台查看 | 数据视图“学习便签”中可见“你好，XRain”；新增表单有内容输入与保存入口 |
| 便签包 1.0.1 | 保持对象、字段和记录 ID，只修改字段标签为“便签内容”；原内容保留 |
| 固定输入函数 | 调试入口输入 name 为“学习者”，得到“你好，学习者” |
| Task 字段消费者 | 核对元数据、服务映射、路由及页面源码；没有执行完整 Task 写入练习 |

这些是课程维护者对明确样例的验证，不代表每位学习者已完成操作，也不证明所有平台接口和所有目标环境可用。真实环境信息与凭据由环境维护者提供；公开课程不内置账号。

## 专题资料

以下链接固定在同一上游提交，避免正文依据随主分支漂移。未来课程更新时同时复核来源、示例和预期结果。

| 原资料 | 在课程中查什么 |
|---|---|
| [平台分工](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/platform.md) | [能力地图](/map)：从业务问题选择能力 |
| [业务主线](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/business-mainlines.md) | [综合练习](/topics/workforce)：先明确动作与结果 |
| [建模](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/modeling.md) | [B1](/basics/model)、[B4](/basics/fields) |
| [对象基础](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/object-foundation.md) | 定义、系统字段与归属 |
| [初始化平台](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/initialized-platform.md) | [环境准备](/help/environment) |
| [元数据与界面](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/metadata-and-ui.md) | [字段](/basics/fields)、[页面消费者](/topics/workforce) |
| [业务 API](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/business-api.md) | [接口文档入口](/reference/) |
| [数据操作](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/data-operations.md) | [B3](/basics/data)、[数据专题](/topics/data) |
| [授权](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/authorization.md) | [B5 身份与权限](/basics/access) |
| [组织与协作](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/organization-and-collaboration.md) | [归属与分享](/topics/data#记录归属与分享) |
| [生命周期](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/lifecycle.md) | [B6](/basics/version)、[安装维护](/topics/operations) |
| [配置与 API 身份](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/configuration-and-api.md) | [配置与调用身份](/topics/integration#配置与调用身份) |
| [自动化](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/automation.md) | [函数、Trigger 与 Routine](/topics/automation) |
| [集成](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/integration.md) | [HTTP 集成](/topics/integration) |
| [地区与时间](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/regional-context.md) | [字段类型](/basics/fields)、[执行时间](/topics/automation#时间与执行人) |
| [公共服务](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/shared-services.md) | [文件、消息与投递](/topics/integration) |
| [个人邮箱](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/personal-email.md) | [个人邮箱身份与引用](/topics/integration#个人邮箱是另一种身份范围) |
| [智能体接入](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/agent-access.md) | [AI 使用资格](/topics/workforce) |
| [业务实现](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/implementation.md) | [服务、页面与工具](/topics/workforce) |
| [企业案例](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/enterprise-case.md) | 完成基础课后的业务主线扩展 |
| [API 验证记录](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/api-verification.md) | 历史实测范围与合同差异 |

## 技能入口

| 原入口 | 何时需要 |
|---|---|
| [业务开发](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/SKILL.md) | 从业务目标选择模型、接口、页面与工具 |
| [XRain CLI](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-cli/SKILL.md) | 命令行登录、元数据、数据和应用包 |
| [认证](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-auth/SKILL.md) | 固定身份与正常登录恢复 |
| [访问诊断](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-access-diagnosis/SKILL.md) | 登录后的 403、准入与数据范围 |
| [人员生命周期](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-business-user-lifecycle/SKILL.md) | 人员接入、协作与职责变化 |
| [应用操作](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-app-operations/SKILL.md) | 安装、升级、冲突与恢复 |
| [运行维护](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-runtime/SKILL.md) | 启动、恢复及核对运行效果 |
| [智能体排障](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-agent-troubleshoot/SKILL.md) | 不回复、重复消息、工具与会话问题 |
| [已有流水线](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/cicd/SKILL.md) | 按项目既有入口执行构建与交付 |

## CLI、样例与接口发现

- CLI 的[安装](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-cli/references/installation.md)、[配置](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-cli/references/configuration.md)和[命令](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-cli/references/commands.md)按分发版本核对；本课程入口在[工具参考](/reference/tools)。
- 上游[HTTP 合同样例](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/assets/http-contract-samples.json)用于比较数据结构，不表示能向任意目标重放全部请求。
- 本课程完整的[基础源码](/downloads/note-source.json)、[标签升级源码](/downloads/note-label-source.json)、[创建值](/downloads/note-values.json)、[查询条件](/downloads/note-query.json)与[固定输入函数](/downloads/greeting.json)可以直接取得，不依赖上游仓库权限。
- 当前目标的在线目录见[接口文档](/reference/)。历史记录曾出现部分目录和 OpenAPI 请求 500；本版没有重新验证所有目录，不宣称统一 Swagger/ReDoc 网站已可用。

## 维护这份课程

课程正文、SVG、练习、示例和站点源码在[独立 GitHub 仓库](https://github.com/xingshukeji/xrainTrain)共同维护。网站的 `/version.json` 记录构建所用的提交，可与 GitHub Actions 的发布记录对应。

更新 API 或 CLI 说明时，先固定来源与版本，修订受影响的例子，再执行内容检查、构建和必要实操。课堂反馈可以指出缺口，但不能代替正式合同或实际结果。
