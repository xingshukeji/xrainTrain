---
title: HTTP 记录与元数据
---
# HTTP 记录与元数据

这份速查用于基础课。请求发往你获准的 XRain 服务 origin，使用目标认可的当前会话。以下 `entityCode`、`recordId`、`fieldApiName` 都是路径参数，要用实际值；本课对象固定为 `xrainlearn__note__c`。

## 元数据与当前身份

| 方法与路径 | 成功正文 | 用途 |
|---|---|---|
| `GET /api/metadata/v1/business-objects` | `{metadataRevision, objects}` | 查可见对象，取得实际 entityCode |
| `GET /api/metadata/v1/entities/{entityCode}/describe` | `{object, fields, listViews, metadataRevision, temporalContracts}` | 查有效字段和访问能力 |
| `GET /api/data/v1/query-capabilities` | `{fieldTypes, operatorSets, operators, limits}` | 查实际操作符与限制 |
| `GET /api/data/v1/entities/{entityCode}/fields/{fieldApiName}/options` | 按该选项字段的候选合同 | Picklist / MultiPicklist 的候选，不用于普通 Text 或 UserRef |
| `GET /api/service/authen/v1/account/context` | 当前租户、用户、scope、权限与地区上下文 | 确认实际身份与时间解释环境 |

`describe.fields` 中使用 `fieldApiName`、`label`、`type`、`required` 等属性。包源码则使用 `nullable`；两者不是同名 DTO。对象的 `access` 提供当前允许的动作及可读、可创建、可编辑字段名。判断写入资格时，不能只看字段声明。

## 单条记录

路径前缀为 `/api/data/v1/entities/{entityCode}/records`。

| 操作 | 请求 | 成功 |
|---|---|---|
| 创建 | `POST` 前缀，body 为 `{ "values": { ... } }` | `201`，记录对象 |
| 读取 | `GET` 前缀加 `/{recordId}`，无 body | `200`，记录对象 |
| 更新 | `PUT` 前缀加 `/{recordId}`，body 为 `{ "values": { ... }, "expectedValues": { ... } }` | `200`，记录对象；expectedValues 可省略 |
| 删除 | `DELETE` 前缀加 `/{recordId}` | `204`，无正文 |

便签创建请求：

```http
POST /api/data/v1/entities/xrainlearn__note__c/records
Content-Type: application/json

{"values":{"content__c":"你好，XRain"}}
```

成功记录包含 `recordId`、`entityCode`、创建与修改时刻及 `values`。普通业务字段在 `values` 中。系统字段按实际只读或专门操作合同处理，不与自定义值一起随意更新。

条件更新的 `expectedValues` 使用已获权读取的实际业务字段旧值，全部匹配才更新。不匹配返回 `409 / platform.data.concurrency_conflict`；保留用户新输入，重读并处理差异。没有条件的普通更新仍是合法用法。

## 查询与统计

```http
POST /api/data/v1/entities/xrainlearn__note__c/records:query
Content-Type: application/json

{
  "page": 1,
  "pageSize": 10,
  "fields": ["content__c"],
  "filter": {"field":"content__c","op":"eq","value":"你好，XRain"},
  "includeTotalCount": true
}
```

成功正文含 `entityCode`、`metadataRevision`、`page`、`pageSize`、`totalCount`、`fields`、`records`、`queryPlan`、`aggregates` 和 `temporalContracts` 等合同字段。未请求总数时，不把缺少或未计算的 totalCount 解释为 0。

单条件为 `{field, op, value}`。组合条件按正式查询合同使用非空的 and/or 分组；不要把 SQL 语句直接放进 filter，也不要发明通用 `groupBy` 支持。

| 按需入口 | 关键区别 |
|---|---|
| `POST .../records:count` | 返回数字，按完整筛选与访问范围计数 |
| `POST .../records:distinct` | 读取指定字段不同值，按对应请求合同 |
| `POST .../records:query` 的 `aggregates` | 使用 `{field,function,alias}`；计算完整筛选范围，不是当前页 |
| `POST .../records:export` | 返回查询结果 JSON；不等于直接下载 CSV 文件 |
| `POST /api/data/v1/records:queryBatch` | body 为 `{queries:[{entityCode,query}]}`，最多 8 项；返回 `{results}` |

复杂查询与批量写入应继续查[数据专题](/topics/data)和[原始业务合同索引](/reference/sources)，这里不省略条件后冒充完整请求。

## 状态、错误与返回外层

HTTP 没有统一的 `{success,data,error}` 外层。先读状态，再按这个接口解释正文。记录与元数据错误通常为包含 `type/title/status/errorCode/message` 的 Problem 对象，部分带 `traceId`；其他模块可能使用不同结构。

本课程真实便签验证得到：创建 `201`，读取和更新 `200`，缺少必填内容 `400`，无权 `403`，软删除后读取 `404`，条件冲突 `409`，删除成功 `204`。具体测试范围见[来源与验证](/reference/sources#适用范围与真实验证)。

调试资料记录的问题和当前目标行为可能不同。若遇到 5xx 或非 JSON 响应，保留状态与可用定位信息，不在代码中静默转成空对象。
