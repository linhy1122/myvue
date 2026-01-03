<template>
  <div class="category-container">
    <h2>货品类别管理</h2>

    <!-- 搜索和操作按钮区域 -->
    <div class="toolbar">
      <el-input v-model="searchQuery" placeholder="搜索类别名称或描述..." style="width: 300px; margin-right: 10px;" clearable
        @keyup.enter="handleSearch">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="openAddDialog">添加类别</el-button>
    </div>

    <!-- 类别列表表格 -->
    <el-table :data="paginatedCategoryList" stripe style="width: 100%; margin-top: 20px;" v-loading="loading">
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="name" label="类别名称" />
      <el-table-column prop="description" label="类别描述" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
            {{ scope.row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column prop="updatedAt" label="更新时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" :type="scope.row.status === 'active' ? 'warning' : 'success'"
            @click="toggleStatus(scope.row)">
            {{ scope.row.status === 'active' ? '禁用' : '启用' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20]"
      :background="true" layout="total, sizes, prev, pager, next, jumper" :total="filteredCategoryList.length"
      @size-change="handleSizeChange" @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: center; display: flex;" />

    <!-- 添加/编辑类别对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" :before-close="handleDialogClose">
      <el-form :model="currentCategory" :rules="categoryRules" ref="categoryFormRef" label-width="120px" status-icon>
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="currentCategory.name" placeholder="请输入类别名称" />
        </el-form-item>
        <el-form-item label="类别描述" prop="description">
          <el-input v-model="currentCategory.description" type="textarea" :rows="3" placeholder="请输入类别描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="currentCategory.status" active-value="active" inactive-value="inactive" active-text="启用"
            inactive-text="禁用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSave">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import type { Category } from '@/types'; // 假设你有定义 Category 类型

// 定义货品类别类型
interface CategoryInfo {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive'; // 'active' 表示启用, 'inactive' 表示禁用
  createdAt: string;
  updatedAt: string;
  // ... 其他可能的字段
}

// 模拟类别列表数据 (实际应用中从 API 加载)
const categoryList = ref<CategoryInfo[]>([
  { id: 1, name: '电子产品', description: '手机、电脑、平板等电子设备', status: 'active', createdAt: '2024-01-15 10:30:00', updatedAt: '2024-05-20 14:22:10' },
  { id: 2, name: '服装鞋帽', description: '各类服装、鞋子、帽子', status: 'active', createdAt: '2024-02-01 09:15:00', updatedAt: '2024-03-10 11:05:30' },
  { id: 3, name: '家居用品', description: '家具、厨具、装饰品等', status: 'inactive', createdAt: '2024-02-28 16:45:00', updatedAt: '2024-08-15 18:30:00' },
  // ... 更多初始数据
]);

const loading = ref(false); // 加载状态
const searchQuery = ref(''); // 搜索关键词
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页大小

// 对话框相关
const dialogVisible = ref(false);
const isAdding = ref(true); // true 表示添加，false 表示编辑
const currentCategory = reactive({
  id: 0,
  name: '',
  description: '',
  status: 'active' as 'active' | 'inactive', // 初始化为 'active'
  createdAt: '',
  updatedAt: '',
});
const categoryFormRef = ref<FormInstance>();

// 表单验证规则
const categoryRules: FormRules = {
  name: [
    { required: true, message: '请输入类别名称', trigger: 'blur' },
    { min: 1, max: 50, message: '类别名称长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  description: [
    { max: 200, message: '类别描述长度不能超过 200 个字符', trigger: 'blur' },
  ],
  // status 字段使用 switch，通常不需要必填验证
};

// 计算属性：根据搜索关键词过滤类别列表
const filteredCategoryList = computed(() => {
  if (!searchQuery.value) {
    return categoryList.value;
  }
  const query = searchQuery.value.toLowerCase();
  return categoryList.value.filter(category =>
    category.name.toLowerCase().includes(query) ||
    category.description.toLowerCase().includes(query)
  );
});

// 计算属性：分页后的数据
const paginatedCategoryList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredCategoryList.value.slice(start, end);
});

// 计算属性：对话框标题
const dialogTitle = computed(() => {
  return isAdding.value ? '添加类别' : '编辑类别';
});

// 搜索处理
const handleSearch = () => {
  // 搜索已经在 filteredCategoryList 中实现
  // 重置到第一页
  currentPage.value = 1;
};

// 打开添加对话框
const openAddDialog = () => {
  isAdding.value = true;
  // 重置表单
  Object.assign(currentCategory, {
    id: 0,
    name: '',
    description: '',
    status: 'active',
    createdAt: '',
    updatedAt: '',
  });
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (category: CategoryInfo) => {
  isAdding.value = false;
  // 将选中类别的信息复制到 currentCategory
  Object.assign(currentCategory, { ...category });
  dialogVisible.value = true;
};

// 保存（添加或更新）
const handleSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('保存类别信息:', { ...currentCategory });
      // 这里调用 API 添加或更新类别信息
      try {
        if (isAdding.value) {
          // 模拟添加 (实际应用中调用 add API)
          // const response = await addCategoryAPI(currentCategory);
          // const newCategory = response.data;
          const newCategory = {
            ...currentCategory,
            id: Date.now(), // 模拟生成 ID
            createdAt: new Date().toLocaleString(), // 模拟创建时间
            updatedAt: new Date().toLocaleString(), // 模拟更新时间
          };
          categoryList.value.push(newCategory as CategoryInfo);
          ElMessage.success('类别添加成功！');
        } else {
          // 模拟更新 (实际应用中调用 update API)
          // const response = await updateCategoryAPI(currentCategory);
          const index = categoryList.value.findIndex(c => c.id === currentCategory.id);
          if (index !== -1) {
            const updatedCategory = {
              ...currentCategory,
              updatedAt: new Date().toLocaleString(), // 更新时间
            };
            categoryList.value.splice(index, 1, updatedCategory as CategoryInfo);
          }
          ElMessage.success('类别更新成功！');
        }
        dialogVisible.value = false; // 保存后关闭对话框
      } catch (error: unknown) { // 明确标注 error 类型为 unknown
        console.error('保存失败:', error);

        let message = '保存失败，请稍后重试';
        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
          // 定义可能的错误响应结构
          interface ErrorResponse { message?: string; }
          const errObj = error as ErrorResponse;
          message = errObj.message ?? message;
        } else if (typeof error === 'string') {
          message = error;
        }

        ElMessage.error(message);
      }
    } else {
      console.log('表单验证失败!', fields);
      ElMessage.error('请检查输入信息');
    }
  });
};

