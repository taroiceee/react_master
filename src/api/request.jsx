import axios from 'axios';
import { message } from 'antd';

// 1. 创建 axios 实例（配置全局默认项）
const request = axios.create({
  baseURL: '', // 开发环境下，mock 服务会拦截此路径，无需填域名
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 请求拦截器（发请求前处理）
request.interceptors.request.use(
  (config) => {
    // 携带 Token（后台鉴权用，mock 环境可保留逻辑）
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // GET 请求加时间戳，避免缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => {
    message.error('请求配置错误，请刷新页面重试');
    return Promise.reject(error);
  }
);

// 3. 响应拦截器（接收到响应后处理，适配 mock 数据的 code: 0 成功标识）
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 匹配 mock 数据的成功标识（code: 0 表示成功，非0表示失败）
    if (res.code !== 0) {
      message.error(res.message || '接口请求失败，请重试');

      // Token 过期处理（401 是常见的未授权码）
      if (res.code === 401) {
        localStorage.removeItem('admin_token');
        window.location.href = '/login'; // 跳登录页
      }

      return Promise.reject(new Error(res.message || 'Error'));
    }

    // 成功时返回 data 字段（简化调用）
    return res.data;
  },
  (error) => {
    // 网络/超时错误处理
    const errorMsg = error.message.includes('timeout') 
      ? '请求超时，请检查网络' 
      : '网络错误，请稍后重试';
    message.error(errorMsg);
    return Promise.reject(error);
  }
);

// 4. 用户信息查询接口（适配 mock 数据的查询需求）
/**
 * 查询用户信息（支持分页、关键词筛选等）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码（默认1）
 * @param {number} params.pageSize - 每页条数（默认10）
 * @param {string} params.keyword - 搜索关键词（用户名/姓名）
 * @param {number} params.status - 账号状态（1正常，2禁用...）
 * @param {string} params.deptId - 部门ID（筛选指定部门用户）
 * @returns {Promise} - 返回用户信息数据（同 mock 中的 data 结构）
 */
export const getUserInfo = (params = {}) => {
  // 请求 mock 文件夹下的用户数据（路径根据你的实际存放位置调整）
  // 假设 mock 数据路径为：mock/api/userInfo.json（开发环境下会被 mock 服务拦截）
  return request.get('/mock/api/userInfo.json', { params });
};

// 5. 导出 axios 实例（如需扩展其他接口，可直接用 request 调用）
export default request;