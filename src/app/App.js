import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import SettingsPanel from './shared/SettingsPanel';
import Footer from './shared/Footer';
import { withTranslation } from "react-i18next";
import { ThemeProvider } from '../context/themeContext';

class App extends Component {
  pageBodyWrapperRef = React.createRef();
  state = {
    isFullPageLayout: false
  };
  componentDidMount() {
    setTimeout(() => this.onRouteChanged(), 0);
  }
  render() {
    console.log('App 组件开始渲染');
    let navbarComponent = !this.state.isFullPageLayout ? <Navbar /> : '';
    let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar /> : '';
    let SettingsPanelComponent = !this.state.isFullPageLayout ? <SettingsPanel /> : '';
    let footerComponent = !this.state.isFullPageLayout ? <Footer /> : '';
    return (
      <ThemeProvider>
        <div className="container-scroller">
          {navbarComponent}
          <div className="container-fluid page-body-wrapper" ref={this.pageBodyWrapperRef}>
            {sidebarComponent}
            <div className="main-panel">
              <div className="content-wrapper">
                <AppRoutes />
                {SettingsPanelComponent}
              </div>
              {footerComponent}
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    // 3. 通过 Ref 获取元素（绝对不会是 null，因为 Ref 绑定在 render 的元素上）
    console.log('当前路由：', this.props.location.pathname);
    console.log('isFullPageLayout 状态：', this.state.isFullPageLayout);


    const pageBodyWrapper = this.pageBodyWrapperRef.current;
    if (!pageBodyWrapper) return; // 极端情况保险
    const fullPageLayoutRoutes = [
      '/user-pages/login-1',
      '/user-pages/register-1',
      '/user-pages/lockscreen'
    ];
    for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        this.setState({ isFullPageLayout: true });
        pageBodyWrapper.classList.add('full-page-wrapper'); // 安全操作
        break;
      } else {
        this.setState({ isFullPageLayout: false });
        pageBodyWrapper.classList.remove('full-page-wrapper'); // 安全操作
      }
    }
  }

}

export default withTranslation()(withRouter(App));
