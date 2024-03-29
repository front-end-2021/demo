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
} from './menu-layouts/Layouts'
import { AccountSettings } from './menu-pages/PagesAccountSettings';
import AuthForms, { LogoSneat } from './menu-pages/AuthForms';
import PagesMisc from './menu-pages/PagesMisc';
import { CardBasic } from './menu-components/CardExtendUi';
import UserInterfaces from './menu-components/UserInterfaces';
import ExtendedUI from './menu-components/ExtendedUi';
import IconsBoxicons from './menu-components/IconsBoxicons';
import FormElements from './menu-forms-tables/FormElements';

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
      case router.UIAccordion:
      case router.UIAlert:
      case router.UIButtons:
      case router.UICarousel:
      case router.UIDropdowns:
      case router.UICollapse:
      case router.UIFooter:
      case router.UIListGroups:
      case router.UIModals:
      case router.UINavbar:
      case router.UIOffcanvas:
      case router.UIPaginationBreadcrumbs:
      case router.UIProgress:
      case router.UISpinners:
      case router.UITabsPills:
      case router.UIToasts:
      case router.UITooltipsPopovers:
      case router.UITypography:
      case router.UIBadges: return 9;
      case router.ExtUiPerfectScrollbar:
      case router.ExtUiTextDivider: return 10;
      case router.CompBoxicons: return 11;
      case router.FormBasicInputs:
      case router.FormLayoutVertical:
      case router.FormLayoutHorizontal:
      case router.Tables:
      case router.FormInputGroups: return 12;
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
                  {LayoutType == 9 && <UserInterfaces />}
                  {LayoutType == 10 && <ExtendedUI />}
                  {LayoutType == 11 && <IconsBoxicons />}
                  {LayoutType == 12 && <FormElements />}

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
        case router.UIButtons:
        case router.UICarousel:
        case router.UIDropdowns:
        case router.UICollapse:
        case router.UIFooter:
        case router.UIListGroups:
        case router.UIModals:
        case router.UINavbar:
        case router.UIOffcanvas:
        case router.UIPaginationBreadcrumbs:
        case router.UIProgress:
        case router.UISpinners:
        case router.UITabsPills:
        case router.UIToasts:
        case router.UITooltipsPopovers:
        case router.UITypography:
        case router.UIAlert: return 7;   // active User Interface
        case router.ExtUiPerfectScrollbar:
        case router.ExtUiTextDivider: return 8;   // active Extended UI
        case router.FormBasicInputs:
        case router.FormInputGroups: return 9;   // active Form Elements
        case router.FormLayoutVertical:
        case router.FormLayoutHorizontal: return 10; // active Form Layouts
        default: return 0
      }
    }, [layout]
  )

  useEffect(() => {
    let layoutMenuEl = document.querySelectorAll('#layout-menu');
    layoutMenuEl.forEach(function (element) {
      const menu = new Menu(element, {
        orientation: 'vertical',
        closeChildren: false
      })
      // Change parameter to true if you want scroll animation
      const animate = true
      window.Helpers.scrollToActive((animate));
      window.Helpers.mainMenu = menu;
    });
  }, [ActiveC])
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
          <a href="#" className="menu-link" onClick={() => setLayout(router.Home)}>
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
                onClick={() => setLayout(router.LayoutWithoutMenu)}>
                <div data-i18n="Without menu">Without menu</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.LayoutWithoutNavbar ? ' active' : ''}`}>
              <a href="#without-navbar" className="menu-link"
                onClick={() => setLayout(router.LayoutWithoutNavbar)}>
                <div data-i18n="Without navbar">Without navbar</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.LayoutWithContainer ? ' active' : ''}`}>
              <a href="#layouts-container" className="menu-link"
                onClick={() => setLayout(router.LayoutWithContainer)}>
                <div data-i18n="Container">Container</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.LayoutWithFluid ? ' active' : ''}`}>
              <a href="#layouts-fluid" className="menu-link"
                onClick={() => setLayout(router.LayoutWithFluid)}>
                <div data-i18n="Fluid">Fluid</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.LayoutWithBlank ? ' active' : ''}`}>
              <a href="#layouts-blank" className="menu-link"
                onClick={() => setLayout(router.LayoutWithBlank)}>
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
                onClick={() => setLayout(router.AccountSettingsAccount)}>
                <div data-i18n="Account">Account</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.AccountSettingsNotify ? ' active' : ''}`}>
              <a href="#account-settings-notifications" className="menu-link"
                onClick={() => setLayout(router.AccountSettingsNotify)}>
                <div data-i18n="Notifications">Notifications</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.AccountSettingsConnect ? ' active' : ''}`}>
              <a href="#account-settings-connections" className="menu-link"
                onClick={() => setLayout(router.AccountSettingsConnect)}>
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
                onClick={() => setLayout(router.AuthLoginBasic)}>
                <div data-i18n="Basic">Login</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.AuthRegisterBasic ? ' active' : ''}`}>
              <a href="#auth-register-basic" className="menu-link"
                onClick={() => setLayout(router.AuthRegisterBasic)}>
                <div data-i18n="Basic">Register</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.AuthForgotPassword ? ' active' : ''}`}>
              <a href="#auth-forgot-password" className="menu-link"
                onClick={() => setLayout(router.AuthForgotPassword)}>
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
                onClick={() => setLayout(router.PageMiscError)}>
                <div data-i18n="Error">Error</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.PageMiscMaintain ? ' active' : ''}`}>
              <a href="#pages-misc-under-maintenance" className="menu-link"
                onClick={() => setLayout(router.PageMiscMaintain)}>
                <div data-i18n="Under Maintenance">Under Maintenance</div>
              </a>
            </li>
          </ul>
        </li>

        <li className="menu-header small text-uppercase"><span className="menu-header-text">Components</span></li>

        <li className={`menu-item${ActiveC == 6 ? ' active' : ''}`}>
          <a href="#cards-basic" className="menu-link"
            onClick={() => setLayout(router.ComponentsCards)}>
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
              <a href="#ui-accordion" className="menu-link"
                onClick={() => setLayout(router.UIAccordion)}>
                <div data-i18n="Accordion">Accordion</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIAlert ? ' active' : ''}`}>
              <a href="#ui-alerts" className="menu-link" onClick={() => setLayout(router.UIAlert)}>
                <div data-i18n="Alerts">Alerts</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIBadges ? ' active' : ''}`}>
              <a href="#ui-badges" className="menu-link" onClick={() => setLayout(router.UIBadges)}>
                <div data-i18n="Badges">Badges</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIButtons ? ' active' : ''}`}>
              <a href="#ui-buttons" className="menu-link" onClick={() => setLayout(router.UIButtons)}>
                <div data-i18n="Buttons">Buttons</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UICarousel ? ' active' : ''}`}>
              <a href="#ui-carousel" className="menu-link" onClick={() => setLayout(router.UICarousel)}>
                <div data-i18n="Carousel">Carousel</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UICollapse ? ' active' : ''}`}>
              <a href="#ui-collapse" className="menu-link" onClick={() => setLayout(router.UICollapse)}>
                <div data-i18n="Collapse">Collapse</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIDropdowns ? ' active' : ''}`}>
              <a href="#ui-dropdowns" className="menu-link" onClick={() => setLayout(router.UIDropdowns)}>
                <div data-i18n="Dropdowns">Dropdowns</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIFooter ? ' active' : ''}`}>
              <a href="#ui-footer" className="menu-link" onClick={() => setLayout(router.UIFooter)}>
                <div data-i18n="Footer">Footer</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIListGroups ? ' active' : ''}`}>
              <a href="#ui-list-groups" className="menu-link"
                onClick={() => setLayout(router.UIListGroups)}>
                <div data-i18n="List Groups">List groups</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIModals ? ' active' : ''}`}>
              <a href="#ui-modals" className="menu-link" onClick={() => setLayout(router.UIModals)}>
                <div data-i18n="Modals">Modals</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UINavbar ? ' active' : ''}`}>
              <a href="#ui-navbar" className="menu-link" onClick={() => setLayout(router.UINavbar)}>
                <div data-i18n="Navbar">Navbar</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIOffcanvas ? ' active' : ''}`}>
              <a href="#ui-offcanvas" className="menu-link" onClick={() => setLayout(router.UIOffcanvas)}>
                <div data-i18n="Offcanvas">Offcanvas</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIPaginationBreadcrumbs ? ' active' : ''}`}>
              <a href="#ui-pagination-breadcrumbs" className="menu-link"
                onClick={() => setLayout(router.UIPaginationBreadcrumbs)}>
                <div data-i18n="Pagination &amp; Breadcrumbs">Pagination &amp; Breadcrumbs</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIProgress ? ' active' : ''}`}>
              <a href="#ui-progress" className="menu-link" onClick={() => setLayout(router.UIProgress)}>
                <div data-i18n="Progress">Progress</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UISpinners ? ' active' : ''}`}>
              <a href="#ui-spinners" className="menu-link" onClick={() => setLayout(router.UISpinners)}>
                <div data-i18n="Spinners">Spinners</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UITabsPills ? ' active' : ''}`}>
              <a href="#ui-tabs-pills" className="menu-link" onClick={() => setLayout(router.UITabsPills)}>
                <div data-i18n="Tabs &amp; Pills">Tabs &amp; Pills</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UIToasts ? ' active' : ''}`}>
              <a href="#ui-toasts" className="menu-link" onClick={() => setLayout(router.UIToasts)}>
                <div data-i18n="Toasts">Toasts</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UITooltipsPopovers ? ' active' : ''}`}>
              <a href="#ui-tooltips-popovers" className="menu-link"
                onClick={() => setLayout(router.UITooltipsPopovers)}>
                <div data-i18n="Tooltips & Popovers">Tooltips &amp; popovers</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.UITypography ? ' active' : ''}`}>
              <a href="#ui-typography" className="menu-link"
                onClick={() => setLayout(router.UITypography)}>
                <div data-i18n="Typography">Typography</div>
              </a>
            </li>
          </ul>
        </li>

        <li className={`menu-item${ActiveC == 8 ? ' active open' : ''}`}>
          <a href="#extended-ui" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-copy"></i>
            <div data-i18n="Extended UI">Extended UI</div>
          </a>
          <ul className="menu-sub">
            <li className={`menu-item${layout == router.ExtUiPerfectScrollbar ? ' active' : ''}`}>
              <a href="#ext-ui-perfect-scrollbar" className="menu-link"
                onClick={() => setLayout(router.ExtUiPerfectScrollbar)}>
                <div data-i18n="Perfect Scrollbar">Perfect scrollbar</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.ExtUiTextDivider ? ' active' : ''}`}>
              <a href="#ext-ui-text-divider" className="menu-link"
                onClick={() => setLayout(router.ExtUiTextDivider)}>
                <div data-i18n="Text Divider">Text Divider</div>
              </a>
            </li>
          </ul>
        </li>

        <li className={`menu-item${layout == router.CompBoxicons ? ' active' : ''}`}>
          <a href={router.CompBoxicons} className="menu-link"
            onClick={() => setLayout(router.CompBoxicons)}>
            <i className="menu-icon tf-icons bx bx-crown"></i>
            <div data-i18n="Boxicons">Boxicons</div>
          </a>
        </li>

        <li className="menu-header small text-uppercase"><span className="menu-header-text">Forms &amp; Tables</span></li>
        <li className={`menu-item${ActiveC == 9 ? ' active open' : ''}`}>
          <a href="#form-elements" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-detail"></i>
            <div data-i18n="Form Elements">Form Elements</div>
          </a>
          <ul className="menu-sub">
            <li className={`menu-item${layout == router.FormBasicInputs ? ' active' : ''}`}>
              <a href={router.FormBasicInputs} className="menu-link"
                onClick={() => setLayout(router.FormBasicInputs)}>
                <div data-i18n="Basic Inputs">Basic Inputs</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.FormInputGroups ? ' active' : ''}`}>
              <a href={router.FormInputGroups} className="menu-link"
                onClick={() => setLayout(router.FormInputGroups)}>
                <div data-i18n="Input groups">Input groups</div>
              </a>
            </li>
          </ul>
        </li>
        <li className={`menu-item${ActiveC == 10 ? ' active open' : ''}`}>
          <a href="#form-layouts" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-detail"></i>
            <div data-i18n="Form Layouts">Form Layouts</div>
          </a>
          <ul className="menu-sub">
            <li className={`menu-item${layout == router.FormLayoutVertical ? ' active' : ''}`}>
              <a href={router.FormLayoutVertical} className="menu-link"
                onClick={() => setLayout(router.FormLayoutVertical)}>
                <div data-i18n="Vertical Form">Vertical Form</div>
              </a>
            </li>
            <li className={`menu-item${layout == router.FormLayoutHorizontal ? ' active' : ''}`}>
              <a href={router.FormLayoutHorizontal} className="menu-link"
                onClick={() => setLayout(router.FormLayoutHorizontal)}>
                <div data-i18n="Horizontal Form">Horizontal Form</div>
              </a>
            </li>
          </ul>
        </li>

        <li className={`menu-item${layout == router.Tables ? ' active' : ''}`}>
          <a href={router.Tables} className="menu-link" onClick={() => setLayout(router.Tables)}>
            <i className="menu-icon tf-icons bx bx-table"></i>
            <div data-i18n="Tables">Tables</div>
          </a>
        </li>

        <li className="menu-header small text-uppercase"><span className="menu-header-text">Misc</span></li>
        <li className="menu-item">
          <a target="_blank"
            href="https://github.com/themeselection/sneat-html-admin-template-free/issues"
            className="menu-link" ><i className="menu-icon tf-icons bx bx-support"></i>
            <div data-i18n="Support">Support</div>
          </a>
        </li>
        <li className="menu-item">
          <a target="_blank"
            href="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/"
            className="menu-link" ><i className="menu-icon tf-icons bx bx-file"></i>
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

          <a target="_blank"
            href="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/"
            className="footer-link me-4">Documentation</a>

          <a target="_blank"
            href="https://github.com/themeselection/sneat-html-admin-template-free/issues"
            className="footer-link me-4">Support</a>
        </div>
      </div>
    </footer>
  )
}

export default App;