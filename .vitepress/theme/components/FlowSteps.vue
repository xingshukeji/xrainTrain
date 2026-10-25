<script setup>
import { computed, ref, useId, watch } from 'vue'
import { useData } from 'vitepress'
const { frontmatter } = useData()
const flow = computed(() => frontmatter.value.flow)
const index = ref(0)
const id = useId()
const current = computed(() => flow.value?.steps[index.value])
watch(flow, () => { index.value = 0 })
function captionLines(text) {
  const lines = []; let line = '', width = 0
  for (const char of text) {
    const size = /[^\x00-\x7f]/.test(char) ? 2 : 1
    if (width + size > 28) { lines.push(line); line = ''; width = 0 }
    line += char; width += size
  }
  if (line) lines.push(line)
  return lines
}
</script>
<template>
  <figure v-if="flow" class="flow-card">
    <figcaption>{{ flow.title }}</figcaption>
    <p class="flow-intro">{{ flow.description }}</p>
    <svg class="flow-svg" :viewBox="`0 0 380 ${flow.steps.length * 128 - 12}`" role="img" :aria-labelledby="`${id}-title ${id}-desc`">
      <title :id="`${id}-title`">{{ flow.title }}</title>
      <desc :id="`${id}-desc`">{{ flow.steps.map((step, i) => `${i + 1}. ${step.title}：${step.detail}`).join('；') }}</desc>
      <defs><marker :id="`${id}-arrow`" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="currentColor" stroke-width="1.5" /></marker></defs>
      <g v-for="(step, i) in flow.steps" :key="i" :transform="`translate(10 ${i * 128 + 4})`" :class="['flow-node', { selected: index === i }]">
        <rect x="0" y="0" width="360" height="100" rx="12" />
        <circle cx="30" cy="30" r="17" />
        <text x="30" y="36" text-anchor="middle" class="step-number">{{ i + 1 }}</text>
        <text x="60" y="34" class="step-title">{{ step.title }}</text>
        <text v-for="(line, j) in captionLines(step.caption)" :key="j" x="60" :y="61 + j * 24" class="step-caption">{{ line }}</text>
        <path v-if="i < flow.steps.length - 1" d="M180 104 V122" :marker-end="`url(#${id}-arrow)`" fill="none" stroke="currentColor" stroke-width="2" />
      </g>
    </svg>
    <div class="flow-controls" aria-label="分步图解">
      <button type="button" :disabled="index === 0" @click="index--">上一步</button>
      <span>{{ index + 1 }} / {{ flow.steps.length }}</span>
      <button type="button" :disabled="index === flow.steps.length - 1" @click="index++">下一步</button>
    </div>
    <div class="flow-detail" aria-live="polite"><strong>{{ current.title }}</strong><p>{{ current.detail }}</p></div>
    <details><summary>阅读完整文字说明</summary><ol><li v-for="step in flow.steps" :key="step.title"><strong>{{ step.title }}：</strong>{{ step.detail }}</li></ol></details>
  </figure>
</template>
