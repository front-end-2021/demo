import { useEffect, useContext, useReducer, useMemo } from 'react';
import LayoutNav from './LayoutNav';
import { Helpers } from './js/helpers';
import { Menu } from './js/menu';
import PerfectScrollbar from 'perfect-scrollbar';
import {
  RouterContext, router, routerReducer,
  user, userReducer, UserContext
} from './DataContext'

import HomeContent from './HomeContent';
import {
  LayoutWithoutMenu, LayoutWithoutNavbar,
  LayoutWithContainer, LayoutWithFluid
} from './layouts/Layouts'
import { AccountSettings } from './pages/PagesAccountSettings';
import AuthForms, { LogoSneat } from './forms/AuthForms';
import PagesMisc from './pages/PagesMisc';
import { CardBasic } from './forms/CardExtendUi';
import { UiAccordion, UiAlert, UiBadges } from './uis/UserInterfaces';

import './fonts/boxicons.scss';
import './scss/core.scss';
import './scss/theme-default.scss';
import './css/demo.css';
import '../node_modules/perfect-scrollbar/css/perfect-scrollbar.css';
import '../node_modules/apexcharts-clevision/dist/apexcharts.css';

window.Helpers = Helpers
window.PerfectScrollbar = PerfectScrollbar

function App() {
  const [layout, setLayout] = useReducer(routerReducer, router.Home);
  const [person, setPerson] = useReducer(userReducer, user);

  const LayoutType = useMemo(() => {
    switch (layout) {
      case router.Home: return 1;
      case router.LayoutWithoutMenu: return 2;
      case router.LayoutWithoutNavbar: return 3
      case router.LayoutWithContainer: return 4;
      case router.LayoutWithFluid: return 5;
      case router.LayoutWithBlank: return 6;
      case router.AccountSettingsAccount:
      case router.AccountSettingsNotify:
      case router.AccountSettingsConnect: return 7;
      case router.ComponentsCards: return 8;
      case router.UIAccordion: return 9;
      case router.UIAlert: return 10;
      case router.UIBadges: return 11;
      case router.AuthLoginBasic:
      case router.AuthRegisterBasic:
      case router.AuthForgotPassword: return 89;
      case router.PageMiscError:
      case router.PageMiscMaintain: return 90;
      default: return 0
    }
  }, [layout])

  return (
    <RouterContext.Provider value={{ layout, setLayout }}>
      <UserContext.Provider value={{ person, setPerson }} >
        {(0 < LayoutType && LayoutType < 89) && (
          <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
              <LayoutMenu />
              <div className="layout-page">
                <LayoutNav></LayoutNav>

                <div className="content-wrapper">

                  {LayoutType == 1 && <HomeContent />}
                  {LayoutType == 2 && <LayoutWithoutMenu />}
                  {LayoutType == 3 && <LayoutWithoutNavbar />}
                  {LayoutType == 4 && <LayoutWithContainer />}
                  {LayoutType == 5 && <LayoutWithFluid />}
                  {LayoutType == 6 && <h4 className="fw-bold p-4">Blank Page</h4>}
                  {LayoutType == 7 && <AccountSettings />}
                  {LayoutType == 8 && <CardBasic />}
                  {LayoutType == 9 && <UiAccordion />}
                  {LayoutType == 10 && <UiAlert />}
                  {LayoutType == 11 && <UiBadges />}

                  <Footer ></Footer>

                  <div className="content-backdrop fade"></div>
                </div>

              </div>
            </div >
            <div className="layout-overlay layout-menu-toggle"></div>
          </div >
        )}
        {LayoutType == 89 && <AuthForms />}
        {LayoutType == 90 && <PagesMisc />}
      </UserContext.Provider>
      <div className="buy-now">
        <a className="btn btn-danger btn-buy-now"
          href="#pro"
          target="_blank">Upgrade to Pro</a>
      </div>
    </RouterContext.Provider>
  );
}

