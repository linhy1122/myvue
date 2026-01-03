<template>
  <div class="statistical-analysis-container">
    <h2>统计分析</h2>

    <!-- 过滤条件 -->
    <div class="filter-bar">
      <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" style="width: 240px; margin-right: 10px;" value-format="YYYY-MM-DD"
        :picker-options="pickerOptions" />
      <el-select v-model="selectedWarehouseId" placeholder="选择仓库" style="width: 150px; margin-right: 10px;" clearable>
        <el-option v-for="warehouse in warehouseList" :key="warehouse.id" :label="warehouse.name"
          :value="warehouse.id" />
      </el-select>
      <el-button type="primary" @click="fetchData">查询</el-button>
    </div>

    <!-- 折线图 -->
    <div class="chart-container">
      <h3>货品进出趋势图</h3>
      <div ref="lineChartRef" style="height: 400px;"></div>
    </div>

    <!-- 排行列表 -->
    <div class="rank-container">
      <h3>进出数量排行榜</h3>
      <el-table :data="rankList" stripe style="width: 100%; margin-top: 20px;" v-loading="loading">
        <el-table-column type="index" label="排名" width="80" />
        <el-table-column prop="productName" label="货品名称" />
        <el-table-column prop="totalQuantity" label="进出数量" />
        <!-- 如果需要区分入库和出库数量，可以增加两列 -->
        <el-table-column prop="inQuantity" label="入库数量" />
        <el-table-column prop="outQuantity" label="出库数量" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts/core';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

// 注册 ECharts 组件
echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
]);

// --- 模拟数据定义 ---
interface Warehouse {
  id: number;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
}

interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  categoryId: number;
  warehouseId: number;
  image: string;
}

interface InOutStockRecord {
  id: number;
  operationType: 'in' | 'out' | 'transfer';
  productId: number;
  productName: string;
  quantity: number;
  fromWarehouseId: number;
  fromWarehouseName: string;
  toWarehouseId: number;
  toWarehouseName: string;
  operator: string;
  operationTime: string; // 格式: 'YYYY-MM-DD HH:mm:ss'
  remarks: string;
}

const warehouseList = ref<Warehouse[]>([
  { id: 1, name: '北京主仓库', address: '北京市朝阳区物流园A区1号', contactPerson: '李经理', contactPhone: '13800138001' },
  { id: 2, name: '上海分仓库', address: '上海市浦东新区外高桥保税区B栋', contactPerson: '王主管', contactPhone: '13800138002' },
  { id: 3, name: '广州前置仓', address: '广东省广州市天河区智慧物流港C座', contactPerson: '张专员', contactPhone: '13800138003' },
]);

const productList = ref<Product[]>([
  { id: 1, name: 'iPhone 15 Pro', barcode: '1234567890123', price: 7999.00, stock: 50, categoryId: 1, warehouseId: 1, image: 'https://via.placeholder.com/100' },
  { id: 2, name: 'Nike Air Max', barcode: '2345678901234', price: 899.00, stock: 95, categoryId: 2, warehouseId: 2, image: 'https://via.placeholder.com/100' },
  { id: 3, name: '宜家书桌', barcode: '3456789012345', price: 599.00, stock: 15, categoryId: 3, warehouseId: 3, image: 'https://via.placeholder.com/100' },
]);

