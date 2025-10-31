// 封装useContext调用
import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";

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