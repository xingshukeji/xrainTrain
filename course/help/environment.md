---
title: 准备真实练习环境
---
# 准备真实练习环境

课程网页可以直接阅读。要操作 XRain，需要维护者提供一套测试环境。

| 你准备做什么 | 需要准备什么 |
|---|---|
| G0，在页面保存便签 | 浏览器、本人账号和已有的学习便签视图 |
| B1 开始的接口练习 | PowerShell 7，完成下方登录 |
| CLI 练习 | Node.js 22.12 或以上，以及完整 XRain CLI；见[工具参考](/reference/tools#cli-命令与安装) |
| 为其他人准备环境 | 查看本页“维护者准备” |

## 开始前，你应拿到什么 {#开始前你应拿到什么}

| 信息 | 说明 |
|---|---|
| 测试平台地址 | 登录页面的入口；调用接口时使用服务地址，不带具体页面路径或 `/api` |
| 练习租户 | 平台中的租户名称；接口登录还需要 tenantCode，CLI 使用 tenantId |
| 本人账号与登录方式 | 使用维护者分配的已有账号；密码丢失时恢复原账号 |
| 学习便签视图 | 已安装教学包，账号能查看、新建和修改便签 |

拿到这些后，可以直接做 [G0](/start)。练习使用测试租户，不使用生产业务数据。

## 学习者准备：一次正常登录 {#学习者准备一次正常登录}

下面适用于 **XRain 平台原生账号**，也就是直接在平台使用用户名和密码登录的账号。在本机 PowerShell 7 中运行，按提示输入信息：

```powershell
$base = (Read-Host '输入获准测试平台的服务地址').TrimEnd('/')
$tenantCode = Read-Host '输入准确的租户代码'
$account = Get-Credential -Message '输入你已有的 XRain 平台原生账号'
$loginBody = @{
  userName = $account.UserName
  password = $account.GetNetworkCredential().Password
  scope = 'tenant'
  tenantCode = $tenantCode
} | ConvertTo-Json
$session = Invoke-RestMethod -Uri "$base/api/service/authen/v1/account/login" -Method Post -ContentType 'application/json; charset=utf-8' -Body $loginBody
$headers = @{ Authorization = "Bearer $($session.access_token)" }
Remove-Variable loginBody, session, account
$context = Invoke-RestMethod -Uri "$base/api/service/authen/v1/account/context" -Headers $headers
$context | Select-Object tenantId, userId, scope
```

成功后会显示 tenantId、userId 和 scope，确认它们与练习环境一致。保留这个终端，后面的接口示例使用其中的 `$base` 和 `$headers`。

`$headers` 含登录凭据，不打印或写入笔记。学习结束后执行 `Remove-Variable headers`，或关闭终端。

如果环境使用统一认证，使用[CLI 浏览器登录](/reference/tools#已有统一身份使用浏览器登录)及对应命令。统一认证的密码不能拿来调用上面的原生登录接口。

## 维护者准备：教学包与权限

环境维护者准备一次，学员使用自己的账号。复用已有用户和成员关系，保留原有角色；只增加本次练习所需权限。

1. 下载完整[便签源码](/downloads/note-source.json)，按[构建、导入与安装](/reference/tools#构建导入与安装)准备教学包。
2. 安装时绑定视图 Owner：键为 `00m1fd16fb40de2b0a3b/ownerId`，值为当前租户中维护者的 userId。
3. 创建或复用权限集 `custom.xraintrain.practice`，添加便签对象及所需字段权限。
4. 给学员关联这个权限集，并配置视图访问。由学员自己的账号完成一次保存和重新打开。
5. B5 的权限对照使用另一名没有便签读取权限的已有测试用户。

权限配置可以在页面上操作，也可以按下面的 CLI 步骤执行。Host 表示平台级管理范围；包导入与租户安装使用不同范围的会话，具体命令在工具参考中。

### 用 CLI 配置练习权限 {#用-cli-初始化练习资格}

先安装教学包，再准备权限。维护者需要目标租户的用户和权限管理权限，学员只需要便签读写权限。

`ensure` 用于复用已有资源，缺少时是否创建由具体命令和输入决定。权限集创建、添加权限、关联用户是三个动作。

### 账号还没有加入练习租户

已有租户成员跳过此步。由已有 Host 管理账号在单独终端执行。先由账号维护者确认全局 userId，再将这个用户加入租户：

```powershell
$base = (Read-Host '输入获准测试平台的服务地址').TrimEnd('/')
$tenantId = Read-Host '输入要维护的租户 ID'
$learnerUserId = Read-Host '输入已核对的原全局用户 ID'
$cli = (Resolve-Path './xrain-cli/scripts/xrain-cli.mjs').Path
$hostAccount = Get-Credential -Message '输入已有且获准的 Host 维护账号'
$hostBody = @{ userName = $hostAccount.UserName; password = $hostAccount.GetNetworkCredential().Password; scope = 'host' } | ConvertTo-Json
$hostSession = Invoke-RestMethod -Uri "$base/api/service/authen/v1/account/login" -Method Post -ContentType 'application/json; charset=utf-8' -Body $hostBody
$env:XRAIN_TOKEN = $hostSession.access_token
Remove-Variable hostAccount, hostBody, hostSession
$member = node $cli host tenant member ensure --tenant-id $tenantId --user-id $learnerUserId --server $base --json | ConvertFrom-Json
if (-not $member.ok) { throw '成员准备失败，保留原错误并处理对应原因。' }
$member.data | Select-Object created, @{n='userId';e={$_.member.userId}}, @{n='isActive';e={$_.member.isActive}}
Remove-Item Env:XRAIN_TOKEN -ErrorAction SilentlyContinue
```

已有成员返回 `created=false`；缺少成员关系时只增加普通成员关系，不创建新的全局账号。停用状态、角色和默认租户保持原样；停用成员由维护者按原因处理。

### 准备教学权限集

在单独终端用原生维护账号完成本页登录，确认租户正确。当前目录需要包含从[正式分发目录](/reference/tools#cli-命令与安装)取得的完整 `xrain-cli/`。

```powershell
$cli = (Resolve-Path './xrain-cli/scripts/xrain-cli.mjs').Path
$tenantId = $context.tenantId
$env:XRAIN_TOKEN = $headers.Authorization.Substring(7)
node $cli profile set --server $base --tenant $tenantId --profile learn
$learnerUserName = Read-Host '输入已经登记、已加入本租户的固定学员登录名'
$learner = node $cli security user ensure --user $learnerUserName --profile learn --json | ConvertFrom-Json
if (-not $learner.ok) { throw '先处理原用户或租户成员缺口，不把查询失败当成没有账号。' }
$catalog = node $cli security permissions catalog --profile learn --json | ConvertFrom-Json
if (-not $catalog.ok) { throw '权限目录读取失败。' }
$notePermissions = @($catalog.data.permissions | Where-Object {
  $_.name -match '^platform\.entity\.xrainlearn__note__c\.(read|create|edit|delete)$' -or
  $_.name -match '^platform\.field\.xrainlearn__note__c\.content__c\.(read|create|edit)$' -or
  $_.name -match '^platform\.field\.xrainlearn__note__c\.(id|ownerId|createdById|createdAt|updatedById|updatedAt|isDeleted|deletedById|deletedAt|externalId|externalSource)\.read$'
})
if ($notePermissions.Count -ne 18) { throw '目标权限目录与本课不同，先核对已安装对象，不补造名称。' }
$notePermissions | Select-Object name, label
$setDefinition = @{ name = 'custom.xraintrain.practice'; label = 'XRain 课程便签练习'; helpText = '教学便签对象和字段权限' } | ConvertTo-Json
$practiceSet = $setDefinition | node $cli security permission-set ensure --permission-set custom.xraintrain.practice --values-json - --profile learn --json | ConvertFrom-Json
if (-not $practiceSet.ok) { throw '教学权限集准备失败。' }
$practiceSet.data | Select-Object created, @{n='name';e={$_.permissionSet.permissionSetName}}
```

这段代码从实际权限目录选出 18 项教学权限：便签对象的 read/create/edit/delete、内容字段的 read/create/edit，以及 11 个系统字段的 read。delete 用于单独的删除恢复练习，G0 不使用。

用户查询没有传创建资料，只复用已有账号。权限集不存在时按给定名称创建，已存在时保留原配置。

### 添加权限，再关联学员

继续在同一个终端执行。先检查已有权限集中是否混入无关权限，再添加本课需要的权限并关联学员：

```powershell
$allowedNames = @($notePermissions.name)
$outside = @($practiceSet.data.permissionSet.permissions | Where-Object { $_ -notin $allowedNames })
if ($outside.Count) { throw '已有权限集含本课之外的权限，先由维护者审阅，不自动覆盖或撤权。' }
node $cli security permission-set grant-permission --permission-set custom.xraintrain.practice --permissions ($allowedNames -join ',') --profile learn --json
node $cli security user grant-permission-set --user $learnerUserName --permission-sets custom.xraintrain.practice --profile learn --json
node $cli security user show --user $learnerUserName --profile learn --json
Remove-Item Env:XRAIN_TOKEN -ErrorAction SilentlyContinue
Remove-Variable headers
```

结果中的 userId 应仍是原账号，permissionSets 包含 `custom.xraintrain.practice`。最后由学员正常登录，检查 describe、保存和重新打开；不要把维护者登录凭据交给学员。

::: details 维护者查阅：确实需要创建新账号时
只有确认缺少账号且已获创建授权时，才使用 `security user ensure --values-json -`，通过受保护输入提供创建资料。它不创建统一认证中心账号，也不自动分配角色。

同一用户已经有全局账号、只是没有加入租户时，使用上面的成员步骤复用原 userId。
:::

## 环境准备好了吗

| 检查 | 预期 |
|---|---|
| 登录信息 | 是学员本人和约定租户 |
| 安装状态 | 教学包版本正确，没有尚未完成的安装操作 |
| 对象说明 | 有 content__c，当前账号可创建和编辑 |
| 平台页面 | 能打开“学习便签”，保存并重新打开自己的记录 |
| B5 对照账号 | 没有权限时读取被拒绝 |

找不到视图或操作按钮时，由环境维护者处理。排错入口见[按现象排错](/help/errors)。

## 专题练习还需要什么

| 练习 | 额外条件 | 入口 |
|---|---|---|
| 金额、选项、关联与分享 | 独立专题包及数据；分享需要两名测试用户 | [数据准备](/topics/data#先准备独立的专题数据) |
| Routine 实际运行 | 可用的执行用户及相应权限 | [定时任务](/topics/automation#定时-routine) |
| AI 读取 Task | 本人可读任务、可用模型和已接入读取工具的执行入口 | [Task 准备](/topics/workforce#准备-task-执行入口) |
| CLI 应用包操作 | 可用的统一认证浏览器会话 | [CLI 登录方式](/reference/tools#cli-命令与安装) |

缺少这些条件时，先完成对应概念或预览，由维护者补齐环境后再实操。文件附件和个人邮箱本课只作概念介绍，不需要配置。
