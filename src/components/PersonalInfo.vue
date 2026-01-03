<template>
  <div class="personal-info-container">
    <h2>个人信息管理</h2>

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>更新个人信息</span>
        </div>
      </template>
      <el-form :model="profileForm" :rules="profileRules" ref="profileFormRef" label-width="100px" class="demo-ruleForm"
        status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="profileForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="profileForm.phone" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitProfile">更新信息</el-button>
          <el-button @click="onResetProfile">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="password-card">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px"
        class="demo-passwordForm" status-icon>
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入当前密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPassword">
          <el-input v-model="passwordForm.confirmNewPassword" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitPassword">确认修改</el-button>
          <el-button @click="onResetPassword">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import type { User } from '@/types'; // 假设你有定义 User 类型

// 模拟当前用户信息
const currentUser = ref<User>({
  id: 1,
  username: 'testUser',
  email: 'test@example.com',
  phone: '13800138000',
  // ... 其他字段
});

// 个人信息表单数据
const profileForm = reactive({
  username: currentUser.value.username,
  email: currentUser.value.email,
  phone: currentUser.value.phone,
});

// 密码修改表单数据
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

// 个人信息表单验证规则
const profileRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
};

// 密码修改表单验证规则
const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 位', trigger: 'blur' },
  ],
  confirmNewPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

// 表单引用
const profileFormRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();

// 提交个人信息更新
const onSubmitProfile = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('提交个人信息:', { ...profileForm });
      // 这里调用 API 更新用户信息
      // try {
      //   const response = await updateUserInfoAPI(profileForm);
      //   if (response.success) {
      //     ElMessage.success('个人信息更新成功！');
      //     // 更新本地存储的用户信息 (如果有的话)
      //     currentUser.value = { ...currentUser.value, ...profileForm };
      //   } else {
      //     throw new Error(response.message || '更新失败');
      //   }
      // } catch (error) {
      //   console.error('更新失败:', error);
      //   ElMessage.error(error.message || '更新失败，请稍后重试');
      // }

      // 模拟成功
      ElMessage.success('个人信息更新成功！');
      currentUser.value = { ...currentUser.value, ...profileForm };
    } else {
      console.log('个人信息表单验证失败!', fields);
      ElMessage.error('请检查输入信息');
    }
  });
};

// 重置个人信息表单
const onResetProfile = (formEl: FormInstance | undefined) => {
  if (formEl) {
    formEl.resetFields();
    // 可选：重置为当前用户信息
    profileForm.username = currentUser.value.username;
    profileForm.email = currentUser.value.email;
    profileForm.phone = currentUser.value.phone;
  }
};

// 提交密码修改
const onSubmitPassword = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('提交密码修改:', {
        oldPassword: '***', // 不打印真实密码
        newPassword: '***',
        confirmNewPassword: '***',
      });
      // 这里调用 API 修改密码
      // try {
      //   const response = await changePasswordAPI(passwordForm);
      //   if (response.success) {
      //     ElMessage.success('密码修改成功！请重新登录。');
      //     // 可能需要清除 Token 并跳转到登录页
      //     // logoutAndRedirectToLogin();
      //   } else {
      //     throw new Error(response.message || '修改失败');
      //   }
      // } catch (error) {
      //   console.error('修改失败:', error);
      //   ElMessage.error(error.message || '修改失败，请稍后重试');
      // }

      // 模拟成功
      ElMessage.success('密码修改成功！（模拟）');
      // 重置密码表单
      onResetPassword(passwordFormRef.value);
    } else {
      console.log('密码表单验证失败!', fields);
      ElMessage.error('请检查密码输入');
    }
  });
};

// 重置密码表单
const onResetPassword = (formEl: FormInstance | undefined) => {
  if (formEl) {
    formEl.resetFields();
  }
};
</script>

<style scoped>
.personal-info-container {
  padding: 20px;
  max-width: 800px;
  /* 限制最大宽度 */
  margin: 0 auto;
  /* 居中 */
}

.info-card,
.password-card {
  margin-bottom: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.demo-ruleForm,
.demo-passwordForm {
  max-width: 500px;
  /* 限制表单最大宽度 */
}
</style>
