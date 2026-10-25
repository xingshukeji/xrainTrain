---
title: G0 · 我的第一条便签
lesson: g0
flow:
  title: 从定义到“你好，XRain”
  description: 只增加一个对象和一个文本字段；列表视图用于查看，系统字段由平台提供。
  steps:
    - title: 读懂最小定义
      caption: 学习便签 · 内容 · Text
      detail: 完整样例声明一个便签对象、一个必填文本字段和一个查看用的列表视图。此时还没有任何一条业务便签。
    - title: 构建并确认安装
      caption: source.json → .appkg → 租户有效定义
      detail: 构建生成包，导入让平台目录认识这个版本，安装才使目标租户使用定义。已准备好的培训目标可复用现有安装，不必为重学一遍而重装。
    - title: 保存一条便签
      caption: content__c = 你好，XRain
      detail: 用现有获授权身份创建一条记录。平台返回新的 recordId；它标识这条记录，不是对象或字段的定义 ID。
    - title: 重新读取并查看
      caption: 同一个 recordId，页面也能看到
      detail: 通过 GET 回读同一条记录，再到平台的数据视图查看。值确实保存下来后，再进入下一节解释模型与接口。
quiz:
  question: 应用包安装成功后，为什么还要单独创建便签记录？
  options: [安装只提供定义，本样例没有预置业务记录, 因为每条记录都需要一个新应用包, 因为网页不能读取已安装的对象]
  answer: 0
  explanations:
    - 正确。源码描述便签有哪些字段；创建请求才把“你好，XRain”保存为某一条具体记录。
    - 同一个对象可以保存多条记录，正常创建记录不需要重建应用包。
    - 获授权的页面和接口都可以访问已生效对象，关键是实际字段、身份与记录范围。
---
# G0 · 我的第一条便签

这一课结束时，你会在真实 XRain 平台保存并重新读到一条 **“你好，XRain”**。只涉及一个自定义对象“学习便签”、一个自定义文本字段“内容”和一条记录。

**预计 25 分钟。** 你需要一个已获准的测试目标、已有账号和 PowerShell 7。培训维护者应先按[环境准备](/help/environment)准备包目录、练习租户与便签权限。课程网页本身无需登录；平台凭据只在目标平台或本机终端输入。

如果还没有平台环境，可以先看完整图解并试用文末模拟。模拟不会记为真实平台实操。

<FlowSteps />

## 1. 获取完整样例

下载[便签源码 source.json](/downloads/note-source.json)，保存为练习目录中的 `source.json`。也可以在课程仓库的 `examples/note/` 直接取得它，不需要下载任何业务工程。

文件中已填好稳定身份、命名空间和版本。先只关注下面两项：

| 对象 | 字段 |
|---|---|
| `xrainlearn__note__c`，标签“学习便签” | `content__c`，标签“内容”，`Text`，必填，最长 200 字符 |

第三条定义是列表视图，用来显示这一列。平台自动提供 ID、创建时间等系统字段；你不需要再定义它们。这个文件没有预置“你好，XRain”这条记录。

## 2. 登录并核对当前目标

