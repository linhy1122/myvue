<template>
  <div class="warehouse-container">
    <h2>仓库管理</h2>

    <!-- 搜索和操作按钮区域 -->
    <div class="toolbar">
      <el-input v-model="searchQuery" placeholder="搜索仓库名称或地址..." style="width: 300px; margin-right: 10px;" clearable
        @keyup.enter="handleSearch">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="openAddDialog">添加仓库</el-button>
    </div>

    <!-- 仓库列表表格 -->
    <el-table :data="filteredWarehouseList" stripe style="width: 100%; margin-top: 20px;" v-loading="loading">
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="name" label="仓库名称" />
      <el-table-column prop="address" label="仓库地址" />
      <el-table-column prop="contactPerson" label="联系人" />
      <el-table-column prop="contactPhone" label="联系方式" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20]"
      :background="true" layout="total, sizes, prev, pager, next, jumper" :total="filteredWarehouseList.length"
      @size-change="handleSizeChange" @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: center; display: flex;" />

    <!-- 添加/编辑仓库对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" :before-close="handleDialogClose">
      <el-form :model="currentWarehouse" :rules="warehouseRules" ref="warehouseFormRef" label-width="120px" status-icon>
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="currentWarehouse.name" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="仓库地址" prop="address">
          <el-input v-model="currentWarehouse.address" type="textarea" :rows="3" placeholder="请输入仓库详细地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="currentWarehouse.contactPerson" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contactPhone">
          <el-input v-model="currentWarehouse.contactPhone" placeholder="请输入联系人电话" />
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
import type { Warehouse } from '@/types'; // 假设你有定义 Warehouse 类型

// 定义仓库类型
interface WarehouseInfo {
  id: number;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  // ... 其他可能的字段
}

// 定义错误类型接口 (可选，用于更精确的类型处理)
interface ErrorResponse {
  message?: string;
  // ... 其他可能的错误字段
}

// 模拟仓库列表数据 (实际应用中从 API 加载)
const warehouseList = ref<WarehouseInfo[]>([
  { id: 1, name: '北京主仓库', address: '北京市朝阳区物流园A区1号', contactPerson: '李经理', contactPhone: '13800138001' },
  { id: 2, name: '上海分仓库', address: '上海市浦东新区外高桥保税区B栋', contactPerson: '王主管', contactPhone: '13800138002' },
  { id: 3, name: '广州前置仓', address: '广东省广州市天河区智慧物流港C座', contactPerson: '张专员', contactPhone: '13800138003' },
  // ... 更多初始数据
]);

const loading = ref(false); // 加载状态
const searchQuery = ref(''); // 搜索关键词
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页大小

// 对话框相关
const dialogVisible = ref(false);
const isAdding = ref(true); // true 表示添加，false 表示编辑
const currentWarehouse = reactive({
  id: 0,
  name: '',
  address: '',
  contactPerson: '',
  contactPhone: '',
});
const warehouseFormRef = ref<FormInstance>();

// 表单验证规则
const warehouseRules: FormRules = {
  name: [
    { required: true, message: '请输入仓库名称', trigger: 'blur' },
    { min: 2, max: 50, message: '仓库名称长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  address: [
    { required: true, message: '请输入仓库地址', trigger: 'blur' },
  ],
  contactPerson: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/, message: '联系人姓名只能包含中文、英文和空格', trigger: 'blur' },
  ],
  contactPhone: [
    { required: true, message: '请输入联系人电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$|^(0\d{2,3}-?)?\d{7,8}$/, message: '请输入正确的手机号码或固定电话号码', trigger: 'blur' },
  ],
};

// 计算属性：根据搜索关键词过滤仓库列表
const filteredWarehouseList = computed(() => {
  if (!searchQuery.value) {
    return warehouseList.value;
  }
  const query = searchQuery.value.toLowerCase();
  return warehouseList.value.filter(warehouse =>
    warehouse.name.toLowerCase().includes(query) ||
    warehouse.address.toLowerCase().includes(query)
  );
});

