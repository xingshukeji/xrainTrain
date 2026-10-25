---
title: 准备真实练习环境
---
# 准备真实练习环境

在线课程、图解、答题和学习记录可以直接使用。真实便签练习还需要一套获准的 XRain 测试目标。**不要把生产业务租户用作初学者试验场。**

## 开始前，你应拿到什么

| 信息 | 如何取得和核对 |
|---|---|
| 平台地址 | 培训维护者提供实际服务 origin，不带 `/api` 或具体页面路径 |
| 租户代码与 ID | 原生登录使用准确 tenantCode；登录后用 context 核对 tenantId。CLI 的 `--tenant` 使用这个 ID |
| 已有练习身份 | 使用分配给自己的稳定身份；缺凭据走原账号恢复，不临时新建同用途账号 |
| 登录方式 | 原生账号走本页正常登录，通用 CLI 命令可使用该短期 Bearer；统一身份走正式浏览器登录 |
| 练习权限 | 便签对象的读、创建、编辑及所用字段权限；安装与构建资格按实际职责准备 |
| 包和查看入口 | `xrainlearn` 教学包已进入平台目录；目标租户有学习便签定义与可用数据视图 |
| 本地工具 | PowerShell 7；若采用 CLI 路径，另需 Node.js 22.12 或以上及正式分发的 XRain CLI |

课程不公开测试环境账号和密码。维护者交付环境时，要说明哪些已准备、哪些由学习者执行，而不是只给一条服务地址。

## 学习者准备：一次正常登录 {#学习者准备一次正常登录}

以下代码在你的本机 PowerShell 7 中运行。依次输入维护者提供的地址、租户代码和已有原生账号。凭据不写入课程文件、不进入网页，也不打印登录响应：

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

只有身份、租户与预期一致才继续。`$headers` 中含会话凭据，不把它输出或写入笔记。学习结束后关闭该终端，或执行 `Remove-Variable headers` 清掉本次变量。服务器会话按实际到期规则处理。