在 PowerShell 7 中进入保存 `source.json` 的目录。准备环境指南会建立 `$base`、`$headers` 和 `$context` 三个变量；若还没做，先完成[一次正常登录](/help/environment#学习者准备一次正常登录)。保持在同一个终端继续：

```powershell
$context | Select-Object tenantId, userId, scope
$source = Get-Content -LiteralPath './source.json' -Raw -Encoding utf8 | ConvertFrom-Json
$source | Select-Object namespace, version
```

核对目标租户和自己的身份。样例应显示 `xrainlearn`、`1.0.0`。如果这两项不对，先检查文件；不要为了继续步骤而修改包身份或切换到别人的账号。

## 3. 构建，并确认这个租户已安装

构建由具备该教学包维护资格的环境维护者执行；学习者阅读这一段后，可直接核对已准备好的租户安装。下面返回一个 `.appkg` 文件，不会自动创建业务数据。`$buildHeaders` 来自[包构建身份准备](/reference/tools#构建导入与安装)，与普通数据练习会话分别保留：

```powershell
Invoke-WebRequest -Uri "$base/api/application/v1/packages:build" -Method Post -Headers $buildHeaders -ContentType 'application/json' -InFile './source.json' -OutFile './note-1.0.0.appkg'
Get-Item -LiteralPath './note-1.0.0.appkg' | Select-Object Name, Length
```

预期：请求成功并得到非空文件。本课验证目标的包由 Host 导入，已有包后续构建使用原有 Host 维护身份；安装管理资格不自动包含构建资格。若没有权限，保留拒绝信息，由环境维护者检查，不能把失败保存的 JSON 当作包上传。

读取当前租户的安装状态：

```powershell
$packages = Invoke-RestMethod -Uri "$base/api/application/v1/packages" -Headers $headers
$installation = $packages | Where-Object id -eq $source.packageId
$installation | Select-Object label, installedVersionId, installationId, revision
```

已准备好的培训目标应有 `installedVersionId`。首次搭建目标时，由获授权维护者按[构建、导入与安装](/reference/tools#构建导入与安装)完成安装与数据授权后再继续。具备这项职责的学习者可以亲自执行该小节。已有安装可直接复用；如果目标已完成 B6 的标签练习，字段会显示为“便签内容”，不必降级。

最后确认有效字段：

```powershell
$describe = Invoke-RestMethod -Uri "$base/api/metadata/v1/entities/xrainlearn__note__c/describe" -Headers $headers
$describe.fields | Where-Object fieldApiName -eq 'content__c' | Select-Object fieldApiName, label, type, required
$describe.object.access.creatableFieldApiNames
```

预期：找到 `content__c`、`Text`、`required=True`，并且可创建字段列表包含 `content__c`。安装权限和数据权限是两回事；缺少后者时先回到环境准备，不靠重复安装解决。

## 4. 保存“你好，XRain”

这一步会在练习对象中真实创建一条记录。只执行一次，保留返回的 `$note`：

```powershell
$body = @{ values = @{ content__c = '你好，XRain' } } | ConvertTo-Json -Depth 3
$note = Invoke-RestMethod -Uri "$base/api/data/v1/entities/xrainlearn__note__c/records" -Method Post -Headers $headers -ContentType 'application/json; charset=utf-8' -Body $body
$note | Select-Object recordId, entityCode, values
```

预期：HTTP 创建成功，返回 `recordId`，`values.content__c` 为 `你好，XRain`。记录 ID 由平台生成，每次创建都不同，不复制课程示例里的 ID。

如果请求超时，先确认有没有已经生成结果，不立即反复点创建。用当前身份的查询和实际时间、内容定位自己的结果；同一租户有人使用相同文字时，还要核对归属与 ID。

## 5. 重新读取，再到页面查看

```powershell
$readback = Invoke-RestMethod -Uri "$base/api/data/v1/entities/xrainlearn__note__c/records/$($note.recordId)" -Headers $headers
$readback.recordId
$readback.values.content__c
```

预期：ID 与刚创建的相同，内容仍是 `你好，XRain`。保存这条 ID，后面的基础课继续使用它。如果重新开了终端，可用 `$note = @{ recordId = Read-Host '输入你已保存的便签记录 ID' }` 恢复这个变量。

在浏览器登录同一个平台和租户，选择 **数据视图 → 学习便签**。页面中的学习便签视图应出现这条文字；“查看详情”用于打开该条记录。该入口已在课程验证目标实际核对。看不到视图时，先检查当前用户的视图访问与对象权限，使用 API 回读结果继续定位，不另建一个同名对象。

## 自己做一次

用自己的获准身份完成上面的创建和回读，再在页面找到这条便签。能说明“内容”是字段名、“你好，XRain”是值、`recordId` 是这条记录的身份，就达到首课目标。

本样例于 2026-10-25 在真实测试目标完成构建、导入、安装、创建和回读；[验证范围](/reference/sources#适用范围与真实验证)区分课程实测与资料介绍。

<QuizCard />

## 可选：用网页模拟观察草稿与保存值

下面只在当前页面内运行，不连接平台。保存一次后，改动输入框但先不保存，再点“重新读取”，观察读到的为何仍是旧值。

<NoteLab />

完成后去 [B1 · 定义与记录](/basics/model)，解释刚才发生了什么。
