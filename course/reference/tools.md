---
title: CLI、SDK 与应用包
---
# CLI、SDK 与应用包

| 你在做什么 | 使用什么 |
|---|---|
| 在终端操作平台 | CLI |
| 在应用代码中调用平台 | SDK |
| 交付对象、字段等配置 | 应用包 |

三者的参数与返回格式不同，使用前查看对应版本的说明。

## CLI 命令与安装

从[公开分发目录](https://github.com/xingshukeji/skills-hub/tree/main/skills/shzw-xrain-cli)取得完整 `xrain-cli/`，无需组织仓库权限。支持 Skill 的工具可按仓库说明安装；其他工具保留完整目录后直接运行。

使用 Node.js 22.12 或以上。CLI 已包含依赖，运行时不需要 npm install 或 .NET。在包含 `xrain-cli/` 的目录执行：

```powershell
$cli = (Resolve-Path './xrain-cli/scripts/xrain-cli.mjs').Path
node $cli --help
node $cli profile list
```

profile 保存连接地址等配置。`--tenant` 使用租户 ID，也就是 tenantId；原生登录中的 tenantCode 则是租户代码。

### 已有原生账号：使用刚才的登录令牌

先完成[PowerShell 登录](/help/environment#学习者准备一次正常登录)，再把登录令牌交给 CLI：

```powershell
$tenantId = $context.tenantId
$env:XRAIN_TOKEN = $headers.Authorization.Substring(7)
$cliAuth = 'auto'
node $cli profile set --server $base --tenant $tenantId --profile learn
```

这条路径适用于通用元数据、数据和安全管理命令，操作权限仍由当前账号决定。`XRAIN_TOKEN` 不写入文件或 profile。结束后执行 `Remove-Item Env:XRAIN_TOKEN -ErrorAction SilentlyContinue`，并清除 `$headers`。

### 已有统一身份：使用浏览器登录 {#已有统一身份使用浏览器登录}

统一认证账号应已关联平台用户，并加入练习租户。在保留 CLI 目录变量的终端中执行：

```powershell
$base = (Read-Host '输入获准测试平台的服务地址').TrimEnd('/')
$tenantId = Read-Host '输入准确的租户 ID（不是租户代码）'
node $cli auth login --server $base --tenant $tenantId --profile learn
$cliAuth = 'session'
```

浏览器和 CLI 要在同一台机器完成回调，登录期间保留终端。`--auth session` 指定使用这次浏览器会话。

CLI 的 app build/import/preview/install 等应用包命令需要这种浏览器会话。缺少账号关联或租户成员关系时，由维护者处理。

### 可选练习：用 CLI 创建并查看一条便签

下载[创建数据](/downloads/note-values.json)和[查询条件](/downloads/note-query.json)，在文件所在目录执行：

```powershell
node $cli metadata describe xrainlearn__note__c --profile learn --auth $cliAuth --json
$created = node $cli data create xrainlearn__note__c --values-json './note-values.json' --profile learn --auth $cliAuth --json | ConvertFrom-Json
if (-not $created.ok) { throw '创建失败，请读取实际错误。' }
$recordId = $created.data.recordId
node $cli data get xrainlearn__note__c $recordId --profile learn --auth $cliAuth --json
node $cli data query xrainlearn__note__c --query-json './note-query.json' --profile learn --auth $cliAuth --json
```

这组命令会新建一条便签，再读取并查询它。CLI 返回的成功结构是 `{ok:true,data:...}`，所以记录编号在 `data.recordId`；失败结构是 `{ok:false,error:...}`。HTTP 记录接口没有这个 data 外层。

修改、删除和其他命令可用对应子命令的 `--help` 查询。课程初始化需要的权限集和成员命令见[环境准备](/help/environment#用-cli-初始化练习资格)。

### 应用包命令

CLI 提供 `app build`、`app import`、`app preview`、`app install` 和 operation 查询，具体参数查当前版本的帮助。

`app import` 从平台配置的应用市场导入指定版本，不接受本地 .appkg 文件；本地原包导入使用下方的 Host 管理接口。`app install --wait` 等待并查询原操作，结束等待不会取消服务器上的安装。

## SDK：用公开导出和类型 {#sdk-用公开导出和类型}

首次使用先读[官方 SDK：取得、调用与工具接入](/developers/sdk)。它说明受控制品的取得方式、适用版本和完整读取示例；不要将包名当作公开 npm 下载承诺。

在企业应用服务端，可以从 `@xrain/workforce-application/server` 使用已发布的 `XRainRuntimeClient`。先查看项目锁文件和该版本类型，按公开方法调用。

| 导出路径 | 用途 |
|---|---|
| `@xrain/workforce-application/host` | 启动宿主和装配应用 |
| `@xrain/workforce-application/server` | 服务端平台客户端 |
| `@xrain/workforce-application/client` | 页面组件与类型 |
| `@xrain/xrain-agent-runtime/host` | 业务工具处理器和执行上下文类型 |

SDK 可能转换 HTTP 响应。例如 HTTP 的 `{results}` 可能被解成数组，context 也可能只返回部分属性。以所用版本的类型和返回为准，不根据路由猜方法名，也不导入包的内部文件。

调用仍使用可信的登录信息；页面或工具参数里的 userId 不能代替认证。

## 构建、导入与安装 {#构建导入与安装}

以下由环境维护者执行。普通学员直接使用已安装环境，回到 [G0](/start)。

### 1. 准备构建账号

新租户包需要提交权限；已有包需要创建者或该包的维护权限。Host 管理账号也可构建。

本课程使用 Host 导入原包，后续构建也使用已有 Host 维护账号。在单独变量中保存它的登录信息，租户练习继续使用原来的 `$headers`：

```powershell
$hostAccount = Get-Credential -Message '输入已有且获准的 Host 维护账号'
$hostBody = @{ userName = $hostAccount.UserName; password = $hostAccount.GetNetworkCredential().Password; scope = 'host' } | ConvertTo-Json
$hostSession = Invoke-RestMethod -Uri "$base/api/service/authen/v1/account/login" -Method Post -ContentType 'application/json; charset=utf-8' -Body $hostBody
$buildHeaders = @{ Authorization = "Bearer $($hostSession.access_token)" }
Remove-Variable hostAccount, hostBody, hostSession
```

如果环境采用租户发布方式，使用已经有该包维护权限的租户账号。不要因此给所有学员增加 Host 管理权限。

### 2. 构建并导入原包

下载的便签源码文件名是 source.json。以下命令生成并导入 1.0.0；已有同名包文件时先核对，避免覆盖需要保留的文件。

```powershell
$source = Get-Content -LiteralPath './source.json' -Raw -Encoding utf8 | ConvertFrom-Json
$built = Invoke-WebRequest -Uri "$base/api/application/v1/packages:build" -Method Post -Headers $buildHeaders -ContentType 'application/json' -InFile './source.json' -OutFile './note-1.0.0.appkg' -PassThru
[pscustomobject]@{ PackageId = $built.Headers['X-Appkg-Package-Id']; VersionId = $built.Headers['X-Appkg-Version-Id']; FileSha256 = $built.Headers['X-Appkg-File-Sha256'] }
Get-FileHash -LiteralPath './note-1.0.0.appkg' -Algorithm SHA256
$imported = Invoke-RestMethod -Uri "$base/api/application/v1/packages:import" -Method Post -Headers $buildHeaders -ContentType 'application/octet-stream' -InFile './note-1.0.0.appkg'
$imported | Select-Object packageId, versionId, version, digest, alreadyExisted
```

检查返回的 packageId、versionId、version、digest 和文件 SHA-256。构建只生成包，导入才保存到平台目录。`alreadyExisted=true` 表示相同版本已经导入，不表示租户已经安装。

### 3. 在租户中预检

下面使用租户 `$headers` 和 `$context`。已安装同版本时先核对现状；已安装其他版本时按升级处理。

```powershell
$packageId = $source.packageId
$packages = Invoke-RestMethod -Uri "$base/api/application/v1/packages" -Headers $headers
$current = $packages | Where-Object id -eq $packageId
$request = @{
  versionId = $source.versionId
  expectedRevision = $(if ($null -ne $current.revision) { $current.revision } else { 0 })
  tenantBindings = @{ '00m1fd16fb40de2b0a3b/ownerId' = $context.userId }
  confirmations = @()
}
$preview = Invoke-RestMethod -Uri "$base/api/application/v1/packages/$packageId/preview" -Method Post -Headers $headers -ContentType 'application/json; charset=utf-8' -Body ($request | ConvertTo-Json -Depth 6)
$preview | Select-Object ready, revision, requiredBindings, requiredConfirmations, conflicts, changes
```

查看 changes，确认变化符合预期。只有 `ready=true` 且检查通过后，才进入下一步。缺少绑定、冲突或需要确认的变更，应先处理返回信息。

### 4. 提交并查询进度

```powershell
if (-not $preview.ready) { throw '预检尚未就绪，先处理返回的具体缺口。' }
$request.expectedRevision = $preview.revision
$request.requestId = 'apo' + [guid]::NewGuid().ToString('N').Substring(0,17)
$request.requestId
$operation = Invoke-RestMethod -Uri "$base/api/application/v1/packages/$packageId/install" -Method Post -Headers $headers -ContentType 'application/json; charset=utf-8' -Body ($request | ConvertTo-Json -Depth 6)
$operation | Select-Object id, status, installationId, errorCode
```

提交前记下 requestId。安装仍在运行或请求超时时，用原编号查询：

```http
GET /api/application/v1/operations/{requestId}
```

操作成功后，再读取 `GET /api/application/v1/installations/{installationId}`，确认租户、包、版本和 revision，并检查字段与原记录。

1.0.1 标签升级使用[对应源码](/downloads/note-label-source.json)和新的包文件名。读取当前 revision，保留已有视图绑定；升级请求的 tenantBindings 可用空字典。结果检查见 [B6](/basics/version)。

### 专题包的影响确认 {#专题包的影响确认}

专题包包含分享、事件与可执行编排，需要先检查完整源码和 preview 中的 securityChange。已安装时核对现状，不重复初装。

若初装只剩已经检查过的确认项，没有绑定缺口或冲突，维护者可提交受管安装，进入 `WaitingForResolution`。此时读取原 operation 的 `details.requiredConfirmations`，再按检查结果调用：

```http
POST /api/application/v1/operations/{operationId}/resolve
```

| 参数 | 使用什么值 |
|---|---|
| `expectedRevision` | 同一 installation 当前的 revision |
| `tenantBindings` | 本次缺少的绑定；已有绑定不重复指定 |
| `confirmations` | 原 operation 返回、且已检查的 `{recordId, unit, token}` |

确认摘要变化后重新核对，不复用旧 token，也不自动确认所有变更。继续查询同一操作，成功后检查 installation、describe 和原记录。

## 几种 ID，分别指什么

| 标识 | 含义 |
|---|---|
| packageId | 同一个应用包 |
| versionId | 其中一个具体版本 |
| installationId | 某租户中的安装 |
| requestId / operationId | 一次安装或恢复操作 |
| objectId / fieldId | 对象与字段定义 |
| recordId | 一条业务记录 |

恢复、冲突和卸载见[安装维护](/topics/operations)。
