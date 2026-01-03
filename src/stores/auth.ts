// stores/auth.js (或 stores/auth.ts)
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || null, // 初始化时从 localStorage 获取
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('authToken', token) // 同步到 localStorage
    },

    clearToken() {
      this.token = null
      localStorage.removeItem('authToken') // 同步移除 localStorage
    },
  },
})
