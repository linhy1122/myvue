<!-- eslint-disable vue/block-lang -->
<template>
  <div class="main-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-content">
        <div class="logo-section">
          <img alt="Vue logo" class="logo" src="@/assets/logo.jpg" width="60" height="60" />
          <h1 class="app-title">
            <CialloItem />App
          </h1>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="$router.push('/')">首页</el-button>
          <el-button @click="$router.push('/about')">关于</el-button>
          <el-button @click="$router.push('/ciallo')">Ciallo</el-button>
          <el-button @click="$router.push('/login')">登录</el-button>
        </div>
      </div>
    </el-header>

    <div class="page-content">
      <!-- 左侧导航栏 -->

      <!-- <el-aside width="220px" class="sidebar"> -->
      <LeftNavigator />
      <!-- </el-aside> -->

      <!-- 主内容区和右侧边栏 -->
      <el-container>
        <el-main class="main-area">
          <div class="content-wrapper">
            <RouterView />
          </div>
        </el-main>

        <!-- 右侧边栏 -->
        <el-aside width="280px" class="right-sidebar">
          <div class="sidebar-content">
            <h3>快速导航</h3>
            <el-button type="text" @click="$router.push('/')">返回首页</el-button>
            <el-button type="text" @click="$router.push('/about')">关于我们</el-button>
            <el-button type="text" @click="$router.push('/ciallo')">Ciallo页面</el-button>

            <div class="sidebar-card">
              <h4>系统信息</h4>
              <p>当前页面: {{ $route.name || $route.path }}</p>
              <p>当前时间: {{ new Date().toLocaleString() }}</p>
            </div>

            <div class="sidebar-card">
              <h4>用户状态</h4>
              <p>已登录</p>
              <p>用户: admin</p>
            </div>

            <div class="sidebar-card">
              <h4>通知中心</h4>
              <p>新消息: 3条</p>
              <p>待办事项: 5项</p>
            </div>
          </div>
        </el-aside>
      </el-container>
    </div>

    <!-- 页脚 -->
    <el-footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 Ciallo App. All rights reserved.</p>
        <div class="footer-links">
          <a href="#" @click.prevent>隐私政策</a>
          <a href="#" @click.prevent>服务条款</a>
          <a href="#" @click.prevent>联系我们</a>
        </div>
      </div>
    </el-footer>
  </div>
</template>

<style scoped>
.main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 1200px;
  /* 固定页面宽度 */
  margin: 0 auto;
  /* 居中显示 */
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  /* 与 isCollapse 配合，展开时的宽度 */
  min-height: 400px;
}

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

.page-content {
  display: flex;
  flex: 1;
  background-color: #f9f9f9;
}

.sidebar {
  background-color: #f5f5f5;
  border-right: 1px solid #e4e7ed;
  width: 220px;
  flex-shrink: 0;
  /* 防止侧边栏被压缩 */
  display: flex;
  /* 使用 flex 布局 */
  flex-direction: column;
  /* 垂直排列 */
  padding: 10px;
  /* 添加内边距 */
  overflow-y: auto;
  /* 如果内容过多，允许滚动 */
}

.sidebar-menu {
  border: none;
  /* height: 100%; */
  /* 不再需要占满高度，因为父元素是 flex column */
}

.main-area {
  padding: 20px;
  background-color: #fff;
  flex: 1;
}

.content-wrapper {
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
}

.demo-content {
  padding: 20px;
  margin-bottom: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.demo-content h2 {
  margin-top: 0;
  color: #333;
}

.right-sidebar {
  background-color: #fafafa;
  border-left: 1px solid #e4e7ed;
  width: 280px;
  padding: 20px;
  flex-shrink: 0;
  /* 防止侧边栏被压缩 */
}

.sidebar-content h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.sidebar-content .el-button {
  width: 100%;
  text-align: left;
  margin-bottom: 8px;
}

.sidebar-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar-card h4 {
  margin-top: 0;
  color: #333;
}

.sidebar-card p {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #bbb;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

.logo {
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* 响应式设计 - 在固定宽度下适配小屏幕 */
@media (max-width: 1220px) {
  .main-container {
    width: 100%;
    margin: 0;
  }

  .header-content {
    flex-direction: column;
    gap: 15px;
    padding: 10px;
  }

  .page-content {
    flex-direction: column;
  }

  .sidebar,
  .right-sidebar {
    width: 100%;
  }

  .main-area {
    padding: 10px;
  }

  .footer-content {
    flex-direction: column;
    gap: 10px;
  }
}

/* 动画效果 */
.content-wrapper {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<script lang="ts" setup>
import { House, InfoFilled, Star, Menu, Location, Document, Setting } from "@element-plus/icons-vue";
import { RouterLink, RouterView } from "vue-router";
import CialloItem from "./components/CialloItem.vue";
import LeftNavigator from "./components/LeftNavigator.vue";


// 不再需要 export default { components: { ... } }
</script>
