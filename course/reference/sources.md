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
| 数据专题 | Money 精确回读、Picklist value/label、Lookup、分页 1/总数 3/合计 60.90、去重、唯一查询、queryBatch、批量冲突回滚、个人视图、分享后撤销、历史、导出与回收站恢复得到预期结果 |
| Trigger | Before Insert 拒绝后同标题记录数仍为 0；验证后回读教学 Trigger 已停用 |
| 只读集成 | 按实际 catalog 调用只读测试接口；外层 200、远端 200、业务内容符合预期；未发送消息 |
| 时间 | 核对当地重复时刻的两个候选及 25 小时业务日；Routine 调度预览成功 |
| SDK | 通过当前应用所安装 SDK 的公开导出读取 context、describe、自己的便签及 queryBatch，核对实际返回形状 |
| CLI 数据与初始化 | 使用正常原生登录 Bearer 运行 describe、创建、回读与查询；复用固定维护者，重复关联原有 18 项教学权限后，人物与权限保持一致 |
| Task 字段消费者 | 核对指定提交的元数据、服务映射、路由及页面；实际创建并重新打开本人的合成 Task，ID 与内容一致 |
| 网页与样例 | 全部 23 页、8 道题、7 个分步图解；检查下载字节与文件名、搜索、深层刷新和本地记录 |

以下项目没有达到完整实操通过条件，继续保留其真实边界：

| 项目 | 本次实际结果 |
|---|---|
| CLI 浏览器登录与应用包命令 | 已核对正式统一登录入口；目标缺少已关联且加入租户的可用统一身份，未完成浏览器登录后的应用包 CLI 操作；通用数据命令已按上表单独实跑 |
| Routine 实际运行 | 未配置执行成员；预览和拒绝路径已核对，没有活动运行，保持原配置 |
| 附件上传、关联与再打开 | 应用未配置文件服务凭据；实际上传返回 503，消息未发送，没有 fileId |
| AI 工具读取 Task | 当前人物没有可用助手；已完成合成 Task 页面回读，未执行 AI 工具 |
| 个人邮箱 | 当前账号列表为空；没有读取或发送邮件 |
| 视图修改后的运行可用性 | 曾持续返回 runtime_metadata_not_ready；维护者调用同一安装的 check 恢复读取，原值保留。平台根因未修复 |

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
- 本课程完整的[基础源码](/downloads/note-source.json)、[标签升级源码](/downloads/note-label-source.json)、[创建值](/downloads/note-values.json)、[查询条件](/downloads/note-query.json)、[固定输入函数](/downloads/greeting.json)和[独立专题样例](/topics/data#先准备独立的专题数据)可以直接取得，不依赖上游仓库权限。
- 当前目标的在线目录见[接口文档](/reference/)。历史记录曾出现部分目录和 OpenAPI 请求 500；本版没有重新验证所有目录，不宣称统一 Swagger/ReDoc 网站已可用。

## 维护这份课程

课程正文、SVG、练习、示例和站点源码在[独立 GitHub 仓库](https://github.com/xingshukeji/xrainTrain)共同维护。网站的 `/version.json` 记录构建所用的提交，可与 GitHub Actions 的发布记录对应。

更新 API 或 CLI 说明时，先固定来源与版本，修订受影响的例子，再执行内容检查、构建和必要实操。课堂反馈可以指出缺口，但不能代替正式合同或实际结果。
