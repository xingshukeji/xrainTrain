<script setup>
import { computed, ref } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter } = useData()
const clip = computed(() => frontmatter.value.video)
const player = ref(null)
const pendingTime = ref(null)
const message = ref('')
const failed = ref(false)
const timestamp = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

function seek() {
  if (pendingTime.value === null || !player.value || player.value.readyState < 1) return
  player.value.currentTime = pendingTime.value
  pendingTime.value = null
}

function jump(chapter) {
  player.value.pause()
  pendingTime.value = chapter.at
  if (player.value.readyState >= 1) seek()
  else player.value.load()
  message.value = `已定位：${chapter.title}。点击视频播放，或在视频上按空格键。`
  player.value.scrollIntoView({ block: 'center', behavior: 'auto' })
  player.value.focus({ preventScroll: true })
}
</script>

<template>
  <section v-if="clip" class="course-video" aria-label="平台操作实录">
    <video ref="player" controls playsinline preload="metadata" tabindex="0"
      :poster="withBase(clip.poster)" :aria-label="clip.title"
      @loadedmetadata="seek" @error="failed = true">
      <source :src="withBase(clip.src)" type="video/mp4">
      <track kind="captions" :src="withBase(clip.captions)" srclang="zh" label="中文字幕">
      当前浏览器不支持视频播放。请下载视频，或阅读下方文字步骤。
    </video>
    <p class="video-help">{{ clip.description }}</p>
    <p v-if="failed" role="alert">视频暂时无法加载。可下载后播放，或先按下方文字步骤学习。</p>
    <ol class="video-chapters" aria-label="选择视频章节">
      <li v-for="chapter in clip.chapters" :key="chapter.at">
        <button type="button" @click="jump(chapter)">
          <span class="chapter-time">{{ timestamp(chapter.at) }}</span>{{ chapter.title }}
        </button>
      </li>
    </ol>
    <p class="video-status" role="status">{{ message }}</p>
    <p><a :href="withBase(clip.src)" download>下载完整视频</a> · <a :href="withBase(clip.captions)" download>下载中文字幕</a></p>
  </section>
</template>
