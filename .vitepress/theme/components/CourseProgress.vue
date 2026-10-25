<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { lessons } from '../course-data.mjs'
import { useProgress } from '../use-progress.js'
const { state, storageAvailable, load, reset } = useProgress()
const ready = ref(false)
const confirmReset = ref(false)
const readCount = computed(() => lessons.filter(l => state.value.lessons[l.id]?.read).length)
const practicedCount = computed(() => lessons.filter(l => state.value.lessons[l.id]?.practiced).length)
const last = computed(() => lessons.find(l => l.id === state.value.lastLesson))
onMounted(() => { load(); ready.value = true })
</script>
<template>
  <div class="course-progress">
    <p v-if="!ready">正在读取此浏览器中的学习记录……</p>
    <template v-else>
      <div class="progress-summary"><strong>{{ readCount }} / {{ lessons.length }}</strong><span>已读完 · {{ practicedCount }} 节练习由你确认完成</span></div>
      <progress :value="readCount" :max="lessons.length" :aria-label="`已读完 ${readCount} 节，共 ${lessons.length} 节`" />
      <p v-if="last"><a :href="withBase(last.path)">继续上次阅读：{{ last.title }} →</a></p>
      <p v-if="!storageAvailable" role="status">当前浏览器无法保存学习记录，你仍然可以阅读全部课程。</p>
      <ol class="lesson-list"><li v-for="lesson in lessons" :key="lesson.id"><a :href="withBase(lesson.path)"><strong>{{ lesson.title }}</strong><span>{{ lesson.outcome }}</span></a><div class="lesson-states"><span>{{ state.lessons[lesson.id]?.read ? '已读' : '未读' }}</span><span>{{ state.lessons[lesson.id]?.quiz ? '答题通过' : '未答题' }}</span><span>{{ state.lessons[lesson.id]?.practiced ? '练习已确认' : '练习待确认' }}</span></div></li></ol>
      <button v-if="!confirmReset" type="button" class="quiet-button" @click="confirmReset = true">清除这台设备的学习记录</button>
      <div v-else class="reset-confirm"><p>将清除本浏览器的阅读、答题与练习勾选。课程内容不受影响。</p><button type="button" @click="reset(); confirmReset = false">确认清除</button><button type="button" @click="confirmReset = false">保留记录</button></div>
    </template>
  </div>
</template>
