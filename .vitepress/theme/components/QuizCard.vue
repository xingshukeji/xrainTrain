<script setup>
import { computed, ref, useId, watch } from 'vue'
import { useData } from 'vitepress'
import { useProgress } from '../use-progress.js'
const { frontmatter } = useData()
const quiz = computed(() => frontmatter.value.quiz)
const selected = ref(null)
const submitted = ref(false)
const id = useId()
const { update } = useProgress()
watch(quiz, () => { selected.value = null; submitted.value = false })
function submit() {
  if (selected.value === null) return
  submitted.value = true
  if (selected.value === quiz.value.answer && frontmatter.value.lesson) update(frontmatter.value.lesson, { quiz: true })
}
</script>
<template>
  <section v-if="quiz" class="quiz-card" aria-label="检查理解">
    <p class="eyebrow">停下来想一想</p>
    <fieldset><legend>{{ quiz.question }}</legend>
      <label v-for="(option, i) in quiz.options" :key="i" :class="{ picked: selected === i }"><input v-model="selected" type="radio" :name="id" :value="i" @change="submitted = false" />{{ option }}</label>
    </fieldset>
    <button class="primary-button" type="button" :disabled="selected === null" @click="submit">检查答案</button>
    <div v-if="submitted" class="quiz-feedback" aria-live="polite"><strong>{{ selected === quiz.answer ? '答对了。' : '再想想。' }}</strong> {{ quiz.explanations[selected] }}</div>
  </section>
</template>
