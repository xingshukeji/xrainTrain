---
title: AI 与 Workforce 综合练习
flow:
  title: 任务内容怎样显示到页面
  description: 同一段文字，在平台记录和应用代码中使用不同属性名。
  steps:
    - title: 平台字段
      caption: description__c
      detail: 平台记录用这个字段保存任务内容。
    - title: 服务端转换
      caption: values.description__c → description
      detail: 服务端读取字段值，赋给应用返回数据中的 description。
    - title: Task 接口
      caption: 返回任务内容
      detail: 应用接口调用已有业务服务，按当前用户的权限返回任务。
    - title: 页面显示
      caption: task.description
      detail: 页面读取 description，将文字显示到任务详情和编辑框。
---
# AI 与 Workforce 综合练习

这一页分两部分：先看**一段任务内容怎样从平台显示到页面**，再让 AI **读取你自己的任务**。

第一部分需要目标 Workforce 仓库的源码阅读权限；没有该权限时，可以先学习[公开的业务实现参考](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/workforce-business-development/references/implementation.md)。第二部分需要可用的 Workforce 练习环境、模型和任务执行入口。可以分别完成。

如果你希望让 AI 根据业务需求进行二开，使用[AI 开发入口](/ai/)。本页继续讲字段追踪与 Task 操作练习。

## 追踪一个真实字段

平台中的任务内容叫 `description__c`，页面代码却使用 `task.description`。中间发生了什么？

<FlowSteps />

可以把服务端的转换理解为：

```js
description: record.values.description__c
```

这是帮助阅读的片段。实际代码与调用位置固定在 Workforce 提交 `e7f17fc`：

| 查看哪里 | 搜索什么 | 要找到的结果 |
|---|---|---|
| [对象定义](https://github.com/xingshukeji/xrain-workforce/blob/e7f17fc921f2aafd51d0170f22f84e418046f8a6/src/xrain/source.json) | `workforce__task__c`、`description` | 任务对象和内容字段 |
| [平台业务服务](https://github.com/xingshukeji/xrain-workforce/blob/e7f17fc921f2aafd51d0170f22f84e418046f8a6/src/backend/platform/platform-workforce-service.mjs) | `description__c`、`description:` | 字段值怎样赋给 description |
| [Task 接口](https://github.com/xingshukeji/xrain-workforce/blob/e7f17fc921f2aafd51d0170f22f84e418046f8a6/src/backend/plugins/tasks/host/routes.mjs) | `platform`、`createTask`、`updateTask` | 接口怎样调用业务服务 |
| [Task 页面](https://github.com/xingshukeji/xrain-workforce/blob/e7f17fc921f2aafd51d0170f22f84e418046f8a6/frontend/src/plugins/tasks/components/TaskViews.tsx) | `task.description`、`任务内容` | 文字怎样显示到页面 |

### 小练习：只改输入框的提示，要改哪一层

需求是把页面上的“任务内容”改成更清楚的提示文字。

先判断：历史任务内容要不要变？字段 API 名要不要变？应该查看哪个文件？

::: details 对照答案
这份页面有自己的提示文案。只改提示时，应修改页面中的文案；历史记录和 description 属性不需要改。

因此，修改平台字段的 label，不一定会改变自建页面。要先看页面是否读取了这个 label。
:::

这一部分只做阅读分析。实际修改应用时，再在对应项目验证编辑框和保存结果。

## 准备 Task 执行入口 {#准备-task-执行入口}

第二部分使用 Task 详情中的“智能体执行”。开始前准备三项：

| 条件 | 怎样确认 |
|---|---|
| 自己能查看的一条练习任务 | 用本人账号打开，能看到内容、负责人和状态 |
| 可用的模型和执行入口 | 任务详情中能打开“智能体执行”，可选择模型 |
| 已接入任务读取工具 | 该入口能调用 `workforce_check_context` 读取当前任务 |

**本练习不需要先订阅个人助手。** Task 执行入口按任务权限运行；个人工作台的助手使用条件是另一回事。

如果你能打开任务，但执行入口没有读取工具，请维护者检查应用接入。这个问题不应通过给学员增加全部任务读取权或管理员权限解决。适用构建见[资料索引](/reference/sources#适用范围与真实验证)。

## 让 AI 读取同一条任务

1. 在“任务”中选择“新建任务”，内容填写“课程合成任务：只读取本任务的内容与状态，不发送消息、不修改业务数据。”，负责人选择自己，点击“确认交办”。已有这条练习任务时直接使用。
2. 重新打开，记下任务编号，确认内容与待处理状态，再点击 **智能体执行**。
3. 使用已配置好的模型，发送下面的要求：

> 请只调用 workforce_check_context 读取当前绑定任务，返回任务内容和状态，然后结束。本轮不调用任何其他工具，不修改任务，不发送消息。

4. 打开这一轮的工具结果，与页面比较任务编号、内容和状态。
5. 刷新任务，确认它仍为待处理（`open`），内容、负责人和结果没有变化。

`workforce_check_context` 使用空参数 `{}`。当前任务和用户由执行入口绑定，不需要让 AI 填写 userId 或 taskId。

### 怎样判断读对了

| 核对内容 | 预期 |
|---|---|
| 调用的工具 | `workforce_check_context` |
| 返回的任务 | 与页面是同一个 taskId |
| 返回的内容和状态 | 与页面一致 |
| 刷新后的任务 | 内容和负责人不变，状态仍为 open |

下面是已经验证过的一次工具返回节选：

```json
{
  "authorized": true,
  "task": {
    "description": "课程合成任务：只读取本任务的内容与状态，不发送消息、不修改业务数据。",
    "status": "open",
    "result": ""
  }
}
```

**AI 说“我读到了”还不够，要查看实际工具结果。** 同样，AI 结束这一轮执行，不表示协作任务已经完成。Task 保存责任和进度，Session/Run 记录 AI 的执行过程。

## 遇到问题时

| 现象 | 下一步 |
|---|---|
| 页面也打不开任务 | 检查本人任务权限，见 [B5](/basics/access) |
| 页面能打开，执行入口不能读取 | 请维护者检查任务工具接入和实际错误 |
| 没有可选模型 | 由环境维护者准备可用模型 |
| 个人工作台显示“暂无可用智能体” | 检查个人助手是否已选择、启用及审批；不要与 Task 入口混淆 |
| AI 不回复、工具失败或重复执行 | 保留该轮运行编号，查[智能体排障资料](/reference/sources#技能入口) |

工具仍使用实际执行用户的权限。让 AI 帮忙，不会扩大它能查看的数据范围。
