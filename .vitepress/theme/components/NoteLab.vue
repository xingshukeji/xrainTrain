<script setup>
import { ref } from 'vue'
const draft = ref('你好，XRain')
const stored = ref('')
const readback = ref(null)
const message = ref('')
function save() { if (!draft.value.trim()) { message.value = '先输入便签内容。'; return }; stored.value = draft.value; readback.value = null; message.value = '模拟保存成功。现在点击重新读取。' }
function read() { readback.value = stored.value; message.value = '已从本页面的模拟记录读取。' }
</script>
<template>
  <section class="note-lab" aria-label="便签网页模拟">
    <p class="eyebrow">网页模拟 · 不连接 XRain</p>
    <p>试着区分输入框中的草稿和已经保存的值。刷新页面会清空模拟记录。</p>
    <label for="note-lab-content">内容</label><input id="note-lab-content" v-model="draft" type="text" maxlength="200" />
    <div class="flow-controls"><button type="button" @click="save">模拟保存</button><button type="button" :disabled="!stored" @click="read">重新读取</button></div>
    <p role="status">{{ message }}</p>
    <pre v-if="readback !== null"><code>{{ JSON.stringify({ recordId: '网页模拟记录', values: { content__c: readback } }, null, 2) }}</code></pre>
  </section>
</template>
