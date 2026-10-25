<script setup>
import { computed } from 'vue'
import { useProgress } from '../use-progress.js'
const props = defineProps({ lesson: { type: String, required: true } })
const { state, storageAvailable, update } = useProgress()
const item = computed(() => state.value.lessons[props.lesson] || {})
</script>
<template>
  <section class="learning-record" aria-label="记录本节学习">
    <h2>记录这一节</h2>
    <p>按自己的完成情况勾选。</p>
    <label><input type="checkbox" :checked="item.read" @change="update(lesson, { read: $event.target.checked })" />我已读完，并能解释本节问题</label>
    <label><input type="checkbox" :checked="item.practiced" @change="update(lesson, { practiced: $event.target.checked })" />我已完成本节的“自己做一次”</label>
    <p class="small-text">仅保存在当前浏览器。清理网站数据或更换设备后不会保留。</p>
    <p v-if="!storageAvailable" role="status">浏览器未允许保存，本次勾选只在当前页面会话有效。</p>
  </section>
</template>
