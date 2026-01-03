<template>
  <div class="user-management-container">
    <h2>用户管理</h2>

    <!-- 搜索和操作按钮 -->
    <div class="header-actions">
      <el-input v-model="searchQuery" placeholder="搜索账号名或用户名" style="width: 240px; margin-right: 16px;" clearable
        @clear="handleSearch" @keyup.enter="handleSearch">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
      <el-button @click="handleSelfChangePassword">修改密码</el-button>
    </div>

    <!-- 用户列表 -->
    <el-table :data="users" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="账号名" width="150" />
      <el-table-column prop="name" label="用户名" width="150" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="primary" @click="handleResetPassword(row.id)">重置密码</el-button>
          <el-button size="small" :type="row.status === 'active' ? 'warning' : 'success'"
            @click="handleToggleStatus(row)">
            {{ row.status === 'active' ? '禁用' : '启用' }}
          </el-button>
          <el-popconfirm title="确定要删除此用户吗？" confirm-button-text="确定" cancel-button-text="取消"
            @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50]"
        :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <!-- 用户表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" :before-close="handleDialogClose">
      <el-form ref="userFormRef" :model="currentForm" :rules="formRules" label-width="100px">
        <el-form-item label="账号名" prop="username">
          <el-input v-model="currentForm.username" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="currentForm.name" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'add'" label="密码" prop="password">
          <el-input v-model="currentForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="currentForm.role" placeholder="请选择角色">
            <el-option label="Admin" value="Admin" />
            <el-option label="User" value="User" />
            <el-option label="Guest" value="Guest" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="changePasswordDialogVisible" title="修改密码" width="400px"
      :before-close="handleChangePasswordDialogClose">
      <el-form ref="changePasswordFormRef" :model="changePasswordForm" :rules="changePasswordRules" label-width="120px">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input v-model="changePasswordForm.currentPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="changePasswordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPassword">
          <el-input v-model="changePasswordForm.confirmNewPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleChangePasswordDialogClose">取消</el-button>
          <el-button type="primary" @click="handleChangePasswordSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { useUserStore, User } from '../stores/user'; // 确保路径正确

const userStore = useUserStore();

// Refs
const dialogVisible = ref(false);
const changePasswordDialogVisible = ref(false);
const userFormRef = ref<FormInstance | null>(null); // 明确类型
const changePasswordFormRef = ref<FormInstance | null>(null);

// Data
const dialogType = ref<'add' | 'edit'>('add');
const currentForm = ref<Omit<User, 'id'> | Partial<User>>({
  username: '',
  name: '',
  password: '',
  role: '',
  status: 'active',
});
const changePasswordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

// Computed
const { users, total, loading, currentPage, pageSize, searchQuery } = userStore;
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增用户' : '编辑用户');

// Form Rules
const formRules: FormRules = {
  username: [
    { required: true, message: '请输入账号名', trigger: 'blur' },
    { min: 3, max: 20, message: '账号名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 位', trigger: 'blur' },
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' },
  ],
};

const changePasswordRules: FormRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 位', trigger: 'blur' },
  ],
  confirmNewPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== changePasswordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

// Methods
const handleSearch = () => {
  userStore.fetchUsers(); // 重新获取列表，应用搜索条件
};

const handleAdd = () => {
  dialogType.value = 'add';
  currentForm.value = { username: '', name: '', password: '', role: '', status: 'active' };
  dialogVisible.value = true;
};

const handleEdit = (row: User) => {
  dialogType.value = 'edit';
  currentForm.value = { ...row };
  dialogVisible.value = true;
};

const handleResetPassword = async (id: number) => {
  try {
    await userStore.resetPassword(id);
    ElMessage.success('密码已重置');
  } catch (error) {
    console.error('Reset password error:', error);
    ElMessage.error('重置密码失败');
  }
};

const handleToggleStatus = async (row: User) => {
  const newStatus = row.status === 'active' ? 'inactive' : 'active';
  try {
    await userStore.updateUser(row.id, { status: newStatus });
    row.status = newStatus; // 更新本地状态
    ElMessage.success(`用户已${newStatus === 'active' ? '启用' : '禁用'}`);
  } catch (error) {
    console.error('Toggle status error:', error);
    ElMessage.error(`切换状态失败`);
  }
};

const handleDelete = async (id: number) => {
  try {
    await userStore.deleteUser(id);
    ElMessage.success('删除成功');
    // 如果删除的是当前页最后一条数据，且当前页不是第一页，则跳转到上一页
    if (users.value.length === 1 && currentPage.value > 1) {
      currentPage.value--;
    }
    await userStore.fetchUsers(); // 重新获取列表
  } catch (error) {
    console.error('Delete user error:', error);
    ElMessage.error('删除失败');
  }
};

const handleDialogClose = () => {
  userFormRef.value?.resetFields();
  dialogVisible.value = false;
};

const handleSave = async () => {
  if (!userFormRef.value) return;
  await userFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await userStore.createUser(currentForm.value as Omit<User, 'id'>);
          ElMessage.success('用户创建成功');
        } else {
          // 确保传递 id
          if (currentForm.value.id) {
            await userStore.updateUser(currentForm.value.id, currentForm.value);
            ElMessage.success('用户更新成功');
          }
        }
        handleDialogClose();
        await userStore.fetchUsers(); // 重新获取列表
      } catch (error) {
        console.error('Save user error:', error);
        ElMessage.error(dialogType.value === 'add' ? '创建用户失败' : '更新用户失败');
      }
    } else {
      console.log('Form validation failed:', fields);
    }
  });
};

const handleSelfChangePassword = () => {
  changePasswordForm.value = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
  changePasswordDialogVisible.value = true;
};

const handleChangePasswordDialogClose = () => {
  changePasswordFormRef.value?.resetFields();
  changePasswordDialogVisible.value = false;
};

const handleChangePasswordSubmit = async () => {
  if (!changePasswordFormRef.value) return;
  await changePasswordFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await userStore.changePassword(changePasswordForm.value.currentPassword, changePasswordForm.value.newPassword);
        ElMessage.success('密码修改成功');
        handleChangePasswordDialogClose();
      } catch (error) {
        console.error('Change password error:', error);
        ElMessage.error('密码修改失败');
      }
    } else {
      console.log('Change password form validation failed:', fields);
    }
  });
};

const handleSizeChange = (size: number) => {
  userStore.pageSize = size;
  userStore.fetchUsers();
};

const handleCurrentChange = (page: number) => {
  userStore.currentPage = page;
  userStore.fetchUsers();
};

// Lifecycle
onMounted(() => {
  userStore.fetchUsers();
});
</script>

<style scoped>
.user-management-container {
  padding: 20px;
}

.header-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  text-align: right;
}
</style>
<!-- 注意：这里没有其他内容了 -->
