<template>
  <div id="left-navigator">
    <!-- 可折叠的左侧内容侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="right-sidebar"> <!-- 假设默认展开时宽度为 220px -->
      <div class="sidebar-content" :class="{ 'collapsed': isCollapse }">
        <!-- 折叠/展开按钮 -->
        <el-button @click="toggleCollapse" text :icon="isCollapse ? DArrowRight : DArrowLeft"
          class="collapse-toggle-button">
        </el-button>

        <!-- 只有在展开时才显示详细内容 -->
        <template v-if="!isCollapse">
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
        </template>
      </div>
    </el-aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DArrowRight, DArrowLeft } from '@element-plus/icons-vue';

// --- 原有逻辑 ---
defineOptions({
  name: 'LeftNavigator'
});

const isCollapse = ref(false);

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
</script>

<style scoped>
/* 保持原有样式不变 */
#left-navigator {
  height: 100%;
  /* transition: width 0.3s ease-in-out; */
  /* 这个对父容器没用，因为父容器本身宽度不变 */
}

.right-sidebar {
  background-color: #fafafa;
  border-left: 1px solid #e4e7ed;
  transition: width 0.3s ease-in-out;
  /* 为侧边栏宽度变化添加过渡 */
  overflow: hidden;
  /* 隐藏溢出内容 */
  display: flex;
  /* 使用 flex 布局 */
  flex-direction: column;
  /* 垂直排列 */
  height: 100%;
  flex-shrink: 0;
  /* 防止侧边栏被压缩 */
  /* width: 280px; /* 移除固定宽度，由 props 控制 */

}

.sidebar-content {
  padding: 20px;
  flex-grow: 1;
  /* 让内容区域填充剩余空间 */
  position: relative;
  /* 为按钮定位做准备 */
}

/* 折叠时的内容样式 */
.sidebar-content.collapsed {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 居中对齐按钮 */
  justify-content: center;
  /* 居中对齐按钮 */
  padding: 0;
  /* 折叠时移除内边距 */
  height: 100%;
}

.collapse-toggle-button {
  /* margin: 10px; */
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.3s;
  margin-left: auto;
  /* 默认按钮在右侧 */
  margin-right: 10px;
  /* 与边框保持距离 */
  margin-top: 10px;
  /* align-self: flex-end; /* 在展开状态下将按钮对齐到右侧 */

}

.sidebar-content.collapsed .collapse-toggle-button {
  margin: 0 auto;
  /* 在折叠状态下将按钮居中 */
  margin-top: 0;
  /* 调整居中时的上边距 */
}

.collapse-toggle-button:hover {
  background-color: #ecf5ff;
  color: #409EFF;
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
</style>
