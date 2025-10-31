// 应用启动时的初始化业务逻辑
import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { fetchUserInfo } from './utils/common'; // 调用模拟接口
import { message } from 'antd';

// 全局用户 Context
const UserContext = createContext(null);

// 方便组件获取用户数据的 Hook
export const useUser = () => useContext(UserContext);

// 初始化组件：只负责加载模拟用户数据，不涉及登录/token
const AppInit = ({ children }) => {
  const [initState, setInitState] = useState({
    loading: true, // 加载状态
    userData: null // 模拟用户数据
  });

  useEffect(() => {
    console.log('AppInit initState 变化：', initState);
  }, [initState]);

  // 应用启动时，直接加载本地模拟数据（不判断 token）
  useEffect(() => {
    let isMounted = true; // 标记组件是否已挂载
    const loadMockUserData = async () => {
      try {
        // 调用模拟接口（本地 mock 文件）
        console.log('开始加载用户数据'); // 日志2：确认函数执行
        const userData = await fetchUserInfo();
        // 仅在组件未卸载时更新状态
        if (isMounted) {
          setInitState({ loading: false, userData });
          console.log('加载成功，更新 loading 为 false'); // 日志3：确认更新状态
        }
      } catch (err) {
        // 失败只提示错误，不跳转（纯前端项目，无需登录）
        console.error('加载用户数据失败：', err); // 日志4：捕获错误（关键！）
        message.error('模拟用户数据加载失败，请检查 mock 文件路径');
        if (isMounted) {
          setInitState({ loading: false, userData: null });
        }
      }
    };

    loadMockUserData(); // 启动即执行，无 token 逻辑
    return () => {
      isMounted = false;
    };
  }, []);

  // 日志5：确认当前 loading 状态和是否进入渲染逻辑
  console.log('AppInit 渲染前：', initState.loading);

  // 加载中显示提示（不跳转任何页面）
  if (initState.loading) {
    console.log('当前处于加载中，显示加载提示'); // 日志6：确认是否停留在加载中
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff', zIndex: 9999
      }}>
        加载模拟用户数据中...
      </div>
    );
  }
  // 加载完成，渲染子组件（App）
  console.log('加载完成，渲染 App 组件'); // 日志7：确认是否进入此分支
  // 加载完成后，共享数据并渲染应用
  return (
    <UserContext.Provider value={initState.userData}>
      {children}
    </UserContext.Provider>
  );
};

export default AppInit;