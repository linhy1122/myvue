<template>
  <div class="product-container">
    <h2>货品信息管理</h2>

    <!-- 搜索和操作按钮区域 -->
    <div class="toolbar">
      <el-input v-model="searchQuery" placeholder="搜索货品名称或条码..." style="width: 300px; margin-right: 10px;" clearable
        @keyup.enter="handleSearch">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="openAddDialog">添加货品</el-button>
    </div>

    <!-- 货品列表表格 -->
    <el-table :data="paginatedProductList" stripe style="width: 100%; margin-top: 20px;" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="货品图片" width="100">
        <template #default="scope">
          <el-image v-if="scope.row.image" :src="scope.row.image" :preview-src-list="[scope.row.image]"
            :preview-teleported="true" fit="cover" style="width: 50px; height: 50px; border-radius: 4px;"
            :lazy="true" />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="货品名称" show-overflow-tooltip />
      <el-table-column prop="barcode" label="条形码" width="150" />
      <el-table-column prop="price" label="价格" width="100">
        <template #default="scope"> ¥{{ scope.row.price.toFixed(2) }} </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="100" />
      <el-table-column prop="categoryName" label="所属类别" width="120" />
      <el-table-column prop="warehouseName" label="所在仓库" width="150" />
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="primary" @click="adjustStock(scope.row)">调整库存</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20]"
      :background="true" layout="total, sizes, prev, pager, next, jumper" :total="filteredProductList.length"
      @size-change="handleSizeChange" @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: center; display: flex;" />

    <!-- 添加/编辑货品对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" :before-close="handleDialogClose">
      <el-form :model="currentProduct" :rules="productRules" ref="productFormRef" label-width="100px" status-icon>
        <el-form-item label="货品名称" prop="name">
          <el-input v-model="currentProduct.name" placeholder="请输入货品名称" />
        </el-form-item>
        <el-form-item label="条形码" prop="barcode">
          <el-input v-model="currentProduct.barcode" placeholder="请输入条形码" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="currentProduct.price" :precision="2" :step="0.01" :min="0" placeholder="请输入价格"
            style="width: 100%;" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="currentProduct.stock" :min="0" placeholder="请输入库存数量" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="所属类别" prop="categoryId">
          <el-select v-model="currentProduct.categoryId" placeholder="请选择类别" style="width: 100%;" clearable>
            <el-option v-for="category in categoryList" :key="category.id" :label="category.name"
              :value="category.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所在仓库" prop="warehouseId">
          <el-select v-model="currentProduct.warehouseId" placeholder="请选择仓库" style="width: 100%;" clearable>
            <el-option v-for="warehouse in warehouseList" :key="warehouse.id" :label="warehouse.name"
              :value="warehouse.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="货品图片" prop="image">
          <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
            :on-success="handleImageSuccess" :on-error="handleImageError" :before-upload="beforeImageUpload"
            :headers="{ 'Authorization': `Bearer ${token}` }">
            <img v-if="currentProduct.image" :src="currentProduct.image" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSave">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 调整库存对话框 -->
    <el-dialog v-model="stockDialogVisible" title="调整库存" width="400px" :before-close="handleStockDialogClose">
      <el-form :model="stockAdjustment" label-width="100px">
        <el-form-item label="货品名称">
          <span>{{ stockAdjustment.productName }}</span>
        </el-form-item>
        <el-form-item label="当前库存">
          <span>{{ stockAdjustment.currentStock }}</span>
        </el-form-item>
        <el-form-item label="调整数量" prop="adjustment">
          <el-input-number v-model="stockAdjustment.adjustment" :min="1" placeholder="请输入调整数量" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="调整类型" prop="type">
          <el-radio-group v-model="stockAdjustment.type">
            <el-radio label="increase">增加</el-radio>
            <el-radio label="decrease">减少</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleStockDialogClose">取消</el-button>
          <el-button type="primary" @click="confirmStockAdjust">确认调整</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { Search, Plus } from '@element-plus/icons-vue';
import type { Product, Category, Warehouse } from '@/types'; // 假设你有定义这些类型

// 定义货品类型
interface ProductInfo {
  id: number;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  categoryId: number;
  warehouseId: number;
  image?: string; // 图片 URL
  // ... 其他可能的字段
}

// 定义库存调整类型
interface StockAdjustmentInfo {
  productId: number;
  productName: string;
  currentStock: number;
  adjustment: number;
  type: 'increase' | 'decrease';
}