// 模拟出入库记录数据 (实际应用中从 API 加载)
const recordList = ref<InOutStockRecord[]>([
  { id: 1, operationType: 'in', productId: 1, productName: 'iPhone 15 Pro', quantity: 10, fromWarehouseId: 2, fromWarehouseName: '上海分仓库', toWarehouseId: 1, toWarehouseName: '北京主仓库', operator: '张三', operationTime: '2024-06-01 10:00:00', remarks: '新批次入库' },
  { id: 2, operationType: 'out', productId: 2, productName: 'Nike Air Max', quantity: 5, toWarehouseId: 2, toWarehouseName: '上海分仓库', operator: '李四', operationTime: '2024-06-02 14:30:00', remarks: '门店发货' },
  { id: 3, operationType: 'transfer', productId: 3, productName: '宜家书桌', quantity: 15, fromWarehouseId: 1, fromWarehouseName: '北京主仓库', toWarehouseId: 3, toWarehouseName: '广州前置仓', operator: '王五', operationTime: '2024-06-03 09:15:00', remarks: '调配库存' },
  { id: 4, operationType: 'in', productId: 1, productName: 'iPhone 15 Pro', quantity: 8, fromWarehouseId: 0, fromWarehouseName: '供应商', toWarehouseId: 1, toWarehouseName: '北京主仓库', operator: '赵六', operationTime: '2024-06-01 16:00:00', remarks: '采购入库' },
  { id: 5, operationType: 'out', productId: 1, productName: 'iPhone 15 Pro', quantity: 3, toWarehouseId: 2, toWarehouseName: '上海分仓库', operator: '孙七', operationTime: '2024-06-04 11:00:00', remarks: '门店调拨' },
  { id: 6, operationType: 'in', productId: 2, productName: 'Nike Air Max', quantity: 20, fromWarehouseId: 0, fromWarehouseName: '供应商', toWarehouseId: 2, toWarehouseName: '上海分仓库', operator: '周八', operationTime: '2024-06-05 13:20:00', remarks: '新货入库' },
  { id: 7, operationType: 'out', productId: 3, productName: '宜家书桌', quantity: 7, toWarehouseId: 1, toWarehouseName: '北京主仓库', operator: '吴九', operationTime: '2024-06-06 15:45:00', remarks: '客户订单' },
  { id: 8, operationType: 'in', productId: 3, productName: '宜家书桌', quantity: 12, fromWarehouseId: 0, fromWarehouseName: '供应商', toWarehouseId: 3, toWarehouseName: '广州前置仓', operator: '郑十', operationTime: '2024-06-07 09:30:00', remarks: '补货入库' },
  { id: 9, operationType: 'out', productId: 2, productName: 'Nike Air Max', quantity: 10, toWarehouseId: 1, toWarehouseName: '北京主仓库', operator: '钱一', operationTime: '2024-06-08 17:10:00', remarks: '大客户订单' },
  { id: 10, operationType: 'transfer', productId: 1, productName: 'iPhone 15 Pro', quantity: 5, fromWarehouseId: 1, fromWarehouseName: '北京主仓库', toWarehouseId: 2, toWarehouseName: '上海分仓库', operator: '孙七', operationTime: '2024-06-09 10:00:00', remarks: '门店调配' },
  // 可以添加更多数据以观察趋势
]);

const loading = ref(false);
const dateRange = ref<[string, string]>(['2024-06-01', '2024-06-10']); // 默认时间范围
const selectedWarehouseId = ref<number | null>(null); // 默认不选仓库

// ECharts 实例和 DOM 引用
const lineChartRef = ref<HTMLDivElement>();
let lineChartInstance: echarts.ECharts | null = null;

// 图表和列表数据
const chartData = ref<{ date: string; in: number; out: number }[]>([]);
const rankList = ref<{ productName: string; totalQuantity: number; inQuantity: number; outQuantity: number }[]>([]);

// 日期选择器选项
const pickerOptions = {
  shortcuts: [
    {
      text: '最近一周',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      },
    },
    {
      text: '最近一个月',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      },
    },
    {
      text: '最近三个月',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      },
    },
  ],
};

// 获取指定日期范围内的所有日期 (格式 YYYY-MM-DD)
function getDateRange(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const date = new Date(start);
  const dates: string[] = [];

  while (date <= end) {
    dates.push(date.toISOString().split('T')[0]);
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

// 初始化图表
const initChart = () => {
  if (!lineChartRef.value) return;
  lineChartInstance = echarts.init(lineChartRef.value);

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['入库', '出库'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: '入库',
        type: 'line',
        stack: '总量',
        data: [],
        smooth: true,
        color: '#5470c6',
      },
      {
        name: '出库',
        type: 'line',
        stack: '总量',
        data: [],
        smooth: true,
        color: '#ee6666',
      },
    ],
  };

  lineChartInstance.setOption(option);
};

// 渲染图表
const renderChart = () => {
  if (!lineChartInstance) return;

  const dates = chartData.value.map(item => item.date);
  const inData = chartData.value.map(item => item.in);
  const outData = chartData.value.map(item => item.out);

  lineChartInstance.setOption({
    xAxis: {
      data: dates,
    },
    series: [
      {
        name: '入库',
        data: inData,
      },
      {
        name: '出库',
        data: outData,
      },
    ],
  });
};

