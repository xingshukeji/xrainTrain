import { readFile, readdir, stat } from 'node:fs/promises'
import { join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const base = '/xrainTrain/'
async function walk(dir) {
  return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(e => e.isDirectory() ? walk(join(dir, e.name)) : join(dir, e.name)))).flat()
}
const files = await walk(dist)
const html = new Map(await Promise.all(files.filter(f => f.endsWith('.html')).map(async f => [f, await readFile(f, 'utf8')])))
const issues = new Set()
let count = 0
for (const [file, text] of html) {
  const page = base + relative(dist, file).replaceAll('\\', '/')
  for (const match of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&')
    if (/^(?:https?:|mailto:|data:|javascript:)/.test(href)) continue
    const url = new URL(href, `https://course.invalid${page}`)
    if (!url.pathname.startsWith(base)) { issues.add(`${page}: 基址外链接 ${href}`); continue }
    const path = resolve(dist, decodeURIComponent(url.pathname.slice(base.length)))
    const candidates = [path, `${path}.html`, join(path, 'index.html')]
    let found
    for (const target of candidates) {
      try { if ((await stat(target)).isFile()) { found = target; break } } catch {}
    }
    if (!found) { issues.add(`${page}: 缺少 ${href}`); continue }
    if (url.hash && html.has(found)) {
      const id = decodeURIComponent(url.hash.slice(1))
      if (!html.get(found).includes(`id="${id}"`)) issues.add(`${page}: 锚点不存在 ${href}`)
    }
    count++
  }
}
for (const file of files) if (/[/\\](?:internal|\.local)(?:[/\\]|$)/.test(file)) issues.add(`产物包含内部目录 ${file}`)
if (issues.size) { console.error([...issues].join('\n')); process.exitCode = 1 }
else console.log(`产物引用检查通过：${html.size} 个 HTML 页面，${count} 个链接与资源。`)