如果平台只允许统一认证，使用[CLI 的浏览器登录](/reference/tools#cli-命令与安装)和已有应用登录，不把统一认证密码发到原生登录接口，也不要求关闭 MFA。

## 维护者准备：教学包与权限

使用已有测试目标和固定人物。已有角色关系保持原样，只增加明确需要的教学便签资格。不同真实人员分别使用自己的身份；不要为了新一轮培训按日期生成一批长期管理员。

1. 取得课程的完整 `source.json`，通过已获准会话调用构建端点。
2. 由 Host 管理者导入这个确定 `.appkg`；租户管理者预检并安装。两种职责可能由同一维护者承担，但会话 scope 不混用。已有包后续构建需要实际包维护资格。本课验证目标的教学包由 Host 导入，后续构建使用原有 Host 维护身份；租户权限目录没有为该包提供专属维护项，不能凭名称自行造出一项权限。完整请求见[应用包操作](/reference/tools#构建导入与安装)。
3. 为视图绑定当前租户的合法 Owner。本样例的绑定键是 `00m1fd16fb40de2b0a3b/ownerId`，值取正常登录 context 中的真实 userId。2026-10-25 的目标会明确要求该绑定，不能假设省略后一定使用安装者。
4. 在租户权限管理中建立或复用 `custom.xraintrain.practice`，从实际权限目录选择便签对象的 `read/create/edit/delete`，内容字段的 `read/create/edit`，以及需要查看的系统字段 `read`。不选择无关业务对象的权限。
5. 把该权限集关联到获准练习人物，按实际范围配置视图访问；在同一身份下验证 describe、创建和回读。`delete` 只用于独立的软删除练习，不用于首课清空数据。
6. 保留一个未获该对象资格的既有测试人物作为 B5 的拒绝对照。该人物不因参加对照而取得管理员权限。

标准字段是 `id`、`ownerId`、`createdById`、`createdAt`、`updatedById`、`updatedAt`、`isDeleted`、`deletedById`、`deletedAt`、`externalId` 和 `externalSource`。对象/字段权限的实际完整名称从 `GET /api/service/authen/v1/security/permissions/catalog` 获取。

### 用 CLI 初始化练习资格 {#用-cli-初始化练习资格}

建议由一位已有租户维护者准备环境，学员使用自己的固定人物。先明确职责：

| 人物 | 需要的资格 |
|---|---|
| 环境维护者 | 在目标租户管理用户和权限的既有资格；构建与 Host 导入仍由原有发布维护者负责 |
| 练习学员 | 目标租户的有效成员，以及 `custom.xraintrain.practice` 中的便签对象和字段资格 |
| B5 拒绝对照 | 已有的另一固定测试人物，保持未获便签对象资格 |

本例把教学权限集直接关联到学员。如果组织已经用角色管理学员，也可以把同一权限集关联到那个已有角色；“学员”不需要成为租户管理员或 Host 管理员。

先完成教学包安装。当前分发版 CLI 已支持权限目录、权限集 `create/ensure`，以及 Host 范围的租户成员 `list/ensure`。`ensure` 复用已存在的资源；创建权限集、给权限集加权限、关联人物是三个独立动作。

### 原人物尚未加入租户时

已有成员跳过这一步。确实缺成员关系时，由已有 Host 维护者在单独终端执行；全局 `userId` 由身份维护者核对，不根据同名猜测。这里的 `--tenant-id` 是被维护的租户，不切换登录身份：

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

已有成员返回 `created=false`；缺少时只把原 userId 加为普通成员，不创建全局身份。停用成员也保持原状，应由成员维护者按具体原因处理；命令不会自动恢复、改变角色或设为默认租户。学员不需要取得 Host 权限。

### 准备教学权限集并关联学员

原生维护账号在一个单独终端按本页完成正常登录，确认 `$context` 是维护者本人和正确租户。当前目录应包含从[正式分发目录](/reference/tools#cli-命令与安装)取得的完整 `xrain-cli/`。然后执行：

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
$setDefinition = @{ name = 'custom.xraintrain.practice'; label = 'XRain 课程便签练习'; helpText = '教学便签对象和字段资格' } | ConvertTo-Json
$practiceSet = $setDefinition | node $cli security permission-set ensure --permission-set custom.xraintrain.practice --values-json - --profile learn --json | ConvertFrom-Json
if (-not $practiceSet.ok) { throw '教学权限集准备失败。' }
$practiceSet.data | Select-Object created, @{n='name';e={$_.permissionSet.permissionSetName}}
```

用户 `ensure` 没有提供创建资料，只复用原人物。权限集 `ensure` 在明确不存在时按所给资料创建；已有权限集返回 `created=false`，不覆盖名称、权限或绑定。审阅目录选出的 18 项权限，只包含上述便签资格。发现已有权限集混入其他权限时先停止，保留原配置：

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

回读的 `userId` 必须仍是原人物，`permissionSets` 包含教学权限集。对已完成准备的人重复执行应复用同一人物和关联。之后由学员用自己的登录重新验证 describe、创建和回读，维护者会话不交给学员。

如果确实缺少已获准创建的平台学员，可在核对全局身份后使用 `security user ensure --values-json -`，从受保护输入提供平台创建资料；这不会创建统一认证中心身份，也不会自动授予角色。同一人在全局已有身份、只是缺租户成员时，使用上面的 Host 成员步骤复用原 `userId`。

## 准备完成的可观察结果

| 检查 | 预期 |
|---|---|
| context | 是约定的真实人物和租户 |
| installation | 教学 packageId、版本与 revision 一致，无在途操作 |
| describe | 一个内容字段及平台系统字段；可创建字段包含 `content__c` |
| 创建与回读 | 同一 recordId 的文字一致 |
| 数据视图 | 能在“学习便签”中找到自己的记录 |
| 拒绝对照 | 未授权人物访问该对象得到拒绝，而不是偷偷换了身份 |

如果查看入口有缺口，应由环境维护者解决并更新交接说明，不能让学员猜菜单或通过额外建对象绕过。常见情况见[按现象排错](/help/errors)。

## 专题练习各自需要什么

基础便签准备完成，不代表以下条件也已具备。进入专题前逐项核对；条件缺失时记录实际结果，不能把阅读、预览或拒绝检查当作成功实操。

| 练习 | 必须先具备的条件 | 缺少时怎样继续 |
|---|---|---|
| CLI 元数据和读写 | 正常原生登录的短期 Bearer，或已关联且加入租户的统一认证会话；当前人有对象资格 | 按[CLI 的两种登录路径](/reference/tools#cli-命令与安装)准备；应用包命令另需浏览器会话 |
| 金额、选项、关联与分享 | 独立专题包、所需对象/字段资格；分享需要两个固定人物 | 先按[专题数据准备](/topics/data#先准备独立的专题数据)交接，不扩张便签 |
| Routine 真实运行 | 已配置的活跃执行成员，对该只读动作有实际资格 | 可做 schedule-preview；保留缺口，不自行改共享执行身份 |
| AI 读取 Task | 完成[Task 执行前置任务](/topics/workforce#准备-task-执行入口)，核对原人物、模型和已包含读取修复的应用构建；Task 路径无需先订阅个人助手 | 本人页面可读而执行入口缺能力时由产品维护者修复；不要求学员额外加权或自建工具 |

文件附件与个人邮箱本轮只保留[概念与资料](/topics/integration)，不需要准备其服务、账号或实操数据。

维护者应为具体练习提供已经具备这些条件的目标。课程不要求学习者临时签发凭据、扩大权限、创建新的长期账号，或给真实收件人发送消息。
