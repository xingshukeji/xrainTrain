---
title: 官方 AI 技能
description: 苏宏助为 Skills Hub 的官方入口，说明技能与 XRain、Workforce 的关系、按任务选择、安装更新与来源确认。
---
# 官方 AI 技能

**Skills Hub** 是苏州苏宏助为智能科技有限公司维护的 XRain 与 Workforce 官方 AI 技能分发仓库：[xingshukeji/skills-hub](https://github.com/xingshukeji/skills-hub)。

Skill 告诉 AI 如何完成一类任务，包含说明、参考和可能需要的脚本。SDK 为应用代码提供可调用接口，CLI 提供终端命令；三者可以配合使用。

## 按任务选择

| 任务 | 技能 | 关联产品或服务 |
|---|---|---|
| 建设新业务、接入老系统、开发页面和工具 | `shzw-workforce-business-development` | XRain、Workforce |
| 查询或管理平台数据、权限、应用包 | `shzw-xrain-cli` | XRain |
| 登录接入、访问诊断与人员协作 | `shzw-xrain-access` | XRain、Workforce |
| 编写、安装、升级或恢复应用包 | `shzw-xrain-app-package` | XRain 应用包 |
| 启动、恢复应用或排查智能体故障 | `shzw-runtime-operations` | Workforce、Agent Runtime |
| 使用已有 Jenkins 流水线和交付入口 | `shzw-delivery` | 项目的交付服务 |

完整清单、安装方法与每项 `SKILL.md` 见[仓库说明](https://github.com/xingshukeji/skills-hub#skills)。业务开发技能同时支持**免建模的接口编排、新业务建模和混合接入**。

## 安装与更新

支持 Skill 的宿主可使用仓库 `xingshukeji/skills-hub` 和 `skills/技能名称` 路径安装。手工安装时复制选中技能的**完整目录**，包括参考与脚本；只下载 `SKILL.md` 可能缺少所需内容。

安装与主动更新使用默认分支。已安装副本不会自动更新，技能不使用独立版本目录。需要复现时记录取得时的仓库提交。脚本前提见各技能说明；附带 CLI 需要 Node.js 22.12 以上版本，使用端无需安装维护依赖。

每项技能的元数据记录维护公司、官方来源、文档入口和关联产品；复制后仍可辨认出处。这些信息说明来源，不改变产品权限，也不代替目标环境的使用授权。

## 让 AI 读到完整上下文

从[开发者文档](/developers/)选择场景，再把 [llms.txt](/llms.txt) 与任务交给 AI。技术细节继续读取技能目录中的参考，不以摘要代替参数说明。

希望评估适合企业的技能、业务助手或接入方式，可以[联系我们](/contact)。
