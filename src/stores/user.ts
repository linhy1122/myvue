// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义用户类型
export interface User {
  id: number
  username: string // 账号名
  name: string // 用户名
  password: string // 密码 (实际应用中应加密存储，这里仅作示例)
  role: string // 用户角色
  status: 'active' | 'inactive' // 用户状态
}

// 模拟 API 调用函数 (实际应用中替换为真实API)
const mockApi = {
  fetchUsers: async (
    page: number,
    pageSize: number,
    query: string = '',
  ): Promise<{ users: User[]; total: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 500)) // 模拟网络延迟
    let allUsers: User[] = [
      {
        id: 1,
        username: 'admin',
        name: 'Admin User',
        password: 'hashed_password_1',
        role: 'Admin',
        status: 'active',
      },
      {
        id: 2,
        username: 'john_doe',
        name: 'John Doe',
        password: 'hashed_password_2',
        role: 'User',
        status: 'active',
      },
      {
        id: 3,
        username: 'jane_smith',
        name: 'Jane Smith',
        password: 'hashed_password_3',
        role: 'User',
        status: 'inactive',
      },
      {
        id: 4,
        username: 'new_user',
        name: 'New User',
        password: 'hashed_password_4',
        role: 'User',
        status: 'active',
      },
      {
        id: 5,
        username: 'test_user',
        name: 'Test User',
        password: 'hashed_password_5',
        role: 'Guest',
        status: 'inactive',
      },
      // ... 更多模拟数据
    ]

    if (query) {
      const lowerQuery = query.toLowerCase()
      allUsers = allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(lowerQuery) ||
          user.name.toLowerCase().includes(lowerQuery),
      )
    }

    const total = allUsers.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const users = allUsers.slice(start, end)

    return { users, total }
  },
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newUser: User = {
      ...userData,
      id: Date.now(), // 模拟生成ID
      password: 'default_password', // 模拟创建时的默认密码
    }
    console.log('Creating user:', newUser)
    return newUser
  },
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Updating user:', id, userData)
    // 模拟更新逻辑
    return { id, ...userData } as User
  },
  deleteUser: async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Deleting user:', id)
  },
  resetPassword: async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Resetting password for user:', id)
  },
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Changing password from:', currentPassword, 'to:', newPassword)
  },
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const searchQuery = ref('')

  const fetchUsers = async () => {
    loading.value = true
    try {
      const { users: fetchedUsers, total: fetchedTotal } = await mockApi.fetchUsers(
        currentPage.value,
        pageSize.value,
        searchQuery.value,
      )
      users.value = fetchedUsers
      total.value = fetchedTotal
    } catch (error) {
      console.error('Failed to fetch users:', error)
      // 处理错误，例如显示提示信息
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: Omit<User, 'id'>) => {
    try {
      const newUser = await mockApi.createUser(userData)
      users.value.unshift(newUser) // 添加到列表开头
      total.value++
      // 可能需要重新分页获取，或简单地添加到列表
      // await fetchUsers(); // 如果需要严格分页
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      const updatedUser = await mockApi.updateUser(id, userData)
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const deleteUser = async (id: number) => {
    try {
      await mockApi.deleteUser(id)
      users.value = users.value.filter((u) => u.id !== id)
      total.value--
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const resetPassword = async (id: number) => {
    try {
      await mockApi.resetPassword(id)
      // 通常会提示密码已重置
    } catch (error) {
      console.error('Failed to reset password:', error)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await mockApi.changePassword(currentPassword, newPassword)
      // 通常会提示密码修改成功
    } catch (error) {
      console.error('Failed to change password:', error)
    }
  }

  return {
    users,
    total,
    loading,
    currentPage,
    pageSize,
    searchQuery,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
    changePassword,
  }
})
