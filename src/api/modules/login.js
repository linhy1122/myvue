// src/api/modules/login.js - 确保使用正确的字段名
import axios from 'axios'

export const loginPostJson = (loginData) => {
  // loginData 现在是 { Account: "xxx", pwd: "yyy" }
  const requestData = {
    account: loginData.Account, // 获取前端传递的 Account 字段
    pwd: loginData.pwd, // 获取前端传递的 pwd 字段
  }

  return axios.post('http://localhost:8899/Storage/api/login', requestData, {
    // Content-Type 会由 axios 自动设置为 application/json
  })
}