// 模拟货品列表数据 (实际应用中从 API 加载)
const productList = ref<ProductInfo[]>([
  { id: 1, name: 'iPhone 15 Pro', barcode: '1234567890123', price: 7999.00, stock: 50, categoryId: 1, warehouseId: 1, image: 'https://via.placeholder.com/100' },
  { id: 2, name: 'Nike Air Max', barcode: '2345678901234', price: 899.00, stock: 100, categoryId: 2, warehouseId: 2, image: 'https://via.placeholder.com/100' },
  { id: 3, name: '宜家书桌', barcode: '3456789012345', price: 599.00, stock: 30, categoryId: 3, warehouseId: 1, image: 'https://via.placeholder.com/100' },
  // ... 更多初始数据
]);

// 模拟类别列表数据 (实际应用中从 API 加载)
const categoryList = ref<Category[]>([
  { id: 1, name: '电子产品', description: '手机、电脑、平板等电子设备', status: 'active', createdAt: '2024-01-15 10:30:00', updatedAt: '2024-05-20 14:22:10' },
  { id: 2, name: '服装鞋帽', description: '各类服装、鞋子、帽子', status: 'active', createdAt: '2024-02-01 09:15:00', updatedAt: '2024-03-10 11:05:30' },
  { id: 3, name: '家居用品', description: '家具、厨具、装饰品等', status: 'inactive', createdAt: '2024-02-28 16:45:00', updatedAt: '2024-08-15 18:30:00' },
]);

// 模拟仓库列表数据 (实际应用中从 API 加载)
const warehouseList = ref<Warehouse[]>([
  { id: 1, name: '北京主仓库', address: '北京市朝阳区物流园A区1号', contactPerson: '李经理', contactPhone: '13800138001' },
  { id: 2, name: '上海分仓库', address: '上海市浦东新区外高桥保税区B栋', contactPerson: '王主管', contactPhone: '13800138002' },
  { id: 3, name: '广州前置仓', address: '广东省广州市天河区智慧物流港C座', contactPerson: '张专员', contactPhone: '13800138003' },
]);

const loading = ref(false); // 加载状态
const searchQuery = ref(''); // 搜索关键词
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页大小

// 对话框相关
const dialogVisible = ref(false);
const isAdding = ref(true); // true 表示添加，false 表示编辑
const currentProduct = reactive({
  id: 0,
  name: '',
  barcode: '',
  price: 0,
  stock: 0,
  categoryId: 0,
  warehouseId: 0,
  image: '',
});
const productFormRef = ref<FormInstance>();

// 库存调整对话框相关
const stockDialogVisible = ref(false);
const stockAdjustment = reactive({
  productId: 0,
  productName: '',
  currentStock: 0,
  adjustment: 1,
  type: 'increase' as 'increase' | 'decrease',
});

// 假设的认证 token (实际应用中从 store 或 cookie 获取)
const token = 'your_auth_token_here';

// 表单验证规则
const productRules: FormRules = {
  name: [
    { required: true, message: '请输入货品名称', trigger: 'blur' },
    { min: 1, max: 100, message: '货品名称长度在 1 到 100 个字符', trigger: 'blur' },
  ],
  barcode: [
    { required: true, message: '请输入条形码', trigger: 'blur' },
    { pattern: /^\d{13}$/, message: '请输入13位数字条形码', trigger: 'blur' }, // 简单校验 EAN-13
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存必须大于等于0', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '请选择所属类别', trigger: 'change' },
  ],
  warehouseId: [
    { required: true, message: '请选择所在仓库', trigger: 'change' },
  ],
  // image 字段可能不需要必填验证，取决于业务需求
};

// 计算属性：根据搜索关键词过滤货品列表
const filteredProductList = computed(() => {
  if (!searchQuery.value) {
    return productList.value;
  }
  const query = searchQuery.value.toLowerCase();
  return productList.value.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.barcode.includes(query)
  );
});

// 计算属性：分页后的数据
const paginatedProductList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredProductList.value.slice(start, end);
});

// 计算属性：对话框标题
const dialogTitle = computed(() => {
  return isAdding.value ? '添加货品' : '编辑货品';
});

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1; // 搜索后回到第一页
};

// 打开添加对话框
const openAddDialog = () => {
  isAdding.value = true;
  // 重置表单
  Object.assign(currentProduct, {
    id: 0,
    name: '',
    barcode: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    warehouseId: 0,
    image: '',
  });
  dialogVisible.value = true;
};

// 打开编辑对话框
const openEditDialog = (product: ProductInfo) => {
  isAdding.value = false;
  // 将选中货品的信息复制到 currentProduct
  Object.assign(currentProduct, { ...product });
  dialogVisible.value = true;
};

