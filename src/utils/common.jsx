/*
 * @Author: thx wbtanhuax@szlanyou.com
 * @Date: 2025-11-02 22:56:53
 * @LastEditors: thx wbtanhuax@szlanyou.com
 * @LastEditTime: 2025-11-03 00:14:53
 * @FilePath: /react_master/src/utils/common.jsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
//公共方法
import { getUserInfo } from '../api/request'; // 引入封装的接口函数

/**
 * 公共方法：查询用户数据（支持传入查询参数）
 * @param {Object} params - 查询参数（如分页、关键词等）
 * @returns {Promise} - 用户信息数据
 */
export const fetchUserInfo = async (params = {}) => {
  try {
    console.log("fetchUserInfo开始调用接口")
    const data = await getUserInfo(params); // 调用接口
    console.log('查询用户数据成功：',data.userInfo)
    return data.userInfo; // 直接返回用户信息（简化后续使用）
  } catch (error) {
    console.error('查询用户数据失败：', error);
    throw error; // 抛出错误，让调用者处理（如显示错误提示）
  }
};

// 其他公共方法可以继续添加在这里（如格式化时间、权限判断等）
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};