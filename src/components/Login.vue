<template>
  <div class="login-container">
    <h2>登录页面</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="Account">用户名:</label>
        <input type="text" id="Account" v-model="Account" required />
      </div>
      <div class="form-group">
        <label for="pwd">密码:</label>
        <input type="password" id="pwd" v-model="pwd" required /> <!-- 修改 type="pwd" 为 type="password" -->
      </div>
      <!-- 点击这个按钮调用 loginPostJson 方法 -->
      <button type="submit" @click="loginPostJson">登录 (JSON)</button>
      <el-button @click="$router.push('/register')">注册</el-button>
    </form>
  </div>
</template>

<script>
import { defineComponent } from "vue";
// import { useRouter } from 'vue-router'; // 不需要导入 useRouter 了
import { useAuthStore } from '@/stores/auth'; // 导入 auth store
// 假设你的 login.js 文件导出了 loginPostJson 函数
import { loginPostJson } from "../api/modules/login.js";

export default defineComponent({
  name: "Login",
  data() {
    return {
      Account: "",
      pwd: "",
    };
  },
  methods: {
    handleSubmit() {
      // 这里可以添加表单验证逻辑，但目前主要逻辑在 loginPostJson
      console.log("表单提交，但登录逻辑在 loginPostJson 方法中");
    },
    async loginPostJson() {
      try {
        console.log("发送登录请求 (JSON):", this.Account, this.pwd);
        const res = await loginPostJson({ Account: this.Account, pwd: this.pwd });
        console.log("封装 POST JSON 成功:", res.data);

        if (res.data && res.data.success) { // 假设后端返回 { success: true, token: '...' }
          const token = res.data.token; // 从响应中获取 token
          console.log("登录成功，获取到 token:", token);

          // --- 修改点：使用 Store 存储 token ---
          const authStore = useAuthStore(); // 获取 auth store 实例
          authStore.setToken(token); // 调用 store 的方法，它会自动同步到 localStorage

          console.log("Token 已通过 Store 存储到 localStorage:", localStorage.getItem('authToken'));

          // --- 修改点：使用 this.$router ---
          // this.$router 是 Vue Router 提供给组件实例的属性，在 Options API 中使用
          await this.$router.push('/Home'); // 使用 this.$router.push

        } else {
          // 处理登录失败，例如后端返回了错误信息
          console.error("登录失败:", res.data?.message || "未知错误");
          // 你可以在这里显示一个错误提示给用户
          // 例如：this.$message.error(res.data?.message || "登录失败");
        }
      } catch (error) {
        console.error("封装 POST JSON 失败:", error);
        if (error.response) {
          // 服务器响应了错误状态码 (e.g., 401)
          console.error("服务器响应错误:", error.response.data);
          console.error("状态码:", error.response.status);
          // 根据不同状态码显示不同错误信息
          if (error.response.status === 401) {
            console.error("用户名或密码错误");
            // this.$message.error("用户名或密码错误");
          } else if (error.response.status === 500) {
            console.error("服务器内部错误");
            // this.$message.error("服务器内部错误");
          } else {
            console.error("请求失败:", error.response.data.message || error.response.statusText);
            // this.$message.error(error.response.data.message || "请求失败");
          }
        } else if (error.request) {
          // 请求已发出但没有收到响应
          console.error("请求发送失败，没有收到响应:", error.request);
          // this.$message.error("网络错误，请检查连接");
        } else {
          // 其他错误
          console.error("请求配置错误:", error.message);
          // this.$message.error("请求配置错误");
        }
      }
    },
  },
});
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 5px rgba(66, 184, 131, 0.3);
}

button {
  padding: 10px 15px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 5px;
  width: 100%;
  font-size: 16px;
}

button:hover {
  background-color: #3aa876;
}

/* 如果你使用了 Element Plus 的 el-button，可以添加一些样式 */
.el-button {
  margin-top: 10px;
  width: 100%;
}
</style>