// 保存（添加或更新）
const handleSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('保存货品信息:', { ...currentProduct });
      // 这里调用 API 添加或更新货品信息
      try {
        if (isAdding.value) {
          // 模拟添加 (实际应用中调用 add API)
          // const response = await addProductAPI(currentProduct);
          // const newProduct = response.data;
          const newProduct = { ...currentProduct, id: Date.now() }; // 模拟生成 ID
          productList.value.push(newProduct);
          ElMessage.success('货品添加成功！');
        } else {
          // 模拟更新 (实际应用中调用 update API)
          // const response = await updateProductAPI(currentProduct);
          const index = productList.value.findIndex(p => p.id === currentProduct.id);
          if (index !== -1) {
            productList.value.splice(index, 1, { ...currentProduct });
          }
          ElMessage.success('货品更新成功！');
        }
        dialogVisible.value = false; // 保存后关闭对话框
      } catch (error: unknown) {
        console.error('保存失败:', error);

        let message = '保存失败，请稍后重试';
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
    } else {
      console.log('表单验证失败!', fields);
      ElMessage.error('请检查输入信息');
    }
  });
};

// 删除货品
const handleDelete = (product: ProductInfo) => {
  ElMessageBox.confirm(
    `此操作将永久删除货品 "${product.name}"，是否继续?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      // 这里调用 API 删除货品
      try {
        // await deleteProductAPI(product.id);
        // 模拟删除
        const index = productList.value.findIndex(p => p.id === product.id);
        if (index !== -1) {
          productList.value.splice(index, 1);
        }
        ElMessage.success('货品删除成功！');
        if (paginatedProductList.value.length === 0 && currentPage.value > 1) {
          currentPage.value--; // 如果当前页没数据了，回到上一页
        }
      } catch (error: unknown) {
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
      ElMessage.info('已取消删除');
    });
};

// 打开库存调整对话框
const adjustStock = (product: ProductInfo) => {
  stockAdjustment.productId = product.id;
  stockAdjustment.productName = product.name;
  stockAdjustment.currentStock = product.stock;
  stockAdjustment.adjustment = 1;
  stockAdjustment.type = 'increase';
  stockDialogVisible.value = true;
};

// 确认库存调整
const confirmStockAdjust = async () => {
  const { productId, adjustment, type } = stockAdjustment;
  const index = productList.value.findIndex(p => p.id === productId);
  if (index === -1) {
    ElMessage.error('未找到该货品，调整失败');
    return;
  }

  const product = productList.value[index];
  let newStock = product.stock;

  if (type === 'increase') {
    newStock += adjustment;
  } else { // decrease
    if (adjustment > product.stock) {
      ElMessage.error('减少数量不能大于当前库存');
      return;
    }
    newStock -= adjustment;
  }

  try {
    // 这里调用 API 调整库存
    // await updateProductStockAPI(productId, newStock);
    // 模拟更新库存
    product.stock = newStock;
    product.updatedAt = new Date().toLocaleString(); // 模拟更新时间
    ElMessage.success(`${type === 'increase' ? '增加' : '减少'}库存 ${adjustment} 成功，当前库存: ${newStock}`);
    stockDialogVisible.value = false;
  } catch (error: unknown) {
    console.error('库存调整失败:', error);

    let message = '库存调整失败，请稍后重试';
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
};

// 图片上传相关方法
const handleImageSuccess = (response: any) => { // 这里的类型取决于你的上传接口返回格式
  console.log('图片上传成功:', response);
  // 假设接口返回 { url: '...' }
  currentProduct.image = response.url;
  ElMessage.success('图片上传成功');
};

const handleImageError = (error: any) => {
  console.error('图片上传失败:', error);
  ElMessage.error('图片上传失败');
};

const beforeImageUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG && !isPNG) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!');
    return false;
  }
  return true;
};

// 关闭货品对话框
const handleDialogClose = (done?: () => void) => {
  if (productFormRef.value) {
    productFormRef.value.clearValidate();
  }
  if (done) {
    done();
  } else {
    dialogVisible.value = false;
  }
};

// 关闭库存对话框
const handleStockDialogClose = (done?: () => void) => {
  if (done) {
    done();
  } else {
    stockDialogVisible.value = false;
  }
};

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

// 组件挂载时加载数据 (如果需要从 API 加载)
onMounted(() => {
  // loadProductList(); // 如果需要从 API 加载，取消注释并实现此函数
  // loadCategoryList(); // 如果需要从 API 加载，取消注释并实现此函数
  // loadWarehouseList(); // 如果需要从 API 加载，取消注释并实现此函数
});
</script>

<style scoped>
.product-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
  /* 确保图片填充且不变形 */
}
</style>