// 删除类别
const handleDelete = (category: CategoryInfo) => {
  ElMessageBox.confirm(
    `此操作将永久删除类别 "${category.name}"，是否继续?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      // 这里调用 API 删除类别
      try {
        // await deleteCategoryAPI(category.id);
        // 模拟删除
        const index = categoryList.value.findIndex(c => c.id === category.id);
        if (index !== -1) {
          categoryList.value.splice(index, 1);
        }
        ElMessage.success('类别删除成功！');
        // 如果当前页没有数据了，且不是第一页，则回到上一页
        if (paginatedCategoryList.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }
      } catch (error: unknown) { // 明确标注 error 类型为 unknown
        console.error('删除失败:', error);

        let message = '删除失败，请稍后重试';
        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
          interface ErrorResponse { message?: string; }
          const errObj = error as ErrorResponse;
          message = errObj.message ?? message;
        } else if (typeof error === 'string') {
          message = error;
        }

        ElMessage.error(message);
      }
    })
    .catch(() => {
      // 用户取消删除
      ElMessage.info('已取消删除');
    });
};

// 切换类别状态 (启用/禁用)
const toggleStatus = async (category: CategoryInfo) => {
  const newStatus = category.status === 'active' ? 'inactive' : 'active';
  const actionText = newStatus === 'active' ? '启用' : '禁用';
  const confirmText = `此操作将${actionText}类别 "${category.name}"，是否继续?`;

  try {
    await ElMessageBox.confirm(confirmText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    // 这里调用 API 更新状态
    // await updateCategoryStatusAPI(category.id, newStatus);
    // 模拟更新状态
    const index = categoryList.value.findIndex(c => c.id === category.id);
    if (index !== -1) {
      categoryList.value[index].status = newStatus;
      categoryList.value[index].updatedAt = new Date().toLocaleString(); // 更新时间
    }
    ElMessage.success(`类别 "${category.name}" 已${actionText}！`);
  } catch (error: unknown) { // 捕获取消操作或 API 错误
    if (error !== 'cancel' && error !== 'close') { // Element Plus MessageBox 取消或关闭会抛出 'cancel' 或 'close'
      console.error(`切换${actionText}状态失败:`, error);

      let message = `切换${actionText}状态失败，请稍后重试`;
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        interface ErrorResponse { message?: string; }
        const errObj = error as ErrorResponse;
        message = errObj.message ?? message;
      } else if (typeof error === 'string') {
        message = error;
      }

      ElMessage.error(message);
    } else {
      // 用户取消操作
      ElMessage.info(`已取消${actionText}操作`);
    }
  }
};

// 关闭对话框
const handleDialogClose = (done?: () => void) => {
  // 如果有表单引用，则重置验证
  if (categoryFormRef.value) {
    categoryFormRef.value.clearValidate();
  }
  // 如果有 done 函数（el-dialog 的 before-close 钩子传入），则调用它
  if (done) {
    done();
  } else {
    // 否则直接关闭
    dialogVisible.value = false;
  }
};

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1; // 切换每页大小后回到第一页
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

// 组件挂载时加载数据 (如果需要从 API 加载)
onMounted(() => {
  // loadCategoryList(); // 如果需要从 API 加载，取消注释并实现此函数
});
</script>

<style scoped>
.category-container {
  padding: 20px;
  max-width: 1200px;
  /* 限制最大宽度 */
  margin: 0 auto;
  /* 居中 */
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
