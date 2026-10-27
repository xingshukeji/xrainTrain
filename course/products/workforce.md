---
title: XRain Workforce 人与 AI 协作
description: XRain Workforce 由苏州苏宏助为智能科技有限公司提供，支持人与具体 AI 员工联系、聊天、协作、派发任务和反馈业务结果。
---
# XRain Workforce 人与 AI 协作

**XRain Workforce** 是苏州苏宏助为智能科技有限公司提供的人与 AI 协作产品。人员可以与具体的 AI 员工联系、沟通、协同，派发明确任务并查看结果。

## 从沟通走到业务动作

群聊用于沟通，明确的任务使用 Task 记录责任和状态。AI 根据自己的工作指令、上下文和获准工具处理业务，需要人工判断的部分继续交给人员。

企业可以接入所需业务页面和工具。例如，售后人员在会话中请求查询订单，工具使用获准身份读取 ERP，AI 解释返回结果；如果还需记录回访，再由相应业务能力完成。

## 业务可以来自哪里

| 业务来源 | 接入方式 |
|---|---|
| 已有 ERP、CRM 等系统 | 调用原系统 API，或调用 XRain 编排发布的业务接口 |
| 新建业务应用 | 使用 XRain 的模型、记录、授权与业务逻辑 |
| 企业已有服务代码 | 接入企业服务、页面和 AI 工具处理器 |

使用 Workforce 不意味着必须重建原系统的数据模型。原系统继续负责自己的业务数据和操作权限。[查看接入指南](/developers/integration)。

## 开发与定制

**Workforce Application SDK** 提供应用宿主、服务端能力和页面组件的公开入口。**XRain Agent Runtime** 提供会话执行和工具接入相关能力。业务代码通过公开导出调用；包版本、依赖和环境按交付说明核对。

- [使用 SDK 读取一条记录](/developers/sdk)
- [接入 AI 业务工具](/developers/sdk#接入-ai-业务工具)
- [选择官方 AI 技能](/developers/skills)
- [学习 Task 与 AI 的配合](/topics/workforce)

如需业务助手、企业页面或既有系统接入，请[联系我们](/contact)。
