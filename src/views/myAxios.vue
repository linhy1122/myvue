<template>
  <div>
    <el-button @click="SentGet">GetList</el-button>
    <el-button @click="SentPost">Post</el-button>
    <el-button @click="SentPostJson">PostJson</el-button>

    <p>封装：</p>
    <el-button @click="myGet()">Get</el-button>
    <el-button @click="myPost()">Post</el-button>
    <el-button @click="myPostJson()">PostJson</el-button>

    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { myGet, myPost, myPostJson } from "../api/modules/test.js";
import { get } from "../api/axios.js";

export default defineComponent({
  name: "MyAxios",
  methods: {
    async myGet() {
      try {
        // myGet 通常接收 query 参数对象（可选）
        const res = await myGet({}); // 如果后端不需要参数，传 {}
        console.log("封装 GET 成功:", res);
      } catch (error) {
        console.error("封装 GET 失败:", error);
      }
    },

    async myPost() {
      try {
        // myPost 通常接收 body 参数对象
        const res = await myPost({ id: "123" });
        console.log("封装 POST 成功:", res);
      } catch (error) {
        console.error("封装 POST 失败:", error);
      }
    },
    async myPostJson() {
      try {
        // myPostJson 通常接收 JSON 对象
        const res = await myPostJson({ name: "李四" });
        console.log("封装 POST JSON 成功:", res);
      } catch (error) {
        console.error("封装 POST JSON 失败:", error);
      }
    },

    SentGet() {
      // 使用封装好的 get 函数，它内部使用 apiService，会自动添加 token
      get("/user/list") // 相对于 baseURL 的路径
        .then((response) => {
          console.log("GET请求成功:", response); // 注意：如果 axios.js 的响应拦截器处理了 res.data，这里拿到的就是业务数据部分
        })
        .catch((error) => {
          console.error("GET请求失败:", error);
        });
    },

    SentPost() {
      // 注意：后端接口路径是 /api/postTest，不是 /api/post
      // 后端接收的是字符串参数id
      const params = new URLSearchParams();
      params.append("id", "123");

      axios
        .post("http://localhost:8899/Storage/api/postTest", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          console.log("POST表单请求成功:", response.data);
        })
        .catch((error) => {
          console.error("POST表单请求失败:", error);
        });
    },
    SentPostJson() {
      // 注意：后端只使用了name字段，根据UserEntity结构
      // 只发送必要的字段以匹配后端期望
      const jsonData = {
        name: "李四",
        // 注意：根据后端代码，只使用了user.getName()，所以只发送name字段
        // 如果UserEntity有其他必填字段，需要根据实际情况添加
      };

      axios
        .post("http://localhost:8899/Storage/api/postJson", jsonData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("POST JSON请求成功:", response.data);
        })
        .catch((error) => {
          console.error("POST JSON请求失败:", error);
        });
    },
  },
});
</script>

<style scoped></style>
