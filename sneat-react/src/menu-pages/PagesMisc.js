import { useContext } from 'react'
import {
    RouterContext, router
} from '../DataContext'
import '../scss/pages/page-misc.scss'
import mscError from '../assets/img/illustrations/page-misc-error-light.png'
import doingYoga from '../assets/img/illustrations/girl-doing-yoga-light.png'

export default function PagesMisc() {
    const { layout } = useContext(RouterContext);

    return (<div className="container-xxl container-p-y">
        <div className="misc-wrapper">
            {layout == router.PageMiscError && <PageMiscError />}
            {layout == router.PageMiscMaintain && <PageMiscUnderMaintain />}
        </div>
    </div>)
}
function PageMiscError() {
    const { setLayout } = useContext(RouterContext);
    return (<>
        <h2 className="mb-2 mx-2">Page Not Found :(</h2>
        <p className="mb-4 mx-2">Oops! 😖 The requested URL was not found on this server.</p>
        <a href="#" className="btn btn-primary"
            onClick={e => setLayout(router.Home)}>Back to home</a>
        <div className="mt-3">
            <img src={mscError}
                alt="page-misc-error-light"
                width="500"
                className="img-fluid"
                data-app-dark-img="illustrations/page-misc-error-dark.png"
                data-app-light-img="illustrations/page-misc-error-light.png"
            />
        </div>
    </>)
}
function PageMiscUnderMaintain() {
    const { setLayout } = useContext(RouterContext);
    return (<>
        <h2 className="mb-2 mx-2">Under Maintenance!</h2>
        <p className="mb-4 mx-2">Sorry for the inconvenience but we're performing some maintenance at the moment</p>
        <a href="#" className="btn btn-primary"
            onClick={e => setLayout(router.Home)}>Back to home</a>
        <div className="mt-4">
            <img src={doingYoga}
                alt="girl-doing-yoga-light"
                width="500"
                className="img-fluid"
                data-app-dark-img="illustrations/girl-doing-yoga-dark.png"
                data-app-light-img="illustrations/girl-doing-yoga-light.png"
            />
        </div>
    </>)
}