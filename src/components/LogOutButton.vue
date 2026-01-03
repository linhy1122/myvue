<!-- LogoutButton.vue -->
<template>
  <!-- <button @click="logout" :disabled="isLoggingOut">
    {{ isLoggingOut ? '退出中...' : '退出登录' }}
  </button> -->
  <!-- 或者使用 Element Plus 的按钮 -->

  <el-button type="info" @click="logout" :loading="isLoggingOut" plain>
    退出登录
  </el-button>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 如果你使用 vue-router
import { ElMessage } from 'element-plus'; // 如果你使用 Element Plus 的消息提示
import { useAuthStore } from '@/stores/auth'; // 导入 auth store

const router = useRouter(); // 获取路由器实例
const authStore = useAuthStore(); // 获取 auth store 实例
const isLoggingOut = ref(false); // 用于控制按钮加载状态

const logout = async () => {
  // 防止重复点击
  if (isLoggingOut.value) return;

  isLoggingOut.value = true;

  try {
    // --- 核心修改：使用 Store 的方法来清除 Token ---
    // 这会同时清除 Pinia Store 和 localStorage 中的 token
    authStore.clearToken();

    // --- 可选：执行其他登出逻辑 ---
    // 例如：调用后端 API 使 token 失效 (通常在 SPA 中不强制需要)
    // await apiCallToBackendToInvalidateToken();

    // --- 登出成功后的操作 ---
    ElMessage.success('已成功退出登录'); // 显示成功消息

    // 重定向到登录页或其他公共页面
    // 注意：如果当前页面是 /login，重定向到 /login 可能导致问题，需要根据实际情况调整
    await router.push('/login');

    // 可选：刷新页面以确保完全清理客户端状态（例如，清除内存中的数据）
    // window.location.reload();
    // 注意：刷新页面通常不是必需的，通过路由跳转和状态管理（如 Pinia/Vuex）通常就足够了。

  } catch (error) {
    console.error('Logout error:', error);
    ElMessage.error('退出登录失败，请稍后重试'); // 显示错误消息
  } finally {
    isLoggingOut.value = false; // 重置加载状态
  }
};
</script>

<style scoped>
/* 你可以根据需要添加样式 */
button {
  padding: 8px 16px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #f78989;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
