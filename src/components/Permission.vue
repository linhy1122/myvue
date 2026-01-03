<template>
  <div class="permission-management-container">
    <h2>权限管理</h2>

    <div class="toolbar">
      <el-button type="primary" @click="openUserDialog()">新增用户</el-button>
    </div>

    <!-- 用户列表 -->
    <el-table :data="userList" stripe style="width: 100%; margin-top: 20px;" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.role === 'super_admin' ? 'danger' : 'primary'">
            {{ scope.row.role === 'super_admin' ? '超级管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="permissions" label="权限" min-width="300">
        <template #default="scope">
          <div v-if="scope.row.role === 'super_admin'">
            <el-tag type="danger" size="small" style="margin-right: 5px;">所有菜单</el-tag>
            <el-tag type="danger" size="small" style="margin-right: 5px;">所有仓库</el-tag>
          </div>
          <div v-else>
            <el-tag v-for="menu in scope.row.permissions.menus" :key="menu" size="small" style="margin-right: 5px;">
              {{ getMenuLabel(menu) }}
            </el-tag>
            <el-tag v-for="warehouse in scope.row.permissions.warehouses" :key="warehouse" size="small"
              style="margin-right: 5px; margin-top: 5px;" type="warning">
              {{ getWarehouseLabel(warehouse) }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="openUserDialog(scope.row)"
            :disabled="scope.row.role === 'super_admin'">编辑</el-button>
          <el-popconfirm title="确定要删除此用户吗？" @confirm="deleteUser(scope.row.id)"
            :disabled="scope.row.role === 'super_admin'">
            <template #reference>
              <el-button size="small" type="danger" :disabled="scope.row.role === 'super_admin'">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑/新增用户对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="600px" :before-close="closeUserDialog">
      <el-form :model="currentUserInfo" :rules="userFormRules" ref="userFormRef" label-width="120px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="currentUserInfo.username" :disabled="isEdit" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="currentUserInfo.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="currentUserInfo.role" @change="onRoleChange">
            <el-radio label="user">普通用户</el-radio>
            <el-radio label="super_admin">超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 权限分配区域 (仅普通用户显示) -->
        <div v-if="currentUserInfo.role === 'user'">
          <el-divider content-position="left">权限分配</el-divider>
          <el-form-item label="菜单权限">
            <el-tree ref="menuTreeRef" :data="menuTreeData" show-checkbox node-key="key"
              :default-expanded-keys="allMenuKeys" :props="{ label: 'label', children: 'children' }"
              @check="onMenuTreeCheck" />
          </el-form-item>
          <el-form-item label="仓库权限">
            <el-checkbox-group v-model="currentUserInfo.permissions.warehouses">
              <el-checkbox v-for="warehouse in warehouseList" :key="warehouse.id" :label="warehouse.id">
                {{ warehouse.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeUserDialog">取消</el-button>
          <el-button type="primary" @click="saveUser">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import type { User, Warehouse, Menu } from '@/types'; // 假设你有定义这些类型

// 定义用户类型
interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'super_admin';
  permissions: {
    menus: string[]; // 菜单权限 key 列表
    warehouses: number[]; // 仓库权限 ID 列表
  };
}

// 模拟用户列表 (实际应用中从 API 加载)
const userList = ref<UserInfo[]>([
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'super_admin', permissions: { menus: [], warehouses: [] } }, // 超级管理员
  { id: 2, username: 'manager', email: 'manager@example.com', role: 'user', permissions: { menus: ['dashboard', 'inventory', 'in_out_stock'], warehouses: [1, 2] } },
  { id: 3, username: 'staff', email: 'staff@example.com', role: 'user', permissions: { menus: ['in_out_stock'], warehouses: [1] } },
]);

// 模拟仓库列表 (实际应用中从 API 加载)
const warehouseList = ref<Warehouse[]>([
  { id: 1, name: '北京主仓库', address: '北京市朝阳区物流园A区1号', contactPerson: '李经理', contactPhone: '13800138001' },
  { id: 2, name: '上海分仓库', address: '上海市浦东新区外高桥保税区B栋', contactPerson: '王主管', contactPhone: '13800138002' },
  { id: 3, name: '广州前置仓', address: '广东省广州市天河区智慧物流港C座', contactPerson: '张专员', contactPhone: '13800138003' },
]);

// 模拟菜单结构 (实际应用中从 API 加载或在路由中定义)
const menuTreeData = ref<Menu[]>([
  {
    key: 'dashboard',
    label: '仪表盘',
    children: [],
  },
  {
    key: 'inventory',
    label: '库存管理',
    children: [
      { key: 'inventory_list', label: '库存列表' },
      { key: 'inventory_adjust', label: '库存调整' },
    ],
  },
  {
    key: 'in_out_stock',
    label: '出入库管理',
    children: [
      { key: 'in_stock', label: '入库管理' },
      { key: 'out_stock', label: '出库管理' },
      { key: 'transfer_stock', label: '调货管理' },
    ],
  },
  {
    key: 'reports',
    label: '报表',
    children: [
      { key: 'stock_report', label: '库存报表' },
      { key: 'in_out_report', label: '出入库报表' },
    ],
  },
  {
    key: 'system',
    label: '系统管理',
    children: [
      { key: 'users', label: '用户管理' },
      { key: 'warehouses', label: '仓库管理' },
      { key: 'permissions', label: '权限管理' },
    ],
  },
]);

// 提取所有菜单的 key
const allMenuKeys = computed(() => {
  const keys: string[] = [];
  const traverse = (nodes: Menu[]) => {
    nodes.forEach(node => {
      keys.push(node.key);
      if (node.children) {
        traverse(node.children);
      }
    });
  };
  traverse(menuTreeData.value);
  return keys;
});

const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const userFormRef = ref<FormInstance>();
const menuTreeRef = ref();

// 当前操作的用户信息
const currentUserInfo = reactive<UserInfo>({
  id: 0,
  username: '',
  email: '',
  role: 'user',
  permissions: {
    menus: [],
    warehouses: [],
  },
});

// 表单验证规则
const userFormRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' },
  ],
};

// 打开用户编辑/新增对话框
const openUserDialog = (user?: UserInfo) => {
  if (user) {
    // 编辑现有用户
    Object.assign(currentUserInfo, user);
    isEdit.value = true; // ✅ 正确！修改 ref 对象内部的值
  } else {
    // 新增用户
    Object.assign(currentUserInfo, {
      id: 0,
      username: '',
      email: '',
      role: 'user',
      permissions: {
        menus: [],
        warehouses: [],
      },
    });
    isEdit.value = false; // ✅ 正确！修改 ref 对象内部的值
  }
  dialogVisible.value = true;

  // 在 DOM 更新后设置树形控件的选中状态
  nextTick(() => {
    if (menuTreeRef.value) {
      menuTreeRef.value.setCheckedKeys(currentUserInfo.permissions.menus);
    }
  });
};

// 关闭用户对话框
const closeUserDialog = async (done?: () => void) => {
  if (userFormRef.value) {
    userFormRef.value.clearValidate();
  }
  if (done) {
    done();
  } else {
    dialogVisible.value = false;
  }
};

// 保存用户
const saveUser = async () => {
  if (!userFormRef.value) return;
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('保存用户信息:', { ...currentUserInfo });

      // 如果是超级管理员，清空权限设置
      if (currentUserInfo.role === 'super_admin') {
        currentUserInfo.permissions.menus = [];
        currentUserInfo.permissions.warehouses = [];
      }

      try {
        if (isEdit.value) {
          // 更新现有用户
          const index = userList.value.findIndex(u => u.id === currentUserInfo.id);
          if (index !== -1) {
            userList.value.splice(index, 1, { ...currentUserInfo });
            ElMessage.success('用户信息更新成功！');
          }
        } else {
          // 创建新用户
          const newId = Math.max(0, ...userList.value.map(u => u.id)) + 1;
          userList.value.push({ ...currentUserInfo, id: newId });
          ElMessage.success('新用户创建成功！');
        }
        dialogVisible.value = false;
      } catch (error) {
        console.error('保存用户失败:', error);
        ElMessage.error('保存失败，请稍后重试');
      }
    } else {
      ElMessage.error('请检查输入信息');
    }
  });
};