// 计算属性：分页后的数据
const paginatedWarehouseList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredWarehouseList.value.slice(start, end);
});

// 计算属性：对话框标题
const dialogTitle = computed(() => {
  return isAdding.value ? '添加仓库' : '编辑仓库';
});

// 搜索处理
const handleSearch = () => {
  // 搜索已经在 filteredWarehouseList 中实现
  // 重置到第一页
  currentPage.value = 1;
};

// 打开添加对话框
const openAddDialog = () => {
  isAdding.value = true;
  // 重置表单
  Object.assign(currentWarehouse, {
    id: 0,
    name: '',
    address: '',
    contactPerson: '',
    contactPhone: '',
  });
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (warehouse: WarehouseInfo) => {
  isAdding.value = false;
  // 将选中仓库的信息复制到 currentWarehouse
  Object.assign(currentWarehouse, { ...warehouse });
  dialogVisible.value = true;
};

// 保存（添加或更新）
const handleSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('保存仓库信息:', { ...currentWarehouse });
      // 这里调用 API 添加或更新仓库信息
      try {
        if (isAdding.value) {
          // 模拟添加 (实际应用中调用 add API)
          // const response = await addWarehouseAPI(currentWarehouse);
          // const newWarehouse = response.data;
          const newWarehouse = { ...currentWarehouse, id: Date.now() }; // 模拟生成 ID
          warehouseList.value.push(newWarehouse);
          ElMessage.success('仓库添加成功！');
        } else {
          // 模拟更新 (实际应用中调用 update API)
          // const response = await updateWarehouseAPI(currentWarehouse);
          const index = warehouseList.value.findIndex(w => w.id === currentWarehouse.id);
          if (index !== -1) {
            warehouseList.value.splice(index, 1, { ...currentWarehouse });
          }
          ElMessage.success('仓库更新成功！');
        }
        dialogVisible.value = false; // 保存后关闭对话框
      } catch (error: unknown) { // 明确标注 error 类型为 unknown
        console.error('保存失败:', error);

        let message = '保存失败，请稍后重试';
        if (error instanceof Error) {
          // 如果 error 是 Error 实例，则使用其 message
          message = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
          // 如果 error 是对象且有 message 属性 (例如后端返回的错误对象)
          const errObj = error as ErrorResponse; // 类型断言
          message = errObj.message ?? message; // 使用可选链或默认值
        } else if (typeof error === 'string') {
          // 如果 error 是字符串
          message = error;
        }
        // 如果以上都不是，则使用默认的 message

        ElMessage.error(message);
      }
    } else {
      console.log('表单验证失败!', fields);
      ElMessage.error('请检查输入信息');
    }
  });
};

// 删除仓库
const handleDelete = (warehouse: WarehouseInfo) => {
  ElMessageBox.confirm(
    `此操作将永久删除仓库 "${warehouse.name}"，是否继续?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      // 这里调用 API 删除仓库
      try {
        // await deleteWarehouseAPI(warehouse.id);
        // 模拟删除
        const index = warehouseList.value.findIndex(w => w.id === warehouse.id);
        if (index !== -1) {
          warehouseList.value.splice(index, 1);
        }
        ElMessage.success('仓库删除成功！');
        // 如果当前页没有数据了，且不是第一页，则回到上一页
        if (paginatedWarehouseList.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }
      } catch (error: unknown) { // 明确标注 error 类型为 unknown
        console.error('删除失败:', error);

        let message = '删除失败，请稍后重试';
        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
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

// 关闭对话框
const handleDialogClose = (done?: () => void) => {
  // 如果有表单引用，则重置验证
  if (warehouseFormRef.value) {
    warehouseFormRef.value.clearValidate();
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
  // loadWarehouseList(); // 如果需要从 API 加载，取消注释并实现此函数
});
</script>

<style scoped>
.warehouse-container {
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
