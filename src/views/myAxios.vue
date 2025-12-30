<template>
  <div>
    <el-button @click="SentGet">Get</el-button>
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
      axios
        .get("http://localhost:8899/Hello/api/get")
        .then((response) => {
          console.log("GET请求成功:", response.data);
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
        .post("http://localhost:8899/Hello/api/postTest", params, {
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
        .post("http://localhost:8899/Hello/api/postJson", jsonData, {
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
