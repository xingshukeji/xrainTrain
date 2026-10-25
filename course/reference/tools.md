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

profile 只是连接配置。首次使用当前练习连接时，按维护者给出的真实地址和租户正常登录：

```powershell
$base = (Read-Host '输入获准测试平台的服务地址').TrimEnd('/')
$tenantCode = Read-Host '输入准确的租户代码'
node $cli auth login --server $base --tenant $tenantCode --profile learn
```

CLI 使用浏览器的正式统一认证流程。浏览器和 CLI 必须能在同一台机器完成回调；登录过程中保留终端。原生登录示例和统一认证流程分别使用各自正式入口，不把一边的会话伪装成另一边的会话文件。

下载 [values](/downloads/note-values.json) 和 [query](/downloads/note-query.json) 后，可以通过 CLI 使用同一对象：

```powershell
node $cli metadata describe xrainlearn__note__c --profile learn --auth session --json
$created = node $cli data create xrainlearn__note__c --values-json './note-values.json' --profile learn --auth session --json | ConvertFrom-Json
if (-not $created.ok) { throw '创建失败，请读取实际错误。' }
$recordId = $created.data.recordId
node $cli data get xrainlearn__note__c $recordId --profile learn --auth session --json
node $cli data query xrainlearn__note__c --query-json './note-query.json' --profile learn --auth session --json
```

创建会真实新增记录，选择 HTTP 或 CLI 路径完成首课即可，不必为了比较工具重复创建。CLI JSON 成功外层是 `{ok:true,data:...}`，失败为 `{ok:false,error:...}`；HTTP 记录接口没有这个统一外层。

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
