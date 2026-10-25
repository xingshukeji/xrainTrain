import test, { afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { storageKey } from '../.vitepress/theme/progress.mjs'

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
afterEach(() => {
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
  else delete globalThis.localStorage
})

function installStorage(storage) {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
}
async function progressFor(name) {
  return (await import(`../.vitepress/theme/use-progress.js?case=${name}`)).useProgress()
}

test('读取被拒绝时保留会话内勾选，重新进入记录页仍提示无法保存', async () => {
  installStorage({
    getItem() { throw new DOMException('Storage is blocked', 'SecurityError') },
    setItem() { throw new DOMException('Storage is blocked', 'SecurityError') }
  })
  const progress = await progressFor('read-denied')
  assert.doesNotThrow(() => progress.load())
  progress.update('g0', { read: true, quiz: true })
  progress.load()
  assert.equal(progress.state.value.lessons.g0.read, true)
  assert.equal(progress.state.value.lessons.g0.quiz, true)
  assert.notEqual(progress.state.value.lessons.g0.practiced, true)
  assert.equal(progress.storageAvailable.value, false)
})

test('配额不足后进入记录页不丢失本次勾选，也不隐藏保存失败提示', async () => {
  const saved = JSON.stringify({ version: 1, lessons: { b1: { read: true } }, lastLesson: 'b1' })
  let persisted = saved
  let quotaExceeded = true
  installStorage({
    getItem() { return persisted },
    setItem(key, value) {
      if (quotaExceeded) throw new DOMException('Storage quota exceeded', 'QuotaExceededError')
      assert.equal(key, storageKey)
      persisted = value
    }
  })
  const progress = await progressFor('quota-exceeded')
  progress.load()
  progress.update('g0', { read: true })
  assert.equal(persisted, saved)
  progress.load()
  assert.equal(progress.state.value.lessons.b1.read, true)
  assert.equal(progress.state.value.lessons.g0.read, true)
  assert.equal(progress.storageAvailable.value, false)
  quotaExceeded = false
  progress.update('b2', { quiz: true })
  assert.equal(progress.storageAvailable.value, true)
  assert.equal(JSON.parse(persisted).lessons.g0.read, true)
})

test('清除课程记录只写入本课程的键，保留同一网站的其他数据', async () => {
  const values = new Map([[storageKey, '{invalid-json'], ['another-key', 'keep']])
  installStorage({ getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) })
  const progress = await progressFor('reset-isolation')
  progress.load()
  progress.update('g0', { read: true, practiced: true })
  progress.reset()
  assert.deepEqual(JSON.parse(values.get(storageKey)), { version: 1, lessons: {}, lastLesson: null })
  assert.equal(values.get('another-key'), 'keep')
})
