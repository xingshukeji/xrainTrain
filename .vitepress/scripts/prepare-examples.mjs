import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
const root = new URL('../../', import.meta.url)
const downloads = new URL('course/public/downloads/', root)
await mkdir(downloads, { recursive: true })
const files = [
  ['examples/note/source.json', 'note-source.json'],
  ['examples/note/label-source.json', 'note-label-source.json'],
  ['examples/note/values.json', 'note-values.json'],
  ['examples/note/query.json', 'note-query.json'],
  ['examples/automation/greeting.json', 'greeting.json']
]
for (const [source, name] of files) await copyFile(new URL(source, root), new URL(name, downloads))
let commit = process.env.GITHUB_SHA || 'local-source'
if (commit === 'local-source') {
  try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch {}
}
await writeFile(new URL('course/public/version.json', root), JSON.stringify({ commit }, null, 2) + '\n')
console.log(`已准备 ${files.length} 个课程样例下载文件。`)