// 获取数据
const fetchData = () => {
  loading.value = true;
  // 模拟 API 调用延迟
  setTimeout(() => {
    try {
      const [start, end] = dateRange.value || [];
      if (!start || !end) {
        ElMessage.warning('请选择日期范围');
        loading.value = false;
        return;
      }

      // 1. 计算折线图数据
      const dateRangeArray = getDateRange(start, end);
      const dateMap = new Map<string, { in: number; out: number }>();

      // 初始化日期范围内的数据
      dateRangeArray.forEach(date => {
        dateMap.set(date, { in: 0, out: 0 });
      });

      // 遍历记录，聚合数据
      recordList.value.forEach(record => {
        const recordDate = record.operationTime.split(' ')[0]; // 提取日期部分
        // 过滤仓库
        const relevantWarehouse = record.toWarehouseId || record.fromWarehouseId;
        if (selectedWarehouseId.value && relevantWarehouse !== selectedWarehouseId.value) {
          return;
        }

        // 修复：将 recordDate 与 start 和 end 进行字符串比较，确保日期在范围内
        if (recordDate >= start && recordDate <= end) {
          const currentData = dateMap.get(recordDate) || { in: 0, out: 0 };

          // 判断操作类型和仓库，决定是增加入库还是出库数量
          if (record.operationType === 'in' || (record.operationType === 'transfer' && selectedWarehouseId.value && record.toWarehouseId === selectedWarehouseId.value)) {
            // 入库：直接从供应商来 或 调拨到当前选中仓库
            if (!record.fromWarehouseId || record.fromWarehouseId === 0) {
              currentData.in += record.quantity;
            } else if (selectedWarehouseId.value && record.toWarehouseId === selectedWarehouseId.value) {
              currentData.in += record.quantity;
            }
          }
          if (record.operationType === 'out' || (record.operationType === 'transfer' && selectedWarehouseId.value && record.fromWarehouseId === selectedWarehouseId.value)) {
            // 出库：发往客户 或 从当前选中仓库调出
            if (!record.toWarehouseId || record.toWarehouseId === 0) {
              currentData.out += record.quantity;
            } else if (selectedWarehouseId.value && record.fromWarehouseId === selectedWarehouseId.value) {
              currentData.out += record.quantity;
            }
          }
          dateMap.set(recordDate, currentData);
        }
      });

      chartData.value = dateRangeArray.map(date => ({
        date,
        in: dateMap.get(date)?.in || 0,
        out: dateMap.get(date)?.out || 0,
      }));

      // 2. 计算排行榜数据
      const productMap = new Map<number, { productName: string; totalQuantity: number; inQuantity: number; outQuantity: number }>();

      recordList.value.forEach(record => {
        const recordDate = record.operationTime.split(' ')[0];
        const relevantWarehouse = record.toWarehouseId || record.fromWarehouseId;
        if (selectedWarehouseId.value && relevantWarehouse !== selectedWarehouseId.value) {
          return;
        }

        if (recordDate >= start && recordDate <= end) {
          if (!productMap.has(record.productId)) {
            productMap.set(record.productId, {
              productName: record.productName,
              totalQuantity: 0,
              inQuantity: 0,
              outQuantity: 0,
            });
          }
          const productStats = productMap.get(record.productId)!;

          // 同样，根据操作类型和仓库判断数量归属
          if (record.operationType === 'in' || (record.operationType === 'transfer' && selectedWarehouseId.value && record.toWarehouseId === selectedWarehouseId.value)) {
            if (!record.fromWarehouseId || record.fromWarehouseId === 0) {
              productStats.inQuantity += record.quantity;
            } else if (selectedWarehouseId.value && record.toWarehouseId === selectedWarehouseId.value) {
              productStats.inQuantity += record.quantity;
            }
          }
          if (record.operationType === 'out' || (record.operationType === 'transfer' && selectedWarehouseId.value && record.fromWarehouseId === selectedWarehouseId.value)) {
            if (!record.toWarehouseId || record.toWarehouseId === 0) {
              productStats.outQuantity += record.quantity;
            } else if (selectedWarehouseId.value && record.fromWarehouseId === selectedWarehouseId.value) {
              productStats.outQuantity += record.quantity;
            }
          }
          productStats.totalQuantity = productStats.inQuantity + productStats.outQuantity; // 更新总数
        }
      });

      // 转换为数组并排序
      rankList.value = Array.from(productMap.values())
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 10); // 取前10

      // 渲染图表
      renderChart();
      loading.value = false;
    } catch (error) {
      console.error('获取数据失败:', error);
      ElMessage.error('获取数据失败，请稍后重试');
      loading.value = false;
    }
  }, 500); // 模拟网络请求
};

// 组件挂载时初始化图表和加载数据
onMounted(() => {
  initChart();
  nextTick(() => {
    fetchData(); // 初始加载数据
  });
});

// 组件卸载时销毁图表实例
onUnmounted(() => {
  if (lineChartInstance) {
    lineChartInstance.dispose();
    lineChartInstance = null; // 清空引用
  }
});
</script>

<style scoped>
.statistical-analysis-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.filter-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.chart-container,
.rank-container {
  margin-bottom: 40px;
}

.chart-container h3,
.rank-container h3 {
  margin-bottom: 15px;
}
</style>
