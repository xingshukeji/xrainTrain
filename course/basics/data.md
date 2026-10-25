---
title: B3 · 修改和查询记录
lesson: b3
flow:
  title: 修改自己的便签
  description: 沿用 G0 的 recordId，不再新建记录。
  steps:
    - title: 读取旧内容
      caption: 你好，XRain
      detail: 先读取当前值，稍后把它作为 expectedValues，检查保存前是否有人修改过。
    - title: 提交新内容
      caption: 我学会了修改便签
      detail: values 放新内容，expectedValues 放刚才读到的旧内容。旧内容仍相同才更新。
    - title: 再次读取
      caption: 同一 recordId，新文字
      detail: 重新读取同一条记录，确认保存结果。若返回 409，先保留自己的输入，再查看别人改了什么。
quiz:
  question: 更新返回 409，提示旧值不匹配。下一步该做什么？
  options: [删掉 expectedValues 后立即重发, 保留自己的文字，重新读取并比较差异, 新建一条相同便签]
  answer: 1
  explanations:
    - 去掉条件可能覆盖别人刚保存的内容，先检查差异。
    - 看清当前内容后，再决定保留、合并还是放弃自己的修改。
    - 新建不会解决原记录的修改冲突。
---
# B3 · 修改和查询记录

这节课做两件事：**修改自己的便签，再通过查询找到它。** 继续使用 B1 的 PowerShell 终端，保留 `$base`、`$headers` 和 `$note.recordId`。

## 1. 修改同一条便签

<FlowSteps />

运行下面的代码，把内容改为“我学会了修改便签”：

```powershell
$recordUrl = "$base/api/data/v1/entities/xrainlearn__note__c/records/$($note.recordId)"
$before = Invoke-RestMethod -Uri $recordUrl -Headers $headers
$update = @{
  values = @{ content__c = '我学会了修改便签' }
  expectedValues = @{ content__c = $before.values.content__c }
} | ConvertTo-Json -Depth 4
Invoke-RestMethod -Uri $recordUrl -Method Put -Headers $headers -ContentType 'application/json; charset=utf-8' -Body $update
$after = Invoke-RestMethod -Uri $recordUrl -Headers $headers
$after.values.content__c
```

最后一行应输出 `我学会了修改便签`，记录编号没有改变。

### expectedValues 为什么要放旧内容

假设你和同事同时打开一条便签：

1. 你读到“你好，XRain”。
2. 同事先把它改成“明天下午开会”。
3. 你提交修改，同时说明：只在旧内容仍是“你好，XRain”时保存。

第 3 步会返回 **409，并发冲突**。这样，你的修改不会悄悄覆盖同事的新内容。先重新读取，再决定怎样处理。

普通更新可以只传 `values`；需要防止覆盖时，再带 `expectedValues`。这里比较的是实际读到的业务字段值，不使用 `updatedAt` 代替。

## 2. 查询内容相同的便签

查询用 POST 发送条件。下面查找内容恰好等于“我学会了修改便签”的记录：

```powershell
$query = @{
  page = 1
  pageSize = 10
  fields = @('content__c')
  filter = @{ field = 'content__c'; op = 'eq'; value = '我学会了修改便签' }
  includeTotalCount = $true
} | ConvertTo-Json -Depth 5
$found = Invoke-RestMethod -Uri "$base/api/data/v1/entities/xrainlearn__note__c/records:query" -Method Post -Headers $headers -ContentType 'application/json; charset=utf-8' -Body $query
$found.records
$found.totalCount
```

| 参数 | 这次的作用 |
|---|---|
| `page = 1` | 读取第一页 |
| `pageSize = 10` | 最多取 10 条 |
| `fields` | 只取内容字段 |
| `filter` | `eq` 表示“等于”，字段使用 API 名 |
| `includeTotalCount` | 同时返回匹配总数 |

多人填写相同文字时可能查出多条。用 `recordId` 确认自己的那一条；第一页没找到时，增加 `page` 逐页查找。

### 当前页和总条数为什么不同

假设有 23 条符合条件的记录，`pageSize=10`：

- 第一页的 `records` 最多有 10 条。
- `totalCount` 是 23。
- 第三页剩下 3 条。

计数只包含当前用户有权查看的记录。排序、汇总和批量查询放在[数据专题](/topics/data)。

## 3. 把内容改回去

把第一个代码块中 `values.content__c` 的新文字改成 `你好，XRain`，重新运行整段代码。它会先读取当前值，再保存并确认结果。

后续课程继续使用这条记录，暂时保留它。删除的请求方法、成功状态和恢复说明可查 [HTTP 速查](/reference/http#单条记录)及[记录恢复](/topics/data#历史敏感值与恢复)。

## 自己做一次

1. 保存“我学会了修改便签”后，把查询操作符改成 `contains`，查询值改成 `修改`。运行后应仍能找到自己的记录。
2. 用原来的修改代码把内容恢复为“你好，XRain”，再读取确认。
3. 在自己的记录上，把 `expectedValues.content__c` 故意写成一个与当前内容不同的值，再提交一次修改。应收到 409；重新读取后，内容应仍是“你好，XRain”。

第 3 步说明条件更新确实阻止了错误覆盖。保留新输入并处理冲突的方法见 [B7](/basics/debug)。

<QuizCard />
