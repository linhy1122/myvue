<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { el } from 'element-plus/es/locales.mjs';
import ciallo from './components/ciallo.vue';
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
        <ciallo />
        <ciallo />
        <ciallo />
        <ciallo />

        <audio controls src="/src/assets/ciallo.mp3 "></audio>
        <!-- <span id="ciallo-text" class="shake-text"><span style="animation-delay: 0.0935655s;">C</span><span
            style="animation-delay: 0.318393s;">i</span><span style="animation-delay: 0.413155s;">a</span><span
            style="animation-delay: 0.24062s;">l</span><span style="animation-delay: 0.173003s;">l</span><span
            style="animation-delay: 0.248909s;">o</span><span style="animation-delay: 0.377515s;">～</span><span
            style="animation-delay: 0.0979662s;">(</span><span style="animation-delay: 0.25305s;">∠</span><span
            style="animation-delay: 0.18591s;">・</span><span style="animation-delay: 0.28715s;">ω</span><span
            style="animation-delay: 0.432797s;">&lt;</span><span style="animation-delay: 0.0389441s;">
          </span><span style="animation-delay: 0.0406722s;">)</span><span
            style="animation-delay: 0.111785s;">⌒</span><span style="animation-delay: 0.306224s;">★</span></span> -->
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




  .shake-text {
    font-size: 24px;
    display: inline-block;
  }

  .shake-text span {
    display: inline-block;
    animation: shake 0.5s infinite, colorChange 2s infinite;
  }

  @keyframes shake {
    0% {
      transform: translate(0, 0);
    }

    25% {
      transform: translate(-1px, -1px);
    }

    50% {
      transform: translate(1px, 1px);
    }

    75% {
      transform: translate(-1px, 1px);
    }

    100% {
      transform: translate(1px, -1px);
    }
  }

  @keyframes colorChange {
    0% {
      color: red;
    }

    25% {
      color: blue;
    }

    50% {
      color: green;
    }

    75% {
      color: orange;
    }

    100% {
      color: purple;
    }
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
