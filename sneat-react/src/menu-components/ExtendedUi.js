import { useContext, useEffect, useMemo, useState } from 'react'
import {
    RouterContext, router, routerReducer,
    user, userReducer, UserContext
} from '../DataContext'

import bg18 from '../assets/img/backgrounds/18.jpg'

export default function ExtendedUI() {
    const { layout } = useContext(RouterContext);
    const SubPath = useMemo(
        () => {
            switch (layout) {
                case router.ExtUiPerfectScrollbar:
                    return ' Perfect Scrollbar'
                case router.ExtUiTextDivider:
                    return ' Text Divider'
                default: return ''
            }
        }, [layout]
    )

    return (<div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4"><span
            className="text-muted fw-light">Extended UI /</span>{SubPath}</h4>
        {layout == router.ExtUiPerfectScrollbar && <PerfectScrollBar />}
        {layout == router.ExtUiTextDivider && <TextDivider />}
    </div>)
}
function PerfectScrollBar() {
    const [scroll, setScroll] = useState([])

    useEffect(
        () => {
            if (!scroll.length) {
                const verticalExample = document.getElementById('vertical-example'),
                    horizontalExample = document.getElementById('horizontal-example'),
                    horizVertExample = document.getElementById('both-scrollbars-example');
                const lstScrl = []
                if (verticalExample) {
                    const scrlX = new window.PerfectScrollbar(verticalExample, {
                        wheelPropagation: false
                    })
                    lstScrl.push(scrlX)
                }

                if (horizontalExample) {
                    const scrlY = new window.PerfectScrollbar(horizontalExample, {
                        wheelPropagation: false,
                        suppressScrollY: true
                    })
                    lstScrl.push(scrlY)
                }

                if (horizVertExample) {
                    const scrlXY = new window.PerfectScrollbar(horizVertExample, {
                        wheelPropagation: false
                    })
                    lstScrl.push(scrlXY)
                }
                if (lstScrl.length) {
                    setScroll(lstScrl)
                }
            }
        }
    )
    return (<div className="row">
        <div className="col-md-6 col-sm-12">
            <div className="card overflow-hidden mb-4" style={{ height: '300px' }}>
                <h5 className="card-header">Vertical Scrollbar</h5>
                <div className="card-body" id="vertical-example">
                    <p>
                        Sweet roll I love I love. Tiramisu I love soufflé cake tart sweet roll cotton candy cookie.
                        Macaroon biscuit dessert. Bonbon cake soufflé jelly gummi bears lemon drops. Chocolate bar I
                        love macaroon danish candy pudding. Jelly carrot cake I love tart cake bear claw macaroon candy
                        candy canes. Muffin gingerbread sweet jujubes croissant sweet roll. Topping muffin carrot cake
                        sweet. Toffee chocolate muffin I love croissant. Donut carrot cake ice cream ice cream. Wafer I
                        love pie danish marshmallow cheesecake oat cake pie I love. Icing pie chocolate marzipan jelly
                        ice cream cake.
                    </p>
                    <p>
                        Marzipan oat cake caramels chocolate. Lemon drops cheesecake jelly beans sweet icing pudding
                        croissant. Donut candy canes carrot cake soufflé. Croissant candy wafer pie I love oat cake
                        lemon drops caramels jujubes. I love macaroon halvah liquorice cake. Danish sweet roll pudding
                        cookie sweet roll I love. Jelly cake I love bear claw jujubes dragée gingerbread. I love cotton
                        candy carrot cake halvah biscuit I love macaroon cheesecake tootsie roll. Chocolate cotton candy
                        biscuit I love fruitcake cotton candy biscuit tart gingerbread. Powder oat cake I love.
                        Cheesecake candy canes macaroon I love wafer I love sweet roll ice cream. Toffee cookie macaroon
                        lemon drops tart candy canes. Gummies gummies pie tiramisu I love bear claw cheesecake.
                    </p>
                    <p>
                        Marzipan oat cake caramels chocolate. Lemon drops cheesecake jelly beans sweet icing pudding
                        croissant. Donut candy canes carrot cake soufflé. Croissant candy wafer pie I love oat cake
                        lemon drops caramels jujubes. I love macaroon halvah liquorice cake. Danish sweet roll pudding
                        cookie sweet roll I love. Jelly cake I love bear claw jujubes dragée gingerbread. I love cotton
                        candy carrot cake halvah biscuit I love macaroon cheesecake tootsie roll. Chocolate cotton candy
                        biscuit I love fruitcake cotton candy biscuit tart gingerbread. Powder oat cake I love.
                        Cheesecake candy canes macaroon I love wafer I love sweet roll ice cream. Toffee cookie macaroon
                        lemon drops tart candy canes. Gummies gummies pie tiramisu I love bear claw cheesecake.
                    </p>
                    <p>
                        Sweet roll I love I love. Tiramisu I love soufflé cake tart sweet roll cotton candy cookie.
                        Macaroon biscuit dessert. Bonbon cake soufflé jelly gummi bears lemon drops. Chocolate bar I
                        love macaroon danish candy pudding. Jelly carrot cake I love tart cake bear claw macaroon candy
                        candy canes. Muffin gingerbread sweet jujubes croissant sweet roll. Topping muffin carrot cake
                        sweet. Toffee chocolate muffin I love croissant. Donut carrot cake ice cream ice cream. Wafer I
                        love pie danish marshmallow cheesecake oat cake pie I love. Icing pie chocolate marzipan jelly
                        ice cream cake.
                    </p>
                    <p>
                        Sweet roll I love I love. Tiramisu I love soufflé cake tart sweet roll cotton candy cookie.
                        Macaroon biscuit dessert. Bonbon cake soufflé jelly gummi bears lemon drops. Chocolate bar I
                        love macaroon danish candy pudding. Jelly carrot cake I love tart cake bear claw macaroon candy
                        candy canes. Muffin gingerbread sweet jujubes croissant sweet roll. Topping muffin carrot cake
                        sweet. Toffee chocolate muffin I love croissant. Donut carrot cake ice cream ice cream. Wafer I
                        love pie danish marshmallow cheesecake oat cake pie I love. Icing pie chocolate marzipan jelly
                        ice cream cake.
                    </p>
                    <p>
                        Sweet roll I love I love. Tiramisu I love soufflé cake tart sweet roll cotton candy cookie.
                        Macaroon biscuit dessert. Bonbon cake soufflé jelly gummi bears lemon drops. Chocolate bar I
                        love macaroon danish candy pudding. Jelly carrot cake I love tart cake bear claw macaroon candy
                        candy canes. Muffin gingerbread sweet jujubes croissant sweet roll. Topping muffin carrot cake
                        sweet. Toffee chocolate muffin I love croissant. Donut carrot cake ice cream ice cream. Wafer I
                        love pie danish marshmallow cheesecake oat cake pie I love. Icing pie chocolate marzipan jelly
                        ice cream cake.
                    </p>
                </div>
            </div>
        </div>
        <div className="col-md-6 col-sm-12">
            <div className="card overflow-hidden mb-4" style={{ height: '300px' }}>
                <h5 className="card-header">Horizontal Scrollbar</h5>
                <div className="card-body" id="horizontal-example">
                    <img src={bg18} alt="scrollbar-image" />
                </div>
            </div>
        </div>
        <div className="col-12">
            <div className="card overflow-hidden" style={{ height: '500px' }}>
                <h5 className="card-header">Vertical & Horizontal Scrollbars</h5>
                <div className="card-body" id="both-scrollbars-example">
                    <img src={bg18} alt="scrollbar-image" />
                </div>
            </div>
        </div>
    </div>)
}
function TextDivider() {
    return (<div className="row">
        <div className="col-md-12 mb-4">
            <div className="card">
                <h5 className="card-header">Basic</h5>
                <div className="card-body">
                    <div className="divider">
                        <div className="divider-text">Text</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-md-12 mb-4">
            <div className="card">
                <h5 className="card-header">Alignment</h5>
                <div className="card-body">
                    <div className="divider text-start">
                        <div className="divider-text">Start</div>
                    </div>
                    <div className="divider text-start-center">
                        <div className="divider-text">Start-Center</div>
                    </div>
                    <div className="divider">
                        <div className="divider-text">Center (Default)</div>
                    </div>
                    <div className="divider text-end-center">
                        <div className="divider-text">End-Center</div>
                    </div>
                    <div className="divider text-end">
                        <div className="divider-text">End</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-md-12 mb-4">
            <div className="card">
                <h5 className="card-header">Colors</h5>
                <div className="card-body">
                    <div className="divider divider-primary">
                        <div className="divider-text">Primary</div>
                    </div>
                    <div className="divider divider-success">
                        <div className="divider-text">Success</div>
                    </div>
                    <div className="divider divider-danger">
                        <div className="divider-text">Danger</div>
                    </div>
                    <div className="divider divider-warning">
                        <div className="divider-text">Warning</div>
                    </div>
                    <div className="divider divider-info">
                        <div className="divider-text">Info</div>
                    </div>
                    <div className="divider divider-dark">
                        <div className="divider-text">Dark</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-md-12 mb-4">
            <div className="card">
                <h5 className="card-header">Icons</h5>
                <div className="card-body">
                    <div className="divider text-start">
                        <div className="divider-text">
                            <i className="bx bx-sun"></i>
                        </div>
                    </div>
                    <div className="divider text-start-center">
                        <div className="divider-text">
                            <i className="bx bx-crown"></i>
                        </div>
                    </div>
                    <div className="divider">
                        <div className="divider-text">
                            <i className="bx bx-star"></i>
                        </div>
                    </div>
                    <div className="divider text-end-center">
                        <div className="divider-text">
                            <i className="bx bx-coffee-togo"></i>
                        </div>
                    </div>
                    <div className="divider text-end">
                        <div className="divider-text">
                            <i className="bx bx-cut bx-rotate-180"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-md-12">
            <div className="card">
                <h5 className="card-header">Styles</h5>
                <div className="card-body">
                    <div className="divider">
                        <div className="divider-text">Solid (Default)</div>
                    </div>
                    <div className="divider divider-dotted">
                        <div className="divider-text">Dotted</div>
                    </div>
                    <div className="divider divider-dashed">
                        <div className="divider-text">Dashed</div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}