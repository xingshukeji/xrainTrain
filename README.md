# XRain 学习课

从一个对象、一个文本字段、一条便签开始的独立低代码自学课程。包括 G0 与 B1—B7、23 类能力地图、接口资料入口、五个按需专题、SVG 图解、判断题和浏览器本地学习记录。

[在线课程](https://xingshukeji.github.io/xrainTrain/) · [完整源码](https://github.com/xingshukeji/xrainTrain) · [课程设计](internal/设计方案.md) · [覆盖地图](internal/能力与接口学习地图.md)

## 本地运行

使用 Node.js 22.12 以上的 22.x 或 24.x，以及 pnpm 10.18.2。只需要本仓库，不需要相邻业务源码、平台账号或业务环境配置。

```powershell
git clone https://github.com/xingshukeji/xrainTrain.git
cd xrainTrain
npm install --global pnpm@10.18.2
pnpm install --frozen-lockfile
pnpm docs:dev
```

打开终端显示的 `http://127.0.0.1:4175/xrainTrain/`。停止本地服务使用 Ctrl+C。真实平台练习另按课程的“准备真实练习环境”执行；网页中的便签演示不会连接平台。

## 检查与预览

```powershell
pnpm docs:check
pnpm test
pnpm docs:build
pnpm docs:preview
```

`docs:check` 检查正文、引用、基础单元与最小样例。`test` 检查学习记录的恢复和隔离。构建先复制本仓 examples 到公开下载目录，再生成 `.vitepress/dist`，不读取业务配置。预览地址同上；本地开发与预览不要同时占用同一端口。

正文位于 `course/`，组件与站点配置位于 `.vitepress/`，可编辑 SVG 在 `course/public/diagrams/`；分步图的数据随所在课程正文维护。`examples/` 持有完整练习源码。`internal/` 不进入网站，但其已提交文件随公开仓库公开。

## GitHub Pages 发布与恢复

目标固定为本仓 GitHub Pages，基址 `/xrainTrain/`。在仓库 Settings → Pages 中将 Source 设为 GitHub Actions；该设置由仓库维护者执行一次。

推送 `main` 自动运行 `.github/workflows/deploy-pages.yml`。同一提交先使用锁文件安装、测试、检查和构建，再上传 Pages artifact；部署作业直接发布这一产物。通过后，在 Actions 的部署链接打开网站，并比较 `/xrainTrain/version.json` 的 commit 与该次运行的提交。刷新深层课程、尝试搜索、答题和学习记录，不能只看首页可达。

首次发布前没有上一网站版本。首次失败时保留未发布状态，修正开发结果并重新核验。后续发布失败时先核对 Pages 当前 deployment，保留仍可用的版本。要恢复已知成功版本，在 Actions 中选择对应提交的成功运行，使用 Re-run jobs → Re-run all jobs；它从原提交重新构建并发布。若原运行已不可用，由维护者建立一个只恢复已确认内容的新提交，重新走同一工作流。不要从不明本地产物手工覆盖网站。

本工作流使用 GitHub 提供的短期权限，不需要课程维护者保存个人 Token。业务平台凭据、原始回执、日志、缓存、依赖目录与构建输出均不提交。

## 样例验证范围

真实练习从[环境准备与 CLI 初始化](course/help/environment.md)开始。2026-10-25 已逐课核对基础单元、独立专题数据、函数与 Trigger、只读集成、SDK 和 CLI 示例，并检查全部课程页面及交互。每项成功结果和仍缺环境条件的项目由[资料总索引与适用版本](course/reference/sources.md#适用范围与真实验证)持有；不能将页面或预览成功当作所有练习成功。

网页学习不需要 skills-hub 或 Workforce 源码权限。上游深入资料可能需要组织访问权，课程明确标注；平台源码不包含在本课程中。
