import test from 'node:test'
import assert from 'node:assert/strict'
import { parseProgress, updateProgress, emptyProgress } from '../.vitepress/theme/progress.mjs'
test('损坏、过期和空的存储可以恢复为空记录', () => {
  for (const raw of [null, '{', 'null', '{"version":2,"lessons":{}}']) assert.deepEqual(parseProgress(raw), emptyProgress())
})
test('只恢复已知课程的布尔状态，不把答题当作实操', () => {
  const data = parseProgress(JSON.stringify({version:1,lessons:{g0:{read:'true',quiz:true,practiced:false},unknown:{read:true}},lastLesson:'unknown'}))
  assert.deepEqual(data, {version:1,lessons:{g0:{read:false,quiz:true,practiced:false}},lastLesson:null})
})
test('更新当前课程会保留其他课程，撤销勾选会生效', () => {
  const start = updateProgress(emptyProgress(), 'g0', {read:true, practiced:true})
  const next = updateProgress(start, 'b1', {quiz:true})
  assert.equal(next.lessons.g0.practiced, true)
  assert.equal(next.lessons.b1.practiced, undefined)
  assert.equal(next.lastLesson, 'b1')
  assert.equal(updateProgress(next, 'g0', {read:false}).lessons.g0.read, false)
  assert.equal(updateProgress(next, 'unknown', {read:true}), next)
})
