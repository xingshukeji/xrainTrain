---
title: 连接已有系统，无需重新建模
description: 对已有清晰数据、流程和接口的 ERP、CRM，使用 XRain 连接器、业务编排和 HTTP 接口接入页面与 AI，不必新建业务数据模型。
---
# 连接已有系统，无需重新建模

如果老系统的数据、流程、权限和接口已经管理完善，可以直接通过 **XRain 业务编排转接接口**。订单、库存、客户仍保存在原系统；页面或 AI 使用统一的业务操作。

“无需重新建模”指不必先新建业务对象和字段。连接配置、输入输出、执行权限和远端身份仍然需要明确。

## 选择最短路线

| 情况 | 实现方式 |
|---|---|
| 转接一个原系统接口 | Connector + HttpRequest + raw HttpInterface |
| 组合接口、转换输入输出或加入业务判断 | 业务编排调用已登记的 raw 接口，再发布为 orchestrated HttpInterface |
| 需要项目库、复杂算法或已有 SDK | 在企业业务服务中调用原系统 SDK/API |
| 还需保存原系统没有的回访、备注等事实 | 只为这些新增事实建模，保留原系统数据归属 |

## 从原接口到业务入口

1. **核对原接口。** 明确请求、响应、错误、执行身份，以及原系统是否支持按用户授权或幂等请求。
2. **配置连接与请求。** Connector 保存目标系统配置，HttpRequest 定义方法、路径与参数模板，raw HttpInterface 提供可调用名称。
3. **按需要编排。** 用 `ctx.sdk.fn.invoke(key, input)` 调用已登记的 raw 接口，转换数据或组织业务判断。编排中不直接使用 `fetch` 或 npm 库。
4. **发布业务接口。** 将编排发布为 HTTP 接口，配置该业务动作的执行权限。
5. **从实际入口验证。** 页面或 AI 工具调用该接口，核对远端结果、权限拒绝、超时及错误处理。

这条调用链不依赖新建 BizObject 或 BizField。单接口转接可以省略编排。配置页面及接口是否可用，以目标环境版本与权限为准。

## 用编排组合已有接口

下面是**教学示例**，前提是已配置名为 `erp_order_quote` 的 raw HTTP 接口，它接受 `orderId` 和 `dryRun`，并返回 JSON。名称、业务字段和 `dryRun` 行为由这个示例接口定义，不是所有 ERP 的通用约定。

输入：

```json
{"orderId":"o/1001"}
```

编排源码：

```js
function execute(ctx) {
  const quote = ctx.sdk.fn.invoke('erp_order_quote', {
    orderId: ctx.input.orderId,
    dryRun: true
  });
  return { source: 'erp', orderId: ctx.input.orderId, quote };
}
```

输出包含 `source`、原订单编号和远端实际返回的 `quote`。这个编排没有读取或写入 XRain 业务记录。`ctx.sdk` 是平台在编排运行时提供的对象，不是要从 npm 安装的 SDK。

已有编排可通过 `POST /api/integration/v1/http-interfaces/from-orchestration/{orchestrationId}` 发布；随后使用目录返回的 `invokePath` 调用。参数和响应细节以[官方集成参考](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/workforce-business-development/references/integration.md)为准。

## 让页面和 AI 调用同一个业务动作

页面提交业务输入；AI 工具也提交同样的业务输入。两者可以共用已经封装的业务接口，数据规则和确定性计算由业务服务或编排执行。

连接器凭据代表的是连接器主体，不会自动变成当前用户在 ERP 中的身份。使用共享连接器时，按完整业务动作控制范围；需要用户委托时，使用原系统支持的认证协议。[接入 AI 工具](/developers/sdk#接入-ai-业务工具)。

## 怎样判断接入完成

读操作检查实际返回、字段映射、空结果和无权限结果。写操作除成功路径外，还需确定超时后如何查询原结果，避免重复提交。远端 HTTP 不参与 XRain 记录事务；混合场景分别记录各系统的成功与失败。

此页说明现有接入能力和教学调用方式，不代表已为你的 ERP 完成配置或联调。完整资源参数、执行权限和恢复规则见[集成参考](https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/workforce-business-development/references/integration.md)；准备建设新业务时再进入[建模案例](/ai/note-case)。
