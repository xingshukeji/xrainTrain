---
title: 产品与技术
description: 苏州苏宏助为智能科技有限公司的 XRain 业务应用平台、XRain Workforce 人与 AI 协作产品，以及配套 SDK、CLI 与 AI 技能。
sidebar: false
prev: false
next: false
---
# 产品与技术

**XRain 与 XRain Workforce 由苏州苏宏助为智能科技有限公司提供。** 企业可以从新业务建设开始，也可以保留已有系统，通过接口和业务编排接入 AI。

| 产品 | 解决什么问题 | 继续了解 |
|---|---|---|
| **XRain** | 建设业务应用、组织业务逻辑、管理数据与权限、连接已有系统并提供接口 | [XRain 产品介绍](/products/xrain) |
| **XRain Workforce** | 让人与具体的 AI 员工联系、沟通、协作、派发任务并查看结果 | [Workforce 产品介绍](/products/workforce) |

## 按现有业务选择接入方式

| 你的情况 | 合适的起点 | 数据由谁维护 |
|---|---|---|
| 老系统管理完善，已有稳定接口 | 用业务编排调用原系统接口，并发布所需业务接口；无需新增业务数据模型 | 原系统继续维护订单、库存、客户及其业务规则 |
| 新业务缺少数据管理和流程 | 在 XRain 定义对象、字段、权限和业务逻辑 | XRain 维护新增业务记录 |
| 保留原系统，同时增加回访、协作等业务 | 复用原系统接口，只为新增事实建模 | 各系统分别维护自己的数据，通过来源和记录标识关联 |

直接转接单个接口时，可以使用连接器与 HTTP 请求；需要参数转换、多个调用或业务判断时，再加入编排。[查看完整接入指南](/developers/integration)。

## 开发工具分别做什么

| 资源 | 用途 | 官方入口 |
|---|---|---|
| **Workforce Application SDK** | 在应用代码中使用宿主、服务端客户端与页面组件；包名 `@xrain/workforce-application` | [SDK 入门与参考](/developers/sdk) |
| **XRain Agent Runtime** | 承载智能体执行、会话与工具接入；扩展包名 `@xrain/xrain-agent-runtime` | [Runtime 与工具接入](/developers/sdk#接入-ai-业务工具) |
| **XRain CLI** | 在终端操作平台的元数据、记录、权限和应用包 | [CLI 安装与用法](/reference/tools#cli-命令与安装) |
| **Skills Hub** | 向 AI 提供按任务执行的方法、参考与配套脚本 | [官方 AI 技能](/developers/skills) |
| **学习课程与示例** | 解释概念，通过便签案例学习数据、权限、接口与扩展 | [人员学习](/learn) · [开发示例](/developers/#从一个例子开始) |

SDK 是供代码调用的开发包，Skill 是供 AI 读取和执行的任务方法，CLI 是终端工具。它们服务于产品开发，不替代产品本身。

产品环境和 SDK 制品按项目交付。课程、开发指南、示例及 skills-hub 可公开读取；具体使用条件以对应制品和仓库说明为准。[咨询接入或合作](/contact)。
