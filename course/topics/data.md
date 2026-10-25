---
title: 查询、视图与数据维护
---
# 查询、视图与数据维护

适合已经完成 B1—B5、开始处理列表、统计和协作的人。每个小例子独立选择，不需要把全部能力加入便签。

## 先准备独立的专题数据

下载完整[专题包源码 topics-source.json](/downloads/topics-source.json)、[三条合成账目 topics-values.json](/downloads/topics-values.json)和[分页汇总请求 topics-query.json](/downloads/topics-query.json)。这组样例使用独立命名空间 `xrainlab`，不修改基础便签。

由环境维护者按[包操作说明](/reference/tools#构建导入与安装)构建、导入并安装专题包 `1.0.1`。使用本页源码的 packageId/versionId；两个列表视图的 ownerId 绑定分别为 `00m0a9a44270c7f506e7/ownerId` 和 `00md1193c752cd639ddf/ownerId`，取既有维护者的真实用户 ID。初装按[专题包的影响确认](/reference/tools#专题包的影响确认)审阅分享、事件与编排源码，不能套用基础便签中固定的视图 ID。

| 定义 | 本次要认识什么 |
|---|---|
| `xrainlab__entry__c` | `title__c` 为必填 Text；`amount__c` 为必填 Money，精度 18、小数 2 位 |
| `category__c` | Picklist，保存 `work/life`，显示“工作/生活” |
| `categoryRef__c` | Lookup，关联 `xrainlab__category__c` 的真实记录 ID |
| `xrainlab__category__c` | 独立分类对象，`name__c` 为必填 Text |
| `xrainlabBeforeCheck` | 提交前拒绝演示使用的编排；包内没有自动启用的 Trigger |

维护者只给练习人物所需的专题对象与字段权限。分享对照人物还需对象 Read 和相应字段 Read，但不因此获得其他业务对象权限。先从 describe 确认字段、写入资格和已安装版本，再做下面的练习。

三条合成账目的创建入口是 `POST /api/data/v1/entities/xrainlab__entry__c/records:batchCreate`，请求正文使用下载的 `topics-values.json`。创建前先用 `topics-query.json` 查询：没有样例时创建一次；已有三条时逐条核对并复用；数量或值不符时先定位，不能自动补写或覆盖共享数据。保存创建返回的真实 recordId。Lookup 练习另在分类对象创建自己的分类，再把返回 ID 写入账目的 `categoryRef__c`，不把分类标签当作 ID。

## 当前页、总数与汇总

想象三条合成记录的金额分别是 `"10.20"`、`"20.30"`、`"30.40"`。当 `pageSize=1` 时，页面只显示一条；总数应为 3，完整筛选范围的合计应为 `"60.90"`。

这个例子说明：页面当前一条数据的金额不能代表全范围汇总。`query.aggregates` 使用 `{field,function,alias}`，按实际字段类型支持 `count/sum/avg/min/max`。金额结果保持精确字符串，不能在显示前先转成会丢精度的数值。

本课便签没有金额字段。要动手时使用独立的金额练习对象，先核对字段和三条合成数据，再同时比较 `records`、`totalCount` 和 `aggregates`。不向便签的 Text 字段发送 Money 请求。

沿用已核对的 `$base` 和 `$headers`，原样执行下载的查询请求：

```powershell
$summary = Invoke-RestMethod -Uri "$base/api/data/v1/entities/xrainlab__entry__c/records:query" -Method Post -Headers $headers -ContentType 'application/json' -InFile './topics-query.json'
$summary.records.Count
$summary.totalCount
$summary.aggregates | Select-Object alias, value
```

预期分别是 `1`、`3` 和 `totalAmount="60.90"`。相同筛选下的 `count` 为 JSON 数字 `3`；`distinct` 查询 `category__c` 应得到 `work/life` 两种值。用一个准确 title 查询 `single` 得到同一记录；让它匹配三条时应拒绝；`singleOrDefault` 查询明确不存在的 title 时返回 JSON null。

## 用最小问题选择查询

| 问题 | 合适入口 | 应检查 |
|---|---|---|
| 列表的一页是什么 | `query` | 页码、字段、筛选与稳定排序 |
| 一共有多少条 | `count` | 返回是数字，不是 `{count}` |
| 某字段组合有哪些不同值 | `distinct` | 只按 fields 与可选 filter 合同，不附带分页参数 |
| 必须正好一条 | `single` | 多于一条也是错误，不静默取第一条 |
| 没有匹配时允许为空 | `firstOrDefault` / `singleOrDefault` | 返回可能为 JSON null |
| 同时读取几个条件 | `queryBatch` | 最多 8 个查询，逐项检查对应结果 |

`RuntimeRecordQuery` 没有通用 SQL `groupBy`。需要分组统计时，按已知条件分别聚合或使用已有报表能力；不要把当前几页数据拼起来冒充全量统计。

## 视图告诉页面怎样显示

视图可以保存列、筛选、排序及部分呈现设置。它不会增加用户的数据权限。客户端要读取当前 views 和 `metadataRevision`；需要应用视图呈现时，再按实际合同提交 `presentation`，不能假设每次普通 query 都自动套用所有样式。

最小练习：在一个获准的个人视图中只改变显示列，比较记录本身是否改变。再检查此视图的访问资格。成功条件是解释“我看到的列变了”，而不是声称数据库结构或记录值也改了。

视图写入前读取最新 `metadataRevision`，通过 `If-Match: "metadata-<本次实际修订>"` 保护修改。若随后出现 `503 / runtime_metadata_not_ready`，先保留该返回并按[元数据未就绪](/help/errors#元数据未就绪)检查，不反复创建视图或记录。本次目标的安装检查恢复读取后，已验证列变为 `title__c`、原记录值不变，另一个人物看不到该个人视图。

## 批量请求有清楚的边界

普通对象同一次批量写入在同一租户事务中处理，一项失败会使该批失败。拆成多个 HTTP 请求之后，它们分别提交；已经发生的外部 HTTP 或消息投递也不随本地事务回滚。

练习时只用两条自己创建的合成记录：先提供都匹配的旧值条件，再让其中一条条件失配，观察同一批是否保持原值。超时先读结果，不把整批自动重放。Owner 变更使用专门动作，不塞进普通 values。

## 记录归属与分享

Owner 是记录归属，不自动等于负责人或创建人。共享规则和人工分享控制记录范围，接收人还需要相应对象与字段资格。

最小分享练习需要两个已准备的固定人物和一条合成记录：先读分享 capability 与候选，再按既有授权选择接收人。分别以两个人物正常登录读取；撤销后复测，并检查其他共享来源是否仍允许访问。不要通过在请求体中换 userId 来模拟另一个人的认证。

对应读取入口位于记录路径的 `/shares/capability`、`/shares/recipients`、`/shares/eligibility` 与 `/shares`。它们各有 DTO，不能统一解析成一个 `allowed` 布尔值。

## 历史、敏感值与恢复 {#历史敏感值与恢复}

修改记录后，可按 `/history?page=1&pageSize=20` 查对应变化。敏感字段的普通响应可能已经脱敏；需要原值时用明确的 `original-values` 合同和合法权限，不能用星号占位值作为并发旧值条件。

软删除后的恢复通过回收站与相应资格处理。它不是再创建一条相似文字，也不是恢复一个应用包版本。最小练习只操作自己创建、明确标注用途的教学记录。

## 导出与附件不同

记录 `:export` 还检查导出权限，返回的是当前页 JSON。生成 CSV/XLSX 属于消费端后续处理，每页继续保留授权与脱敏。浏览器列表上出现一个“导出”按钮，并不能证明你已经获得全量数据。

自己的检查题：当分页期间其他人又修改了记录，怎样避免把一次动态读取声称为冻结的业务快照？先回答这个问题，再决定是否需要明确报表批次或已有快照能力。

深入资料：[数据操作、元数据、组织协作和生命周期](/reference/sources#专题资料)。
