<template>
  <div class="company-info-container">
    <h2>企业基本信息管理</h2>

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>企业信息</span>
        </div>
      </template>

      <el-descriptions v-if="!isEditing" class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              企业名称
            </div>
          </template>
          {{ companyInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              具体地址
            </div>
          </template>
          {{ companyInfo.address }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              联系人
            </div>
          </template>
          {{ companyInfo.contactPerson }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              联系方式
            </div>
          </template>
          {{ companyInfo.contactPhone }}
        </el-descriptions-item>
        <!-- 可以根据需要添加更多字段 -->
      </el-descriptions>

      <el-form v-else :model="editForm" :rules="rules" ref="editFormRef" label-width="100px" class="demo-ruleForm"
        status-icon>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="具体地址" prop="address">
          <el-input v-model="editForm.address" type="textarea" :rows="3" placeholder="请输入企业具体地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="editForm.contactPerson" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contactPhone">
          <el-input v-model="editForm.contactPhone" placeholder="请输入联系人电话" />
        </el-form-item>
        <!-- 可以根据需要添加更多字段 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 编辑按钮，仅在非编辑状态下显示 -->
    <el-button v-if="!isEditing" type="primary" @click="startEditing">编辑信息</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import type { Company } from '@/types'; // 假设你有定义 Company 类型

// 定义企业信息类型
interface CompanyInfo {
  id?: number; // 如果后端提供 ID
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  // ... 其他可能的字段
}

// 响应式数据
const companyInfo = ref<CompanyInfo>({
  name: '示例科技有限公司', // 初始值，实际应用中从 API 加载
  address: '北京市朝阳区未来科技大厦 101 室',
  contactPerson: '张三',
  contactPhone: '13800138000',
  // ... 其他初始值
});

const isEditing = ref(false);
const editFormRef = ref<FormInstance>();

// 编辑表单数据，初始化为当前企业信息
const editForm = reactive<CompanyInfo>({
  name: companyInfo.value.name,
  address: companyInfo.value.address,
  contactPerson: companyInfo.value.contactPerson,
  contactPhone: companyInfo.value.contactPhone,
  // ... 其他字段
});

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入企业名称', trigger: 'blur' },
    { min: 2, max: 50, message: '企业名称长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  address: [
    { required: true, message: '请输入企业具体地址', trigger: 'blur' },
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

// 模拟从 API 加载企业信息 (实际应用中需要调用 API)
const loadCompanyInfo = async () => {
  try {
    // const response = await getCompanyInfoAPI();
    // companyInfo.value = response.data;
    // console.log('企业信息加载成功:', companyInfo.value);
  } catch (error) {
    console.error('加载企业信息失败:', error);
    ElMessage.error('加载企业信息失败，请稍后重试');
  }
};

// 开始编辑
const startEditing = () => {
  // 将当前信息复制到编辑表单
  Object.assign(editForm, companyInfo.value);
  isEditing.value = true;
};

// 保存编辑
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('提交企业信息:', { ...editForm });
      // 这里调用 API 更新企业信息
      // try {
      //   const response = await updateCompanyInfoAPI(editForm);
      //   if (response.success) {
      //     ElMessage.success('企业信息更新成功！');
      //     // 更新本地显示信息
      //     Object.assign(companyInfo.value, editForm);
      //     isEditing.value = false; // 保存后退出编辑状态
      //   } else {
      //     throw new Error(response.message || '更新失败');
      //   }
      // } catch (error) {
      //   console.error('更新失败:', error);
      //   ElMessage.error(error.message || '更新失败，请稍后重试');
      // }

      // 模拟成功
      ElMessage.success('企业信息更新成功！（模拟）');
      // 更新本地显示信息
      Object.assign(companyInfo.value, editForm);
      isEditing.value = false; // 保存后退出编辑状态
    } else {
      console.log('表单验证失败!', fields);
      ElMessage.error('请检查输入信息');
    }
  });
};

// 取消编辑，恢复原始值
const onCancel = () => {
  // 将当前显示的信息重新赋值给编辑表单，撤销未保存的更改
  Object.assign(editForm, companyInfo.value);
  isEditing.value = false;
};

// 组件挂载时加载企业信息
onMounted(() => {
  loadCompanyInfo();
});
</script>

<style scoped>
.company-info-container {
  padding: 20px;
  max-width: 800px;
  /* 限制最大宽度 */
  margin: 0 auto;
  /* 居中 */
}

.info-card {
  margin-bottom: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.demo-ruleForm {
  max-width: 500px;
  /* 限制表单最大宽度 */
}

.cell-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
