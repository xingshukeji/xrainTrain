---
title: 按现象排错
---
# 按现象排错

找到与你遇到的情况最接近的一行，先检查这一项。报告问题时保留请求方法、地址、状态码和错误码，删去密码、Token 和真实业务数据。

## 按返回结果查

| 现象 | 先检查什么 | 说明 |
|---|---|---|
| 没有账号或练习环境 | 向维护者取得平台地址、账号和练习权限 | [环境准备](/help/environment) |
| 401 | 登录是否过期，当前入口是否接受这种登录方式 | [用户与权限](/basics/access) |
| 403 | 当前用户、租户、操作权限及记录范围 | [权限排查](/basics/access#收到-403先查哪三件事) |
| 400 | 字段名、类型、必填项和长度 | [字段](/basics/fields) |
| 404，查不到对象 | 对象 API 名、租户、安装版本 | [对象与记录](/basics/model) |
| 404，查不到记录 | recordId、租户、删除状态及可见范围 | [记录接口](/reference/http) |
| 409 | 当前值或修订号是否已变化 | [修改冲突](/basics/data#expectedvalues-为什么要放旧内容) |
| 503，runtime_metadata_not_ready | 对象配置尚不能用于数据操作 | [下方处理步骤](#元数据未就绪) |
| 保存后再打开，内容不对 | 是否读取了同一租户、同一 recordId | [G0](/start) |
| 改了源码，平台没变化 | 是否完成构建、导入和目标租户安装 | [版本](/basics/version) |
| 平台标签变了，应用页面没变 | 页面是否读取该标签，还是使用自己的文案 | [页面字段练习](/topics/workforce) |
| 安装或写入超时 | 先查询原操作或已经保存的记录 | [超时处理](/topics/operations#超时后先查原操作) |
| HTTP 200，但外部调用失败 | 返回中的 statusCode、isSuccess 和 body | [集成](/topics/integration) |
| 接口目录或 OpenAPI 返回 500 | 保留错误，由维护者处理；用静态文档继续查阅 | [接口文档](/reference/) |
| 邮件 reference 失效 | 重新搜索取得完整 reference | [个人邮箱](/topics/integration#个人邮箱是另一种身份范围) |

状态码不能单独确定原因。例如 404 可能是记录不存在，也可能与访问范围有关，要结合具体错误消息判断。

## 元数据未就绪

如果 describe 能返回，但记录请求持续出现 `503 / runtime_metadata_not_ready`，请环境维护者检查该应用安装。

维护者确认 installationId 后，可调用：

```http
POST /api/application/v1/installations/{installationId}/check
```

这个操作刷新该安装的运行可用性，并按当前用户权限检查对象。查看返回 items 中 BizObject 的 `status/errorCode`，再读取原记录。

课程验证环境曾用这个方法恢复读取，原记录保留；它不补齐用户权限，也不表示平台问题的根因已修复。检查后仍失败时，继续交给平台维护者处理。

## 三种“成功”分别说明什么

| 返回 | 还要检查什么 |
|---|---|
| 安装 Succeeded | 租户中的安装版本、字段和原记录 |
| 编排 isSuccess=true | output 是否符合预期 |
| 通知 accepted | 通道后续状态，是否确认送达 |

## 课程网站的问题

学习记录只保存在当前浏览器。更换设备、清理网站数据或使用另一地址，记录不会自动同步；这不影响平台中的便签。

网页模拟刷新后恢复初始状态，真实便签需要到 XRain 平台查看。遇到内容与实际接口不一致，可在[课程仓库](https://github.com/xingshukeji/xrainTrain)提供页名、最小请求和去除敏感信息后的返回。
