---
title: 准备真实练习环境
---
# 准备真实练习环境

在线课程、图解、答题和学习记录可以直接使用。真实便签练习还需要一套获准的 XRain 测试目标。**不要把生产业务租户用作初学者试验场。**

## 开始前，你应拿到什么

| 信息 | 如何取得和核对 |
|---|---|
| 平台地址 | 培训维护者提供实际服务 origin，不带 `/api` 或具体页面路径 |
| 租户代码 | 培训维护者提供准确代码；登录后用 context 核对 tenantId |
| 已有练习身份 | 使用分配给自己的稳定身份；缺凭据走原账号恢复，不临时新建同用途账号 |
| 登录方式 | 本页命令用于已启用原生登录的已有账号；统一认证账号按 CLI 或应用正式登录流程 |
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
