import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import "./i18n";
import * as serviceWorker from './serviceWorker';
// 引入 Ant Design 样式（v4 版本的 css 路径）
import 'antd/dist/antd.css';



ReactDOM.render(
  <BrowserRouter basename="/demo/purple-react-free/template/demo_1/preview">
    <App />
  </BrowserRouter>
  , document.getElementById('root'));

serviceWorker.unregister();