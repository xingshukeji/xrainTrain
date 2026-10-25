import { readFile, readdir, access } from 'node:fs/promises'
import { resolve, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lessons } from '../theme/course-data.mjs'
const root = fileURLToPath(new URL('../../', import.meta.url))
const course = join(root, 'course')
const issues = []
async function walk(dir) {
  return (await Promise.all((await readdir(dir, {withFileTypes:true})).map(entry => entry.isDirectory() ? walk(join(dir,entry.name)) : join(dir,entry.name)))).flat()
}
async function exists(path) { try { await access(path); return true } catch { return false } }
const files = await walk(course)
let links = 0
for (const file of files.filter(f => f.endsWith('.md'))) {
  const text = await readFile(file, 'utf8'), label = relative(root,file)
  if (text.includes('\uFFFD')) issues.push(`${label}: 损坏的字符`)
  if ((text.match(/^```/gm)||[]).length % 2) issues.push(`${label}: 代码围栏未闭合`)
  if (/(?:D:\\github\.com|C:\\Users\\HP|ANBANG_FUNCTION_AUTH_PASSWORD|xrain-central\.test)/i.test(text)) issues.push(`${label}: 含本机或测试环境私有配置`)
  const prose = text.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm,'')
  for (const match of prose.matchAll(/!?\[[^\]\n]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const href = match[1]
    if (/^(?:https?:|mailto:|#)/.test(href)) continue
    links++
    const target = decodeURIComponent(href.split('#')[0].split('?')[0])
    const path = target.startsWith('/') ? join(course, target.slice(1)) : resolve(dirname(file), target)
    const candidates = [path, `${path}.md`, join(path,'index.md'), join(course,'public',target.replace(/^\//,''))]
    if (!(await Promise.all(candidates.map(exists))).some(Boolean)) issues.push(`${label}: 链接不存在 ${href}`)
  }
}
for (const lesson of lessons) {
  const file = join(course,`${lesson.path}.md`)
  if (!(await exists(file))) { issues.push(`课程缺页: ${lesson.id}`); continue }
  const text = await readFile(file,'utf8')
  if (!text.includes(`lesson: ${lesson.id}`) || !text.includes('## 自己做一次') || !text.includes('<QuizCard />')) issues.push(`课程不完整: ${lesson.id}`)
}
for (const file of files.filter(f=>f.endsWith('.svg') && f.includes(`${join('public','diagrams')}`))) {
  const svg=await readFile(file,'utf8')
  if(!/<title\b/.test(svg)||!/<desc\b/.test(svg)||!/<svg[^>]*viewBox=/.test(svg)) issues.push(`${relative(root,file)}: 缺少 SVG 可访问说明或 viewBox`)
}
const first = JSON.parse(await readFile(join(root,'examples/note/source.json'),'utf8'))
const second = JSON.parse(await readFile(join(root,'examples/note/label-source.json'),'utf8'))
if (first.records.filter(r=>r.kind==='BizObject').length!==1 || first.records.filter(r=>r.kind==='BizField').length!==1 || first.records.some(r=>r.kind==='RuntimeRecord')) issues.push('首课样例超出一对象、一字段、无预置记录的范围')
if (first.packageId!==second.packageId || first.versionId===second.versionId || first.records.map(r=>r.id).join()!==second.records.map(r=>r.id).join()) issues.push('标签升级没有保留稳定身份或没有新版本身份')
if(issues.length){console.error(issues.join('\n'));process.exitCode=1}
else console.log(`课程检查通过：${files.filter(f=>f.endsWith('.md')).length} 篇正文、${lessons.length} 个基础单元、${links} 个本地引用。`)
