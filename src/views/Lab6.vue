<template>
  <div>

      <router-link to="/">首页</router-link> |
      <router-link to="/about">关于</router-link> |
      <router-link to="/myRouter">MyRouter</router-link>

    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Lab6View'
});
</script>

<style scoped>
</style>
