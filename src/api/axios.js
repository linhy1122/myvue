// axios.js
import axios from "axios";
import qs from "qs";

// 创建 axios 实例（推荐方式，而非直接修改 defaults）
const service = axios.create({
  baseURL: 'http://localhost:8899/Hello/api',
  timeout: 10000, // 10秒超时
});

// ======================
// 请求拦截器
// ======================
service.interceptors.request.use(
  (config) => {
    // 1. 自动序列化表单数据（仅对 x-www-form-urlencoded）
    if (
      config.method === 'post' &&
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data, { allowDots: true });
    }

    // 2. 开发环境日志（可选）
    if (process.env.NODE_ENV === 'development') {
      console.log(' 发起请求:', {
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    // 请求配置出错
    console.error('请求配置失败:', error);
    return Promise.reject(error); // 返回被拒绝的 Promise
  }
);

// ======================
// 响应拦截器
// ======================
service.interceptors.response.use(
  (response) => {
    // 成功响应（HTTP 状态码 2xx）
    // 假设后端返回格式：{ code: 200, msg: "...", data: ... }
    const res = response.data;

    if (res.code === 200 || res.success === true) {
      // 成功：只返回业务数据部分
      return Promise.resolve(res.data);
    } else {
      // 业务逻辑错误（如参数校验失败）
      console.error('业务错误:', res.msg || '未知错误');
      return Promise.reject(new Error(res.msg || '请求失败'));
    }
  },
  (error) => {
    // HTTP 状态码非 2xx（如 404, 500）或网络错误
    let message = '网络异常，请稍后重试';

    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          message = '请求参数错误';
          break;
        case 401:
          message = '未授权，请重新登录';
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = `接口不存在: ${error.response.config.url}`;
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `请求失败 [${status}]`;
      }
    } else if (error.request) {
      message = '网络连接失败，请检查网络';
    }

    console.error(' 请求失败:', message);
    return Promise.reject(new Error(message));
  }
);

// ======================
// 导出封装方法（保持你原有的 API 不变）
// ======================
export function get(url, params = {}) {
  return service.get(url, { params });
}

export function post(url, params = {}) {
  return service.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export function postJson(url, params = {}) {
  return service.post(url, params, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
