---
title: HTTP 记录与元数据
---
# HTTP 记录与元数据

请求使用平台地址和当前登录凭据。路径中的 `entityCode`、`recordId`、`fieldApiName` 要替换为实际值；基础课的对象是 `xrainlearn__note__c`。

## 元数据与当前身份

| 方法与路径 | 主要返回 | 用途 |
|---|---|---|
| `GET /api/metadata/v1/business-objects` | `metadataRevision, objects` | 查当前可见对象 |
| `GET /api/metadata/v1/entities/{entityCode}/describe` | `object, fields, listViews, metadataRevision, temporalContracts` | 查字段、视图和访问权限 |
| `GET /api/data/v1/query-capabilities` | `fieldTypes, operatorSets, operators, limits` | 查查询操作符和限制 |
| `GET /api/data/v1/entities/{entityCode}/fields/{fieldApiName}/options` | 该选项字段的可选项 | 查询 Picklist / MultiPicklist；不用于 Text 或 UserRef |
| `GET /api/service/authen/v1/account/context` | 用户、租户、scope、权限和地区设置 | 确认当前登录信息 |

在 `describe.fields` 中：

| 属性 | 含义 |
|---|---|
| `fieldApiName` | 字段的 API 名 |
| `label` | 显示名称 |
| `type` | 字段类型 |
| `required` | 是否必填 |

`object.access` 列出当前允许的操作和可读、可创建、可编辑字段。字段存在不等于当前用户有写入权限。

应用包源码用 `nullable` 表示能否为空，describe 用 `required` 表示是否必填，不能直接复制属性名。

## 单条记录

路径前缀是 `/api/data/v1/entities/{entityCode}/records`。

| 操作 | 请求 | 成功返回 |
|---|---|---|
| 创建 | POST 到前缀，正文为 `{ "values": { ... } }` | 201，记录对象 |
| 读取 | GET 前缀加 `/{recordId}`，无正文 | 200，记录对象 |
| 更新 | PUT 前缀加 `/{recordId}`，正文包含 values，可选 expectedValues | 200，记录对象 |
| 删除 | DELETE 前缀加 `/{recordId}` | 204，无正文 |

创建便签：

```http
POST /api/data/v1/entities/xrainlearn__note__c/records
Content-Type: application/json

{"values":{"content__c":"你好，XRain"}}
```

成功响应包含 `recordId`、`entityCode`、创建与修改时间、`values`。便签文字在 `values.content__c` 中。

### 条件更新

`values` 放新值，`expectedValues` 放此前读到的业务字段旧值。所有旧值条件都匹配才更新；不匹配返回 `409 / platform.data.concurrency_conflict`。

`expectedValues` 可以省略。使用时保留用户的新输入，冲突后重新读取并比较差异。系统字段按其只读规则或专门操作处理，不随意写入 values。

### 删除与恢复

本课便签采用软删除。删除成功后，普通记录读取返回 404；恢复使用回收站和相应权限。新建相同内容会得到另一条记录，不能代替恢复。

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

| 返回字段 | 含义 |
|---|---|
| `records` | 当前页的记录 |
| `totalCount` | 筛选后且当前用户可见的总条数 |
| `page, pageSize` | 页码和每页条数 |
| `fields` | 查询字段说明 |
| `aggregates` | 请求的汇总结果 |
| `metadataRevision` | 本次使用的元数据版本 |

没有请求总数时，缺少或未计算的 totalCount 不能当作 0。

单个筛选条件使用 `{field, op, value}`；组合筛选使用非空的 and/or 分组。条件中的 field 填字段 API 名。describe 的属性叫 `fieldApiName`，查询返回的字段说明可能叫 `apiName`，要按各自结构读取。

| 其他查询 | 要点 |
|---|---|
| `POST .../records:count` | 返回数字 |
| `POST .../records:distinct` | 查询指定字段的不同值，使用 fields 和可选 filter，不带分页参数 |
| query 中的 `aggregates` | `{field,function,alias}`，汇总完整筛选结果，不只算当前页 |
| `POST .../records:export` | 返回当前页 JSON，生成 CSV/XLSX 由调用方处理 |
| `POST /api/data/v1/records:queryBatch` | 正文为 `{queries:[{entityCode,query}]}`，最多 8 项；返回 `{results}` |

当前查询不提供通用 SQL groupBy。完整例子见[数据专题](/topics/data)。

## 错误返回

HTTP 接口没有统一的 `{success,data,error}` 外层。先检查状态码，再按该接口读取正文。

记录和元数据错误通常包含 `type/title/status/errorCode/message`，部分还带 `traceId`；其他模块可能使用不同格式。遇到非 JSON 或 5xx 时，保留状态和错误信息，不转换成空列表。

基础样例已验证的状态与范围见[资料索引](/reference/sources#适用范围与真实验证)。按现象定位见[排错表](/help/errors)。
