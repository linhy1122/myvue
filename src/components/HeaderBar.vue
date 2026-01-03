<!-- components/Header.vue -->
<template>
  <el-header class="header">
    <div class="header-content">
      <div class="logo-section">
        <img alt="Vue logo" class="logo" src="@/assets/logo.jpg" width="60" height="60" />
        <h1 class="app-title">
          <CialloItem />仓储管理系统
        </h1>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="$router.push('/Home')">首页</el-button>
        <el-button @click="$router.push('/about')">关于</el-button>
        <el-button @click="$router.push('/ciallo')">Ciallo</el-button>
        <!-- 如果用户已登录，隐藏登录按钮；如果未登录，显示登录按钮 -->
        <!-- 从 Pinia Store 获取登录状态 -->
        <el-button v-if="!authStore.isLoggedIn" @click="$router.push('/login')">登录</el-button>
        <!-- 如果用户已登录，显示登出按钮 -->
        <LogOutButton v-if="authStore.isLoggedIn" />
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
// import { computed } from 'vue'; // 不再需要 computed
// import { useRoute, useRouter } from 'vue-router'; // 如果不需要路由钩子，可以不导入
import { useAuthStore } from '@/stores/auth'; // 导入 auth store
import CialloItem from '@/components/CialloItem.vue'
import LogOutButton from '@/components/LogOutButton.vue'; // 假设 LogOutButton 组件路径

// 使用 useRouter 和 useRoute 钩子 (如果需要的话)
// const router = useRouter();
// const route = useRoute();

// --- 修改点：使用 Pinia Store 的状态 ---
const authStore = useAuthStore(); // 获取 auth store 实例

// --- 移除旧的 computed 属性 ---
// const isLoggedIn = computed(() => {
//   // 检查 localStorage 中是否有 token
//   // 或者检查 Pinia/Vuex store 中的状态
//   return !!localStorage.getItem('authToken'); // !! 将值转换为布尔值
// });

// 如果需要在组件内部执行路由跳转，可以使用 router.push
// const goToHome = () => {
//   router.push('/Home');
// };
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 100%;
  color: white;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-right {
  display: flex;
  gap: 10px;
}
</style>