// 删除用户
const deleteUser = (userId: number) => {
  // 不能删除超级管理员
  const userToDelete = userList.value.find(u => u.id === userId);
  if (userToDelete && userToDelete.role === 'super_admin') {
    ElMessage.error('无法删除超级管理员账户');
    return;
  }

  userList.value = userList.value.filter(u => u.id !== userId);
  ElMessage.success('用户删除成功！');
};

// 角色变更处理
const onRoleChange = (newRole: 'user' | 'super_admin') => {
  if (newRole === 'super_admin') {
    // 超级管理员拥有所有权限，清空具体分配
    currentUserInfo.permissions.menus = [];
    currentUserInfo.permissions.warehouses = [];
    if (menuTreeRef.value) {
      menuTreeRef.value.setCheckedKeys([]); // 清空菜单树选择
    }
  }
};

// 菜单树选中状态变化处理
const onMenuTreeCheck = (data: Menu, checkedInfo: { checkedKeys: string[]; halfCheckedKeys: string[] }) => {
  // checkedKeys 包含所有被选中和半选中的节点 key
  // 如果需要精确控制，只保留完全选中的叶子节点和父节点，可以进行额外处理
  // 这里直接使用 checkedKeys
  currentUserInfo.permissions.menus = [...checkedInfo.checkedKeys];
};

// 根据菜单 key 获取标签
const getMenuLabel = (key: string): string => {
  const findLabel = (nodes: Menu[]): string | null => {
    for (const node of nodes) {
      if (node.key === key) return node.label;
      if (node.children) {
        const found = findLabel(node.children);
        if (found) return found;
      }
    }
    return null;
  };
  return findLabel(menuTreeData.value) || key;
};

// 根据仓库 ID 获取标签
const getWarehouseLabel = (id: number): string => {
  const warehouse = warehouseList.value.find(w => w.id === id);
  return warehouse ? warehouse.name : `未知仓库(${id})`;
};
</script>

<style scoped>
.permission-management-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
