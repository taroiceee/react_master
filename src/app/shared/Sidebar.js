import React, { useState, useEffect, useCallback } from 'react'; // 1. 导入函数组件所需Hook
import { Link, useLocation } from 'react-router-dom'; // 2. 导入useLocation替代withRouter获取路由信息
import { Collapse } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { useUser } from '../../AppInit'; // 引入获取用户数据的 Hook


// 3. 类组件改写为函数组件
const Sidebar = () => {
  // 4. 用useState替代this.state，管理菜单展开状态（初始值同原类组件空对象）
  const [menuState, setMenuState] = useState({});

  // 5. 用useLocation获取当前路由信息，替代this.props.location（无需再用withRouter包裹）
  const location = useLocation();
  const userData = useUser();

  // 6. 重写toggleMenuState方法：类组件this.setState改为函数组件setMenuState（函数式更新确保依赖旧状态）
  const toggleMenuState = (menuStateKey) => {
    setMenuState(prevState => {
      // 逻辑同原方法：先判断当前菜单是否已展开
      if (prevState[menuStateKey]) {
        return { ...prevState, [menuStateKey]: false };
      }
      // 若当前无展开菜单，直接展开目标菜单
      else if (Object.keys(prevState).length === 0) {
        return { [menuStateKey]: true };
      }
      // 若有其他展开菜单，先关闭所有再展开目标
      else {
        const newState = Object.keys(prevState).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        return { ...newState, [menuStateKey]: true };
      }
    });
  };
  // 8. 重写isPathActive方法：用useLocation获取的location替代this.props.location
  const isPathActive = useCallback((path) => {
    return location.pathname.startsWith(path);
  }, [location]);

  // 7. 重写onRouteChanged方法：替换this.state为menuState，this.setState为setMenuState
  const onRouteChanged = useCallback(() => {
    document.querySelector('#sidebar').classList.remove('active');

    // 关闭所有展开的菜单
    setMenuState(prevState => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      return newState;
    });

    // 匹配当前路由对应的菜单并展开
    const dropdownPaths = [
      { path: '/apps', state: 'appsMenuOpen' },
      { path: '/basic-ui', state: 'basicUiMenuOpen' },
      { path: '/advanced-ui', state: 'advancedUiMenuOpen' },
      { path: '/form-elements', state: 'formElementsMenuOpen' },
      { path: '/tables', state: 'tablesMenuOpen' },
      { path: '/maps', state: 'mapsMenuOpen' },
      { path: '/icons', state: 'iconsMenuOpen' },
      { path: '/charts', state: 'chartsMenuOpen' },
      { path: '/user-pages', state: 'userPagesMenuOpen' },
      { path: '/error-pages', state: 'errorPagesMenuOpen' },
      { path: '/general-pages', state: 'generalPagesMenuOpen' },
      { path: '/ecommerce', state: 'ecommercePagesMenuOpen' },
    ];

    dropdownPaths.forEach(obj => {
      if (isPathActive(obj.path)) {
        setMenuState(prevState => ({ ...prevState, [obj.state]: true }));
      }
    });
  }, [isPathActive]);



  // 9. 用useEffect模拟类组件的componentDidMount和componentDidUpdate生命周期
  useEffect(() => {
    // 执行路由变化后的逻辑（对应componentDidMount和componentDidUpdate）
    onRouteChanged();

    // 原componentDidMount中添加的鼠标hover事件
    const body = document.querySelector('body');
    const navItems = document.querySelectorAll('.sidebar .nav-item');

    // 定义事件处理函数（避免每次渲染创建新函数）
    const handleMouseOver = (el) => () => {
      if (body.classList.contains('sidebar-icon-only')) {
        el.classList.add('hover-open');
      }
    };
    const handleMouseOut = (el) => () => {
      if (body.classList.contains('sidebar-icon-only')) {
        el.classList.remove('hover-open');
      }
    };

    // 为每个导航项添加事件监听
    navItems.forEach(el => {
      el.addEventListener('mouseover', handleMouseOver(el));
      el.addEventListener('mouseout', handleMouseOut(el));
    });

    // 10. 组件卸载时清理事件监听（避免内存泄漏，对应类组件的componentWillUnmount）
    return () => {
      navItems.forEach(el => {
        el.removeEventListener('mouseover', handleMouseOver(el));
        el.removeEventListener('mouseout', handleMouseOut(el));
      });
    };
  }, [location, onRouteChanged]); // 依赖项为location：路由变化时重新执行（对应componentDidUpdate）
  console.log('Sidebar 开始渲染');
  // 11. 原render方法内容直接移至函数组件返回值，替换类组件语法
  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a href="!#" className="nav-link" onClick={evt => evt.preventDefault()}>
            <div className="nav-profile-image">
              <img src={require("../../assets/images/faces/face1.jpg")} alt="profile" />
              <span className="login-status online"></span> {/* change to offline or busy as needed */}
            </div>
            <div className="nav-profile-text">
              <span className="font-weight-bold mb-2"><Trans>{userData?.realName || 'Loading...'}</Trans></span>
              <span className="text-secondary text-small"><Trans>{userData?.role.roleName || 'Loading...'}</Trans></span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </a>
        </li>
        <li className={isPathActive('/dashboard') ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link" to="/dashboard">
            <span className="menu-title"><Trans>Dashboard</Trans></span>
            <i className="mdi mdi-home menu-icon"></i>
          </Link>
        </li>
        <li className={isPathActive('/basic-ui') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.basicUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('basicUiMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title"><Trans>Basic UI Elements</Trans></span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-crosshairs-gps menu-icon"></i>
          </div>
          <Collapse in={menuState.basicUiMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={isPathActive('/basic-ui/buttons') ? 'nav-link active' : 'nav-link'}
                  to="/basic-ui/buttons"
                >
                  <Trans>Buttons</Trans>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={isPathActive('/basic-ui/dropdowns') ? 'nav-link active' : 'nav-link'}
                  to="/basic-ui/dropdowns"
                >
                  <Trans>Dropdowns</Trans>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={isPathActive('/basic-ui/typography') ? 'nav-link active' : 'nav-link'}
                  to="/basic-ui/typography"
                >
                  <Trans>Typography</Trans>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li className={isPathActive('/form-elements') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.formElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('formElementsMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title"><Trans>Form Elements</Trans></span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-format-list-bulleted menu-icon"></i>
          </div>
          <Collapse in={menuState.formElementsMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={isPathActive('/form-elements/basic-elements') ? 'nav-link active' : 'nav-link'}
                  to="/form-elements/basic-elements"
                >
                  <Trans>Basic Elements</Trans>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li className={isPathActive('/tables') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.tablesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('tablesMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title"><Trans>Tables</Trans></span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-table-large menu-icon"></i>
          </div>
          <Collapse in={menuState.tablesMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={isPathActive('/tables/basic-table') ? 'nav-link active' : 'nav-link'}
                  to="/tables/basic-table"
                >
                  <Trans>Basic Table</Trans>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li className={isPathActive('/icons') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.iconsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('iconsMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title"><Trans>Icons</Trans></span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-contacts menu-icon"></i>
          </div>
          <Collapse in={menuState.iconsMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={isPathActive('/icons/mdi') ? 'nav-link active' : 'nav-link'}
                  to="/icons/mdi"
                >
                  <Trans>Material</Trans>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li className={isPathActive('/charts') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.chartsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('chartsMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title"><Trans>Charts</Trans></span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-chart-bar menu-icon"></i>
          </div>
          <Collapse in={menuState.chartsMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={isPathActive('/charts/chart-js') ? 'nav-link active' : 'nav-link'}
                  to="/charts/chart-js"
                >
                  <Trans>Chart Js</Trans>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li className={isPathActive('/user-pages') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.userPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('userPagesMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title"><Trans>User Pages</Trans></span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-lock menu-icon"></i>
          </div>
          <Collapse in={menuState.userPagesMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={isPathActive('/user-pages/login-1') ? 'nav-link active' : 'nav-link'}
                  to="/user-pages/login-1"
                >
                  <Trans>Login</Trans>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={isPathActive('/user-pages/register-1') ? 'nav-link active' : 'nav-link'}
                  to="/user-pages/register-1"
                >
                  <Trans>Register</Trans>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={isPathActive('/user-pages/lockscreen') ? 'nav-link active' : 'nav-link'}
                  to="/user-pages/lockscreen"
                >
                  <Trans>Lockscreen</Trans>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li className={isPathActive('/error-pages') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.errorPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('errorPagesMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title"><Trans>Error Pages</Trans></span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-security menu-icon"></i>
          </div>
          <Collapse in={menuState.errorPagesMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={isPathActive('/error-pages/error-404') ? 'nav-link active' : 'nav-link'}
                  to="/error-pages/error-404"
                >
                  404
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={isPathActive('/error-pages/error-500') ? 'nav-link active' : 'nav-link'}
                  to="/error-pages/error-500"
                >
                  500
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li className={isPathActive('/general-pages') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.generalPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('generalPagesMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title"><Trans>General Pages</Trans></span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-medical-bag menu-icon"></i>
          </div>
          <Collapse in={menuState.generalPagesMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={isPathActive('/general-pages/blank-page') ? 'nav-link active' : 'nav-link'}
                  to="/general-pages/blank-page"
                >
                  <Trans>Blank Page</Trans>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="http://bootstrapdash.com/demo/purple-react-free/documentation/documentation.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="menu-title"><Trans>Documentation</Trans></span>
            <i className="mdi mdi-file-document-box menu-icon"></i>
          </a>
        </li>
        <li className={isPathActive('/tables') ? 'nav-item active' : 'nav-item'}>
          <div
            className={menuState.tablesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'}
            onClick={() => toggleMenuState('tablesMenuOpen')}
            data-toggle="collapse"
          >
            <span className="menu-title"><Trans>看板</Trans></span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-table-large menu-icon"></i>
          </div>
          <Collapse in={menuState.tablesMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link
                  className={isPathActive('/shujukanban') ? 'nav-link active' : 'nav-link'}
                  to="/shujukanban"
                >
                  <Trans>数据看板</Trans>
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
      </ul>
    </nav>
  );
};

// 12. 无需再用withRouter包裹（useLocation已获取路由信息），直接导出
export default Sidebar;