/*
 * @Author: thx wbtanhuax@szlanyou.com
 * @Date: 2025-11-02 22:56:53
 * @LastEditors: thx wbtanhuax@szlanyou.com
 * @LastEditTime: 2025-11-02 23:23:56
 * @FilePath: /react_master/src/context/themeContext.jsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// 主题初始设置/主题变更
import React, { createContext, useState, useEffect ,useContext} from 'react';

export const ThemeContext = createContext({
    theme: 'light',
    changeTheme: () => { }
});

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app_theme') || 'light';
    });
    // 切换主题时，更新 localStorage 并添加全局类名
    useEffect(() => {
        const root = document.documentElement; // 获取 html 根元素
        if (theme === 'dark') {
            root.classList.add('dark-theme'); // 添加深色模式类名
        } else {
            root.classList.remove('dark-theme'); // 移除深色模式类名
        }
        localStorage.setItem('app_theme', theme); // 持久化主题设置
    }, [theme]);



    const changeTheme = (checked) => {
        console.log('changeTheme 被调用，checked:', checked); // 新增日志，验证是否触发
        const newTheme = checked !== undefined
            ? (checked ? 'dark' : 'light')  // Switch 传入 true → dark，false → light
            : (theme === 'light' ? 'dark' : 'light');  // 无参数时翻转
        setTheme(newTheme);
        localStorage.setItem('app_theme', newTheme);
        console.log(`switch to ${newTheme}`);
    };

    const contextValue = { theme, changeTheme: changeTheme };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    )
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (typeof context.changeTheme !== 'function') {
        throw new Error('ThemeContext 中未找到有效的 toggleTheme 方法');
    }
    if (!context) {
        throw new Error('useTheme必须在ThemeProvider包裹的组件中使用');
    };

    return context;
}