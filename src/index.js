import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import "./i18n"; // 保留原有的国际化配置
import * as serviceWorker from './serviceWorker';
// 引入 Ant Design 样式（v4 版本的 css 路径）
import 'antd/dist/antd.css';


// 1. 引入我们写的「应用初始化组件」（路径根据你实际存放位置调整，这里假设 AppInit 在 src 根目录）
import AppInit from './AppInit';

// 2. 核心修改：用 AppInit 包裹 App，其他配置（BrowserRouter、basename）完全保留
ReactDOM.render(
  <BrowserRouter basename="/demo/purple-react-free/template/demo_1/preview">
    {/* 插入 AppInit：先执行初始化（查用户数据），再渲染 App */}
    <AppInit>
      <App /> {/* App 会在初始化完成后渲染，且能拿到 Context 里的用户数据 */}
    </AppInit>
  </BrowserRouter>
  , document.getElementById('root'));

serviceWorker.unregister();