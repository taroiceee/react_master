/*
 * @Author: thx wbtanhuax@szlanyou.com
 * @Date: 2025-10-24 20:11:09
 * @LastEditors: thx wbtanhuax@szlanyou.com
 * @LastEditTime: 2025-10-24 20:11:27
 * @FilePath: /react_master/src/api/ request.jsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// src/api/request.js （文件路径示例：和 dashboard.js 在同一个 api 文件夹下）
import axios from 'axios'; // 先安装 axios：npm install axios
import { message } from 'antd'; // 引入 Ant Design 的提示组件，统一弹窗提示错误

// 1. 创建 axios 实例（配置全局默认项）
const request = axios.create({
  baseURL: '', // 开发环境：Mock 服务拦截请求，不用填；后续对接真实后端时，填真实接口域名（如 'https://api.xxx.com'）
  timeout: 5000, // 超时时间：5秒没响应则报错
  headers: {
    'Content-Type': 'application/json', // 默认请求头：JSON 格式（后台接口常用）
  },
});

// 2. 请求拦截器（发请求前做的事）
request.interceptors.request.use(
  (config) => {
    // 示例1：给所有请求加 Token（后台系统鉴权必备）
    const token = localStorage.getItem('admin_token'); // 从本地存储取登录态
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 把 Token 放到请求头里
    }

    // 示例2：给 GET 请求加时间戳（避免浏览器缓存）
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(), // 追加一个时间戳参数
      };
    }

    return config; // 必须返回修改后的 config，否则请求发不出去
  },
  (error) => {
    // 请求还没发出去就报错了（比如网络错误）
    message.error('请求配置错误，请刷新页面重试');
    return Promise.reject(error); // 把错误抛出去，让调用者能 catch 到
  }
);

// 3. 响应拦截器（接收到后端响应后做的事）
request.interceptors.response.use(
  (response) => {
    // 示例1：统一提取 data 字段（后端返回格式通常是 { code, message, data }，前端只需要 data）
    const res = response.data;

    // 示例2：统一处理业务错误（比如 Token 过期、权限不足）
    if (res.code !== 200) { // 假设后端约定 code=200 是成功
      // 弹窗提示错误信息（用 Ant Design 的 message 组件，和你的项目风格统一）
      message.error(res.message || '接口请求失败，请重试');

      // 特殊场景：Token 过期，跳转登录页
      if (res.code === 401) {
        localStorage.removeItem('admin_token'); // 清除无效 Token
        window.location.href = '/login'; // 跳转到登录页
      }

      // 把错误抛出去，让调用者能 catch 到（比如处理加载状态）
      return Promise.reject(new Error(res.message || 'Error'));
    }

    // 成功：只返回 data 字段，简化前端使用（不用每次都写 res.data）
    return res.data;
  },
  (error) => {
    // 处理网络错误、超时等（非业务错误）
    const errorMsg = error.message.includes('timeout') 
      ? '请求超时，请检查网络' 
      : '网络错误，请稍后重试';
    message.error(errorMsg);
    return Promise.reject(error);
  }
);

// 4. 导出这个封装好的 axios 实例
export default request;