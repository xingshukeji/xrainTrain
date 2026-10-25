---
title: B2 · 找到并读懂接口
lesson: b2
flow:
  title: 读取一条便签
  description: 看清请求发了什么，以及返回了什么。
  steps:
    - title: 选中记录
      caption: 便签对象 + 你的 recordId
      detail: 对象 API 名选择便签，recordId 选择其中一条。沿用 G0 保存的编号。
    - title: 发送请求
      caption: GET + 请求地址 + 登录凭据
      detail: GET 表示读取。当前租户和用户由登录凭据确定，这个请求不需要 JSON 正文。
    - title: 查看响应
      caption: 状态码 + 返回内容
      detail: 成功时得到 200 和记录内容。失败时先读状态码和错误信息。
    - title: 找到文字
      caption: values.content__c
      detail: 这里应是“你好，XRain”。同时核对 recordId，确认读到的是自己的那一条。
quiz:
  question: 想知道“内容”是不是必填字段，应该查什么？
  options: [某一条便签的内容, 对象的 describe, 应用包安装成功提示]
  answer: 1
  explanations:
    - 一条记录只显示这次填了什么，不能说明字段是否允许为空。
    - 在 describe.fields 中找到 content__c，再看 required。
    - 安装提示没有列出字段规则，需要读取对象说明。
---
# B2 · 找到并读懂接口

B1 已经调用了两个接口。这一课学习怎样自己找到它们：**先确定要做的事，再看请求方法、参数和返回结果。**

## 把“读取我的便签”翻译成一个请求

在[HTTP 速查的单条记录表](/reference/http#单条记录)中，读取操作是：

```http
GET /api/data/v1/entities/{entityCode}/records/{recordId}
```

花括号表示需要替换的部分：

| 路径参数 | 本课填什么 |
|---|---|
| `entityCode` | `xrainlearn__note__c`，便签对象的 API 名 |
| `recordId` | G0 中你保存的记录编号 |

沿用 B1 的终端变量，完整请求就是：

```powershell
$record = Invoke-RestMethod -Uri "$base/api/data/v1/entities/xrainlearn__note__c/records/$($note.recordId)" -Headers $headers
$record.values.content__c
```

`$base` 是平台地址，`$headers` 携带登录凭据。这个 GET 请求没有请求正文。

<FlowSteps />

## 怎样找到响应里的数据

下面是响应的简化示例。为方便阅读，编号写成说明文字：

```json
{
  "recordId": "你的记录编号",
  "entityCode": "xrainlearn__note__c",
  "values": {
    "content__c": "你好，XRain"
  }
}
```

读到内容的路径是 `values.content__c`。没有额外的 `data` 层，所以不能写成 `data.values.content__c`。

**不同接口的返回结构可能不同。** 记录读取返回对象，计数接口返回数字，删除成功时没有正文。查文档时先找到“成功返回”这一项。

## 看接口文档时，回答五个问题

| 问题 | 本例的答案 |
|---|---|
| 用什么方法和路径？ | GET，路径里带对象 API 名和 recordId |
| 参数放在哪里？ | 本例放在路径里，没有 JSON 正文 |
| 需要什么权限？ | 当前用户有这条便签及内容字段的读取权限 |
| 成功后返回什么？ | 200，记录对象，文字在 values.content__c |
| 失败怎么看？ | 先看状态码，再看错误码和消息 |

创建、更新、删除还要多确认一件事：**请求会改变什么数据**。本页的 GET 只读取，不修改便签。

## 去哪份文档查

| 你要解决的问题 | 查阅位置 |
|---|---|
| 请求怎样写、返回怎样读 | [HTTP 速查](/reference/http) |
| 当前对象有哪些字段、我能改哪些字段 | 对象的 `describe` |
| CLI 命令支持什么参数 | 对应命令的 `--help` |
| 程序中有哪些可用方法 | 当前 SDK 的公开类型与文档 |
| 应用包的 JSON 怎样写 | [应用包说明](/reference/tools#构建导入与安装) |

更多入口集中在[接口文档](/reference/)。不需要先读完整个平台的接口清单。

## 自己做一次

需求：查找内容为“你好，XRain”的便签，每页最多显示 10 条，并返回匹配总数。

打开 [HTTP 查询示例](/reference/http#查询与统计)，找出请求方法、`filter`、`pageSize` 和 `includeTotalCount`。先自己回答，再展开答案。

::: details 对照答案
- 方法是 POST，因为要在请求正文中发送查询条件。
- `filter` 是 `{ "field": "content__c", "op": "eq", "value": "你好，XRain" }`。
- `pageSize` 为 `10`，`includeTotalCount` 为 `true`。
- `records` 是这一页的数据，`totalCount` 是符合条件且你有权查看的总条数。

下一节会实际执行修改和查询。
:::

<QuizCard />
