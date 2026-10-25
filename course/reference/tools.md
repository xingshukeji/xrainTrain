---
title: CLI、SDK 与应用包
---
# CLI、SDK 与应用包

同一个业务动作可以从命令、程序或 HTTP 发起，但每一层的输入输出各有合同。先选现成入口，再确认当前版本支持什么。

## CLI 命令与安装

XRain CLI 随 `skills-hub` 的 `xrain-cli` 目录分发。取得有权访问的[官方分发目录](https://github.com/xingshukeji/skills-hub/tree/main/skills/xrain-cli)后，保留整个目录。该来源仓库需要相应阅读权限；由培训维护者提供受管副本，不从不明地址下载单个可执行文件。

运行需要 Node.js 22.12 或以上，依赖已打包，使用端不需要 `npm install` 或 .NET。假设当前目录包含完整的 `xrain-cli/`：

```powershell
$cli = (Resolve-Path './xrain-cli/scripts/xrain-cli.mjs').Path
node $cli --help
node $cli profile list
```

profile 只是连接配置。CLI 的 `--tenant` 接收 `tenantId`，与原生登录示例的 `tenantCode` 是两种参数。先选择你已有的登录方式，再执行下方共用的数据命令。

### 已有原生账号：继续使用正常登录凭据

先在本机 PowerShell 7 完成[一次正常登录](/help/environment#学习者准备一次正常登录)，核对 `$context`。CLI 的通用元数据、数据与安全管理命令支持显式提供 Bearer；这里使用刚才登录返回的短期凭据：

```powershell
$tenantId = $context.tenantId
$env:XRAIN_TOKEN = $headers.Authorization.Substring(7)
$cliAuth = 'auto'
node $cli profile set --server $base --tenant $tenantId --profile learn
```

`XRAIN_TOKEN` 只存在于当前终端及其子进程中，不把它写进 profile、文件或命令参数。这里的 Bearer 是正常原生登录凭据，**不是平台 API Token，也不是伪造的浏览器会话**。安全管理仍按当前人的实际权限执行；普通学员不会因此得到维护权限。结束后执行 `Remove-Item Env:XRAIN_TOKEN -ErrorAction SilentlyContinue`，并清除 `$headers`。

### 已有统一身份：使用浏览器登录

统一认证身份须已关联到平台用户，并且是练习租户的有效成员；同名不足以证明关联。用维护者给出的准确租户 ID 登录：

```powershell
$base = (Read-Host '输入获准测试平台的服务地址').TrimEnd('/')
$tenantId = Read-Host '输入准确的租户 ID（不是租户代码）'
node $cli auth login --server $base --tenant $tenantId --profile learn
$cliAuth = 'session'
```

`auth login` 使用浏览器的正式统一认证流程。浏览器和 CLI 必须能在同一台机器完成回调；登录过程中保留终端。`--auth session` 明确选择该浏览器会话，避免终端中残留的其他凭据抢先。

缺少统一身份或关联时，由身份与租户维护者处理；`security user ensure` 只处理平台用户，不能创建认证中心身份。已有原生账号的元数据和数据练习可以采用上一条路径；CLI 的 `app build/import/preview/install` 等应用包命令仍要求正式浏览器会话。

### 用所选身份完成便签读写

下载 [values](/downloads/note-values.json) 和 [query](/downloads/note-query.json) 后，可以通过 CLI 使用同一对象：

```powershell
node $cli metadata describe xrainlearn__note__c --profile learn --auth $cliAuth --json
$created = node $cli data create xrainlearn__note__c --values-json './note-values.json' --profile learn --auth $cliAuth --json | ConvertFrom-Json
if (-not $created.ok) { throw '创建失败，请读取实际错误。' }
$recordId = $created.data.recordId
node $cli data get xrainlearn__note__c $recordId --profile learn --auth $cliAuth --json
node $cli data query xrainlearn__note__c --query-json './note-query.json' --profile learn --auth $cliAuth --json
```

创建会真实新增记录，选择 HTTP 或 CLI 路径完成首课即可，不必为了比较工具重复创建。CLI JSON 成功外层是 `{ok:true,data:...}`，失败为 `{ok:false,error:...}`；HTTP 记录接口没有这个统一外层。

课程需要的常见操作已包括元数据查询、记录创建／读取／修改／删除、分页查询、权限目录、权限集创建／复用、权限关联及既有全局人物加入租户。维护者的完整步骤见[用 CLI 初始化练习资格](/help/environment#用-cli-初始化练习资格)。

权限集 `ensure` 不自动授予权限；Host 成员 `ensure` 不创建全局身份、不授管理员。命令支持某项操作，也仍需当前人具有相应资格；用所取分发版的子命令帮助核对参数。

应用命令包括 `app build`、`app import`、`app preview`、`app install` 和 operation 查询。**当前 CLI 已提供 install**；旧资料中“没有 app install”的说明不再适用。按你所用分发版本的该子命令 `--help` 核对参数。

`app import` 通过平台配置的市场来源导入精确包版本，不接受本地 `.appkg` 文件。Host 本地原包导入使用相应管理入口。`app install --wait` 的等待只读取原操作，不会因等待结束就取消服务器执行。

## SDK：用公开导出和类型

在已有企业应用中，可从 `@xrain/workforce-application/server` 使用已发布的 `XRainRuntimeClient`。使用者应检查自己的锁文件和包导出，读取该版本的类型；不导入发布包内部实现路径。

| 入口 | 适用范围 |
|---|---|
| `@xrain/workforce-application/host` | 宿主启动与应用装配 |
| `@xrain/workforce-application/server` | 服务端 XRain 公共客户端与能力 |
| `@xrain/workforce-application/client` | 已公开的页面组件与类型 |
| `@xrain/xrain-agent-runtime/host` | 业务工具处理器和执行上下文类型 |

HTTP 的 `{results}` 可能被 SDK 解成数组，某些 SDK 版本的 context 也可能只保留部分属性。用公开类型和实际返回验证，不按 HTTP 路由猜方法名。代码与原平台共享可信身份，页面或工具参数里的 `userId` 不能替代认证。

## 构建、导入与安装 {#构建导入与安装}

这一段由具备相应职责的环境维护者执行。已经准备好环境的学习者可先阅读过程，再回 [G0](/start) 写入自己的便签。

### 确定构建身份

新租户包需要目标规定的提交资格；已有租户包按创建者与该包维护权限判断。Host 范围的管理员也可构建。构建不保存包、不建立创建者归属，也不自动提交或安装。

本课程真实验证采用 Host 原包导入。该目标没有为此 Host 包提供租户专属维护权限，因此后续构建使用同一既有维护者的 Host scope。下面在单独保留的变量中建立该会话，不影响 `$headers` 中用于租户练习的身份：

```powershell
$hostAccount = Get-Credential -Message '输入已有且获准的 Host 维护账号'
$hostBody = @{ userName = $hostAccount.UserName; password = $hostAccount.GetNetworkCredential().Password; scope = 'host' } | ConvertTo-Json
$hostSession = Invoke-RestMethod -Uri "$base/api/service/authen/v1/account/login" -Method Post -ContentType 'application/json; charset=utf-8' -Body $hostBody
$buildHeaders = @{ Authorization = "Bearer $($hostSession.access_token)" }
Remove-Variable hostAccount, hostBody, hostSession
```

如果你的平台采用租户发布与包创建者维护流程，按实际合同使用已经具备该包维护资格的租户会话；不根据本课 Host 路径给所有学习者新增 Host 权限。

### 构建并导入原包

保持 `source.json` 原始 UTF-8 字节。下列例子用于尚未在本机生成的 1.0.0 文件；已有文件先保留，不随意覆盖已确认制品。

```powershell
$source = Get-Content -LiteralPath './source.json' -Raw -Encoding utf8 | ConvertFrom-Json
$built = Invoke-WebRequest -Uri "$base/api/application/v1/packages:build" -Method Post -Headers $buildHeaders -ContentType 'application/json' -InFile './source.json' -OutFile './note-1.0.0.appkg' -PassThru
[pscustomobject]@{ PackageId = $built.Headers['X-Appkg-Package-Id']; VersionId = $built.Headers['X-Appkg-Version-Id']; FileSha256 = $built.Headers['X-Appkg-File-Sha256'] }
Get-FileHash -LiteralPath './note-1.0.0.appkg' -Algorithm SHA256
$imported = Invoke-RestMethod -Uri "$base/api/application/v1/packages:import" -Method Post -Headers $buildHeaders -ContentType 'application/octet-stream' -InFile './note-1.0.0.appkg'
$imported | Select-Object packageId, versionId, version, digest, alreadyExisted
```

导入会写平台包目录。检查 packageId、versionId、version、包 digest 和文件 SHA-256；记录与原 source 一致的构建信息。`alreadyExisted=true` 只说明相同版本已经在目录，不代表当前租户已安装。

### 租户预检与提交

这段继续使用已有的租户 `$headers` 和 `$context`。从包目录读取该教学包。若已有同版本，先核对现状；若已有其他版本，按升级任务审查，不把下面初装命令盲目重放。

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

先审阅 `changes`，确认是本例的对象、字段与视图；只有 `ready=true` 且影响符合预期才提交。缺少绑定、冲突或影响确认时，读对应信息后处理，不能自动把全部确认填成同意。

```powershell
if (-not $preview.ready) { throw '预检尚未就绪，先处理返回的具体缺口。' }
$request.expectedRevision = $preview.revision
$request.requestId = 'apo' + [guid]::NewGuid().ToString('N').Substring(0,17)
$request.requestId
$operation = Invoke-RestMethod -Uri "$base/api/application/v1/packages/$packageId/install" -Method Post -Headers $headers -ContentType 'application/json; charset=utf-8' -Body ($request | ConvertTo-Json -Depth 6)
$operation | Select-Object id, status, installationId, errorCode
```

提交前记录 requestId。结果未知或仍在运行时，使用原编号 GET `/api/application/v1/operations/{requestId}`。只有操作成功，并且 GET `/api/application/v1/installations/{installationId}` 的租户、包、版本和 revision 一致，才报告安装完成。

1.0.1 标签升级使用对应完整源码和新构建文件；读取现有 revision，保留已有视图绑定，升级请求的 `tenantBindings` 用空字典即可。本例已验证只有 `content__c` 标签发生变化，详见[B6](/basics/version)。

### 专题包的影响确认 {#专题包的影响确认}

基础便签初装没有需确认的分享、事件或可执行源码变更，使用上面的 `ready=true` 提交步骤。独立专题包还包含这些变更，应先审阅完整源码和 preview 中的 securityChange。已有专题安装时直接核对现状，不重新发起初装。

首次安装若只剩已审阅的影响确认、没有绑定缺口或冲突，维护者可通过平台的受管安装操作进入 `WaitingForResolution`；此时组件尚未生效。读取原 operation 的 `details.requiredConfirmations`，根据审阅结果选择对应项，不循环重发新的安装请求。确认请求使用 `POST /api/application/v1/operations/{operationId}/resolve`：

| 输入 | 从哪里取得 |
|---|---|
| `expectedRevision` | 同一 installation 的当前 revision |
| `tenantBindings` | 本次缺少的合法绑定；保留已有绑定时不重复指定 Owner |
| `confirmations` | 已审阅项的 `{recordId, unit, token}`；使用当前 operation 返回值 |

本次专题初装验证了同一操作从等待确认到 `Succeeded`，升级时也核对了精确源码影响。独立 preview 的确认摘要若发生变化，不把前一次摘要当作仍然有效，也不自动勾选所有项；保留差异，在同一待处理操作中重新核对。解决后仍需读取 installation、有效 describe 和原业务记录。

## 记住几种不同的 ID

| 标识 | 指向 |
|---|---|
| packageId | 同一个应用包，跨版本保持稳定 |
| versionId | 一个不可变版本，修改源码需新版本身份 |
| installationId | 某租户中的安装 |
| requestId / operationId | 一次逻辑安装操作；HTTP traceId 是另一回事 |
| objectId / fieldId | 对象与字段的定义 |
| recordId | 具体业务记录 |

恢复、冲突和卸载继续读[安装维护专题](/topics/operations)，不要把包重新导入当作通用恢复办法。
