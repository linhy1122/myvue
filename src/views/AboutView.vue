<template>
  <div class="about">
    <CialloItem />
    <!-- <audio src="/src/assets/ciallo.mp3 " autoplay='true' loop="true"></audio> -->
    <div @click="handleClick">
      <img alt="Vue logo" class="logo" src="@/assets/logo.jpg" width="125" height="125">
    </div>
    <audio ref="audioRef" preload="auto" @ended="isPlaying = false">
      <!-- 可以替换为你自己的音频文件 -->
      <source src="/src/assets/ciallo.mp3" type="audio/mpeg">

    </audio>
  </div>
</template>

<script setup lang="ts">
import CialloItem from '../components/CialloItem.vue';
import { ref } from 'vue';

// 音频元素引用
const audioRef = ref<HTMLAudioElement | null>(null);
// 播放状态标记：是否正在播放
const isPlaying = ref(false);

// 点击事件处理
const handleClick = () => {
  // 如果音频元素不存在或正在播放，则不执行操作
  if (!audioRef.value || isPlaying.value) return;

  try {
    // 重置音频到起点（确保每次播放都是完整的）
    audioRef.value.currentTime = 0;
    // 开始播放
    audioRef.value.play();
    // 更新状态为“正在播放”
    isPlaying.value = true;
  } catch (error) {
    console.error('播放失败:', error);
    alert('音频播放失败，请检查浏览器设置');
  }
};

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
