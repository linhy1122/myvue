<template>
  <div id="left-navigator">
    <!-- 左侧导航栏 -->
    <!-- 使用 v-bind:width 动态设置宽度 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar"> <!-- 或者使用 '60px' 等其他折叠后的宽度 -->
      <!-- 折叠/展开按钮 -->
      <el-button @click="toggleCollapse" text :icon="isCollapse ? DArrowRight : DArrowLeft"
        class="collapse-toggle-button">
      </el-button>

      <!-- 主菜单 (可折叠) -->
      <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
        @close="handleClose" background-color="#f5f5f5" text-color="#333" active-text-color="#409EFF">
        <el-menu-item index="0">
          <el-icon>
            <House />
          </el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="1">
          <el-icon>
            <User />
          </el-icon>
          <template #title>用户信息管理</template>
        </el-menu-item>

        <el-menu-item index="2">
          <el-icon>
            <UserFilled />
          </el-icon>
          <template #title>个人信息管理</template>
        </el-menu-item>

        <el-menu-item index="3">
          <el-icon>
            <Menu />
          </el-icon>
          <template #title>企业基本信息管理</template>
        </el-menu-item>

        <el-menu-item index="4">
          <el-icon>
            <OfficeBuilding />
          </el-icon>
          <template #title>仓库管理</template>
        </el-menu-item>


        <el-menu-item index="5">
          <el-icon>
            <CollectionTag />
          </el-icon>
          <template #title>货品类别管理</template>
        </el-menu-item>

        <el-menu-item index="6">
          <el-icon>
            <Box />
          </el-icon>
          <template #title>货品信息管理</template>
        </el-menu-item>

        <el-menu-item index="7">
          <el-icon>
            <Van />
          </el-icon>
          <template #title>出入库管理</template>
        </el-menu-item>

        <el-menu-item index="8">
          <el-icon>
            <Operation />
          </el-icon>
          <template #title>权限管理</template>
        </el-menu-item>

        <el-sub-menu index="9">
          <template #title>
            <el-icon>
              <TrendCharts />
            </el-icon>
            <span>数据统计分析</span>
          </template>
          <el-menu-item index="9-1">
            <template #title>数据统计分析1</template>
          </el-menu-item>
          <el-menu-item index="9-2">
            <template #title>数据统计分析2</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { User, UserFilled, Menu, Document, Setting, DArrowRight, DArrowLeft } from '@element-plus/icons-vue';
import { fa } from 'element-plus/es/locales.mjs';

defineOptions({
  name: 'LeftNavigator'
});

const isCollapse = ref(false);

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style scoped>
/* 推荐使用 scoped 样式 */
#left-navigator {
  /* 可以在这里为整个侧边栏容器添加样式 */
  height: 100%;
  /* 示例：如果需要占满父容器高度 */
  transition: width 0.3s ease-in-out;
  /* 添加过渡效果到侧边栏容器 */
}

.sidebar {
  /* 可选：移除或调整其他可能影响宽度的样式 */
  /* border-right: solid 1px #e6e6e6; */
  /* box-sizing: border-box; */
  /* 确保 padding 和 border 不会增加总宽度 */
  transition: width 0.3s ease-in-out;
  /* 为 .sidebar 元素（el-aside）添加过渡效果 */
}

/* 为折叠/展开按钮添加样式 */
.collapse-toggle-button {
  margin: 10px;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.3s;
  /* 按钮自身的过渡效果 */
}

/* 可选：悬停效果 */
.collapse-toggle-button:hover {
  background-color: #ecf5ff;
  color: #409EFF;
}

/* 菜单样式 */
/* 注意：Element Plus 的 el-menu 在 collapse 时会自动调整宽度，通常不需要为展开状态单独设置宽度 */
/* .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
} */
/* 但如果你想覆盖默认的折叠宽度（Element Plus 默认折叠宽度约为 64px），可以设置 .el-menu--collapse */
/* .el-menu--collapse {
  width: 60px;
} */
</style>
