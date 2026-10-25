---
title: 函数、事件与定时任务
flow:
  title: 记录事件的两个不同结果
  description: 按“先提交，还是先检查”理解时机；外部副作用需要独立核对。
  steps:
    - title: 收到记录写入
      caption: Insert / Update / Delete 的一批输入
      detail: 事件使用集合输入。Insert 和 Update 是 records，Delete 是 ids；按目标模板取得具体合同，不按单条表单猜结构。
    - title: Before 校验
      caption: 提交前同步执行
      detail: Before 编排可以阻止不合规则的写入。校验失败时，本次记录写入批次不能当作已经保存。
    - title: 记录提交
      caption: 本次数据成为已保存结果
      detail: 到此才有已提交的记录。平台内部事务不意味着外部 HTTP、邮件或短信也在同一个事务里。
    - title: After 后续处理
      caption: 提交后调度，独立查看运行结果
      detail: After 失败不会撤回已经提交的数据。检查事件运行记录和实际业务结果；执行保留事件操作者，后台 Worker 不自动变成管理员。
---
# 函数、事件与定时任务

当需求是“输入一个值，算出结果”或“在某个时机执行动作”，再选择这些能力。先做无写入的小例子，然后分别增加记录、事件或时间。

## 三个问题，对应三种能力

**第一次只做一句问候。** 沿用 B1 的正常登录会话，并确认本人具备编排调试资格；下载下一节的完整请求，调用后核对 `你好，学习者` 即可。Trigger 和 Routine 是后续独立练习，分别需要专题对象或执行成员，不能直接沿用这个问候例子的通过结果。

| 问题 | 能力 |
|---|---|
| 这段计算或操作要复用 | 有输入输出合同的函数 |
| 一个动作要组合几项已有能力 | 业务编排 `execute(ctx)` |
| 什么时候触发这个动作 | 记录事件 Trigger 或定时 Routine |

业务编排不是任意 Node.js 程序。受控上下文提供 `ctx.input` 和 `ctx.sdk.fn.invoke(key,input)` 等能力，不直接提供 npm、文件、进程或任意 fetch。确需项目依赖的业务算法放在已有企业应用中。

## 第一个小练习：只返回一句话

下载完整[问候请求 greeting.json](/downloads/greeting.json)。它的编排源码只有：

```js
function execute(ctx) {
  return { message: '你好，' + ctx.input.name };
}
```

配套输入是 `{ "name": "学习者" }`，inputFields 明确 name 为必填 string。由具备编排调试资格的人，在已获准目标调用：

```powershell
$result = Invoke-RestMethod -Uri "$base/api/orchestration/v1/debug" -Method Post -Headers $headers -ContentType 'application/json' -InFile './greeting.json'
$result | Select-Object isSuccess, output, errorCode
```

预期：`isSuccess=true`，`output.message` 为 `你好，学习者`。本请求已在 2026-10-25 的课程测试目标验证，它不访问记录、不写入、不发送消息。

调试入口本身会真实执行源码中的动作；不能因为这一个例子无副作用，就把所有 debug 当作沙盒。本例普通执行成功，同时 `supportsTrigger=false`，说明它没有满足 Trigger 的专门响应合同，这两个结果不矛盾。

## 再加一次只读调用

先读 `GET /api/orchestration/v1/callables`，确认存在 `runtime.records.query` 及相应输入说明，再把一个仅查询自己便签的调用放入编排。key 使用目录实际值，signature 可能为空，还要阅读 helpText 与[正式专题资料](/reference/sources)。

结束时区分：编排是否成功、查询是否得到空集、当前执行者能访问哪些记录。空集不是运行失败，声明了 callable 也没有扩大数据权限。

## 记录事件 Trigger

<FlowSteps />

对象 `triggersEnabled` 与 Trigger 的启用状态共同决定是否触发。对象总开关为 true 不代表已经配置了一个业务 Trigger。

最小练习应只做一次提交前校验，例如在独立教学对象上拒绝不符合规则的输入，核对拒绝后记录是否保存。提交后通知另作独立练习。不要从一个既有生产对象复制全部触发器来“看会发生什么”。

使用[专题包](/topics/data#先准备独立的专题数据)时，对象和编排必须在该安装的有效定义集合中。不能把另一个临时创建、未纳入该包的编排 ID 直接绑定给受包管理对象；本次目标会以 `application_package_invalid` 拒绝。包内的 `xrainlabBeforeCheck` 已提供完整响应合同，固定返回 `code=course.rule_rejected`，用于观察拒绝路径。它不是生产校验规则。

由维护者在 `xrainlab__entry__c` 上绑定该编排为一次 Before Insert 练习，提交一条标题为“课程拒绝保存演示”的合成输入；检查拒绝结果，再查询相同标题，数量应仍为 `0`。**验证后停用这个教学 Trigger**，并回读 `isActive=false`，避免继续阻止后续练习。不要把返回拒绝的编排直接绑定到业务对象。

重复事件、运行记录和外部回执各有身份，不能从一个 eventId 推出“恰好一次投递”。后续写回也应按实际变化限制，避免无条件自更新形成循环。

## 定时 Routine

Routine 绑定编排、固定输入和调度；Owner 负责维护，实际执行成员另由目标配置决定。第一步先读 `/api/automation/routines/execution-user`，确认是否配置了可用执行人，再用 schedule-preview 看下一次时刻。

最小练习：一个读取型动作，一次明确调度，预览后按获准范围启用，检查对应 run 的输出。不能把“已启用”或“有 run ID”当作业务已经完成。

```powershell
$executionUser = Invoke-RestMethod -Uri "$base/api/automation/routines/execution-user" -Headers $headers
$schedule = @{ scheduleType = 'Daily'; executeTime = '09:00'; timeZoneId = 'Asia/Shanghai' } | ConvertTo-Json
$preview = Invoke-RestMethod -Uri "$base/api/automation/routines/schedule-preview" -Method Post -Headers $headers -ContentType 'application/json' -Body $schedule
$executionUser.userId
$preview | Select-Object nextRunAt, timeZoneId, offset
```

`userId=null` 表示还没有执行成员。此时可以完成预览和前置条件检查，**不能把真实运行勾选为已完成**，也不为了练习自行改变共享租户的执行身份。本次全课检查保留了目标未配置状态，验证了实际运行请求被拒绝且没有活动运行；成功运行及输出仍待有执行成员的环境验证。

## 时间与执行人

`Date` 表达业务日期，`DateTime` 表达时刻。一个当地时间可能需要 timeZoneId 与 offset 才能确定 UTC；夏令时切换时，有的当地时间不存在，有的有两个候选。

当需求是“某业务日的记录”，使用目标提供的 day-range 合同取得半开区间 `[startUtc,endUtc)`。不要默认一天永远是 24 小时。Routine 的每日时间、工作日和时区也要先预览，不靠本机时区猜测。

继续深入：[自动化与地区上下文资料](/reference/sources#专题资料)。需要跨系统动作时转到[集成专题](/topics/integration)。
