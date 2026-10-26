---
title: 资料总索引与适用版本
---
# 资料总索引与适用版本

这页供查来源和版本。基础课所需说明、请求和样例已包含在课程中；进一步阅读 skills-hub 或 Workforce 源码时，可能需要组织仓库权限。

## 适用范围与真实验证

完整 OpenAPI 文档核对日期为 **2026-10-26**，平台版本为 `0.1.0-ci.20261026.31`，来源提交为 `f1cde12`。其余 HTTP 和业务样例保留 2026-10-25 的验证范围，对应 skills-hub `f6e10f6`；CLI 对应 `f4c4861`，Workforce 字段例子对应 `e7f17fc`，Task 读取练习需要包含 `c00c3b2` 修复的应用。下方链接分别固定到对应资料版本。

下面记录维护者已经验证的具体样例。其他环境升级后，按实际接口和类型检查差异。

::: details 展开样例验证记录

| 已核验的内容 | 本次结果 |
|---|---|
| 完整 OpenAPI 文档（2026-10-26） | 线上 29 个功能分组、386 个租户接口；中文搜索、直达链接刷新、页面版本和 JSON 下载通过，调用地址与实际公开入口一致；兼容对外子集保留 31 个接口 |
| 从文档完成只读调用（2026-10-26） | 在“业务数据”查到 query-capabilities，复用已有租户登录调用返回 200，无重定向；响应含 fieldTypes、operatorSets、operators 和 limits，其中字段类型 12 项；无业务写入 |
| 便签包 1.0.0 | 服务端构建、Host 原包导入、租户预检与安装成功 |
| 便签记录 | 创建、重新读取、修改、筛选查询、空值拒绝和并发冲突均得到预期结果 |
| 记录可见性 | 普通测试账号访问该教学记录被拒绝；维护者使用专门的教学对象权限 |
| 平台页面与操作视频 | 实际完成便签新建、重新读取、修改和搜索；在详情“系统标识”找到 recordId。录制自定义权限、权限集、角色、已有成员关联及解除，新增演示配置已清理，原账号、角色与教学权限保持一致 |
| 便签包 1.0.1 | 保持对象、字段和记录 ID，只修改字段标签为“便签内容”；原内容保留 |
| 固定输入函数 | 调试入口输入 name 为“学习者”，得到“你好，学习者” |
| 数据专题 | 保存后读取 Money 金额，精度保持一致；Picklist value/label、Lookup、分页 1/总数 3/合计 60.90、去重、唯一查询、queryBatch、批量冲突回滚、个人视图、分享后撤销、历史、导出与回收站恢复得到预期结果 |
| Trigger | Before Insert 拒绝后同标题记录数仍为 0；验证后确认教学 Trigger 已停用 |
| 只读集成 | 按实际 catalog 调用只读测试接口；外层 200、远端 200、业务内容符合预期；未发送消息 |
| 时间 | 核对当地重复时刻的两个候选及 25 小时业务日；Routine 调度预览成功 |
| SDK | 通过当前应用所安装 SDK 的公开导出读取 context、describe、自己的便签及 queryBatch，核对实际返回结构 |
| CLI 数据与初始化 | 使用正常原生登录 Bearer 运行 describe、创建、重新读取与查询；新增权限目录、权限集创建／复用和 Host 成员查询／复用已实跑。合成空权限集验证后软删除，原账号、成员与 18 项教学权限保持一致；新成员创建分支另有定向接口测试 |
| Task 字段到页面 | 核对指定提交的元数据、服务映射、路由及页面；实际创建并重新打开本人的合成 Task，ID 与内容一致 |
| AI 工具读取 Task | 普通测试用户从 Task 入口实际调用 workforce_check_context，取得同一任务的内容与 open 状态；该轮正常结束，更新工具调用为 0，任务前后快照一致。本人单读 200，无业务关系的后台记录 Owner 单读 403；未新增助手、身份或权限 |
| 网页与样例 | 24 页课程，8 个基础单元和判断题，7 个分步图解；操作视频有章节、字幕及文字步骤。学习记录标识保持不变 |

专题账目的示例标题改为办公用品、午餐和打车；字段格式、10.20/20.30/30.40 三个金额及查询方式保持一致。
:::

使用前请留意以下环境限制：

| 项目 | 本次实际结果 |
|---|---|
| CLI 浏览器登录与应用包命令 | 已核对正式统一登录入口；目标缺少已关联且加入租户的可用统一身份，未完成浏览器登录后的应用包 CLI 操作；通用数据命令已按上表单独实跑 |
| Routine 实际运行 | 未配置执行成员；预览和拒绝路径已核对，没有活动运行，保持原配置 |
| 视图修改后的运行可用性 | 曾持续返回 runtime_metadata_not_ready；维护者调用同一安装的 check 恢复读取，原值保留。平台根因未修复 |

文件附件与个人邮箱只介绍概念和资料，不安排实操。

