import { lessonIds } from './course-data.mjs'
export const storageKey = 'xraintrain.progress.v1'
export const emptyProgress = () => ({ version: 1, lessons: {}, lastLesson: null })
export function parseProgress(raw) {
  try {
    const data = JSON.parse(raw)
    if (!data || data.version !== 1 || !data.lessons || typeof data.lessons !== 'object') return emptyProgress()
    const clean = emptyProgress()
    for (const id of lessonIds) {
      const item = data.lessons[id]
      if (item && typeof item === 'object') clean.lessons[id] = { read: item.read === true, practiced: item.practiced === true, quiz: item.quiz === true }
    }
    if (lessonIds.includes(data.lastLesson)) clean.lastLesson = data.lastLesson
    return clean
  } catch { return emptyProgress() }
}
export function updateProgress(data, id, patch = {}) {
  if (!lessonIds.includes(id)) return data
  const allowed = Object.fromEntries(Object.entries(patch).filter(([key, value]) => ['read', 'practiced', 'quiz'].includes(key) && typeof value === 'boolean'))
  return { ...data, lastLesson: id, lessons: { ...data.lessons, [id]: { ...data.lessons[id], ...allowed } } }
}
