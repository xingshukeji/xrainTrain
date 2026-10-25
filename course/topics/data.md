---
title: 查询、视图与数据维护
---
# 查询、视图与数据维护

这一页从三笔支出开始，理解**当前页、总条数和金额合计**。完成 B1—B5 后即可学习；视图、分享和批量操作放在后半页，按需要选择。

## 先准备独立的专题数据

基础便签只有文本字段。这个练习使用另一个教学应用 `xrainlab`，其中的账目对象 `xrainlab__entry__c` 有标题、金额和分类。

| 标题 | 金额 | 分类 |
|---|---|---|
| 课程账目：办公用品 | 10.20 | 工作 |
| 课程账目：午餐 | 20.30 | 生活 |
| 课程账目：打车 | 30.40 | 生活 |

下载[三笔账目](/downloads/topics-values.json)和[查询请求](/downloads/topics-query.json)。平台中应已经准备好专题包和这些数据，登录账号也应有读取权限。

::: details 维护者：安装专题包并准备数据
使用完整[专题包源码](/downloads/topics-source.json)，按[包操作说明](/reference/tools#构建导入与安装)构建、导入并安装 1.0.1。

两个列表视图的 ownerId 绑定分别是 `00m0a9a44270c7f506e7/ownerId` 和 `00md1193c752cd639ddf/ownerId`，值取维护者的实际 userId。初装前按[专题包的影响确认](/reference/tools#专题包的影响确认)检查分享、事件与编排配置。

先执行下载的查询。如果没有这些账目，用 `POST /api/data/v1/entities/xrainlab__entry__c/records:batchCreate` 提交下载的 topics-values.json；已存在时核对并复用。不要重复创建或覆盖不一致的数据。

金额字段 `amount__c` 是 Money，精度 18、小数 2 位；`category__c` 保存 `work/life`。分类对象是 `xrainlab__category__c`，通过 Lookup 字段 `categoryRef__c` 关联。给学员配置这两个对象及所需字段的权限。

包内还有用于提交前拒绝演示的编排，但没有自动启用的 Trigger。
:::

## 当前页、总数与汇总 {#当前页总数与汇总}

每页只显示 1 条时，预期是：

- **这一页有 1 条**：`records.Count = 1`。
- **符合条件的共有 3 条**：`totalCount = 3`。
- **三笔金额合计 60.90**：`totalAmount = "60.90"`。

沿用 B1 的 `$base`、`$headers`，在下载文件所在目录运行：

```powershell
$summary = Invoke-RestMethod -Uri "$base/api/data/v1/entities/xrainlab__entry__c/records:query" -Method Post -Headers $headers -ContentType 'application/json' -InFile './topics-query.json'
$summary.records.Count
$summary.totalCount
$summary.aggregates | Select-Object alias, value
```

打开 topics-query.json，可以找到：

| 配置 | 作用 |
|---|---|
| `pageSize: 1` | 每页取 1 条 |
| `includeTotalCount: true` | 返回总条数 |
| `aggregates` 中的 `sum` | 对符合筛选条件的金额求和 |
| `alias: "totalAmount"` | 给这项合计起一个返回名称 |

**合计按完整筛选结果计算，不只计算当前页。** 金额通过字符串传输，以保留十进制精度。

试着把 pageSize 改成 2。应该只有当前页条数改变；总条数仍为 3，合计仍为 60.90。

## 按问题选择查询方式

| 你想知道什么 | 使用什么 | 本例的结果 |
|---|---|---|
| 一共有几笔？ | `count` | 数字 `3` |
| 用到了哪些分类？ | `distinct` | `work`、`life` |
| 必须只有一条匹配记录 | `single` | 用完整标题查一笔；匹配多条会报错 |
| 最多一条，没有时可以为空 | `singleOrDefault` | 无匹配时返回 JSON `null` |
| 只取第一条，没有时可以为空 | `firstOrDefault` | 第一条或 `null` |
| 同时发送几组查询 | `queryBatch` | 最多 8 组，分别返回结果 |

`distinct` 使用字段与筛选参数，不带分页参数。当前查询接口没有通用 SQL `groupBy`；分组统计可以按不同条件分别汇总，或使用已有报表功能。

## 视图：改变显示方式，保留原数据 {#视图改变显示方式保留原数据}

视图保存要显示的列、筛选和排序。例如把账目列表从“标题、金额、分类”改成只显示“标题”，原记录的金额并不会消失。

可以在自己的个人视图中试一次：修改显示列，再通过记录接口读取同一条账目，确认金额仍在。

维护视图时先读取最新 `metadataRevision`，用 `If-Match: "metadata-本次修订号"` 提交。开发页面时，需要按接口说明读取 views，并在需要时提交 `presentation`，才能应用视图的显示设置。

视图不会增加数据权限。修改后若出现 `503 / runtime_metadata_not_ready`，按[对应排错步骤](/help/errors#元数据未就绪)处理。

## 批量修改：一个请求中的记录一起成功或失败 {#批量修改一个请求中的记录一起成功或失败}

以两条普通账目为例：在同一个批量更新请求中，一条旧值条件匹配，另一条不匹配，整批更新会失败，两条都保留原值。

这项保证只覆盖**同一租户内、同一次普通记录批量写入的事务**。拆成两个请求后，它们分别提交；已经发出的外部 HTTP 请求或消息也不会随数据库事务撤回。

练习只用自己创建的两条测试记录，比较提交前后的值。Owner 变更使用专门接口，不放进普通 `values`。

## 记录归属与分享

假设你有一条账目，希望同事也能查看。分享解决的是“同事能否查看这一条”；同事仍需该对象和字段的读取权限。

一次完整练习是：

1. 用已有的两名测试用户，确认分享前第二人不能读取这条记录。
2. 查询可分享操作和接收人，分享给第二人。
3. 第二人正常登录，读取同一 recordId。
4. 撤销分享，第二人再次读取，检查访问是否被收回。

查询入口是记录路径下的 `/shares/capability`、`/shares/recipients`、`/shares/eligibility` 和 `/shares`，各自的参数与返回见[专题资料](/reference/sources#专题资料)。

若撤销后仍能访问，检查是否还有其他角色或共享规则允许访问。记录 Owner、业务负责人和创建人可能是不同的人。

## 历史、敏感值与恢复 {#历史敏感值与恢复}

- **查修改历史**：在记录路径后使用 `/history?page=1&pageSize=20`。
- **读取敏感原值**：需要对应权限及 `original-values` 接口。普通响应中的星号可能是脱敏结果，不能拿来作为 `expectedValues`。
- **恢复软删除记录**：使用回收站恢复功能。新建一条相同文字的记录会得到另一个 ID，不能代替恢复。

删除和恢复练习使用单独创建、标明用途的测试记录，不删除后续课程还要用的便签。

## 导出：先确认拿到了多少条 {#导出先确认拿到了多少条}

`:export` 返回当前页 JSON，并检查导出权限。要生成 CSV 或 Excel，由调用它的程序继续处理。

如果每页 10 条、共 23 条，只导出第一页就只有 10 条。分页期间数据还可能变化；需要固定某一时点的报表时，应使用明确支持快照或固定批次的方案。

详细参数见[数据操作与维护资料](/reference/sources#专题资料)。
