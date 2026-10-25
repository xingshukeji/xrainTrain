---
title: AI 与 Workforce 综合练习
flow:
  title: 追踪 Task 内容的一条读取链
  description: 箭头表示数据在已核对代码中的传递。页面还包含自己的交互与业务规则。
  steps:
    - title: 字段定义
      caption: description__c
      detail: Task 元数据声明任务内容字段。定义说明可保存什么，具体文字在业务记录中。
    - title: 服务读取与映射
      caption: values.description__c → description
      detail: 平台服务读取记录，将 description__c 映射到应用使用的 description 属性。
    - title: Task 接口
      caption: 返回应用 Task 数据
      detail: Task 路由复用平台服务；接口仍需检查当前身份和动作条件。
    - title: 页面消费
      caption: task.description → 任务内容
      detail: Task 页面读取 description，形成标题、详情和编辑输入；不是直接显示所有元数据属性。
---
# AI 与 Workforce 综合练习

在基础课中，你直接使用平台的对象和记录接口。实际应用还会增加业务规则、页面和协作。先追踪一个已有字段，再考虑让 AI 调用同一个业务动作。

## 追踪一个真实字段

本练习默认只读源码。需要 Workforce 仓库的访问权；没有权限时，仍可根据下面的数据链理解各层职责。它不是 G0 的前置条件。

<FlowSteps />

本课固定对照 Workforce 提交 `e7f17fc`。请在该版本中按以下顺序定位，别仅凭目录名称推断调用关系：

| 查看位置 | 搜索什么 | 需要回答 |
|---|---|---|
| [元数据源码](https://github.com/xingshukeji/xrain-workforce/blob/e7f17fc921f2aafd51d0170f22f84e418046f8a6/src/xrain/source.json) | `workforce__task__c`、`description` | 对象与字段定义分别在哪？ |
| [平台业务服务](https://github.com/xingshukeji/xrain-workforce/blob/e7f17fc921f2aafd51d0170f22f84e418046f8a6/src/backend/platform/platform-workforce-service.mjs) | `description__c`、`description:` | 哪一处把记录值映射成 Task 属性？ |
| [Task 路由](https://github.com/xingshukeji/xrain-workforce/blob/e7f17fc921f2aafd51d0170f22f84e418046f8a6/src/backend/plugins/tasks/host/routes.mjs) | `platform`、`createTask`、`updateTask` | 请求怎样进入已有业务服务？ |
| [Task 页面](https://github.com/xingshukeji/xrain-workforce/blob/e7f17fc921f2aafd51d0170f22f84e418046f8a6/frontend/src/plugins/tasks/components/TaskViews.tsx) | `task.description`、`任务内容` | 标题、详情和编辑框分别使用什么属性？ |

## 自己写一张影响表

假设需求是“把任务内容的界面提示改得更清楚”。先分开判断：

1. 记录值是否改变？只改提示通常不需要改历史记录。
2. 字段 label 是否被目标页面直接读取？这份 Task 页面有自己的“任务内容”文案，不能承诺改元数据标签就会自动改变它。
3. DTO 属性是否改变？保持 `description` 时不应顺带重命名所有调用者。
4. 哪个最小验证能证明结果？打开实际编辑框，保存自己的测试任务，重新读取同一 taskId。

本页完成了来源定位与读取链核对，没有运行修改 Task 的真实写入练习。需要动手修改时，先由对应项目确定目标、身份和预期行为，再在原工程开展开发。

## AI 参与一个已有业务动作

先把动作写成人能够判断结果的句子，例如“读取我有权查看的一条任务，返回内容和状态”。然后选择已有业务服务，将它暴露为明确的只读工具。

工具参数只有任务编号等业务输入。执行身份来自可信会话或执行绑定，不让模型自行填写用户身份。AI 输出的自然语言也不能替代服务返回的实际记录。

| 条件 | 说明 |
|---|---|
| 定义启用 | Runtime 允许该智能体执行，还需满足使用资格 |
| 个人订阅 | 使用个人路径时检查 selected 与 approvalStatus |
| 应用选用 | 应用路径按当前应用准入、绑定和启用状态判断 |
| 工具与数据权限 | 每次实际动作仍检查执行者的数据和业务资格 |

能选中助手，不等于能访问所有记录。工具执行结束，也不等于协作 Task 已经完成。Task 表示责任与进度，Session/Run 表示执行过程，业务记录保存业务事实。

## 判断一次只读工具是否成功

使用已配置助手、自己的合成任务和明确授权的只读工具。检查实际 taskId、执行身份、工具结果及页面读取是否一致。若工具说成功但没有相应返回，保持“尚未确认”；若被拒绝，沿[B5](/basics/access)检查资格，不改用管理员。

不回复、重复消息或接管后迟到写入属于运行与会话排查。先保留当前请求和实际运行标识，再使用[资料索引中的排障入口](/reference/sources#技能入口)，不要反复新建智能体或会话掩盖问题。
