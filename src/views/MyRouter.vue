<template>
  <div class="my-router-container">
    <h1>My Router 页面</h1>

    <div class="router-links">
      <router-link to="/myrouter/login">登录页面</router-link> |
      <router-link to="/myrouter/register">注册页面</router-link>
    </div>
    <div class="button-group">
      <button @click="goToHomeByPath">通过path跳转到首页</button>
      <button @click="goToHomeByName">通过name跳转到首页</button>
      <button @click="replaceToHome">通过replace跳转到首页</button>
    </div>

    <!-- 嵌套路由视图 -->
    <router-view class="nested-view"></router-view>
  </div>
</template>

<script>
export default {
  name: "MyRouter",

  methods: {
    // 导航方法
    goToHomeByPath() {
      console.log(
        "%c[导航操作]",
        "color: #9b59b6; font-weight: bold;",
        "通过 path 跳转到首页"
      );
      this.$router.push("/");
    },

    goToHomeByName() {
      console.log(
        "%c[导航操作]",
        "color: #9b59b6; font-weight: bold;",
        "通过 name 跳转到首页"
      );
      this.$router.push({ name: "Home" });
    },

    replaceToHome() {
      console.log(
        "%c[导航操作]",
        "color: #9b59b6; font-weight: bold;",
        "通过 replace 跳转到首页"
      );
      this.$router.replace("/");
    },
  },

  // 路由守卫
  beforeRouteEnter(to, from, next) {
    console.log(
      "%c[beforeRouteEnter]",
      "color: #42b883; font-weight: bold;",
      "导航进入组件前触发",
      "\nFrom:",
      from.path,
      "\nTo:",
      to.path
    );

    // 模拟异步操作
    setTimeout(() => {
      // 通过 next 回调获取组件实例
      next((vm) => {
        console.log(
          "%c[beforeRouteEnter]",
          "color: #42b883;",
          "组件实例已创建，允许导航"
        );
      });
    }, 800);
  },

  beforeRouteUpdate(to, from, next) {
    console.log(
      "%c[beforeRouteUpdate]",
      "color: #3498db; font-weight: bold;",
      "路由参数已变化，但组件被复用",
      "\nFrom:",
      from.fullPath,
      "\nTo:",
      to.fullPath
    );

    next(); // 必须调用 next() 以继续导航
  },

  beforeRouteLeave(to, from, next) {
    console.log(
      "%c[beforeRouteLeave]",
      "color: #e74c3c; font-weight: bold;",
      "即将离开当前路由",
      "\nFrom:",
      from.fullPath,
      "\nTo:",
      to.fullPath
    );

    const answer = confirm("确定要离开 MyRouter 页面吗？");
    if (answer) {
      next();
    } else {
      next(false); // 取消导航
    }
  },

  mounted() {
    console.log("%c[MyRouter] 组件已挂载", "color: #9b59b6; font-weight: bold;");
  },
};
</script>

<style scoped>
.my-router-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.button-group {
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

.nested-view {
  margin-top: 30px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 200px;
  background-color: #f9f9f9;
}
</style>