Task 读取结果适用于已验证的 Workforce 本机应用构建，Runtime 为 0.2.2；其他环境需由维护者确认已包含对应修复。[Task 读取工具源码](https://github.com/xingshukeji/xrain-workforce/blob/c00c3b28a7c926dea03d4eff3332ff1701c01018/src/backend/plugins/tasks/host/task-tool-definition.mjs)与[执行入口源码](https://github.com/xingshukeji/xrain-workforce/blob/c00c3b28a7c926dea03d4eff3332ff1701c01018/frontend/src/plugins/tasks/components/TaskExecutionPanel.tsx)持有该次接入。平台原始记录接口的公共读取权限仍由独立产品修复处理，不属于这次 Task 应用读取的通过结论。

练习平台地址和账号由环境维护者提供，公开课程不包含凭据。

## 专题资料

以下链接固定到课程使用的来源版本。

| 原资料 | 在课程中查什么 |
|---|---|
| [平台分工](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/platform.md) | [能力地图](/map)：从业务问题选择能力 |
| [业务主线](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/business-mainlines.md) | [综合练习](/topics/workforce)：先明确动作与结果 |
| [建模](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/modeling.md) | [B1](/basics/model)、[B4](/basics/fields) |
| [对象基础](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/object-foundation.md) | 定义、系统字段与归属 |
| [初始化平台](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/initialized-platform.md) | [环境准备](/help/environment) |
| [元数据与界面](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/metadata-and-ui.md) | [字段](/basics/fields)、[页面字段](/topics/workforce) |
| [业务 API](https://github.com/xingshukeji/skills-hub/blob/9a8459d603f8543eceea3791b79bbd6117536fb7/skills/workforce-business-development/references/business-api.md) | [接口文档入口](/reference/) |
| [数据操作](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/data-operations.md) | [B3](/basics/data)、[数据专题](/topics/data) |
| [授权](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/authorization.md) | [B5 身份与权限](/basics/access) |
| [组织与协作](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/organization-and-collaboration.md) | [归属与分享](/topics/data#记录归属与分享) |
| [生命周期](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/lifecycle.md) | [B6](/basics/version)、[安装维护](/topics/operations) |
| [配置与 API 身份](https://github.com/xingshukeji/skills-hub/blob/9a8459d603f8543eceea3791b79bbd6117536fb7/skills/workforce-business-development/references/configuration-and-api.md) | [配置与调用身份](/topics/integration#配置与调用身份) |
| [自动化](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/automation.md) | [函数、Trigger 与 Routine](/topics/automation) |
| [集成](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/integration.md) | [HTTP 集成](/topics/integration) |
| [地区与时间](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/regional-context.md) | [字段类型](/basics/fields)、[执行时间](/topics/automation#时间与执行人) |
| [公共服务](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/shared-services.md) | [文件、消息与投递](/topics/integration) |
| [个人邮箱](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/personal-email.md) | [个人邮箱身份与引用](/topics/integration#个人邮箱是另一种身份范围) |
| [智能体接入](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/agent-access.md) | [AI 使用条件](/topics/workforce) |
| [业务实现](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/implementation.md) | [服务、页面与工具](/topics/workforce) |
| [企业案例](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/references/enterprise-case.md) | 完成基础课后的业务主线扩展 |
| [API 验证记录](https://github.com/xingshukeji/skills-hub/blob/9a8459d603f8543eceea3791b79bbd6117536fb7/skills/workforce-business-development/references/api-verification.md) | 历史实测范围与接口差异 |

## 技能入口

| 原入口 | 何时需要 |
|---|---|
| [业务开发](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/SKILL.md) | 从业务目标选择模型、接口、页面与工具 |
| [XRain CLI](https://github.com/xingshukeji/skills-hub/blob/f4c48613557394cb42e37ec5b93d4f3303f93299/skills/xrain-cli/SKILL.md) | 命令行登录、元数据、数据、课程初始化和应用包 |
| [认证](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-auth/SKILL.md) | 固定身份与正常登录恢复 |
| [访问诊断](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-access-diagnosis/SKILL.md) | 登录后的 403、准入与数据范围 |
| [人员生命周期](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-business-user-lifecycle/SKILL.md) | 人员接入、协作与职责变化 |
| [应用操作](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/xrain-app-operations/SKILL.md) | 安装、升级、冲突与恢复 |
| [运行维护](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-runtime/SKILL.md) | 启动、恢复及核对运行效果 |
| [智能体排障](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-agent-troubleshoot/SKILL.md) | 不回复、重复消息、工具与会话问题 |
| [已有流水线](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/cicd/SKILL.md) | 按项目既有入口执行构建与交付 |

## CLI、样例与接口发现

- CLI 的[安装](https://github.com/xingshukeji/skills-hub/blob/f4c48613557394cb42e37ec5b93d4f3303f93299/skills/xrain-cli/references/installation.md)、[配置](https://github.com/xingshukeji/skills-hub/blob/f4c48613557394cb42e37ec5b93d4f3303f93299/skills/xrain-cli/references/configuration.md)和[命令](https://github.com/xingshukeji/skills-hub/blob/f4c48613557394cb42e37ec5b93d4f3303f93299/skills/xrain-cli/references/commands.md)按分发版本核对；本课程入口在[工具参考](/reference/tools)。
- 上游[HTTP 请求样例](https://github.com/xingshukeji/skills-hub/blob/f6e10f6385cd4bae937c632a81839c9cc4e86f1a/skills/workforce-business-development/assets/http-contract-samples.json)用于比较数据结构，不表示能向任意目标重放全部请求。
- 本课程完整的[基础源码](/downloads/note-source.json)、[标签升级源码](/downloads/note-label-source.json)、[创建值](/downloads/note-values.json)、[查询条件](/downloads/note-query.json)、[固定输入函数](/downloads/greeting.json)和[独立专题样例](/topics/data#先准备独立的专题数据)可以直接取得，不依赖上游仓库权限。
- 平台提供按功能分组的 OpenAPI 3.1 阅读页，入口和只读练习见[接口文档](/reference/)。2026-10-26 已在上述版本验证完整规范与兼容子集下载均返回 200；旧版本导出 500 的历史记录仍保留，其他环境应核对部署版本和实际下载结果。

## 维护这份课程

课程正文、SVG、练习、示例和站点源码在[独立 GitHub 仓库](https://github.com/xingshukeji/xrainTrain)共同维护。网站的 `/version.json` 记录构建所用的提交，可与 GitHub Actions 的发布记录对应。

API 或 CLI 更新后，同步检查来源版本、例子和预期结果，再运行课程检查与必要的实际操作。
