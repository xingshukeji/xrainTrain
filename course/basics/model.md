---
title: B1 · 定义与记录
lesson: b1
quiz:
  question: 把便签内容从“你好”改为“已完成”，需要重新构建应用包吗？
  options: [需要，因为任何变化都要发新版本, 不需要，这是修改一条记录的值, 需要先新增一个“已完成”字段]
  answer: 1
  explanations:
    - 应用包描述对象和字段等定义。修改已有字段中的记录值，使用记录更新接口即可。
    - 正确。字段仍然是 content__c，改变的是同一 recordId 下保存的文字。
    - “已完成”在这个例子中是一段文字值。只有确实需要独立业务信息时，才考虑增加字段。
---
# B1 · 定义与记录

刚才你保存了一条便签。现在回答一个问题：**“内容”这个字段，和“你好，XRain”这段文字，分别放在哪里？**

本节使用 G0 中保存的便签与自己的 `recordId`。结束时，你应能在定义与数据之间准确找到要改的位置。

## 一张空表，和填进去的一行

对象定义描述一类东西，字段定义描述它有什么信息，记录保存某一次具体填写的值。用熟悉的数据库来类比：对象近似表的业务定义，字段近似列的业务定义，记录近似一行数据。XRain 的定义还带有权限、呈现和生命周期等规则，因此不能只把它理解成数据库列。

| 这个例子中的东西 | 具体值 | 回答的问题 |
|---|---|---|
| 对象 API 名 | `xrainlearn__note__c` | 操作哪一类记录？ |
| 字段 API 名 | `content__c` | 读写这条记录的哪项信息？ |
| 字段标签 | 内容 | 给人看时叫什么？ |
| 字段类型 | `Text`，最长 200 字符 | 允许保存什么？ |
| 记录 ID | 详情“系统标识”或创建响应中的 `recordId` | 操作哪一条记录？ |
| 记录值 | `"你好，XRain"` | 这一次实际填了什么？ |

![定义安装后约束记录写入，记录值通过数据接口单独保存](/diagrams/definitions.svg)

文字说明：源码中的对象、字段和视图经构建、安装成为租户的有效定义。创建记录时，平台按有效定义检查输入，并保存字段值。修改记录值走数据接口；修改定义走定义维护或应用版本流程。

## 读取两份不同的信息

这是本课程第一次使用接口。准备 PowerShell 7，按[一次正常登录](/help/environment#学习者准备一次正常登录)取得 `$base`、`$headers` 和 `$context`。保持在同一个终端，把 G0 记下的编号放入变量；不再创建便签：

```powershell
$note = @{ recordId = Read-Host '输入 G0 中自己的便签 recordId' }
```

如果已走过接口路径并保留这些变量，可以跳过准备。先读定义：

```powershell
$describe = Invoke-RestMethod -Uri "$base/api/metadata/v1/entities/xrainlearn__note__c/describe" -Headers $headers
$describe.fields | Select-Object fieldApiName, label, type, required
```

你应找到 `content__c`，其类型为 `Text`，`required` 为 `true`。再读记录：

```powershell
$record = Invoke-RestMethod -Uri "$base/api/data/v1/entities/xrainlearn__note__c/records/$($note.recordId)" -Headers $headers
$record.values.content__c
```

这里应输出 `你好，XRain`。`describe` 返回字段定义，记录读取返回一条数据。两个请求都成功，仍然不能互相替代。

## 为什么只有一个自定义字段，却读到 12 个字段

便签样例只声明 `content__c`。平台同时提供 11 个系统字段：

| 系统字段 | 用途 |
|---|---|
| `id` | 记录身份 |
| `ownerId` | 记录 Owner，与业务负责人不是同一个概念 |
| `createdById`、`createdAt` | 创建人和创建时刻 |
| `updatedById`、`updatedAt` | 最近修改人和时刻 |
| `isDeleted`、`deletedById`、`deletedAt` | 删除状态及相关信息 |
| `externalId`、`externalSource` | 外部来源对应信息 |

不要在样例源码中重复创建这些字段，也不要把它们混进普通字段写入。当前身份能读写哪些字段，要继续看 `object.access` 的 `readableFieldApiNames`、`creatableFieldApiNames` 和 `editableFieldApiNames`。

`recordId` 是记录响应外层的身份；元数据中的 `objectId`、`fieldId` 是定义身份。即使它们看起来都是一串字符，也不能交叉使用。

## 源文件、应用包与租户

`source.json` 是可编辑的完整定义；`.appkg` 是平台构建后的应用制品。包进入平台目录后，仍须在目标租户安装才会生效。同一个包可以安装到不同租户，各租户拥有各自的数据和合法配置。

源码中没有“你好，XRain”这条业务记录。安装本样例不会自动生成便签，G0 在页面中的保存操作才创建了它。样例额外声明了一个列表视图，方便显示“内容”这一列；当前用户实际能看到哪些视图，还取决于视图访问条件。

## 自己做一次

1. 在 `describe.fields` 中找到 `content__c` 的 `fieldId`，再找到记录响应中的 `recordId`，分别写下它们的用途。
2. 找出 `content__c` 与 `createdAt` 的类型，说明为什么不能用同一种方式填写。
3. 判断“把文字改为今天的安排”和“把内容长度从 200 调整为 240”分别需要改数据还是改定义。

完成标准：你能在不重新安装的情况下解释一次记录修改，并能指出判断可写字段所需的实际元数据。

<QuizCard />

下一节：[找到并读懂接口](/basics/api)。遇到名词不熟悉时查[术语表](/reference/glossary)。
