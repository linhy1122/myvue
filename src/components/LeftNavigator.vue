<template>
  <div id="left-navigator">
    <!-- 左侧导航栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <!-- 折叠/展开按钮 -->
      <el-button @click="toggleCollapse" text :icon="isCollapse ? DArrowRight : DArrowLeft"
        class="collapse-toggle-button">
      </el-button>

      <!-- 主菜单 (可折叠) -->
      <!-- 1. 将 default-active 绑定到计算属性 currentActiveIndex -->
      <!-- 2. 可选：给菜单添加 router 属性，但这会将 index 作为路由路径，不如手动处理灵活 -->
      <el-menu :default-active="currentActiveIndex" class="el-menu-vertical-demo" :collapse="isCollapse"
        @open="handleOpen" @close="handleClose" background-color="#f5f5f5" text-color="#333" active-text-color="#409EFF"
        @select="handleMenuSelect">
        <el-menu-item index="0" @click="navigateTo('Home')">
          <el-icon>
            <House />
          </el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <!-- 2. 移除 router-link 标签，并添加 @click 事件 -->
        <el-menu-item index="1" @click="navigateTo('UserManagement')">
          <el-icon>
            <User />
          </el-icon>
          <template #title>用户信息管理</template>
          <!-- <router-link to="/userManagement" /> -->
        </el-menu-item>

        <el-menu-item index="2" @click="navigateTo('PersonalInfo')"> <!-- 假设你有 PersonalInfo 路由 -->
          <el-icon>
            <UserFilled />
          </el-icon>
          <template #title>个人信息管理</template>
        </el-menu-item>

        <el-menu-item index="3" @click="navigateTo('CompanyInfo')"> <!-- 假设你有 CompanyInfo 路由 -->
          <el-icon>
            <Menu />
          </el-icon>
          <template #title>企业基本信息管理</template>
        </el-menu-item>

        <el-menu-item index="4" @click="navigateTo('Warehouse')"> <!-- 假设你有 Warehouse 路由 -->
          <el-icon>
            <OfficeBuilding />
          </el-icon>
          <template #title>仓库管理</template>
        </el-menu-item>

        <el-menu-item index="5" @click="navigateTo('Category')"> <!-- 假设你有 Category 路由 -->
          <el-icon>
            <CollectionTag />
          </el-icon>
          <template #title>货品类别管理</template>
        </el-menu-item>

        <el-menu-item index="6" @click="navigateTo('Product')"> <!-- 假设你有 Product 路由 -->
          <el-icon>
            <Box />
          </el-icon>
          <template #title>货品信息管理</template>
        </el-menu-item>

        <el-menu-item index="7" @click="navigateTo('InOutStock')"> <!-- 假设你有 InOutStock 路由 -->
          <el-icon>
            <Van />
          </el-icon>
          <template #title>出入库管理</template>
        </el-menu-item>

        <el-menu-item index="8" @click="navigateTo('Permission')"> <!-- 假设你有 Permission 路由 -->
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
          <el-menu-item index="9-1" @click="navigateTo('DataStats1')"> <!-- 假设你有 DataStats1 路由 -->
            <template #title>数据统计分析1</template>
          </el-menu-item>
          <el-menu-item index="9-2" @click="navigateTo('DataStats2')"> <!-- 假设你有 DataStats2 路由 -->
            <template #title>数据统计分析2</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { User, UserFilled, Menu, Document, Setting, DArrowRight, DArrowLeft, House, OfficeBuilding, CollectionTag, Box, Van, Operation, TrendCharts } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router'; // 1. 导入 useRoute 和 useRouter

// --- 新增计算属性 ---
const route = useRoute(); // 获取当前路由
const router = useRouter(); // 获取路由实例

// 计算当前应该激活的菜单项索引
// 这里可以根据路由的 name 或 path 来映射到对应的 index
const currentActiveIndex = computed(() => {
  const name = route.name;
  // 根据路由 name 映射到菜单项的 index
  // 你需要维护这个映射关系，或者根据 path 的一部分来判断
  switch (name) {
    case 'Home':
      return '0';
    case 'UserManagement': // 路由 UserManagement 对应 index "1"
      return '1';
    case 'PersonalInfo': // 示例：假设 '个人信息管理' 对应路由名 'PersonalInfo'
      return '2';
    case 'CompanyInfo': // 示例
      return '3';
    case 'Warehouse': // 示例
      return '4';
    case 'Category': // 示例
      return '5';
    case 'Product': // 示例
      return '6';
    case 'InOutStock': // 示例
      return '7';
    case 'Permission': // 示例
      return '8';
    case 'DataStats1': // 示例
      return '9-1';
    // case 'DataStats2': // 示例
    //   return '9-2';
    default:
      return '0'; // 默认首页
  }
});

// --- 新增导航函数 ---
const navigateTo = (routeName: string) => {
  // 使用 router.push 跳转到指定路由
  // 确保这里的 routeName 与 router/index.ts 中定义的 name 一致
  router.push({ name: routeName });
};

// 如果你更喜欢基于 index 的 select 事件来导航 (可选)
const handleMenuSelect = (index: string) => {
  // console.log('Selected menu index:', index);
  // 你可以在这里根据 index 跳转，但上面的 @click 方式更直接
  // switch(index) {
  //   case '0': router.push({ name: 'Home' }); break;
  //   case '1': router.push({ name: 'UserManagement' }); break;
  //   // ... 其他 case
  // }
};

// --- 原有逻辑 ---
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
/* 保持原有样式不变 */
#left-navigator {
  height: 100%;
  transition: width 0.3s ease-in-out;
}

.sidebar {
  transition: width 0.3s ease-in-out;
}

.collapse-toggle-button {
  margin: 10px;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.collapse-toggle-button:hover {
  background-color: #ecf5ff;
  color: #409EFF;
}
</style>
