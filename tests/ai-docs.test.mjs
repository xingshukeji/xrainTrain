import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { exportMarkdown, prepareAiDocs } from '../.vitepress/scripts/prepare-ai-docs.mjs'

test('text documents resolve base-path and relative links while preserving runnable code', () => {
  const source = '# Example\n[HTTP](/reference/http#单条记录) [Next](./note-case)\n' +
    '![Image](/diagrams/access.svg) <a href="/learn">Learn</a>\n' +
    '```http\nGET /api/data/v1/query-capabilities\n[Literal](/do-not-change)\n```\n' +
    '[Upstream](https://example.com/docs) [Local](#example)\n'
  const text = exportMarkdown(source, 'ai/index.md')
  assert.ok(text.includes('(https://xingshukeji.github.io/xrainTrain/reference/http#%E5%8D%95%E6%9D%A1%E8%AE%B0%E5%BD%95)'))
  assert.ok(text.includes('(https://xingshukeji.github.io/xrainTrain/ai/note-case)'))
  assert.ok(text.includes('(https://xingshukeji.github.io/xrainTrain/diagrams/access.svg)'))
  assert.ok(text.includes('href="https://xingshukeji.github.io/xrainTrain/learn"'))
  assert.ok(text.includes('```http\nGET /api/data/v1/query-capabilities\n[Literal](/do-not-change)\n```'))
  assert.ok(text.includes('[Upstream](https://example.com/docs) [Local](#example)'))
  const windowsText = exportMarkdown(source.replaceAll('\n', '\r\n'), 'ai/index.md')
  assert.ok(windowsText.includes('```http\r\nGET /api/data/v1/query-capabilities\r\n[Literal](/do-not-change)\r\n```'))
})

test('publication exports all authored documents without copying public assets or internal files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'xrain-ai-docs-'))
  try {
    const sourceDir = join(root, 'course'), outputDir = join(sourceDir, 'public')
    await mkdir(join(sourceDir, 'ai'), { recursive: true })
    await mkdir(join(outputDir, 'downloads'), { recursive: true })
    await mkdir(join(root, 'internal'), { recursive: true })
    await writeFile(join(sourceDir, 'ai/index.md'), '---\ntitle: AI entry\n---\n# AI entry\n[Help](/help)\n')
    await writeFile(join(sourceDir, 'help.md'), '# Help\nUse the real result.\n')
    await writeFile(join(outputDir, 'downloads/example.md'), 'Do not copy this asset into the course corpus.')
    await writeFile(join(root, 'internal/private.md'), 'Do not publish this internal file.')
    assert.equal(await prepareAiDocs({ sourceDir, outputDir }), 2)
    assert.ok((await readFile(join(outputDir, 'text/ai/index.md'), 'utf8')).includes('https://xingshukeji.github.io/xrainTrain/help'))
    const index = await readFile(join(outputDir, 'llms.txt'), 'utf8')
    assert.ok(index.includes('text/ai/index.md'))
    assert.ok(index.includes('skills/workforce-business-development/SKILL.md'))
    const full = await readFile(join(outputDir, 'llms-full.txt'), 'utf8')
    assert.ok(full.includes('Use the real result.'))
    assert.ok(!full.includes('Do not copy'))
    assert.ok(!full.includes('Do not publish'))
    await unlink(join(sourceDir, 'help.md'))
    assert.equal(await prepareAiDocs({ sourceDir, outputDir }), 1)
    await assert.rejects(readFile(join(outputDir, 'text/help.md')), { code: 'ENOENT' })
    assert.ok(!(await readFile(join(outputDir, 'llms-full.txt'), 'utf8')).includes('Use the real result.'))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
