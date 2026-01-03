<template>
  <div class="in-out-stock-container">
    <h2>出入库管理</h2>

    <!-- 操作按钮区域 -->
    <div class="toolbar">
      <el-button type="primary" @click="openInOutDialog('in')">新增入库</el-button>
      <el-button type="success" @click="openInOutDialog('out')">新增出库</el-button>
      <el-button type="warning" @click="openInOutDialog('transfer')">新增调货</el-button>
    </div>

    <!-- 搜索过滤区域 -->
    <div class="filter-bar">
      <el-select v-model="filterType" placeholder="操作类型" style="width: 150px; margin-right: 10px;" clearable>
        <el-option label="入库" value="in" />
        <el-option label="出库" value="out" />
        <el-option label="调货" value="transfer" />
      </el-select>
      <el-select v-model="filterWarehouseId" placeholder="仓库" style="width: 150px; margin-right: 10px;" clearable>
        <el-option v-for="warehouse in warehouseList" :key="warehouse.id" :label="warehouse.name"
          :value="warehouse.id" />
      </el-select>
      <el-input v-model="filterProductKeyword" placeholder="搜索货品名称或条码" style="width: 200px; margin-right: 10px;"
        clearable />
      <el-date-picker v-model="filterDateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" style="width: 240px;" value-format="YYYY-MM-DD" />
    </div>

    <!-- 记录列表表格 -->
    <el-table :data="paginatedRecordList" stripe style="width: 100%; margin-top: 20px;" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="operationType" label="操作类型" width="100">
        <template #default="scope">
          <el-tag :type="getOperationTypeTagType(scope.row.operationType)" disable-transitions>
            {{ getOperationTypeText(scope.row.operationType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="货品名称" show-overflow-tooltip />
      <el-table-column prop="quantity" label="数量" width="80" />
      <el-table-column prop="fromWarehouseName" label="来源仓库" width="150" />
      <el-table-column prop="toWarehouseName" label="目标仓库" width="150" />
      <el-table-column prop="operator" label="对接人" width="120" />
      <el-table-column prop="operationTime" label="操作时间" width="180" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="viewDetails(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20]"
      :background="true" layout="total, sizes, prev, pager, next, jumper" :total="filteredRecordList.length"
      @size-change="handleSizeChange" @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: center; display: flex;" />

    <!-- 入库/出库/调货 对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" :before-close="handleDialogClose">
      <el-form :model="currentRecord" :rules="recordRules" ref="recordFormRef" label-width="120px" status-icon>
        <el-form-item label="操作类型" prop="operationType">
          <el-radio-group v-model="currentRecord.operationType" disabled>
            <el-radio label="in">入库</el-radio>
            <el-radio label="out">出库</el-radio>
            <el-radio label="transfer">调货</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选择货品" prop="productId">
          <el-select v-model="currentRecord.productId" placeholder="请选择货品" style="width: 100%;" filterable
            @change="onProductSelectChange">
            <el-option v-for="product in productList" :key="product.id" :label="`${product.name} (${product.barcode})`"
              :value="product.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="操作数量" prop="quantity">
          <el-input-number v-model="currentRecord.quantity" :min="1" :max="maxQuantity" placeholder="请输入数量"
            style="width: 100%;" />
          <div v-if="currentRecord.operationType !== 'transfer'" style="font-size: 12px; color: #999; margin-top: 2px;">
            当前库存: {{ currentProductStock }}
          </div>
        </el-form-item>

        <el-form-item v-if="currentRecord.operationType === 'in' || currentRecord.operationType === 'transfer'"
          label="来源仓库" prop="fromWarehouseId">
          <el-select v-model="currentRecord.fromWarehouseId" placeholder="请选择来源仓库" style="width: 100%;"
            :disabled="currentRecord.operationType === 'in'">
            <el-option v-for="warehouse in warehouseList" :key="warehouse.id" :label="warehouse.name"
              :value="warehouse.id" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="currentRecord.operationType === 'out' || currentRecord.operationType === 'transfer'"
          label="目标仓库" prop="toWarehouseId">
          <el-select v-model="currentRecord.toWarehouseId" placeholder="请选择目标仓库" style="width: 100%;"
            :disabled="currentRecord.operationType === 'out'">
            <el-option v-for="warehouse in warehouseList" :key="warehouse.id" :label="warehouse.name"
              :value="warehouse.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="对接人" prop="operator">
          <el-input v-model="currentRecord.operator" placeholder="请输入对接人姓名" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="currentRecord.remarks" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSave">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="detailsDialogVisible" title="操作详情" width="500px"
      :before-close="() => detailsDialogVisible = false">
      <div v-if="selectedRecord" class="details-content">
        <p><strong>ID:</strong> {{ selectedRecord.id }}</p>
        <p><strong>操作类型:</strong> {{ getOperationTypeText(selectedRecord.operationType) }}</p>
        <p><strong>货品名称:</strong> {{ selectedRecord.productName }}</p>
        <p><strong>数量:</strong> {{ selectedRecord.quantity }}</p>
        <p v-if="selectedRecord.fromWarehouseName"><strong>来源仓库:</strong> {{ selectedRecord.fromWarehouseName }}</p>
        <p v-if="selectedRecord.toWarehouseName"><strong>目标仓库:</strong> {{ selectedRecord.toWarehouseName }}</p>
        <p><strong>对接人:</strong> {{ selectedRecord.operator }}</p>
        <p><strong>操作时间:</strong> {{ selectedRecord.operationTime }}</p>
        <p v-if="selectedRecord.remarks"><strong>备注:</strong> {{ selectedRecord.remarks }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import type { Product, Warehouse, InOutStockRecord } from '@/types'; // 假设你有定义这些类型

// 定义出入库记录类型
interface InOutStockRecordInfo {
  id: number;
  operationType: 'in' | 'out' | 'transfer'; // in: 入库, out: 出库, transfer: 调货
  productId: number;
  productName: string;
  quantity: number;
  fromWarehouseId?: number; // 入库/调货时需要
  fromWarehouseName?: string;
  toWarehouseId: number; // 出库/调货时需要
  toWarehouseName: string;
  operator: string;
  operationTime: string;
  remarks?: string;
  // ... 其他可能的字段
}

// 模拟出入库记录列表数据 (实际应用中从 API 加载)
const recordList = ref<InOutStockRecordInfo[]>([
  { id: 1, operationType: 'in', productId: 1, productName: 'iPhone 15 Pro', quantity: 10, fromWarehouseId: 2, fromWarehouseName: '上海分仓库', toWarehouseId: 1, toWarehouseName: '北京主仓库', operator: '张三', operationTime: '2024-06-01 10:00:00', remarks: '新批次入库' },
  { id: 2, operationType: 'out', productId: 2, productName: 'Nike Air Max', quantity: 5, toWarehouseId: 2, toWarehouseName: '上海分仓库', operator: '李四', operationTime: '2024-06-02 14:30:00', remarks: '门店发货' },
  { id: 3, operationType: 'transfer', productId: 3, productName: '宜家书桌', quantity: 15, fromWarehouseId: 1, fromWarehouseName: '北京主仓库', toWarehouseId: 3, toWarehouseName: '广州前置仓', operator: '王五', operationTime: '2024-06-03 09:15:00', remarks: '调配库存' },
  // ... 更多初始数据
]);

// 模拟货品列表数据 (实际应用中从 API 加载)
const productList = ref<Product[]>([
  { id: 1, name: 'iPhone 15 Pro', barcode: '1234567890123', price: 7999.00, stock: 50, categoryId: 1, warehouseId: 1, image: 'https://via.placeholder.com/100' },
  { id: 2, name: 'Nike Air Max', barcode: '2345678901234', price: 899.00, stock: 95, categoryId: 2, warehouseId: 2, image: 'https://via.placeholder.com/100' }, // 假设已出库5件
  { id: 3, name: '宜家书桌', barcode: '3456789012345', price: 599.00, stock: 15, categoryId: 3, warehouseId: 3, image: 'https://via.placeholder.com/100' }, // 假设已调货15件
]);

// 模拟仓库列表数据 (实际应用中从 API 加载)
const warehouseList = ref<Warehouse[]>([
  { id: 1, name: '北京主仓库', address: '北京市朝阳区物流园A区1号', contactPerson: '李经理', contactPhone: '13800138001' },
  { id: 2, name: '上海分仓库', address: '上海市浦东新区外高桥保税区B栋', contactPerson: '王主管', contactPhone: '13800138002' },
  { id: 3, name: '广州前置仓', address: '广东省广州市天河区智慧物流港C座', contactPerson: '张专员', contactPhone: '13800138003' },
]);

const loading = ref(false); // 加载状态
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页大小

// 搜索过滤条件
const filterType = ref<string>('');
const filterWarehouseId = ref<number | null>(null);
const filterProductKeyword = ref('');
const filterDateRange = ref<[string, string] | null>(null);

// 对话框相关
const dialogVisible = ref(false);
const currentRecord = reactive({
  id: 0,
  operationType: 'in' as 'in' | 'out' | 'transfer',
  productId: 0,
  productName: '', // 用于显示
  quantity: 1,
  fromWarehouseId: undefined as number | undefined, // 入库/调货时需要
  toWarehouseId: 0, // 出库/调货时需要
  operator: '',
  remarks: '',
  operationTime: '', // 保存时设置
});
const recordFormRef = ref<FormInstance>();

// 查看详情对话框
const detailsDialogVisible = ref(false);
const selectedRecord = ref<InOutStockRecordInfo | null>(null);

// 获取当前选中货品在当前仓库的库存
const currentProductStock = computed(() => {
  if (!currentRecord.productId || !currentRecord.toWarehouseId) return 0;
  const product = productList.value.find(p => p.id === currentRecord.productId);
  // 这里简化处理，假设 product.warehouseId 就是其当前库存所在的仓库ID
  // 实际业务中可能需要一个更复杂的库存表来存储特定仓库的特定货品数量
  // 这里假设如果选择的仓库ID与货品记录中的warehouseId不匹配，则库存为0（或需要查询对应仓库库存）
  // 为了演示，我们假设操作发生在 product.warehouseId 所代表的仓库
  if (product && product.warehouseId === currentRecord.toWarehouseId) {
    return product.stock;
  }
  // 如果操作仓库与记录仓库不一致，需要查询逻辑，这里返回0作为示例
  // 实际应用中应从库存表查询
  return 0;
});

// 计算最大可操作数量 (出库时)
const maxQuantity = computed(() => {
  if (currentRecord.operationType === 'out') {
    return currentProductStock.value;
  }
  // 入库和调货没有硬性上限，这里可以设置一个合理的默认值或不做限制
  // 如果是调出，则限制为当前库存
  if (currentRecord.operationType === 'transfer' && currentRecord.fromWarehouseId) {
    const product = productList.value.find(p => p.id === currentRecord.productId);
    // 同样，这里假设 product.warehouseId 是调出仓库的ID，实际需查询
    if (product && product.warehouseId === currentRecord.fromWarehouseId) {
      return product.stock;
    }
    return 0;
  }
  return Infinity; // 入库或调入无上限
});

// 表单验证规则
const recordRules: FormRules = {
  operationType: [
    { required: true, message: '请选择操作类型', trigger: 'change' },
  ],
  productId: [
    { required: true, message: '请选择货品', trigger: 'change' },
  ],
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (currentRecord.operationType === 'out' && value > currentProductStock.value) {
          callback(new Error(`出库数量不能大于当前库存 ${currentProductStock.value}`));
        } else if (currentRecord.operationType === 'transfer' && currentRecord.fromWarehouseId) {
          const product = productList.value.find(p => p.id === currentRecord.productId);
          const fromStock = product && product.warehouseId === currentRecord.fromWarehouseId ? product.stock : 0;
          if (value > fromStock) {
            callback(new Error(`调出数量不能大于来源仓库库存 ${fromStock}`));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  fromWarehouseId: [
    { required: true, message: '请选择来源仓库', trigger: 'change' },
  ],
  toWarehouseId: [
    { required: true, message: '请选择目标仓库', trigger: 'change' },
  ],
  operator: [
    { required: true, message: '请输入对接人', trigger: 'blur' },
    { min: 1, max: 20, message: '对接人姓名长度在 1 到 20 个字符', trigger: 'blur' },
  ],
};

// 计算属性：根据过滤条件过滤记录列表
const filteredRecordList = computed(() => {
  let filtered = [...recordList.value];

  if (filterType.value) {
    filtered = filtered.filter(record => record.operationType === filterType.value);
  }

  if (filterWarehouseId.value) {
    filtered = filtered.filter(record =>
      record.toWarehouseId === filterWarehouseId.value ||
      record.fromWarehouseId === filterWarehouseId.value
    );
  }

  if (filterProductKeyword.value) {
    const keyword = filterProductKeyword.value.toLowerCase();
    filtered = filtered.filter(record =>
      record.productName.toLowerCase().includes(keyword) ||
      record.productId.toString().includes(filterProductKeyword.value)
    );
  }

  if (filterDateRange.value) {
    const [start, end] = filterDateRange.value;
    filtered = filtered.filter(record => {
      const recordDate = record.operationTime.split(' ')[0]; // 提取日期部分
      return recordDate >= start && recordDate <= end;
    });
  }

  return filtered;
});

// 计算属性：分页后的数据
const paginatedRecordList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredRecordList.value.slice(start, end);
});

// 计算属性：对话框标题
const dialogTitle = computed(() => {
  const typeMap: Record<string, string> = { in: '新增入库', out: '新增出库', transfer: '新增调货' };
  return typeMap[currentRecord.operationType] || '操作';
});

// 获取操作类型文本
const getOperationTypeText = (type: string) => {
  const map: Record<string, string> = { in: '入库', out: '出库', transfer: '调货' };
  return map[type] || type;
};

// 获取操作类型标签样式
const getOperationTypeTagType = (type: string) => {
  const map: Record<string, string> = { in: 'success', out: 'danger', transfer: 'warning' };
  return map[type] || 'info';
};

// 打开对话框
const openInOutDialog = (type: 'in' | 'out' | 'transfer') => {
  // 重置表单
  Object.assign(currentRecord, {
    id: 0,
    operationType: type,
    productId: 0,
    productName: '',
    quantity: 1,
    fromWarehouseId: type === 'transfer' ? undefined : (type === 'in' ? 0 : undefined), // 入库时可能需要一个默认的来源仓库
    toWarehouseId: 0,
    operator: '',
    remarks: '',
    operationTime: '',
  });

  // 入库时，目标仓库可能需要默认值或由用户选择
  // 出库时，来源仓库可能需要默认值或由用户选择
  // 调货时，都需要选择
  if (type === 'in') {
    // 可以设置一个默认仓库ID，或者让用户选择
    // currentRecord.toWarehouseId = warehouseList.value[0]?.id;
  } else if (type === 'out') {
    // currentRecord.fromWarehouseId = warehouseList.value[0]?.id;
  }

  dialogVisible.value = true;
};

// 当选择货品时，自动填充货品名称
const onProductSelectChange = (productId: number) => {
  const product = productList.value.find(p => p.id === productId);
  if (product) {
    currentRecord.productName = product.name;
    // 如果是出库或调出，设置默认仓库ID（这里假设 product.warehouseId 是其所在仓库）
    if (currentRecord.operationType === 'out') {
      currentRecord.toWarehouseId = product.warehouseId; // 出库时，目标仓库是货品当前所在的仓库
    } else if (currentRecord.operationType === 'transfer') {
      currentRecord.fromWarehouseId = product.warehouseId; // 调货时，来源仓库是货品当前所在的仓库
    }
  }
};

// 保存（入库/出库/调货）
const handleSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('保存操作记录:', { ...currentRecord });
      // 这里调用 API 保存操作记录
      try {
        // 1. 创建操作记录
        const newRecord: InOutStockRecordInfo = {
          ...currentRecord,
          id: Date.now(), // 模拟生成 ID
          operationTime: new Date().toLocaleString(), // 设置操作时间
          fromWarehouseName: currentRecord.fromWarehouseId ? warehouseList.value.find(w => w.id === currentRecord.fromWarehouseId)?.name : undefined,
          toWarehouseName: warehouseList.value.find(w => w.id === currentRecord.toWarehouseId)?.name || '',
        };

        // 2. 更新库存
        const productIndex = productList.value.findIndex(p => p.id === currentRecord.productId);
        if (productIndex === -1) {
          throw new Error('货品信息不存在，无法更新库存');
        }
        const product = productList.value[productIndex];

        // 为了演示，这里简化处理库存更新逻辑
        // 实际应用中，库存应按仓库和货品ID进行管理，需要一个库存表
        // 例如: stockTable = [{ productId: 1, warehouseId: 1, quantity: 50 }, ...]
        // 这里假设 product.warehouseId 代表其库存所在的仓库ID

        if (currentRecord.operationType === 'in') {
          // 入库：增加目标仓库库存
          if (product.warehouseId === currentRecord.toWarehouseId) {
            product.stock += currentRecord.quantity;
          } else {
            // 如果入库到不同仓库，需要更新 product.warehouseId 并处理库存表
            // 此处仅为简化演示
            throw new Error('入库仓库与货品记录仓库不一致，需要更复杂的库存管理逻辑');
          }
        } else if (currentRecord.operationType === 'out') {
          // 出库：减少来源仓库库存
          if (product.warehouseId === currentRecord.toWarehouseId) { // 注意：出库时 toWarehouseId 是来源仓库
            if (product.stock < currentRecord.quantity) {
              throw new Error('库存不足，无法出库');
            }
            product.stock -= currentRecord.quantity;
          } else {
            throw new Error('出库仓库与货品记录仓库不一致，无法出库');
          }
        } else if (currentRecord.operationType === 'transfer') {
          // 调货：减少来源仓库库存，增加目标仓库库存
          if (product.warehouseId === currentRecord.fromWarehouseId) { // 调出
            if (product.stock < currentRecord.quantity) {
              throw new Error('来源仓库库存不足，无法调货');
            }
            product.stock -= currentRecord.quantity;
            // 同时需要为目标仓库增加库存（这里假设需要更新 product.warehouseId 或维护库存表）
            // 简化：假设调货后货品归属到目标仓库
            product.warehouseId = currentRecord.toWarehouseId;
            // 查找或创建目标仓库的库存记录并增加
            const targetProduct = productList.value.find(p => p.id === currentRecord.productId && p.warehouseId === currentRecord.toWarehouseId);
            if (targetProduct) {
              targetProduct.stock += currentRecord.quantity;
            } else {
              // 如果目标仓库没有该货品，创建一条新记录（这在实际应用中更复杂）
              // 此处仅为演示，不实际创建新记录，而是假设库存已转移
            }
          } else {
            throw new Error('调出仓库与货品记录仓库不一致，无法调货');
          }
        }

        // 3. 添加记录到列表
        recordList.value.push(newRecord);
        ElMessage.success(`${getOperationTypeText(currentRecord.operationType)}记录创建成功！`);

        dialogVisible.value = false; // 保存后关闭对话框
      } catch (error: unknown) {
        console.error('保存失败:', error);

        let message = '操作失败，请稍后重试';
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

// 查看详情
const viewDetails = (record: InOutStockRecordInfo) => {
  selectedRecord.value = record;
  detailsDialogVisible.value = true;
};

// 关闭对话框
const handleDialogClose = (done?: () => void) => {
  if (recordFormRef.value) {
    recordFormRef.value.clearValidate();
  }
  if (done) {
    done();
  } else {
    dialogVisible.value = false;
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
  // loadRecordList(); // 如果需要从 API 加载，取消注释并实现此函数
  // loadProductList();
  // loadWarehouseList();
});
</script>

<style scoped>
.in-out-stock-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  /* 使用 gap 替代 margin */
  margin-bottom: 20px;
}

.filter-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  /* 允许换行 */
}

.details-content p {
  margin: 8px 0;
  line-height: 1.5;
}
</style>
