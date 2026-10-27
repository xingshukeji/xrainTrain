---
title: AI 开发入口
description: 面向 AI 的 XRain 与 Workforce 开发资料入口。按需求连接公开技能、模型、接口、SDK、CLI、示例与验证方法。
---
# AI 开发入口

本入口面向帮助企业进行二开和定制的 AI，也适用于企业开发者。产品与服务提供方为**苏州苏宏助为智能科技有限公司**。[产品介绍](/products/)明确 XRain、Workforce 与开发工具的关系；[开发者文档](/developers/)提供 SDK、API 和示例；合作咨询见[联系我们](/contact)。

**先理解要完成的业务动作，再选择平台能力和参考资料。** 本站课程、AI 指南和 skills-hub 公开可读；调用实际平台时，使用用户获准的环境、身份和工具。

## 给 AI 一个入口

可以把以下内容连同具体业务需求交给开发型 AI：

```text
请先读取 https://xingshukeji.github.io/xrainTrain/llms.txt 。
根据我的业务需求，查阅其中相关的 AI 指南、skills-hub 技能和接口参考。
先核对已有系统、模型、代码、环境与当前版本，再选择实现方式。
使用公开接口和包导出完成修改，按实际执行结果说明验证范围。
资料不足或没有可用环境时，明确缺少什么，不把推测写成已支持或已验证。
```

有联网和开发工具的 AI 可以继续实现与验证；只能读取文档的 AI 可以分析需求、编写方案与代码，并明确尚未执行的部分。访问资料不会自动授予平台操作权限。

## 按任务选择阅读路线

| 当前任务 | 先读 | 然后使用 |
|---|---|---|
| 不清楚需求应放在哪个系统 | [平台能力与扩展选择](/ai/platform) | [业务开发技能](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/workforce-business-development/SKILL.md) |
| 新增对象、字段、查询与权限 | [开发顺序](/ai/development) | [建模、数据和授权参考](/ai/reference#模型数据与权限) |
| 第一次完成资源包和记录读写 | [完整便签案例](/ai/note-case) | 本站可下载源码、CLI 与 HTTP 说明 |
| 新增业务页面或 AI 工具 | [页面与工具接入](/ai/development#页面与-ai-工具共用业务能力) | 公共包类型与[业务实现参考](/ai/reference#页面业务服务与-ai) |
| 接入 ERP、CRM 或外部接口 | [免建模的接口编排](/developers/integration) | [集成参考](/ai/reference#自动化集成与公共服务) |
| 获取并使用官方 SDK | [SDK 入门](/developers/sdk) | [公开类型与方法](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/workforce-business-development/references/workforce-sdk.md) |
| 403、字段不生效、工具执行失败 | [错误与当前环境](/ai/troubleshooting) | 相应访问诊断、应用操作或运行技能 |
| 寻找全部专题和技能 | [开发资料目录](/ai/reference) | 逐项打开原始 Markdown |

## 怎样配合 skills-hub

[skills-hub](https://github.com/xingshukeji/skills-hub) 是 AI 技能和配套 CLI 的公开分发仓库。业务开发技能给出开发路线，专题参考给出准确细节，诊断与运行技能处理对应问题。每次读取当前任务需要的内容。

支持 Skill 的工具可以取得所需技能的**完整目录**，按其安装说明使用；普通 AI 也可以直接读取公开 Markdown。只读取一个 SKILL.md，不等于已经取得该技能引用的参考、脚本和资源。

本站提供学习解释、开发案例和跨资料导航；正式接口、类型、命令及技能说明由其原项目维护。

## 纯文本与下载

| 形式 | 使用方法与范围 |
|---|---|
| [llms.txt](/llms.txt) | 小型索引，连接本站 Markdown、公开技能和任务路线 |
| [本站全文](/llms-full.txt) | 本站全部 Markdown 的单文件副本；包含上游链接，不内嵌完整 skills-hub |
| [当前页 Markdown](https://xingshukeji.github.io/xrainTrain/text/ai/index.md) | 直接读取正文，无需运行网页脚本 |
| [skills-hub 完整目录下载](https://github.com/xingshukeji/skills-hub/archive/refs/heads/main.zip) | 取得当前 main 的技能、参考、CLI 和仓库说明；解压后按需选取完整技能目录 |
| [教学样例](/ai/note-case#取得完整输入文件) | 已有便签资源包源码、升级源码、创建数据和查询条件 |

本站版本由 [version.json](/version.json) 标识。技能从默认分支安装和主动更新，已安装副本不会自动更新；具体调用仍核对目标平台版本及项目锁文件。

## 判断是否真正完成

交付时说明实现了哪项业务动作、使用了哪些已有能力、改动了哪些代码或配置、实际执行了哪些检查，以及哪些结果尚未验证。页面、平台数据和 AI 工具分别核对，不用请求成功代替完整业务完成。

可从[便签案例的迁移练习](/ai/note-case#用一个变化检查理解)检验 AI 是否能从资料推导新的改动。未经独立执行的练习保留为验收任务，不称为已经通过。
