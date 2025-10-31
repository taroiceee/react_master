// 主题初始设置/主题变更
import React, { createContext, useState, useEffect } from 'react';
// import { theme } from "antd";
// import context from "react-bootstrap/esm/AccordionContext";

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

