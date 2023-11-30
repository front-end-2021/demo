import { useContext } from 'react';
import { RouterContext } from '../DataContext';
import layMenu from '../assets/img/layouts/layout-without-menu-light.png'
import layWtNav from '../assets/img/layouts/layout-without-navbar-light.png'
import layContainer from '../assets/img/layouts/layout-container-light.png'
import layFluid from '../assets/img/layouts/layout-fluid-light.png'

export function LayoutWithFluid() {
    return (
        <div className="container-fluid flex-grow-1 container-p-y">
            <div className="layout-demo-wrapper">
                <div className="layout-demo-placeholder">
                    <img className="img-fluid"
                        data-app-light-img="layouts/layout-fluid-light.png"
                        data-app-dark-img="layouts/layout-fluid-dark.png"
                        src={layFluid} alt="Layout fluid" />
                </div>
                <div className="layout-demo-info">
                    <h4>Layout fluid</h4>
                    <p>Fluid layout sets a <code>100% width</code> at each responsive breakpoint.</p>
                </div>
            </div>
        </div>
    )
}

export function LayoutWithoutNavbar() {
    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="layout-demo-wrapper">
                <div className="layout-demo-placeholder">
                    <img className="img-fluid"
                        src={layWtNav}
                        alt="Layout without navbar"
                        data-app-light-img="layouts/layout-without-navbar-light.png"
                        data-app-dark-img="layouts/layout-without-navbar-dark.png"
                    />
                </div>
                <div className="layout-demo-info">
                    <h4>Layout without Navbar</h4>
                    <p>Layout does not contain Navbar component.</p>
                </div>
            </div>
        </div>
    )
}

export function LayoutWithContainer() {
    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="layout-demo-wrapper">
                <div className="layout-demo-placeholder">
                    <img className="img-fluid"
                        src={layContainer} alt="Layout container"
                        data-app-light-img="layouts/layout-container-light.png"
                        data-app-dark-img="layouts/layout-container-dark.png"
                    />
                </div>
                <div className="layout-demo-info">
                    <h4>Layout container</h4>
                    <p>Container layout sets a <code>max-width</code> at each responsive breakpoint.</p>
                </div>
            </div>
        </div>
    )
}

export function LayoutWithoutMenu() {
    const { setLayout } = useContext(RouterContext);

    return (
        <div className="layout-demo-wrapper">
            <div className="layout-demo-placeholder">
                <img src={layMenu}
                    className="img-fluid"
                    data-app-light-img="layouts/layout-without-menu-light.png"
                    data-app-dark-img="layouts/layout-without-menu-dark.png"
                    alt="Layout without menu" />
            </div>
            <div className="layout-demo-info">
                <h4>Layout without Menu (Navigation)</h4>
                <button className="btn btn-primary" type="button"
                    onClick={() => setLayout(router.Home)}>Go Back</button>
            </div>
        </div>
    )
}
