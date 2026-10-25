---
title: B6 · 修改定义与版本
lesson: b6
flow:
  title: 一处定义修改，怎样成为租户的实际字段
  description: 用“内容标签改为便签内容”做一个非破坏性例子；记录值保持原样。
  steps:
    - title: 编辑完整源码
      caption: 保持原有身份，使用新版本身份
      detail: 修改字段 label，保留 packageId、对象和字段 ID、API 名及类型；新版本使用新的 versionId 和版本号。源码仍包含完整记录集合。
    - title: 构建并导入
      caption: source.json → 新的不可变 .appkg
      detail: 由目标平台构建并核对摘要，再通过获授权入口将这个确定版本导入目录。构建或导入成功都没有改变租户的有效版本。
    - title: 预检并安装
      caption: 读取当前 revision，检查影响
      detail: 预检针对确定包和版本。提交时携带实际修订号，保留 operation ID；有冲突或缺失输入时处理对应事实，不把请求自动重发。
    - title: 读取生效结果
      caption: 安装指针 + describe + 原记录
      detail: operation 成功后，核对 installation 指向的版本和 revision，再读字段标签及原来的 recordId。三项一致才能说明这次变化按预期生效。
quiz:
  question: 新版本已导入平台目录，当前租户的 describe 仍显示旧标签。优先检查什么？
  options: [浏览器字体缓存, 该租户的安装版本和操作状态, 再创建一个同名字段]
  answer: 1
  explanations:
    - 标签是业务元数据。应先核对安装事实，再判断客户端是否缓存了旧的 metadataRevision。
    - 正确。导入发生在包目录，安装才改变目标租户的有效版本。
    - 重建同名字段可能造成身份和数据冲突，不能代替核对原对象版本。
---
# B6 · 修改定义与版本

这次把字段标签“内容”改为“便签内容”。我们仍只使用一个对象和一个自定义字段。先预测结果：**界面标签会变，`content__c` 和原记录的文字应保持不变。**

本节需要具备教学包的维护与安装权限。共享培训目标由维护者执行一次即可，其他学习者核对同一结果；不要多人同时修改一个包版本。

<FlowSteps />

## 三种变化，选择三个不同入口

| 你改的是什么 | 例子 | 生效路径 |
|---|---|---|
| 记录值 | 把便签文字改成“明天再看” | 数据更新接口 |
| 对象或字段定义 | 把标签改为“便签内容” | 定义维护或本应用的新包版本 |
| 运行程序 | 修改某个自建页面的代码 | 对应应用自己的构建与部署 |

本课程的便签属于包管理定义，所以用新包版本说明变化。不能把改 JSON 文件、构建成功、导入成功和租户安装成功合并成一个状态。

## 先核对已有版本

```powershell
$packageId = 'apgc5deec239e1d8b0ba'
$packages = Invoke-RestMethod -Uri "$base/api/application/v1/packages" -Headers $headers
$installed = $packages | Where-Object id -eq $packageId
$installed | Select-Object id, installedVersionId, installationId, revision
if (-not $installed.installationId) { throw '此租户尚未安装教学包，先完成环境准备。' }
$installationState = Invoke-RestMethod -Uri "$base/api/application/v1/installations/$($installed.installationId)" -Headers $headers
$installationState | Select-Object packageId, installedVersionId, revision, activeOperationId
```

保存安装详情中的版本与 `revision`。包目录不包含 `activeOperationId`，必须另读 installation；若其中指向一个尚未完成的操作，先跟踪它，不能另起一次并行升级。

## 一次非破坏性修改

课程提供两个完整源码：[1.0.0 源码](/downloads/note-source.json)和[标签练习 1.0.1 源码](/downloads/note-label-source.json)。后者只改变标签与发布版本身份，不改变对象、字段和视图的稳定 ID。

先对照这两个文件，找出字段 `label` 的变化。完整源码还保留全部原有定义；不要把“只改一处”理解成只发送一个 JSON patch。

按[应用包操作说明](/reference/tools#构建导入与安装)构建 1.0.1，经维护者导入后，在你的目标租户读取 preview。没有冲突且所需输入完整时，按本次实际 revision 提交安装。保存 `requestId`，后续通过同一 operation 查询。

基础练习不要同时修改字段类型、删除字段、增加必填字段或改变唯一性。这些操作可能影响存量记录和依赖，需要在[安装维护专题](/topics/operations)中单独评估。

## 成功之后还要读什么

1. GET operation：`status` 是 `Succeeded`。
2. GET installation：`packageId`、`installedVersionId`、`revision` 与这次操作一致。
3. GET describe：`content__c` 的标签是“便签内容”。
4. GET 原 recordId：此前保存的内容仍在，没有变成新记录。

如果只有第一项成功，不能省略后面三项。字段标签正确但原记录消失，也不是这次练习的预期结果。

## 自己做一次

在有维护权限的独立练习租户完成这次标签变更。若共享目标已由维护者执行，读取四项结果并对照源码，不重复升级同一版本。

写下改变与未改变的事实：包版本变了，字段标签变了；字段 API 名、recordId 和内容值没有变。把这四项结果保存为脱敏笔记，不保存会话令牌。

完成标准：从“想改什么”判断正确入口，再用有效定义和原记录证明变化结果。

<QuizCard />
