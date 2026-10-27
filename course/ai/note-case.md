---
title: 完整便签开发案例
description: 使用已公开的完整资源包源码，贯通对象、字段、视图、权限、CLI 记录读写和保留原数据的标签升级。
---
# 完整便签开发案例

业务目标：保存一条便签，能查询和修改，再把字段显示名称改为“便签内容”，保留原记录。这个案例使用与基础课程相同的完整输入文件。

**先走通一个小功能，再迁移到企业业务。** 本案例已有真实验证范围见[资料索引](/reference/sources#适用范围与真实验证)。本页组织开发步骤，不表示每个读者的环境已经完成安装或获得权限。

## 取得完整输入文件

| 文件 | 用途 |
|---|---|
| [note-source.json](/downloads/note-source.json) | 1.0.0 的对象、文本字段与列表视图 |
| [note-label-source.json](/downloads/note-label-source.json) | 1.0.1 的字段标签变更 |
| [note-values.json](/downloads/note-values.json) | 创建记录的业务字段值 |
| [note-query.json](/downloads/note-query.json) | 筛选查询输入 |

下载文件名可能由浏览器保存为 `source.json`。以实际文件名读取。源码也可从[公开 examples 目录](https://github.com/xingshukeji/xrainTrain/tree/main/examples/note)取得。

## 理解源码中的三类资源

| 资源 | 本例身份与作用 |
|---|---|
| BizObject | `0044b9a2d478d15160b4`；对象 API 名为 `xrainlearn__note__c` |
| BizField | `005f1794cd5ff2e6f099`；字段 `content__c`，Text，不可为空，长度 200 |
| BizListView | `00m1fd16fb40de2b0a3b`；列表包含 `content__c` |

包 namespace 为 `xrainlearn`，packageId 为 `apgc5deec239e1d8b0ba`。源码不包含业务记录，也不重复声明平台系统字段。

资源包源码里的 `nullable: false` 与运行 describe 里的必填说明使用不同属性名。记录写入只提交业务字段值；模型定义和记录值不能混用。

## 准备一次获准运行

由环境维护者提供已有账号、测试租户与平台入口。普通学习者使用已安装环境；需要构建和安装时，由获准维护者按[构建、导入与安装](/reference/tools#构建导入与安装)执行。

顺序是：**源码构建 → 导入原包 → 在租户预检 → 提交安装 → 查询原操作 → 核对安装与字段**。构建成功只证明生成了包，导入成功只证明包进入目录。

预检需要当前 revision 与视图 owner 绑定。已有安装时核对原状态，不重复初装。安装等待或中断后继续查询原 requestId/operationId；具体请求和恢复入口由[应用包说明](/reference/tools#构建导入与安装)与[应用操作技能](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/xrain-app-operations/SKILL.md)持有。

## 检查当前身份与字段

完成[CLI 准备与登录](/reference/tools#cli-命令与安装)。沿用该步骤取得的 `$cli`、`$cliAuth` 和 `learn` profile，在同一 PowerShell 终端执行：

```powershell
node $cli metadata describe xrainlearn__note__c --profile learn --auth $cliAuth --json
```

确认字段包含 `content__c`。当前用户还需要相应接口、对象、字段与记录范围权限。环境未准备时进入[课程初始化](/help/environment#用-cli-初始化练习资格)，由维护者按已有身份准备；不要通过改换管理员身份隐藏拒绝结果。

## 保存、读取和查询同一条记录

在创建数据与查询条件所在目录执行。以下调用会在获准测试租户新建一条教学便签。

```powershell
$created = node $cli data create xrainlearn__note__c --values-json './note-values.json' --profile learn --auth $cliAuth --json | ConvertFrom-Json
if (-not $created.ok) { throw '创建失败，请检查实际错误。' }
$recordId = $created.data.recordId
node $cli data get xrainlearn__note__c $recordId --profile learn --auth $cliAuth --json
node $cli data query xrainlearn__note__c --query-json './note-query.json' --profile learn --auth $cliAuth --json
```

成功时，单读结果中的 recordId 与创建结果相同，`values.content__c` 为“你好，XRain”；筛选结果包含该记录。CLI 返回 `{ok,data}`，原始 HTTP 记录接口没有这个 `data` 外层。

重复执行创建会新增记录。继续检查同一记录时复用已保存的 recordId。需要修改时，查当前 CLI 子命令帮助或[HTTP 条件更新](/reference/http#条件更新)，不要根据常见接口习惯猜参数。

## 修改显示名称并保留原数据

比较 1.0.0 与 1.0.1：packageId、对象/字段/视图 ID、对象和字段 API 名保持一致；versionId 和版本变化，字段 label 从“内容”改为“便签内容”。

获准维护者构建和导入 1.0.1，预检现有安装后完成升级。然后核对：

1. 安装记录采用 1.0.1，查询原操作得到成功结果。
2. 当前 describe 中该字段 label 为“便签内容”。
3. 读取原 recordId，`values.content__c` 与升级前一致。
4. 使用元数据标签的页面显示新名称；自定义页面按自己的映射另行核对。

不要新建同内容记录代替原数据保留验证。版本与资源身份说明见[B6](/basics/version)。

## 让 AI 处理业务时再接一层工具

便签包只提供模型与视图，没有附带新的 AI 工具或业务应用。若要让 AI 查询便签，在所属业务应用按[页面与 AI 工具接入](/ai/development#页面与-ai-工具共用业务能力)实现处理器与定义，并使用当前执行者的业务读取能力。

可以先用课程已有的 [Task 只读工具练习](/topics/workforce#让-ai-读取同一条任务)认识实际调用结果；Task 的业务读取方式不能直接当作任意对象的通用读取工具。

## 用一个变化检查理解

给 AI 的迁移任务：**把字段显示名称改成“工作记录”，保留原内容和稳定身份；同时说明如果需求改为“只改自定义页面输入框提示”，应修改哪里。**

检查它能否：

- 找到实际源码，只改标签并使用新的包版本身份，保留对象、字段、视图 ID 与 API 名。
- 说明已有安装的预检和升级方式，并安排读取原 recordId 验证数据保留。
- 对自定义页面提示先查页面是否使用元数据，再选择页面文案或字段标签的修改位置。
- 区分生成了方案、修改了文件、执行了检查，以及已在平台完成的结果。

本任务用于检验迁移能力。没有获准平台环境时，交付代码与检查结果，并明确尚未执行安装和平台验证。
