# 苏宏助为 · 企业 AI 与 XRain 开发支持

苏州苏宏助为智能科技有限公司的企业 AI 解决方案、人员课程与 AI 开发资料入口。以 XRain 与 Workforce 的公开能力支持二开、业务应用定制和系统集成。商务咨询：[510102105@qq.com](mailto:510102105@qq.com)。

[解决方案与合作](https://xingshukeji.github.io/xrainTrain/solutions) · [人员学习](https://xingshukeji.github.io/xrainTrain/learn) · [AI 开发入口](https://xingshukeji.github.io/xrainTrain/ai/) · [公开技能](https://github.com/xingshukeji/skills-hub) · [AI 文本索引](https://xingshukeji.github.io/xrainTrain/llms.txt)

人员课程包含 G0 与 B1—B7、五个专题、操作视频、SVG、判断题和浏览器学习记录。AI 资料按开发任务连接技能、21 份业务专题、接口、CLI、SDK 和完整便签案例。当前范围由[设计](internal/设计方案.md)与[覆盖地图](internal/能力与接口学习地图.md)持有。

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

`docs:check` 检查正文、引用、课程标题与导航、教学用语和最小样例。`test` 检查学习记录及 AI 文本导出行为。准备步骤复制本仓 examples，并从 course 正文生成 `text/`、`llms.txt` 和 `llms-full.txt`；构建生成 `.vitepress/dist`，不读取相邻仓库或业务配置。纯文本副本在准备步骤更新。预览地址同上；本地开发与预览不要同时占用同一端口。

正文位于 `course/`，组件与站点配置位于 `.vitepress/`，可编辑 SVG 在 `course/public/diagrams/`；分步图的数据随所在课程正文维护。`examples/` 持有完整练习源码。`internal/` 不进入网站，但其已提交文件随公开仓库公开。

[操作视频](https://xingshukeji.github.io/xrainTrain/platform-tour)为 7 分 54 秒真实页面实录。公开成片、封面与字幕位于 `course/public/media/`，章节和等价文字由 `course/platform-tour.md` 持有。更新成片时同步核对时长、章节、字幕、遮盖与实际播放；原始录屏和制作缓存不提交。逐页的首次自学审阅见[课程真人审阅](internal/课程真人审阅.md)。

## GitHub Pages 发布与恢复

目标固定为本仓 GitHub Pages，基址 `/xrainTrain/`。在仓库 Settings → Pages 中将 Source 设为 GitHub Actions；该设置由仓库维护者执行一次。

推送 `main` 自动运行 `.github/workflows/deploy-pages.yml`。同一提交先使用锁文件安装、测试、检查和构建，再上传 Pages artifact；部署作业直接发布这一产物。通过后，在 Actions 的部署链接打开网站，并比较 `/xrainTrain/version.json` 的 commit 与该次运行的提交。刷新深层课程、尝试搜索、答题和学习记录，不能只看首页可达。

首次发布前没有上一网站版本。首次失败时保留未发布状态，修正开发结果并重新核验。后续发布失败时先核对 Pages 当前 deployment，保留仍可用的版本。要恢复已知成功版本，在 Actions 中选择对应提交的成功运行，使用 Re-run jobs → Re-run all jobs；它从原提交重新构建并发布。若原运行已不可用，由维护者建立一个只恢复已确认内容的新提交，重新走同一工作流。不要从不明本地产物手工覆盖网站。

本工作流使用 GitHub 提供的短期权限，不需要课程维护者保存个人 Token。业务平台凭据、原始回执、日志、缓存、依赖目录与构建输出均不提交。

## 样例验证范围

真实练习从[环境准备与 CLI 初始化](course/help/environment.md)开始。2026-10-25 已逐课核对基础单元、独立专题数据、函数与 Trigger、只读集成、SDK 和 CLI 示例，并检查全部课程页面及交互。每项成功结果和仍缺环境条件的项目由[资料总索引与适用版本](course/reference/sources.md#适用范围与真实验证)持有；不能将页面或预览成功当作所有练习成功。

本站与 skills-hub 公开可读。纯文本全文包含本站 Markdown 和上游链接；取得全部技能及资源使用 skills-hub 完整目录。Workforce 源码按原仓库权限访问，真实调用需要获准环境和身份。平台核心源码不包含在公开资料中。
