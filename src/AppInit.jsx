// 应用启动时的初始化业务逻辑
import React from 'react';
import { UserProvider } from './context/userInfoContext';


const AppInit = ({ children }) => {
  // 加载完成后，共享数据并渲染应用
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
};

export default AppInit;