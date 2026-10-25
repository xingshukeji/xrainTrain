---
title: B1 · 对象、字段与记录
lesson: b1
quiz:
  question: 把便签内容从“你好，XRain”改成“下午三点开会”，需要重新安装应用包吗？
  options: [需要，任何修改都要重新安装, 不需要，直接更新这条记录, 需要新增一个“下午三点开会”字段]
  answer: 1
  explanations:
    - 应用包提供对象和字段等配置。修改已经保存的文字，用记录更新接口即可。
    - 字段仍是 content__c，改变的是这一条便签的内容。
    - “下午三点开会”是填写的文字，不是一个新字段。
---
# B1 · 对象、字段与记录

你已经保存了一条“你好，XRain”。现在把它拆成三个概念：**便签是对象，内容是字段，你保存的那一条是记录。**

## 用一张表看懂三个概念

| 记录编号 | 内容 |
|---|---|
| 你的 recordId | 你好，XRain |
| 另一条 recordId | 下午三点开会 |

如果你熟悉数据库，可以把**对象理解为表、字段理解为列、记录理解为行**。XRain 还会在对象和字段上配置显示名称、校验和权限，所以这里是帮助理解的类比。

“内容必须填写、最多 200 个字符”是字段的**定义**；“你好，XRain”是某条记录的**值**。对象、字段及这些配置统称为**元数据**。

| 想做的修改 | 改哪里 |
|---|---|
| 把“你好，XRain”改为“下午三点开会” | 修改记录值 |
| 把最大长度从 200 改为 240 | 修改字段定义 |
| 把页面显示的“内容”改为“便签内容” | 修改字段的显示名称 |

## 用接口分别读取定义和记录

这是课程第一次调用接口。先用 PowerShell 7 完成[登录准备](/help/environment#学习者准备一次正常登录)，取得 `$base`、`$headers` 和 `$context`。在同一个终端输入 G0 中记下的编号：

```powershell
$note = @{ recordId = Read-Host '输入 G0 中自己的便签 recordId' }
```

**先看字段定义。** `describe` 是读取对象说明的接口：

```powershell
$describe = Invoke-RestMethod -Uri "$base/api/metadata/v1/entities/xrainlearn__note__c/describe" -Headers $headers
$describe.fields | Select-Object fieldApiName, label, type, required
```

在结果中找到下面这一行。已经做过标签升级的环境中，label 会显示为“便签内容”。

| fieldApiName | label | type | required |
|---|---|---|---|
| content__c | 内容 | Text | True |

这里的意思是：字段的 API 名叫 `content__c`，用于保存文本，而且不能为空。

**再看你填的文字。** 记录接口按 `recordId` 读取具体的那一条：

```powershell
$record = Invoke-RestMethod -Uri "$base/api/data/v1/entities/xrainlearn__note__c/records/$($note.recordId)" -Headers $headers
$record.values.content__c
```

预期输出 `你好，XRain`。可以把两个请求记成：**describe 看字段怎样定义，records 看数据填了什么。**

## API 名和 ID 分别用在哪里

| 名称 | 本例中的值或取得位置 | 用途 |
|---|---|---|
| 对象 API 名 | `xrainlearn__note__c` | 选择便签对象 |
| 字段 API 名 | `content__c` | 选择内容字段 |
| recordId | G0 详情中的“系统标识” | 选择你保存的那一条 |
| objectId / fieldId | describe 返回的对象、字段 ID | 维护对象和字段定义时使用 |

读取便签要用 `recordId`。即使 `fieldId` 也是一串字符，把它放进记录路径也找不到你要读的那条便签。

## 为什么还会出现创建人和创建时间

平台自动提供系统字段，所以你只定义了“内容”，却能看到更多字段。最常用的是：

| 字段 | 作用 |
|---|---|
| `id` | 记录编号 |
| `createdById`、`createdAt` | 谁在什么时候创建 |
| `updatedById`、`updatedAt` | 谁在什么时候修改 |
| `ownerId` | 记录归属，参与数据访问控制 |

这些字段不用在样例中重复创建。完整字段和允许的读写操作，以 `describe` 为准；`object.access` 中的 `creatableFieldApiNames`、`editableFieldApiNames` 列出当前账号可填写和修改的字段。

## 便签对象从哪里来

维护者提前安装了教学应用包。它定义便签对象、内容字段和列表视图；G0 中点击保存，才创建了你的便签记录。

![对象和字段先安装，具体文字再通过记录接口保存](/diagrams/definitions.svg)

可编辑的配置文件叫 `source.json`，构建后得到 `.appkg` 应用包，再安装到租户中。**修改一条便签的文字不需要重新安装包。** 修改字段定义的练习放在 [B6](/basics/version)。

## 自己做一次

判断下面三项应该改“定义”还是“记录值”：

1. 把自己的便签改成“明天交报告”。
2. 让内容允许填写 240 个字符。
3. 把显示名称“内容”改成“便签内容”。

::: details 对照答案
第 1 项改记录值；第 2、3 项改字段定义。

再用本页的两个请求分别找出 `required` 和 `你好，XRain`。能说清它们为什么出现在不同结果里，就理解了定义与记录的区别。
:::

<QuizCard />

下一节：[找到并读懂接口](/basics/api)。
