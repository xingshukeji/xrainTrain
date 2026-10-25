---
title: 函数、事件与定时任务
flow:
  title: 保存记录时，检查在哪一步执行
  description: Before 在保存前检查；After 在保存后处理后续动作。
  steps:
    - title: 收到保存请求
      caption: 一批要创建或修改的记录
      detail: 事件处理按批次接收输入。Insert、Update 使用 records，Delete 使用 ids。
    - title: Before 检查
      caption: 不符合规则就拒绝
      detail: Before 同步执行。检查失败时，这一批记录不会保存。
    - title: 保存记录
      caption: 数据提交成功
      detail: 到这一步，记录已保存到平台。
    - title: After 处理
      caption: 再执行后续动作
      detail: After 的失败不会撤销已保存的记录，需要单独查看运行结果。外部请求和消息也不属于记录事务。
---
# 函数、事件与定时任务

先做一个最小动作：输入名字，返回一句问候。然后再理解，怎样让一个动作在**保存记录时**或**每天固定时间**执行。

| 需求 | 平台能力 |
|---|---|
| 重复调用一段计算或操作 | 函数 |
| 把几项操作组合成一个动作 | 业务编排 |
| 保存记录前检查输入，保存后做后续处理 | Trigger，记录触发器 |
| 每天 09:00 执行一次 | Routine，定时任务 |

## 第一个练习：输入名字，返回问候

下载完整请求 [greeting.json](/downloads/greeting.json)。其中的编排代码是：

```js
function execute(ctx) {
  return { message: '你好，' + ctx.input.name };
}
```

`ctx.input` 是传入的数据。输入 `{ "name": "学习者" }`，就应返回 `{ "message": "你好，学习者" }`。

使用已经登录、并有编排调试权限的账号，在下载文件所在目录执行：

```powershell
$result = Invoke-RestMethod -Uri "$base/api/orchestration/v1/debug" -Method Post -Headers $headers -ContentType 'application/json' -InFile './greeting.json'
$result | Select-Object isSuccess, output, errorCode
```

预期 `isSuccess=true`，`output.message` 为 `你好，学习者`。将文件输入中的名字改成“张三”，再调用，应得到“你好，张三”。

这个例子不读写业务数据。**调试接口会实际执行代码**；以后调试包含写入或发送动作的编排时，会产生相应影响。

::: details 开发时查阅：编排能调用什么
编排可以使用 `ctx.input` 和 `ctx.sdk.fn.invoke(key, input)` 等提供的能力。它不直接提供 npm、文件、进程或任意 fetch。

查看 `GET /api/orchestration/v1/callables`，可以找到可调用的函数名称和说明。例如使用 `runtime.records.query` 前，先核对目录中的参数与权限要求，再查询自己的便签。

函数已出现在目录中，不表示当前用户可以读取全部数据；记录访问仍受权限控制。
:::

## 记录事件 Trigger

例如要求“保存账目前先检查输入”：检查通过才保存，失败就提示错误。这是 **Before（提交前）**。

若要求“账目保存成功后，再处理后续事项”，则属于 **After（提交后）**。后续处理失败，原账目仍已保存。

<FlowSteps />

### 观察一次提交前拒绝

[专题包](/topics/data#先准备独立的专题数据)包含教学编排 `xrainlabBeforeCheck`，固定返回 `course.rule_rejected`。它的用途是让你明确看到“检查拒绝后，记录没有保存”。

由维护者在 `xrainlab__entry__c` 上，把它配置成一次 Before Insert 练习：

1. 确认对象的 `triggersEnabled` 与这条 Trigger 都已启用。
2. 提交标题为“课程拒绝保存演示”的测试账目。
3. 查看拒绝结果，再查询这个标题，预期条数为 0。
4. **停用这条教学 Trigger**，确认 `isActive=false`，以免继续阻止保存。

包管理的对象应关联同一安装中提供的编排。问候例子只是普通编排，没有 Trigger 所需的返回格式，不能直接拿来替代这个校验编排。

后续开发更新触发器时，还要避免“更新记录 → 触发器再次更新同一记录”的无限循环。事件运行也保留实际操作者，不会自动获得管理员权限。

## 定时 Routine

例子：每天上海时间 09:00 运行一个只读动作。配置时要明确**执行什么、何时执行、由哪个用户执行**。

先读取执行用户，再预览下一次运行时间：

```powershell
$executionUser = Invoke-RestMethod -Uri "$base/api/automation/routines/execution-user" -Headers $headers
$schedule = @{ scheduleType = 'Daily'; executeTime = '09:00'; timeZoneId = 'Asia/Shanghai' } | ConvertTo-Json
$preview = Invoke-RestMethod -Uri "$base/api/automation/routines/schedule-preview" -Method Post -Headers $headers -ContentType 'application/json' -Body $schedule
$executionUser.userId
$preview | Select-Object nextRunAt, timeZoneId, offset
```

| 结果 | 下一步 |
|---|---|
| 有可用执行用户，预览时间正确 | 维护者可配置并启用教学任务，再查看实际 run 的输出 |
| `userId=null` | 尚未配置执行用户，先由环境维护者准备 |
| 预览时间不符合预期 | 检查 executeTime 和 timeZoneId |

本课程验证时，环境未配置执行用户，因此只完成了**时间预览**，没有完成真实定时运行。任务显示“已启用”或出现 run ID 后，也仍需检查输出。

## 时间与执行人

“2026-10-25”是一个日期；“当天 09:00”还需要时区，才能确定是哪一个时刻。每天 09:00 的任务，应明确使用 `Asia/Shanghai` 等时区配置，不能依赖操作者电脑的时区。

查“某一天的记录”时，使用平台的 day-range 接口得到 `[startUtc, endUtc)`：包括起点，不包括终点。存在夏令时的地区，一天不一定恰好 24 小时；当地时间还可能重复或不存在。

执行用户决定这个定时任务能访问哪些数据；Owner 负责维护，两者作用不同。详细格式与时间处理见[自动化和地区资料](/reference/sources#专题资料)。