function LayoutMenu() {
  const { layout, setLayout } = useContext(RouterContext);
  useEffect(() => {
    let layoutMenuEl = document.querySelectorAll('#layout-menu');
    layoutMenuEl.forEach(function (element) {
      const menu = new Menu(element, {
        orientation: 'vertical',
        closeChildren: false
      })
      // Change parameter to true if you want scroll animation
      const animate = false
      Helpers.scrollToActive((animate));
      Helpers.mainMenu = menu;
    });
  })

  const ActiveC = useMemo(
    () => {
      switch (layout) {
        case router.Home: return 1;    // active Home
        case router.LayoutWithoutMenu:
        case router.LayoutWithoutNavbar:
        case router.LayoutWithContainer:
        case router.LayoutWithFluid:
        case router.LayoutWithBlank: return 2;  // active Layout
        case router.AccountSettingsAccount:
        case router.AccountSettingsNotify:
        case router.AccountSettingsConnect: return 3; // active Account
        case router.AuthRegisterBasic:
        case router.AuthForgotPassword:
        case router.AuthLoginBasic: return 4;   // active Auth Forms
        case router.PageMiscError:
        case router.PageMiscMaintain: return 5;   // active Miscs
        case router.ComponentsCards: return 6;   // active Cards
        case router.UIAccordion:
        case router.UIBadges:
        case router.UIAlert: return 7;   // active User Interface Accordion
        default: return 0
      }
    }, [layout]
  )

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo">
        <LogoSneat />
        <a href="" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
          <i className="bx bx-chevron-left bx-sm align-middle"></i>
        </a>
      </div>
      <div className="menu-inner-shadow"></div>
      <ul className="menu-inner py-1">

        <li className={`menu-item${ActiveC == 1 ? ' active' : ''}`}>
          <a href="#" className="menu-link" onClick={() => setLayout('BACK_ROOT')}>
            <i className="menu-icon tf-icons bx bx-home-circle"></i>
            <div data-i18n="Analytics">Dashboard</div>
          </a>
        </li>

        <li className={`menu-item${ActiveC == 2 ? ' active open' : ''}`}>
          <a href="#layout" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-layout"></i>
            <div data-i18n="Layouts">Layouts</div>
          </a>

          <ul className="menu-sub">
            <li className={`menu-item${layout == router.LayoutWithoutMenu ? ' active' : ''}`}>
              <a href="#without-menu" className="menu-link"
                onClick={() => setLayout('LAYOUT_WITHOUT_MENU')}>
                <div data-i18n="Without menu">Without menu</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.LayoutWithoutNavbar ? ' active' : ''}`}>
              <a href="#without-navbar" className="menu-link"
                onClick={() => setLayout('LAYOUT_WITHOUT_NAVBAR')}>
                <div data-i18n="Without navbar">Without navbar</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.LayoutWithContainer ? ' active' : ''}`}>
              <a href="#layouts-container" className="menu-link"
                onClick={() => setLayout('LAYOUT_WITH_CONTAINER')}>
                <div data-i18n="Container">Container</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.LayoutWithFluid ? ' active' : ''}`}>
              <a href="#layouts-fluid" className="menu-link"
                onClick={() => setLayout('LAYOUT_WITH_FLUID')}>
                <div data-i18n="Fluid">Fluid</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.LayoutWithBlank ? ' active' : ''}`}>
              <a href="#layouts-blank" className="menu-link"
                onClick={() => setLayout('LAYOUT_WITH_BLANK')}>
                <div data-i18n="Blank">Blank</div>
              </a>
            </li>
          </ul>
        </li>

        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Pages</span>
        </li>
        <li className={`menu-item${ActiveC == 3 ? ' active open' : ''}`}>
          <a href="#account-settings" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top"></i>
            <div data-i18n="Account Settings">Account Settings</div>
          </a>
          <ul className="menu-sub">
            <li className={`menu-item${layout == router.AccountSettingsAccount ? ' active' : ''}`}>
              <a href="#account-settings-account" className="menu-link"
                onClick={() => setLayout('ACCOUNT_SETTINGS_ACCOUNT')}>
                <div data-i18n="Account">Account</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.AccountSettingsNotify ? ' active' : ''}`}>
              <a href="#account-settings-notifications" className="menu-link"
                onClick={() => setLayout('ACCOUNT_SETTINGS_NOTIFY')}>
                <div data-i18n="Notifications">Notifications</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.AccountSettingsConnect ? ' active' : ''}`}>
              <a href="#account-settings-connections" className="menu-link"
                onClick={() => setLayout('ACCOUNT_SETTINGS_CONNECT')}>
                <div data-i18n="Connections">Connections</div>
              </a>
            </li>
          </ul>
        </li>
        <li className={`menu-item${ActiveC == 4 ? ' active open' : ''}`}>
          <a href="#authen" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-lock-open-alt"></i>
            <div data-i18n="Authentications">Authentications</div>
          </a>
          <ul className="menu-sub">
            <li className={`menu-item${layout == router.AuthLoginBasic ? ' active' : ''}`}>
              <a href="#auth-login-basic" className="menu-link"
                onClick={() => setLayout('AUTH_LOGIN_BASIC')}>
                <div data-i18n="Basic">Login</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.AuthRegisterBasic ? ' active' : ''}`}>
              <a href="#auth-register-basic" className="menu-link"
                onClick={() => setLayout('AUTH_REGISTER_BASIC')}>
                <div data-i18n="Basic">Register</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.AuthForgotPassword ? ' active' : ''}`}>
              <a href="#auth-forgot-password" className="menu-link"
                onClick={() => setLayout('AUTH_FORGOT_PASS')}>
                <div data-i18n="Basic">Forgot Password</div>
              </a>
            </li>
          </ul>
        </li>
        <li className={`menu-item${ActiveC == 5 ? ' active open' : ''}`}>
          <a href="#misc" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-cube-alt"></i>
            <div data-i18n="Misc">Misc</div>
          </a>
          <ul className="menu-sub">
            <li className={`menu-item${layout == router.PageMiscError ? ' active' : ''}`}>
              <a href="#pages-misc-error" className="menu-link"
                onClick={() => setLayout('PAGE_MISC_ERROR')}>
                <div data-i18n="Error">Error</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.PageMiscMaintain ? ' active' : ''}`}>
              <a href="#pages-misc-under-maintenance" className="menu-link"
                onClick={() => setLayout('PAGE_MISC_MAINTAIN')}>
                <div data-i18n="Under Maintenance">Under Maintenance</div>
              </a>
            </li>
          </ul>
        </li>

        <li className="menu-header small text-uppercase"><span className="menu-header-text">Components</span></li>

        <li className={`menu-item${ActiveC == 6 ? ' active' : ''}`}>
          <a href="#cards-basic" className="menu-link"
            onClick={() => setLayout('COMPONENTS_CARDS')}>
            <i className="menu-icon tf-icons bx bx-collection"></i>
            <div data-i18n="Basic">Cards</div>
          </a>
        </li>

        <li className={`menu-item${ActiveC == 7 ? ' active open' : ''}`}>
          <a href="#user-interface" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-box"></i>
            <div data-i18n="User interface">User interface</div>
          </a>
          <ul className="menu-sub">
            <li className={`menu-item${layout == router.UIAccordion ? ' active' : ''}`}>
              <a href="#ui-accordion" className="menu-link" onClick={() => setLayout('UI_ACCORDION')}>
                <div data-i18n="Accordion">Accordion</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIAlert ? ' active' : ''}`}>
              <a href="#ui-alerts" className="menu-link" onClick={() => setLayout('UI_ALERT')}>
                <div data-i18n="Alerts">Alerts</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIBadges ? ' active' : ''}`}>
              <a href="#ui-badges" className="menu-link" onClick={() => setLayout('UI_BADGES')}>
                <div data-i18n="Badges">Badges</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-buttons.html" className="menu-link">
                <div data-i18n="Buttons">Buttons</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-carousel.html" className="menu-link">
                <div data-i18n="Carousel">Carousel</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-collapse.html" className="menu-link">
                <div data-i18n="Collapse">Collapse</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-dropdowns.html" className="menu-link">
                <div data-i18n="Dropdowns">Dropdowns</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-footer.html" className="menu-link">
                <div data-i18n="Footer">Footer</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-list-groups.html" className="menu-link">
                <div data-i18n="List Groups">List groups</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-modals.html" className="menu-link">
                <div data-i18n="Modals">Modals</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-navbar.html" className="menu-link">
                <div data-i18n="Navbar">Navbar</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-offcanvas.html" className="menu-link">
                <div data-i18n="Offcanvas">Offcanvas</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-pagination-breadcrumbs.html" className="menu-link">
                <div data-i18n="Pagination &amp; Breadcrumbs">Pagination &amp; Breadcrumbs</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-progress.html" className="menu-link">
                <div data-i18n="Progress">Progress</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-spinners.html" className="menu-link">
                <div data-i18n="Spinners">Spinners</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-tabs-pills.html" className="menu-link">
                <div data-i18n="Tabs &amp; Pills">Tabs &amp; Pills</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-toasts.html" className="menu-link">
                <div data-i18n="Toasts">Toasts</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-tooltips-popovers.html" className="menu-link">
                <div data-i18n="Tooltips & Popovers">Tooltips &amp; popovers</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="ui-typography.html" className="menu-link">
                <div data-i18n="Typography">Typography</div>
              </a>
            </li>
          </ul>
        </li>

        <li className="menu-item">
          <a href="void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-copy"></i>
            <div data-i18n="Extended UI">Extended UI</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="extended-ui-perfect-scrollbar.html" className="menu-link">
                <div data-i18n="Perfect Scrollbar">Perfect scrollbar</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="extended-ui-text-divider.html" className="menu-link">
                <div data-i18n="Text Divider">Text Divider</div>
              </a>
            </li>
          </ul>
        </li>

        <li className="menu-item">
          <a href="icons-boxicons.html" className="menu-link">
            <i className="menu-icon tf-icons bx bx-crown"></i>
            <div data-i18n="Boxicons">Boxicons</div>
          </a>
        </li>

        <li className="menu-header small text-uppercase"><span className="menu-header-text">Forms &amp; Tables</span></li>

        <li className="menu-item">
          <a href="void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-detail"></i>
            <div data-i18n="Form Elements">Form Elements</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="forms-basic-inputs.html" className="menu-link">
                <div data-i18n="Basic Inputs">Basic Inputs</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="forms-input-groups.html" className="menu-link">
                <div data-i18n="Input groups">Input groups</div>
              </a>
            </li>
          </ul>
        </li>
        <li className="menu-item">
          <a href="void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-detail"></i>
            <div data-i18n="Form Layouts">Form Layouts</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="form-layouts-vertical.html" className="menu-link">
                <div data-i18n="Vertical Form">Vertical Form</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="form-layouts-horizontal.html" className="menu-link">
                <div data-i18n="Horizontal Form">Horizontal Form</div>
              </a>
            </li>
          </ul>
        </li>

        <li className="menu-item">
          <a href="tables-basic.html" className="menu-link">
            <i className="menu-icon tf-icons bx bx-table"></i>
            <div data-i18n="Tables">Tables</div>
          </a>
        </li>

        <li className="menu-header small text-uppercase"><span className="menu-header-text">Misc</span></li>
        <li className="menu-item">
          <a
            href="https://github.com/themeselection/sneat-html-admin-template-free/issues"
            target="_blank"
            className="menu-link" >
            <i className="menu-icon tf-icons bx bx-support"></i>
            <div data-i18n="Support">Support</div>
          </a>
        </li>
        <li className="menu-item">
          <a
            href="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/"
            target="_blank"
            className="menu-link" >
            <i className="menu-icon tf-icons bx bx-file"></i>
            <div data-i18n="Documentation">Documentation</div>
          </a>
        </li>
      </ul>
    </aside>
  )
}
function Footer() {
  return (
    <footer className="content-footer footer bg-footer-theme">
      <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
        <div className="mb-2 mb-md-0">
          ©
          <script>
            document.write(new Date().getFullYear());
          </script> , made with ❤️ by
          <a href="https://themeselection.com" target="_blank" className="footer-link fw-bolder">ThemeSelection</a>
        </div>
        <div>
          <a href="https://themeselection.com/license/" className="footer-link me-4" target="_blank">License</a>
          <a href="https://themeselection.com/" target="_blank" className="footer-link me-4">More Themes</a>

          <a
            href="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/"
            target="_blank"
            className="footer-link me-4"
          >Documentation</a>

          <a
            href="https://github.com/themeselection/sneat-html-admin-template-free/issues"
            target="_blank"
            className="footer-link me-4"
          >Support</a>
        </div>
      </div>
    </footer>
  )
}


export default App;