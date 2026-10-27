---
title: 官方 SDK：取得、调用与工具接入
description: Workforce Application SDK 与 XRain Agent Runtime 的官方使用入口，包括交付方式、公开导出、读取记录示例、工具处理器与版本说明。
---
# 官方 SDK：取得、调用与工具接入

**Workforce Application SDK**（`@xrain/workforce-application`）和 **XRain Agent Runtime**（`@xrain/xrain-agent-runtime`）由苏州苏宏助为智能科技有限公司维护。它们用于企业应用代码与智能体工具接入。

## 先取得正确的开发包

这些包目前通过项目约定的制品渠道交付，**不是公开 npm 的匿名安装包**。已有项目使用维护者提供的依赖声明和锁文件，在项目根运行 `npm ci`；首次接入通过[联系我们](/contact)取得所需包、环境与接入说明。

不要根据包名直接猜测下载地址。确认交付版本、依赖、完整性与使用条件后再安装。文档公开与源码授权、制品获取是不同事项。

本文记录读取用法按 Workforce Application **0.3.17**、Runtime **0.2.2** 的公开导出核对；这不是“最新版本”承诺。Workforce 宿主需要 Node.js 24，具体依赖以所用包声明为准。在已有项目运行：

```powershell
npm ls @xrain/workforce-application @xrain/xrain-agent-runtime
```

## 按用途导入

| 导出 | 典型内容 | 运行位置 |
|---|---|---|
| `@xrain/workforce-application/server` | `XRainRuntimeClient` | 应用服务端 |
| `@xrain/workforce-application/host` | `bootWorkforceApplication`、`createWorkforcePortalApplication` | 应用宿主 |
| `@xrain/workforce-application/client` | 公共页面组件及其类型 | 浏览器应用 |
| `@xrain/xrain-agent-runtime/host` | `ServiceToolInvoker`、`ServiceToolInvocation` | AI 工具宿主 |

从公开导出取得能力；完整方法、参数和组件属性查安装包的类型。不要导入包内未公开的文件。

## 读取一条已有便签

前提：项目已安装 SDK，目标租户已安装[便签示例](/ai/note-case)，你拥有一条可读取便签的 recordId 和获准的租户登录令牌。此例只读取数据。

将以下内容保存为 `read-note.mjs`，放在已安装 SDK 的项目中：

```js
import { XRainRuntimeClient } from '@xrain/workforce-application/server';

const { XRAIN_BASE_URL, XRAIN_TOKEN, XRAIN_NOTE_ID } = process.env;
if (!XRAIN_BASE_URL || !XRAIN_TOKEN || !XRAIN_NOTE_ID) {
  throw new Error('需要 XRAIN_BASE_URL、XRAIN_TOKEN 和 XRAIN_NOTE_ID');
}
const client = new XRainRuntimeClient({
  baseUrl: XRAIN_BASE_URL,
  token: XRAIN_TOKEN
});
const note = await client.get('xrainlearn__note__c', XRAIN_NOTE_ID);
console.log(JSON.stringify(note, null, 2));
```

在完成[正常登录](/help/environment#学习者准备一次正常登录)的 PowerShell 中，沿用 `$base` 和 `$headers`，执行：

```powershell
$env:XRAIN_BASE_URL = $base
$env:XRAIN_TOKEN = $headers.Authorization.Substring(7)
$env:XRAIN_NOTE_ID = Read-Host '输入一条已有便签的 recordId'
try { node ./read-note.mjs }
finally { Remove-Item Env:XRAIN_BASE_URL, Env:XRAIN_TOKEN, Env:XRAIN_NOTE_ID -ErrorAction SilentlyContinue }
```

预期看到同一条记录的 JSON。SDK 的 `get()` 返回记录本身，不使用 CLI 的 `{ok,data}` 外层。令牌保持在进程环境中，不写入样例、源码或输出。

常用方法包括 `describeBusinessObject(entityCode)`、`get(entityCode, recordId)`、`query(entityCode, query)` 和 `create(entityCode, values)`。写入方法会改变数据，使用前核对对应权限和输入。详细说明见[SDK 专题参考](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/workforce-business-development/references/workforce-sdk.md)。

## 接入 AI 业务工具

宿主已经取得可信执行上下文时，使用 `XRainRuntimeClient.fromExecution(call.execution, { signal: call.signal })`；工具参数只接受业务输入，不能接受用户传入的令牌或任意执行主体。

[官方接线示例](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/workforce-business-development/references/implementation.md)展示 `ServiceToolInvoker` 与业务函数的连接。还需要工具声明、宿主装入、当前定义和实际权限同时生效。

如果业务完全来自原系统，可让工具调用[编排发布的接口](/developers/integration)或企业服务；不必为了使用 AI 工具而创建 XRain 业务对象。

## 区分三种调用方式

| 名称 | 怎样使用 |
|---|---|
| 应用 SDK | 在项目中安装交付包，以 JavaScript/TypeScript 导入并调用 |
| 编排中的 `ctx.sdk` | 由 XRain 编排运行时注入，通过 `fn.invoke()` 使用已登记能力 |
| XRain HTTP API / CLI | 分别通过网络请求或终端命令调用，认证、参数和响应各按自身说明 |

找不到包时先核对交付渠道；找不到导出或方法时核对锁定版本；调用失败时按[错误与当前环境](/ai/troubleshooting)检查身份、权限和实际返回。本文的源码与模拟传输核对不替代你的环境联调。
