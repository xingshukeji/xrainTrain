import { ref } from 'vue'
import { emptyProgress, parseProgress, storageKey, updateProgress } from './progress.mjs'
const state = ref(emptyProgress())
const storageAvailable = ref(true)
export function useProgress() {
  function load() {
    try { state.value = parseProgress(localStorage.getItem(storageKey)); storageAvailable.value = true }
    catch { storageAvailable.value = false }
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(state.value)); storageAvailable.value = true }
    catch { storageAvailable.value = false }
  }
  function update(id, patch) { state.value = updateProgress(state.value, id, patch); save() }
  function reset() { state.value = emptyProgress(); save() }
  return { state, storageAvailable, load, update, reset }
}
