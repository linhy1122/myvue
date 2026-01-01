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
        <input type="pwd" id="pwd" v-model="pwd" required />
      </div>
      <!-- 点击这个按钮调用 loginPostJson 方法 -->
      <button type="submit" @click="loginPostJson">登录 (JSON)</button>
      <el-button @click="$router.push('/register')">注册</el-button>
    </form>

  </div>
</template>

<script>
import { defineComponent } from "vue";
// 假设你的 login.js 文件导出了 loginPostJson 函数
import { loginPostJson } from "../api/modules/login.js";
import { lo } from "element-plus/es/locales.mjs";

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
      alert(`登录信息: ${this.Account}`);
      // 这里可以添加实际登录逻辑
    },
    async loginPostJson() {
      try {
        console.log("发送登录请求 (JSON):", this.Account, this.pwd);
        const res = await loginPostJson({ Account: this.Account, pwd: this.pwd });
        console.log("封装 POST JSON 成功:", res.data);

        if (res.data.success) { // 假设后端返回 success: true 表示登录成功
          const token = res.data.token; // 从响应中获取 token
          console.log("登录成功，获取到 token:", token);

          // 将 token 存储到 localStorage
          localStorage.setItem('authToken', token);
          console.log("Token 已存储到 localStorage:" + localStorage.getItem('authToken'));

          // 可以在这里进行页面跳转等操作
          // this.$router.push('/dashboard'); // 例如跳转到首页
        } else {
          console.error("登录失败:", res.data.message); // 显示后端返回的错误信息
        }
      } catch (error) {
        console.error("封装 POST JSON 失败:", error);
        if (error.response) {
          // 服务器响应了错误状态码 (e.g., 401)
          console.error("服务器响应错误:", error.response.data);
        } else if (error.request) {
          // 请求已发出但没有收到响应
          console.error("请求发送失败，没有收到响应:", error.request);
        } else {
          // 其他错误
          console.error("请求配置错误:", error.message);
        }
      }
    },

    // login() {
    //   // 注意：后端接口路径是 /Hello/user/login
    //   // 注意：后端接收的是 @RequestBody LoginRequest request (JSON)，而不是 @RequestParam (Form Data)
    //   // 所以这个方法发送 Form Data 与后端不匹配，会失败。
    //   // 如果你只想测试 Form Data，需要修改后端为 @RequestParam
    //   const params = new URLSearchParams();
    //   params.append("Account", this.Account);
    //   params.append("pwd", this.pwd);
    //   // 注意：axios.postjson 是错误的写法，已修正为 axios.post
    //   // 但 Content-Type 未设置，axios 默认会根据数据类型设置，URLSearchParams 会被设置为 application/x-www-form-urlencoded
    //   axios
    //     .post("http://localhost:8899/Hello/user/login", params, {
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded", // 明确设置为 Form Data
    //       },
    //     })
    //     .then((response) => {
    //       console.log("POST表单请求成功:", response.data);
    //     })
    //     .catch((error) => {
    //       console.error("POST表单请求失败:", error);
    //     });
    // },

  },
});
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 8px 15px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 5px;
  /* 添加一点间距 */
}
</style>
