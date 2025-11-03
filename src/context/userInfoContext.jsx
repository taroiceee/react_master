import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { fetchUserInfo } from '../utils/common'; // 调用模拟接口

// 定义用户信息的默认值（失败时显示）
const DEFAULT_USER_INFO = {
    userId: '',
    realName: '游客', // 默认显示“游客”
    role: { roleName: '未登录' },
    // 其他需要的默认字段...
};

export const UserContext = createContext({
    userInfo: DEFAULT_USER_INFO
})

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
  try {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      console.log('localStorage中的userInfo原始值：', stored); // 打印原始值
      return JSON.parse(stored); // 尝试解析
    }
    return DEFAULT_USER_INFO;
  } catch (err) {
    console.error('解析localStorage中的userInfo失败：', err); // 捕获并打印错误
    return DEFAULT_USER_INFO; // 解析失败时用默认值
  }
});
    console.log("进入context的UserProvider")

        // 新增：组件卸载时打印日志
    useEffect(() => {
        return () => {
            console.log("UserProvider 被卸载了");
        };
    }, []);


    useEffect(() => {
        let isMounted = true;
        console.log("进入context的useeffect")

        const fetchData = async () => {
            try {
                console.log("context开始fetch")

                const userData = await fetchUserInfo();
                console.log('userData', userData);
                if (isMounted) {
                    console.log('userData', userData);
                    setUserInfo(userData);
                    // localStorage.setItem('userInfo', JSON.stringify(userData));
                }

            } catch (err) {
                console.log(err)
            }
        };
        fetchData();
        return () => {
            isMounted = false
        }
    }, []);




    const contextValue = useMemo(() => ({
        userInfo
    }), [userInfo])

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
};
export const useUserInfo = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserInfo必须在ThemeProvider包裹的组件中使用');
    };
    return context;
}