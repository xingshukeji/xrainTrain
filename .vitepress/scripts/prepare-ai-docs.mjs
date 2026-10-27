import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

const publishedSite = 'https://xingshukeji.github.io/xrainTrain/'
const hub = 'https://raw.githubusercontent.com/xingshukeji/skills-hub/main/skills/'
const skills = [
  ['workforce-business-development', '业务开发'],
  ['xrain-cli', '平台 CLI'],
  ['xrain-auth', '认证与登录'],
  ['xrain-access-diagnosis', '访问诊断'],
  ['xrain-business-user-lifecycle', '业务人员接入与协作'],
  ['xrain-app-operations', '应用安装与恢复'],
  ['workforce-runtime', '应用运行与恢复'],
  ['workforce-agent-troubleshoot', '智能体排错'],
  ['cicd', '已有流水线操作']
]

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(entry => {
    if (entry.name === 'public' || entry.name.startsWith('.')) return []
    const path = join(directory, entry.name)
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith('.md') ? [path] : []
  }))
  return files.flat().sort()
}

function webUrl(path, siteUrl) {
  return new URL(path.replace(/index\.md$/, '').replace(/\.md$/, ''), siteUrl).href
}

function absoluteLink(href, path, siteUrl) {
  if (/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(href)) return href
  return href.startsWith('/') ? new URL(href.slice(1), siteUrl).href : new URL(href, webUrl(path, siteUrl)).href
}

// Preserve fenced examples verbatim; resolve document links for use outside
// the website, without evaluating Vue components or changing their source data.
export function exportMarkdown(source, path, siteUrl = publishedSite) {
  return source.split(/(^```[^\n]*\n[\s\S]*?^```[^\S\r\n]*$)/gm).map(part => {
    if (part.startsWith('```')) return part
    return part
      .replace(/(!?\[[^\]\n]*\]\()([^\s)]+)(\))/g, (_, before, href, after) => before + absoluteLink(href, path, siteUrl) + after)
      .replace(/\b(href|src)="([^"]+)"/g, (_, attribute, href) => `${attribute}="${absoluteLink(href, path, siteUrl)}"`)
  }).join('')
}

export async function prepareAiDocs({ sourceDir, outputDir, siteUrl = publishedSite }) {
  const sources = await markdownFiles(sourceDir)
  const paths = new Set(sources.map(file => relative(sourceDir, file).replaceAll('\\', '/')))
  const textDir = join(outputDir, 'text')
  let previous = []
  try { previous = await markdownFiles(textDir) } catch (error) { if (error.code !== 'ENOENT') throw error }
  for (const file of previous) {
    if (!paths.has(relative(textDir, file).replaceAll('\\', '/'))) await unlink(file)
  }
  const docs = []
  for (const file of sources) {
    const path = relative(sourceDir, file).replaceAll('\\', '/')
    const source = await readFile(file, 'utf8')
    const title = source.match(/^# (.+)$/m)?.[1] || source.match(/^title: (.+)$/m)?.[1] || path
    const content = exportMarkdown(source, path, siteUrl)
    const output = join(outputDir, 'text', path)
    await mkdir(dirname(output), { recursive: true })
    await writeFile(output, content)
    docs.push({ path, title, content, url: new URL(`text/${path}`, siteUrl).href })
  }
  const list = selected => selected.map(doc => `- [${doc.title}](${doc.url})`).join('\n')
  const introduction = '# 苏宏助为 · XRain 与 Workforce 开发资料\n\n' +
    '> 苏州苏宏助为智能科技有限公司提供企业 AI 解决方案、应用定制与系统集成。业务咨询：510102105@qq.com。\n\n' +
    '从业务需求选择资料，按任务读取。公开知识不授予平台权限；实际调用使用获准环境和身份。平台核心源码保持闭源。\n\n' +
    '本站 Markdown 保留正文、代码和教学组件的源数据，无需运行网页脚本；模拟和学习记录交互在网页使用。正式接口、类型和命令以来源及实际版本为准。\n\n' +
    `- [本站版本](${new URL('version.json', siteUrl).href})\n` +
    `- [本站 Markdown 全文](${new URL('llms-full.txt', siteUrl).href})：不内嵌完整 skills-hub；继续读取下方公开来源。\n` +
    '- [skills-hub 完整目录](https://github.com/xingshukeji/skills-hub/archive/refs/heads/main.zip)：按需取得完整技能目录，已安装副本需主动更新。\n'
  const index = `${introduction}\n## AI 开发路线\n\n${list(docs.filter(doc => doc.path.startsWith('ai/')))}\n\n` +
    `## 企业服务与人员学习\n\n${list(docs.filter(doc => ['index.md', 'solutions.md', 'learn.md'].includes(doc.path)))}\n\n` +
    `## 公开 AI 技能\n\n${skills.map(([name, label]) => `- [${label}](${hub}${name}/SKILL.md)：${name}`).join('\n')}\n\n` +
    `## 课程与接口参考\n\n${list(docs.filter(doc => !doc.path.startsWith('ai/') && !['index.md', 'solutions.md', 'learn.md'].includes(doc.path)))}\n`
  await writeFile(join(outputDir, 'llms.txt'), index)
  await writeFile(join(outputDir, 'llms-full.txt'), introduction + '\n' + docs.map(doc => `\n---\n\n# 文档：${doc.title}\n\n网页：${webUrl(doc.path, siteUrl)}\n原始 Markdown：${doc.url}\n\n${doc.content}`).join('\n'))
  return docs.length
}
