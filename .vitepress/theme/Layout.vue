<script setup>
import { onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LearningRecord from './components/LearningRecord.vue'
import { useProgress } from './use-progress.js'
const { frontmatter } = useData()
const { load, update } = useProgress()
onMounted(() => {
  load()
  watch(() => frontmatter.value.lesson, id => { if (id) update(id, {}) }, { immediate: true })
})
</script>
<template>
  <DefaultTheme.Layout>
    <template #doc-after><LearningRecord v-if="frontmatter.lesson" :lesson="frontmatter.lesson" /></template>
  </DefaultTheme.Layout>
</template>
