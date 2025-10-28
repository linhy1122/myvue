<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { el } from 'element-plus/es/locales.mjs';
// import logoImg from '@/assets/logo.jpg';
</script>

<!-- <template>
  <header>
    <div id="building">

      <img alt="Vue logo" class="logo" src="@/assets/logo.jpg" width="125" height="125" />
      <!-- <div class="demo-type">
        <el-avatar src="@/assets/logo.jpg" />
      </div> -->
<!-- <div class="wrapper">
        <HelloWorld msg="Ciallo!!!!!" />

        <nav>
          <RouterLink to="/">Ciallo</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/ciallo">Ciallo</RouterLink>
        </nav>
      </div>
    </div>
  </header>

  <RouterView />
</template> -->
<template>
  <header>
    <div id="building">
      <!-- header -->
      <el-container style="border: 2px red solid; width: 1200px; height: 100px;">
        <el-header><img alt="Vue logo" class="logo" src="@/assets/logo.jpg" width="125" height="125"></el-header>
        <el-container style="border: 2px yellow solid;  width: 1200px; height: 800px;">
          <!-- side -->
          <el-aside width="200px">
            <nav>
              <RouterLink to="/">Ciallo</RouterLink>
              <RouterLink to="/about">About</RouterLink>
              <RouterLink to="/ciallo">Ciallo</RouterLink>
            </nav>
          </el-aside>
          <el-container style="border: 2px purple solid; width: 800px; height: 800px;">
            <!-- main -->
            <el-main style="width: 800px;">
              <RouterView />
            </el-main>
          </el-container>
          <el-container style="border: 2px green solid; width: 200px; height: 800px;">
            <el-footer>
              <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.jpg" width="125" height="125"> -->
              <!-- <HelloWorld msg="Ciallo!!!!!" /> -->
            </el-footer>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </header>
</template>

<style scoped>
#building {

  backdrop-filter: blur(5px);
}

:deep(.el-avatar) {
  display: inline-block !important;
  /* 确保元素显示 */
  width: 100px !important;
  /* 强制宽度 */
  height: 100px !important;
  /* 强制高度 */
  border: 2px solid red !important;
  /* 强制边框（用于验证） */
  background: transparent !important;
  /* 去掉默认灰色背景 */
}

:deep(.el-avatar img) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  /* 确保图片充满容器 */
}

header {
  line-height: 1.5;
  /* max-height: 100vh; */
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }

  .scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  /* .demo-type {
    display: flex;
  }

  .demo-type>div {
    flex: 1;
    text-align: center;
  }

  .demo-type>div:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
  } */

}
</style>
