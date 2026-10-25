---
title: B3 · 读写与查询
lesson: b3
flow:
  title: 修改之后，读回同一条记录
  description: 每次只改一项值，并核对同一个 recordId。
  steps:
    - title: 读取当前值
      caption: GET → 你好，XRain
      detail: 先记住实际读到的内容。如果需要防止覆盖他人的修改，把这个实际旧值作为 expectedValues 的条件。
    - title: 提交新值
      caption: PUT → values 与可选 expectedValues
      detail: values 是想保存的新内容。expectedValues 表示只有指定旧字段仍一致才更新；它不是每个更新都必须携带的字段。
    - title: 回读结果
      caption: GET 同一 recordId → 今天学会回读
      detail: 成功后回读同一条记录；如果是 409，保留自己的未保存文字，先查看冲突再决定如何处理，不自动把条件换成最新值重试。
quiz:
  question: 更新返回 409，最合适的下一步是什么？
  options: [删掉 expectedValues 立即重发, 保留未保存内容，重读并处理差异, 再创建一条同样的记录]
  answer: 1
  explanations:
    - 删除条件会失去原本需要的并发保护，可能覆盖其他人的修改。
    - 正确。先弄清实际值与旧条件的差异，再由业务决定合并、放弃或重新提交。
    - 新建会改变记录身份，也没有解决原记录的修改冲突。
---
# B3 · 读写与查询

这一节继续操作你已经创建的便签，**不增加新对象或字段**。保持准备环境的终端打开，确认 `$note.recordId` 仍是你自己的记录 ID。

## 把“你好，XRain”改成一句新文字

<FlowSteps />

先读取当前记录，再用读到的旧值构造条件：

```powershell
$recordUrl = "$base/api/data/v1/entities/xrainlearn__note__c/records/$($note.recordId)"
$before = Invoke-RestMethod -Uri $recordUrl -Headers $headers
$update = @{
  values = @{ content__c = '今天学会回读' }
  expectedValues = @{ content__c = $before.values.content__c }
} | ConvertTo-Json -Depth 4
Invoke-RestMethod -Uri $recordUrl -Method Put -Headers $headers -ContentType 'application/json; charset=utf-8' -Body $update
$after = Invoke-RestMethod -Uri $recordUrl -Headers $headers
$after.values.content__c
```

预期：最后一行是 `今天学会回读`，`recordId` 没有改变。输入框里显示新文字不证明保存成功；成功响应和回读才能提供本次操作的证据。

这里使用 `expectedValues` 是为了观察并发保护。普通更新也可以只传 `values`。需要保护业务状态时，要保留从真实读取取得的条件；不要把 `updatedAt` 塞进 `expectedValues` 当作旧版更新时间条件。

## 查询：一次只加一个条件

查询找的是一组符合条件的记录，用 POST 发送结构化条件。下面只取“内容”等于刚才新文字的记录：

```powershell
$query = @{
  page = 1
  pageSize = 10
  fields = @('content__c')
  filter = @{ field = 'content__c'; op = 'eq'; value = '今天学会回读' }
  includeTotalCount = $true
} | ConvertTo-Json -Depth 5
$found = Invoke-RestMethod -Uri "$base/api/data/v1/entities/xrainlearn__note__c/records:query" -Method Post -Headers $headers -ContentType 'application/json; charset=utf-8' -Body $query
$found.records
$found.totalCount
```

预期：结果包含刚才的便签。`records` 是当前页；`totalCount` 是符合筛选并且当前身份可访问的总数。多人在同一租户练习时，相同文字可能匹配多条，所以“有结果”不能代替核对自己的 `recordId`。

`fields` 使用字段 API 名。元数据对象常把这个名称放在 `fieldApiName`，查询返回的字段描述可能使用 `apiName`；不要照抄属性名来生成筛选条件。

## 翻页、排序和计数，各解决一件事

| 需要 | 选择 |
|---|---|
| 逐页展示 | `page` 从 1 开始，设置 `pageSize` |
| 顺序稳定 | 按查询合同加入 `sort`，核对字段是否可排序 |
| 只关心数量 | 查文档中的 `:count`，不先拉取全部记录 |
| 同时查几个对象 | 按需使用 `queryBatch`，最多 8 个查询 |
| 汇总金额 | 用支持的 aggregate；它计算完整筛选范围，不是浏览器当前页 |

基础课不扩成完整查询语言教程。复杂筛选、批量、聚合和导出在[数据专题](/topics/data)中继续。

## 删除之前，先看影响

单条删除使用 `DELETE`，路径需要准确 `recordId`。本样例对象遵循普通记录的删除生命周期，成功响应为 `204`、正文为空，之后普通读取不能再得到它。恢复属于回收站与相应权限，不是重新 POST 一条同 ID 记录。

本节不要求删除你用来继续学习的便签。若要练习，单独创建一条内容明确写着“仅用于删除练习”的记录，只删除自己刚创建的 ID；不要按筛选结果批量删除。

## 自己做一次

1. 把查询条件从 `eq` 换成文本的 `contains`，值改为 `回读`；先预测是否仍匹配，再执行。
2. 把新值保存为 `你好，XRain`，用刚才的实际旧值保护更新，然后回读。
3. 仅在自己的教学记录上，故意使用一个不相等的旧值提交条件更新。确认收到 `409`，并证明原内容没有被错误覆盖。

完成标准：能给出同一记录的前值、新值、回读结果和一次被拒绝的冲突，而不是只记录“命令执行过”。

<QuizCard />
