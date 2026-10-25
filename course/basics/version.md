---
title: B6 · 修改字段与应用版本
lesson: b6
flow:
  title: 把“内容”改成“便签内容”
  description: 修改字段名称，不修改已经保存的文字。
  steps:
    - title: 修改源码
      caption: label 改为“便签内容”
      detail: 保留对象和字段的 ID、API 名及类型，为这次修改设置新的版本号和 versionId。
    - title: 构建并导入
      caption: source.json → .appkg → 平台包目录
      detail: 构建生成应用包，导入让平台保存这个版本。此时还没有升级租户。
    - title: 预检并安装
      caption: 检查变化，再升级目标租户
      detail: 使用当前 revision 检查和提交安装，保存 requestId，按这个编号查看进度。
    - title: 检查结果
      caption: 新标签，原 recordId，原内容
      detail: 安装成功后读 describe 和原记录，确认只有预期的标签发生变化。
quiz:
  question: 1.0.1 已导入平台，但当前租户仍显示旧标签。先检查什么？
  options: [浏览器字体, 当前租户安装的版本和安装进度, 再创建一个同名字段]
  answer: 1
  explanations:
    - 字段标签由配置决定，先确认租户是否已升级。
    - 导入是把包放进平台目录，安装才会更新租户中的配置。
    - 新建字段不能替代升级原字段，还可能产生重复定义。
---
# B6 · 修改字段与应用版本

这次把字段的显示名称从“内容”改成 **“便签内容”**。预期只有标签变化：`content__c`、记录编号和便签文字都保持原样。

普通学员可以比较源码、读取结果。**安装和升级由教学环境维护者执行一次**，同一班学员不需要重复升级。

## 先区分：改文字，还是改字段

| 要改什么 | 例子 | 使用什么方式 |
|---|---|---|
| 记录内容 | 把便签改成“明天交报告” | B3 的记录更新接口 |
| 字段定义 | 把“内容”改成“便签内容” | 更新教学应用包并安装 |
| 应用页面代码 | 调整自建页面的按钮布局 | 该应用自己的构建与发布 |

本课程的字段由应用包管理。打开两份完整源码：[1.0.0](/downloads/note-source.json)和[1.0.1](/downloads/note-label-source.json)，搜索 `content__c`，比较旁边的 `label`。

除了标签，1.0.1 还使用了新的版本号和 `versionId`；对象、字段和视图的 ID 保持不变。两份文件都是完整源码，可以直接用于构建。

## 新版本怎样生效

<FlowSteps />

可以把它理解为三件连续的事：

1. **构建**：把 source.json 变成 .appkg 文件。
2. **导入**：把这个包版本放进平台包目录。
3. **安装或升级**：让指定租户使用这个版本。

文件已生成或包已导入，都不表示租户已经升级。

## 维护者操作：读取当前版本

沿用环境准备中的租户登录变量：

```powershell
$packageId = 'apgc5deec239e1d8b0ba'
$packages = Invoke-RestMethod -Uri "$base/api/application/v1/packages" -Headers $headers
$installed = $packages | Where-Object id -eq $packageId
$installed | Select-Object id, installedVersionId, installationId, revision
if (-not $installed.installationId) { throw '此租户尚未安装教学包，先完成环境准备。' }
$installationState = Invoke-RestMethod -Uri "$base/api/application/v1/installations/$($installed.installationId)" -Headers $headers
$installationState | Select-Object packageId, installedVersionId, revision, activeOperationId
```

记下 `installedVersionId` 和 `revision`。revision 是安装状态的修订号，用来防止两次变更互相覆盖。如果 `activeOperationId` 指向尚未完成的操作，先查询那个操作。

然后按[构建、导入与安装步骤](/reference/tools#构建导入与安装)处理 1.0.1。安装前查看 preview 列出的变化，确认是预期的标签修改，再提交并保存 `requestId`。

## 升级后检查什么

| 检查位置 | 预期结果 |
|---|---|
| operation | `status = Succeeded` |
| installation | 已安装版本是本次提交的 1.0.1 |
| describe 的 `content__c` | label 变成“便签内容” |
| 原 recordId 对应的记录 | 编号没变，原来的文字仍在 |

普通学员读取后两项；前两项由维护者提供结果。已有 1.0.1 的环境直接核对，不重复安装。

## 自己做一次

比较升级前后，填写这张表：

| 项目 | 变了，还是没变？ |
|---|---|
| 字段显示名称 | |
| 字段 API 名 `content__c` | |
| 原记录的 `recordId` | |
| 原记录的内容 | |

::: details 对照答案
只有显示名称变了。API 名、recordId 和原内容不变。

这个结论只适用于本次标签修改。改字段类型、增加必填项或删除字段，可能影响已有数据，需要先评估；继续查[安装维护](/topics/operations)。
:::

<QuizCard />
