import { useContext } from 'react'
import {
    RouterContext, router, routerReducer,
    user, userReducer, UserContext
} from '../DataContext'

import elm1 from '../assets/img/elements/1.jpg'
import elm2 from '../assets/img/elements/2.jpg'
import elm3 from '../assets/img/elements/3.jpg'
import elm13 from '../assets/img/elements/13.jpg'
import elm18 from '../assets/img/elements/18.jpg'


export default function UserInterfaces() {
    const { layout, setLayout } = useContext(RouterContext);

    return (<div className="container-xxl flex-grow-1 container-p-y">
        {layout == router.UIAccordion && <UiAccordion />}
        {layout == router.UIAlert && <UiAlert />}
        {layout == router.UIBadges && <UiBadges />}
        {layout == router.UIButtons && <UiButtons />}
        {layout == router.UICarousel && <UiCarousel />}
        {layout == router.UICollapse && <UiCollapse />}
        {layout == router.UIDropdowns && <UiDropdowns />}
        {layout == router.UIFooter && <UiFooter />}
        {layout == router.UIListGroups && <UiListGroups />}
        {layout == router.UIModals && <UiModals />}
        {layout == router.UINavbar && <UiNavbar />}
        {layout == router.UIOffcanvas && <UiOffcanvas />}
        {layout == router.UIPaginationBreadcrumbs && <UiPagniationBreadcrumbs />}
        {layout == router.UIProgress && <UiProgress />}
        {layout == router.UISpinners && <UiSpinners />}
        {layout == router.UITabsPills && <UiTabsPills />}
        {layout == router.UIToasts && <UiToasts />}
        {layout == router.UITooltipsPopovers && <UiTooltipsPopovers />}
        {layout == router.UITypography && <UiTypography />}
    </div>)
}

function UiAccordion() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Accordion</h4>

        <h5 className="mt-4">Accordion</h5>
        <div className="row">
            <div className="col-md mb-4 mb-md-0">
                <small className="text-light fw-semibold">Basic Accordion</small>
                <div className="accordion mt-3" id="accordionExample">
                    <div className="card accordion-item active">
                        <h2 className="accordion-header" id="headingOne">
                            <button type="button"
                                className="accordion-button"
                                data-bs-toggle="collapse"
                                data-bs-target="#accordionOne"
                                aria-expanded="true"
                                aria-controls="accordionOne" >
                                Accordion Item 1
                            </button>
                        </h2>

                        <div id="accordionOne"
                            className="accordion-collapse collapse show"
                            data-bs-parent="#accordionExample" >
                            <div className="accordion-body">
                                Lemon drops chocolate cake gummies carrot cake chupa chups muffin topping. Sesame snaps icing
                                marzipan gummi bears macaroon dragée danish caramels powder. Bear claw dragée pastry topping
                                soufflé. Wafer gummi bears marshmallow pastry pie.
                            </div>
                        </div>
                    </div>
                    <div className="card accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                            <button type="button"
                                className="accordion-button collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#accordionTwo"
                                aria-expanded="false"
                                aria-controls="accordionTwo" >
                                Accordion Item 2
                            </button>
                        </h2>
                        <div id="accordionTwo"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#accordionExample" >
                            <div className="accordion-body">
                                Dessert ice cream donut oat cake jelly-o pie sugar plum cheesecake. Bear claw dragée oat cake
                                dragée ice cream halvah tootsie roll. Danish cake oat cake pie macaroon tart donut gummies.
                                Jelly beans candy canes carrot cake. Fruitcake chocolate chupa chups.
                            </div>
                        </div>
                    </div>
                    <div className="card accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                            <button type="button"
                                className="accordion-button collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#accordionThree"
                                aria-expanded="false"
                                aria-controls="accordionThree" >
                                Accordion Item 3
                            </button>
                        </h2>
                        <div id="accordionThree"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingThree"
                            data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                Oat cake toffee chocolate bar jujubes. Marshmallow brownie lemon drops cheesecake. Bonbon
                                gingerbread marshmallow sweet jelly beans muffin. Sweet roll bear claw candy canes oat cake
                                dragée caramels. Ice cream wafer danish cookie caramels muffin.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md">
                <small className="text-light fw-semibold">Accordion Without Arrow</small>
                <div id="accordionIcon" className="accordion mt-3 accordion-without-arrow">
                    <div className="accordion-item card">
                        <h2 className="accordion-header text-body d-flex justify-content-between" id="accordionIconOne">
                            <button
                                type="button"
                                className="accordion-button collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#accordionIcon-1"
                                aria-controls="accordionIcon-1"
                            >
                                Accordion Item 1
                            </button>
                        </h2>

                        <div id="accordionIcon-1" className="accordion-collapse collapse" data-bs-parent="#accordionIcon">
                            <div className="accordion-body">
                                Lemon drops chocolate cake gummies carrot cake chupa chups muffin topping. Sesame snaps icing
                                marzipan gummi bears macaroon dragée danish caramels powder. Bear claw dragée pastry topping
                                soufflé. Wafer gummi bears marshmallow pastry pie.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item card">
                        <h2 className="accordion-header text-body d-flex justify-content-between" id="accordionIconTwo">
                            <button
                                type="button"
                                className="accordion-button collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#accordionIcon-2"
                                aria-controls="accordionIcon-2"
                            >
                                Accordion Item 2
                            </button>
                        </h2>
                        <div id="accordionIcon-2" className="accordion-collapse collapse" data-bs-parent="#accordionIcon">
                            <div className="accordion-body">
                                Dessert ice cream donut oat cake jelly-o pie sugar plum cheesecake. Bear claw dragée oat cake
                                dragée ice cream halvah tootsie roll. Danish cake oat cake pie macaroon tart donut gummies.
                                Jelly beans candy canes carrot cake. Fruitcake chocolate chupa chups.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item card active">
                        <h2 className="accordion-header text-body d-flex justify-content-between" id="accordionIconThree">
                            <button
                                type="button"
                                className="accordion-button"
                                data-bs-toggle="collapse"
                                data-bs-target="#accordionIcon-3"
                                aria-expanded="true"
                                aria-controls="accordionIcon-3"
                            >
                                Accordion Item 3
                            </button>
                        </h2>
                        <div
                            id="accordionIcon-3"
                            className="accordion-collapse collapse show"
                            data-bs-parent="#accordionIcon"
                        >
                            <div className="accordion-body">
                                Oat cake toffee chocolate bar jujubes. Marshmallow brownie lemon drops cheesecake. Bonbon
                                gingerbread marshmallow sweet jelly beans muffin. Sweet roll bear claw candy canes oat cake
                                dragée caramels. Ice cream wafer danish cookie caramels muffin.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiAlert() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Alerts</h4>
        <div className="row mb-4">

            <div className="col-md mb-4 mb-md-0">
                <div className="card">
                    <h5 className="card-header">Basic Alerts</h5>
                    <div className="card-body">
                        <div className="alert alert-primary" role="alert">This is a primary alert — check it out!</div>

                        <div className="alert alert-secondary" role="alert">This is a secondary alert — check it out!</div>

                        <div className="alert alert-success" role="alert">This is a success alert — check it out!</div>

                        <div className="alert alert-danger" role="alert">This is a danger alert — check it out!</div>

                        <div className="alert alert-warning" role="alert">This is a warning alert — check it out!</div>

                        <div className="alert alert-info" role="alert">This is an info alert — check it out!</div>

                        <div className="alert alert-dark mb-0" role="alert">This is a dark alert — check it out!</div>
                    </div>
                </div>
            </div>

            <div className="col-md">
                <div className="card">
                    <h5 className="card-header">Dismissible Alerts</h5>
                    <div className="card-body">
                        <div className="alert alert-primary alert-dismissible" role="alert">
                            This is a primary dismissible alert — check it out!
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>

                        <div className="alert alert-secondary alert-dismissible" role="alert">
                            This is a secondary dismissible alert — check it out!
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>

                        <div className="alert alert-success alert-dismissible" role="alert">
                            This is a success dismissible alert — check it out!
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>

                        <div className="alert alert-danger alert-dismissible" role="alert">
                            This is a danger dismissible alert — check it out!
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>

                        <div className="alert alert-warning alert-dismissible" role="alert">
                            This is a warning dismissible alert — check it out!
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>

                        <div className="alert alert-info alert-dismissible" role="alert">
                            This is an info dismissible alert — check it out!
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>

                        <div className="alert alert-dark alert-dismissible mb-0" role="alert">
                            This is a dark dismissible alert — check it out!
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiBadges() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Badges</h4>

        <div className="row">
            <div className="col-lg">
                <div className="card mb-4">
                    <h5 className="card-header">Basic Badges</h5>
                    <div className="card-body">
                        <div className="text-light small fw-semibold">Default</div>
                        <div className="demo-inline-spacing">
                            <span className="badge bg-primary">Primary</span>
                            <span className="badge bg-secondary">Secondary</span>
                            <span className="badge bg-success">Success</span>
                            <span className="badge bg-danger">Danger</span>
                            <span className="badge bg-warning">Warning</span>
                            <span className="badge bg-info">Info</span>
                            <span className="badge bg-dark">Dark</span>
                        </div>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <div className="text-light small fw-semibold">Pills</div>

                        <div className="demo-inline-spacing">
                            <span className="badge rounded-pill bg-primary">Primary</span>
                            <span className="badge rounded-pill bg-secondary">Secondary</span>
                            <span className="badge rounded-pill bg-success">Success</span>
                            <span className="badge rounded-pill bg-danger">Danger</span>
                            <span className="badge rounded-pill bg-warning">Warning</span>
                            <span className="badge rounded-pill bg-info">Info</span>
                            <span className="badge rounded-pill bg-dark">Dark</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-lg">
                <div className="card mb-4">
                    <h5 className="card-header">Label Badges</h5>
                    <div className="card-body">
                        <div className="text-light small fw-semibold">Label Default</div>

                        <div className="demo-inline-spacing">
                            <span className="badge bg-label-primary">Primary</span>
                            <span className="badge bg-label-secondary">Secondary</span>
                            <span className="badge bg-label-success">Success</span>
                            <span className="badge bg-label-danger">Danger</span>
                            <span className="badge bg-label-warning">Warning</span>
                            <span className="badge bg-label-info">Info</span>
                            <span className="badge bg-label-dark">Dark</span>
                        </div>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <div className="text-light small fw-semibold">Label Pills</div>

                        <div className="demo-inline-spacing">
                            <span className="badge rounded-pill bg-label-primary">Primary</span>
                            <span className="badge rounded-pill bg-label-secondary">Secondary</span>
                            <span className="badge rounded-pill bg-label-success">Success</span>
                            <span className="badge rounded-pill bg-label-danger">Danger</span>
                            <span className="badge rounded-pill bg-label-warning">Warning</span>
                            <span className="badge rounded-pill bg-label-info">Info</span>
                            <span className="badge rounded-pill bg-label-dark">Dark</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col-lg">
                <div className="card mb-4">
                    <h5 className="card-header">Button with Badges</h5>
                    <div className="card-body">
                        <div className="row gy-3">
                            <div className="col-sm-4">
                                <small className="text-light fw-semibold">Default</small>
                                <div className="demo-inline-spacing">
                                    <button type="button" className="btn btn-primary">
                                        Text
                                        <span className="badge bg-white text-primary">4</span>
                                    </button>
                                    <button type="button" className="btn btn-primary">
                                        Text
                                        <span className="badge bg-secondary rounded-pill">4</span>
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <small className="text-light fw-semibold">Label</small>
                                <div className="demo-inline-spacing">
                                    <button type="button" className="btn btn-outline-primary">
                                        Text
                                        <span className="badge bg-white text-primary">4</span>
                                    </button>
                                    <button type="button" className="btn btn-outline-primary">
                                        Text
                                        <span className="badge bg-secondary rounded-pill">4</span>
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <small className="text-light fw-semibold">Outline</small>
                                <div className="demo-inline-spacing">
                                    <button type="button" className="btn btn-outline-primary">
                                        Text
                                        <span className="badge">4</span>
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary">
                                        Text
                                        <span className="badge rounded-pill">4</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col-12">
                <div className="card mb-4">
                    <h5 className="card-header">Badge Circle & Square Style</h5>
                    <div className="card-body">
                        <div className="row gy-3">
                            <div className="col-xl-6">
                                <h6>Basic</h6>
                                <div className="text-light small fw-semibold mb-2">Default</div>
                                <div className="demo-inline-spacing">
                                    <p>
                                        <span className="badge badge-center rounded-pill bg-primary">1</span>
                                        <span className="badge badge-center rounded-pill bg-secondary">2</span>
                                        <span className="badge badge-center rounded-pill bg-success">3</span>
                                        <span className="badge badge-center rounded-pill bg-danger">4</span>
                                        <span className="badge badge-center rounded-pill bg-warning">5</span>
                                        <span className="badge badge-center rounded-pill bg-info">6</span>
                                    </p>
                                    <p>
                                        <span className="badge badge-center bg-primary">1</span>
                                        <span className="badge badge-center bg-secondary">2</span>
                                        <span className="badge badge-center bg-success">3</span>
                                        <span className="badge badge-center bg-danger">4</span>
                                        <span className="badge badge-center bg-warning">5</span>
                                        <span className="badge badge-center bg-info">6</span>
                                    </p>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <h6>Label</h6>
                                <div className="text-light small fw-semibold mb-2">Default</div>
                                <div className="demo-inline-spacing">
                                    <p>
                                        <span className="badge badge-center rounded-pill bg-label-primary">1</span>
                                        <span className="badge badge-center rounded-pill bg-label-secondary">2</span>
                                        <span className="badge badge-center rounded-pill bg-label-success">3</span>
                                        <span className="badge badge-center rounded-pill bg-label-danger">4</span>
                                        <span className="badge badge-center rounded-pill bg-label-warning">5</span>
                                        <span className="badge badge-center rounded-pill bg-label-info">6</span>
                                    </p>
                                    <p>
                                        <span className="badge badge-center bg-label-primary">1</span>
                                        <span className="badge badge-center bg-label-secondary">2</span>
                                        <span className="badge badge-center bg-label-success">3</span>
                                        <span className="badge badge-center bg-label-danger">4</span>
                                        <span className="badge badge-center bg-label-warning">5</span>
                                        <span className="badge badge-center bg-label-info">6</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiButtons() {
    return (<>
        <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">UI elements /</span>
            Buttons
        </h4>
        <div className="row">
            <div className="col-12">
                <div className="card mb-4">
                    <h5 className="card-header">Basic Buttons</h5>
                    <div className="card-body">
                        <small className="text-light fw-semibold">Default</small>
                        <div className="demo-inline-spacing">
                            <button type="button" className="btn btn-primary">Primary</button>
                            <button type="button" className="btn btn-secondary">Secondary</button>
                            <button type="button" className="btn btn-success">Success</button>
                            <button type="button" className="btn btn-danger">Danger</button>
                            <button type="button" className="btn btn-warning">Warning</button>
                            <button type="button" className="btn btn-info">Info</button>
                            <button type="button" className="btn btn-dark">Dark</button>
                        </div>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <small className="text-light fw-semibold">Rounded</small>
                        <div className="demo-inline-spacing">
                            <button type="button" className="btn rounded-pill btn-primary">Primary</button>
                            <button type="button" className="btn rounded-pill btn-secondary">Secondary</button>
                            <button type="button" className="btn rounded-pill btn-success">Success</button>
                            <button type="button" className="btn rounded-pill btn-danger">Danger</button>
                            <button type="button" className="btn rounded-pill btn-warning">Warning</button>
                            <button type="button" className="btn rounded-pill btn-info">Info</button>
                            <button type="button" className="btn rounded-pill btn-dark">Dark</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-4">
                    <h5 className="card-header">Outline Buttons</h5>
                    <div className="card-body">
                        <small className="text-light fw-semibold">Default</small>
                        <div className="demo-inline-spacing">
                            <button type="button" className="btn btn-outline-primary">Primary</button>
                            <button type="button" className="btn btn-outline-secondary">Secondary</button>
                            <button type="button" className="btn btn-outline-success">Success</button>
                            <button type="button" className="btn btn-outline-danger">Danger</button>
                            <button type="button" className="btn btn-outline-warning">Warning</button>
                            <button type="button" className="btn btn-outline-info">Info</button>
                            <button type="button" className="btn btn-outline-dark">Dark</button>
                        </div>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <small className="text-light fw-semibold">Rounded</small>
                        <div className="demo-inline-spacing">
                            <button type="button" className="btn rounded-pill btn-outline-primary">Primary</button>
                            <button type="button" className="btn rounded-pill btn-outline-secondary">Secondary</button>
                            <button type="button" className="btn rounded-pill btn-outline-success">Success</button>
                            <button type="button" className="btn rounded-pill btn-outline-danger">Danger</button>
                            <button type="button" className="btn rounded-pill btn-outline-warning">Warning</button>
                            <button type="button" className="btn rounded-pill btn-outline-info">Info</button>
                            <button type="button" className="btn rounded-pill btn-outline-dark">Dark</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-4">
                    <h5 className="card-header">Buttons with Icons</h5>
                    <div className="card-body">
                        <div className="row gy-3">
                            <div className="col-md-6">
                                <small className="text-light fw-semibold">Basic</small>
                                <div className="demo-inline-spacing">
                                    <button type="button" className="btn btn-primary">
                                        <span className="tf-icons bx bx-pie-chart-alt"></span>&nbsp; Primary
                                    </button>
                                    <button type="button" className="btn btn-secondary">
                                        <span className="tf-icons bx bx-bell"></span>&nbsp; Secondary
                                    </button>
                                </div>
                                <div className="demo-inline-spacing">
                                    <button type="button" className="btn rounded-pill btn-primary">
                                        <span className="tf-icons bx bx-pie-chart-alt"></span>&nbsp; Primary
                                    </button>
                                    <button type="button" className="btn rounded-pill btn-secondary">
                                        <span className="tf-icons bx bx-bell"></span>&nbsp; Secondary
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <small className="text-light fw-semibold">Outline</small>
                                <div className="demo-inline-spacing">
                                    <button type="button" className="btn btn-outline-primary">
                                        <span className="tf-icons bx bx-pie-chart-alt"></span>&nbsp; Primary
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary">
                                        <span className="tf-icons bx bx-bell"></span>&nbsp; Secondary
                                    </button>
                                </div>
                                <div className="demo-inline-spacing">
                                    <button type="button" className="btn rounded-pill btn-outline-primary">
                                        <span className="tf-icons bx bx-pie-chart-alt"></span>&nbsp; Primary
                                    </button>
                                    <button type="button" className="btn rounded-pill btn-outline-secondary">
                                        <span className="tf-icons bx bx-bell"></span>&nbsp; Secondary
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <div className="row gy-3">
                            <div className="col-md-6">
                                <small className="text-light fw-semibold">Basic</small>
                                <div className="demo-inline-spacing">
                                    <button type="button" className="btn btn-icon btn-primary">
                                        <span className="tf-icons bx bx-pie-chart-alt"></span>
                                    </button>
                                    <button type="button" className="btn btn-icon btn-secondary">
                                        <span className="tf-icons bx bx-bell"></span>
                                    </button>
                                    <button type="button" className="btn rounded-pill btn-icon btn-primary">
                                        <span className="tf-icons bx bx-pie-chart-alt"></span>
                                    </button>
                                    <button type="button" className="btn rounded-pill btn-icon btn-secondary">
                                        <span className="tf-icons bx bx-bell"></span>
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <small className="text-light fw-semibold">Outline</small>
                                <div className="demo-inline-spacing">
                                    <button type="button" className="btn btn-icon btn-outline-primary">
                                        <span className="tf-icons bx bx-pie-chart-alt"></span>
                                    </button>
                                    <button type="button" className="btn btn-icon btn-outline-secondary">
                                        <span className="tf-icons bx bx-bell"></span>
                                    </button>
                                    <button type="button" className="btn rounded-pill btn-icon btn-outline-primary">
                                        <span className="tf-icons bx bx-pie-chart-alt"></span>
                                    </button>
                                    <button type="button" className="btn rounded-pill btn-icon btn-outline-secondary">
                                        <span className="tf-icons bx bx-bell"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-4">
                    <h5 className="card-header">Button Options</h5>
                    <div className="card-body">
                        <small className="text-light fw-semibold">Sizes</small>
                        <div className="demo-inline-spacing">
                            <button type="button" className="btn btn-xl btn-primary">Button xl</button>
                            <button type="button" className="btn btn-lg btn-primary">Button lg</button>
                            <button type="button" className="btn btn-primary">Button</button>
                            <button type="button" className="btn btn-sm btn-primary">Button sm</button>
                            <button type="button" className="btn btn-xs btn-primary">Button xs</button>
                        </div>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <small className="text-light fw-semibold">Buttons State</small>
                        <div className="demo-inline-spacing">
                            <button type="button" className="btn btn-primary">Normal</button>
                            <button type="button" className="btn btn-primary active">Active</button>
                            <button type="button" className="btn btn-primary" disabled>Disabled</button>
                        </div>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <small className="text-light fw-semibold">Block level buttons</small>
                        <div className="row mt-3">
                            <div className="d-grid gap-2 col-lg-6 mx-auto">
                                <button className="btn btn-primary btn-lg" type="button">Button</button>
                                <button className="btn btn-secondary btn-lg" type="button">Button</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card mb-4">
                    <h5 className="card-header">Button Plugin</h5>
                    <div className="card-body">
                        <div className="row gy-3">
                            <div className="col-xl-3">
                                <div className="text-light small fw-semibold">Toggle states</div>
                                <div className="demo-vertical-spacing">
                                    <button
                                        type="button"
                                        className="btn btn-primary d-block"
                                        data-bs-toggle="button"
                                        autocomplete="off"
                                    >
                                        Toggle button
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary active d-block"
                                        data-bs-toggle="button"
                                        autocomplete="off"
                                        aria-pressed="true"
                                    >
                                        Active toggle button
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary d-block"
                                        disabled
                                        data-bs-toggle="button"
                                        autocomplete="off"
                                    >
                                        Disabled toggle button
                                    </button>
                                </div>
                            </div>
                            <div className="col-xl-3">
                                <div className="text-light small fw-semibold">Checkbox toggle buttons</div>
                                <div className="demo-vertical-spacing">
                                    <div className="d-block">
                                        <input type="checkbox" className="btn-check" id="btn-check" autocomplete="off" />
                                        <label className="btn btn-primary" for="btn-check">Single toggle</label>
                                    </div>
                                    <div className="d-block">
                                        <input type="checkbox" className="btn-check" id="btn-check-2" checked autocomplete="off" />
                                        <label className="btn btn-primary" for="btn-check-2">Checked</label>
                                    </div>
                                    <div className="d-block">
                                        <input type="checkbox" className="btn-check" id="btn-check-3" checked autocomplete="off" />
                                        <label className="btn btn-primary" for="btn-check-3">Checked</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="text-light small fw-semibold">Checkbox and radio</div>
                                <div className="demo-vertical-spacing">
                                    <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                                        <input type="checkbox" className="btn-check" id="btncheck1" checked autocomplete="off" />
                                        <label className="btn btn-outline-primary" for="btncheck1">Checkbox 1 (pre-checked)</label>
                                        <input type="checkbox" className="btn-check" id="btncheck2" autocomplete="off" />
                                        <label className="btn btn-outline-primary" for="btncheck2">Checkbox 2</label>
                                        <input type="checkbox" className="btn-check" id="btncheck3" autocomplete="off" />
                                        <label className="btn btn-outline-primary" for="btncheck3">Checkbox 3</label>
                                    </div>
                                    <br />
                                    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="btnradio"
                                            id="btnradio1"
                                            checked
                                            autocomplete="off"
                                        />
                                        <label className="btn btn-outline-primary" for="btnradio1">Radio 1</label>
                                        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autocomplete="off" />
                                        <label className="btn btn-outline-primary" for="btnradio2">Radio 2</label>
                                        <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autocomplete="off" />
                                        <label className="btn btn-outline-primary" for="btnradio3">Radio 3</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5 className="card-header">Button Group</h5>
                    <div className="card-body">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <small className="text-light fw-semibold">Basic</small>
                                <div className="mt-3">
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        <button type="button" className="btn btn-secondary">Left</button>
                                        <button type="button" className="btn btn-secondary">Middle</button>
                                        <button type="button" className="btn btn-secondary">Right</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <small className="text-light fw-semibold">Outline</small>
                                <div className="mt-3">
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        <button type="button" className="btn btn-outline-secondary">Left</button>
                                        <button type="button" className="btn btn-outline-secondary">Middle</button>
                                        <button type="button" className="btn btn-outline-secondary">Right</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <div className="row">
                            <div className="col-xl-6 mb-xl-0 mb-3">
                                <small className="text-light fw-semibold">Button Toolbar</small>
                                <div
                                    className="btn-toolbar demo-inline-spacing"
                                    role="toolbar"
                                    aria-label="Toolbar with button groups"
                                >
                                    <div className="btn-group" role="group" aria-label="First group">
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="tf-icons bx bx-bell"></i>
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="tf-icons bx bx-task"></i>
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="tf-icons bx bx-check-shield"></i>
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="tf-icons bx bx-comment-dots"></i>
                                        </button>
                                    </div>
                                    <div className="btn-group" role="group" aria-label="Second group">
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="tf-icons bx bx-bold"></i>
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="tf-icons bx bx-italic"></i>
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="tf-icons bx bx-underline"></i>
                                        </button>
                                    </div>
                                    <div className="btn-group" role="group" aria-label="Third group">
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="tf-icons bx bx-volume-full"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <small className="text-light fw-semibold">Button Nesting</small>
                                <div className="mt-3">
                                    <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="tf-icons bx bx-car"></i>
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="tf-icons bx bx-rocket"></i>
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="tf-icons bx bx-bulb"></i>
                                        </button>
                                        <div className="btn-group" role="group">
                                            <button
                                                id="btnGroupDrop1"
                                                type="button"
                                                className="btn btn-outline-secondary dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Dropdown
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                <a className="dropdown-item" href="void(0);">Dropdown link</a>
                                                <a className="dropdown-item" href="void(0);">Dropdown link</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiCarousel() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Carousel</h4>
        <div className="row">
            <div className="col-md">
                <h5 className="my-4">Bootstrap carousel</h5>

                <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-bs-target="#carouselExample" data-bs-slide-to="0" className="active"></li>
                        <li data-bs-target="#carouselExample" data-bs-slide-to="1"></li>
                        <li data-bs-target="#carouselExample" data-bs-slide-to="2"></li>
                    </ol>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img className="d-block w-100" src={elm13} alt="First slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <h3>First slide</h3>
                                <p>Eos mutat malis maluisset et, agam ancillae quo te, in vim congue pertinacia.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={elm2} alt="Second slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <h3>Second slide</h3>
                                <p>In numquam omittam sea.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={elm18} alt="Third slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <h3>Third slide</h3>
                                <p>Lorem ipsum dolor sit amet, virtute consequat ea qui, minim graeco mel no.</p>
                            </div>
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#carouselExample" role="button" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carouselExample" role="button" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </a>
                </div>
            </div>
            <div className="col-md">
                <h5 className="my-4">Bootstrap crossfade carousel (dark)</h5>

                <div
                    id="carouselExample-cf"
                    className="carousel carousel-dark slide carousel-fade"
                    data-bs-ride="carousel"
                >
                    <ol className="carousel-indicators">
                        <li data-bs-target="#carouselExample-cf" data-bs-slide-to="0" className="active"></li>
                        <li data-bs-target="#carouselExample-cf" data-bs-slide-to="1"></li>
                        <li data-bs-target="#carouselExample-cf" data-bs-slide-to="2"></li>
                    </ol>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img className="d-block w-100" src={elm18} alt="First slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <h3>First slide</h3>
                                <p>Eos mutat malis maluisset et, agam ancillae quo te, in vim congue pertinacia.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={elm13} alt="Second slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <h3>Second slide</h3>
                                <p>In numquam omittam sea.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={elm2} alt="Third slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <h3>Third slide</h3>
                                <p>Lorem ipsum dolor sit amet, virtute consequat ea qui, minim graeco mel no.</p>
                            </div>
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#carouselExample-cf" role="button" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carouselExample-cf" role="button" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </a>
                </div>
            </div>
        </div>
    </>)
}
function UiCollapse() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Collapse</h4>
        <h5>Collapse</h5>
        <div className="row">
            <div className="col-12">
                <div className="card mb-4">
                    <h5 className="card-header">Basic</h5>
                    <div className="card-body">
                        <p className="card-text">
                            Toggle the visibility of content across your project with a few classes and our JavaScript
                            plugins.
                        </p>
                        <p className="demo-inline-spacing">
                            <a
                                className="btn btn-primary me-1"
                                data-bs-toggle="collapse"
                                href="#collapseExample"
                                role="button"
                                aria-expanded="false"
                                aria-controls="collapseExample" >
                                Link with href
                            </a>
                            <button type="button"
                                className="btn btn-primary me-1"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseExample"
                                aria-expanded="false"
                                aria-controls="collapseExample" >
                                Button with data-bs-target
                            </button>
                        </p>
                        <div className="collapse" id="collapseExample">
                            <div className="d-grid d-sm-flex p-3 border">
                                <img src={elm1}
                                    alt="collapse-image"
                                    height="125"
                                    className="me-4 mb-sm-0 mb-2" />
                                <span>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                                    been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                                    galley of type and scrambled it to make a type specimen book. It has survived not only five
                                    centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                                    passages, and more recently with desktop publishing software like Aldus PageMaker including
                                    versions of Lorem Ipsum.It is a long established fact that a reader will be distracted by
                                    the readable content of a page when looking at its layout. The point of using Lorem Ipsum is
                                    that it has a more-or-less normal distribution of letters.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5 className="card-header">Multiple targets</h5>
                    <div className="card-body">
                        <p className="card-text">Show and hide multiple elements by referencing them with a selector.</p>

                        <p className="demo-inline-spacing">
                            <a
                                className="btn btn-primary me-1"
                                data-bs-toggle="collapse"
                                href="#multiCollapseExample1"
                                role="button"
                                aria-expanded="false"
                                aria-controls="multiCollapseExample1"
                            >Toggle first element</a
                            >
                            <button
                                className="btn btn-primary me-1"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#multiCollapseExample2"
                                aria-expanded="false"
                                aria-controls="multiCollapseExample2"
                            >
                                Toggle second element
                            </button>
                            <button
                                className="btn btn-primary me-1"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target=".multi-collapse"
                                aria-expanded="false"
                                aria-controls="multiCollapseExample1 multiCollapseExample2"
                            >
                                Toggle both elements
                            </button>
                        </p>
                        <div className="row">
                            <div className="col-12 col-md-6 mb-2 mb-md-0">
                                <div className="collapse multi-collapse" id="multiCollapseExample1">
                                    <div className="d-grid d-sm-flex p-3 border">
                                        <img src={elm2}
                                            alt="collapse-image"
                                            height="125"
                                            className="me-4 mb-sm-0 mb-2" />
                                        <span>
                                            All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as
                                            necessary, making this the first true generator on the Internet. It uses a dictionary of
                                            over 200 Latin words, combined with a handful of model sentence structures, to generate
                                            Lorem Ipsum which looks reasonable.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="collapse multi-collapse" id="multiCollapseExample2">
                                    <div className="d-grid d-sm-flex p-3 border">
                                        <img src={elm3}
                                            alt="collapse-image"
                                            height="125"
                                            className="me-4 mb-sm-0 mb-2" />
                                        <span>
                                            There are many variations of passages of Lorem Ipsum available, but the majority have
                                            suffered alteration in some form, by injected humour, or randomised words which don't
                                            look even slightly believable. If you are going to use a passage of Lorem Ipsum.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiDropdowns() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Dropdowns</h4>

        <div className="card mb-4" id="btn-dropdown-demo">
            <h5 className="card-header">Dropdowns</h5>
            <div className="card-body">
                <small className="text-light fw-semibold">Basic</small>
                <div className="demo-inline-spacing">
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Primary
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Secondary
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-success dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Success
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-danger dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Danger
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-warning dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Warning
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-info dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Info
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <hr className="m-0" />
            <div className="card-body">
                <small className="text-light fw-semibold">Outline</small>
                <div className="demo-inline-spacing">
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-outline-primary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Primary
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-outline-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Secondary
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-outline-success dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Success
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-outline-danger dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Danger
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-outline-warning dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Warning
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-outline-info dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Info
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className="m-0" />
            <div className="card-body">
                <small className="text-light fw-semibold">Split</small>
                <div className="demo-inline-spacing">
                    <div className="btn-group">
                        <button type="button" className="btn btn-primary">Primary</button>
                        <button
                            type="button"
                            className="btn btn-primary dropdown-toggle dropdown-toggle-split"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span className="visually-hidden">Toggle Dropdown</span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button type="button" className="btn btn-secondary">Secondary</button>
                        <button
                            type="button"
                            className="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span className="visually-hidden">Toggle Dropdown</span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button type="button" className="btn btn-success">Success</button>
                        <button
                            type="button"
                            className="btn btn-success dropdown-toggle dropdown-toggle-split"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span className="visually-hidden">Toggle Dropdown</span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button type="button" className="btn btn-danger">Danger</button>
                        <button
                            type="button"
                            className="btn btn-danger dropdown-toggle dropdown-toggle-split"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span className="visually-hidden">Toggle Dropdown</span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button type="button" className="btn btn-warning">Warning</button>
                        <button
                            type="button"
                            className="btn btn-warning dropdown-toggle dropdown-toggle-split"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span className="visually-hidden">Toggle Dropdown</span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button type="button" className="btn btn-info">Info</button>
                        <button
                            type="button"
                            className="btn btn-info dropdown-toggle dropdown-toggle-split"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span className="visually-hidden">Toggle Dropdown</span>
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className="m-0" />
            <div className="card-body">
                <div className="row gy-3">
                    <div className="col-lg-3 col-sm-6 col-12">
                        <small className="text-light fw-semibold">Hidden arrow</small>
                        <div className="demo-inline-spacing">
                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-primary dropdown-toggle hide-arrow"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Hidden arrow
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="void(0);">Action</a></li>
                                    <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                                    <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                        <small className="text-light fw-semibold">With Icon</small>
                        <div className="demo-inline-spacing">
                            <div className="btn-group" id="dropdown-icon-demo">
                                <button
                                    type="button"
                                    className="btn btn-primary dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bx bx-menu"></i> With Icon
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a href="void(0);" className="dropdown-item d-flex align-items-center"
                                        ><i className="bx bx-chevron-right scaleX-n1-rtl"></i>Action</a
                                        >
                                    </li>
                                    <li>
                                        <a href="void(0);" className="dropdown-item d-flex align-items-center"
                                        ><i className="bx bx-chevron-right scaleX-n1-rtl"></i>Another action</a
                                        >
                                    </li>
                                    <li>
                                        <a href="void(0);" className="dropdown-item d-flex align-items-center"
                                        ><i className="bx bx-chevron-right scaleX-n1-rtl"></i>Something else here</a
                                        >
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <a href="void(0);" className="dropdown-item d-flex align-items-center"
                                        ><i className="bx bx-chevron-right scaleX-n1-rtl"></i>Separated link</a
                                        >
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                        <small className="text-light fw-semibold">Icon Dropdown</small>
                        <div className="demo-inline-spacing">
                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-icon rounded-pill dropdown-toggle hide-arrow"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><a className="dropdown-item" href="void(0);">Action</a></li>
                                    <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                                    <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card" id="dropdown-variation-demo">
            <h5 className="card-header">Dropdown Variations</h5>
            <div className="card-body">
                <small className="text-light fw-semibold">Menu Alignment</small>
                <div className="demo-inline-spacing">
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            End-aligned dropdown menu
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="dropdown-item" type="button">Action</button></li>
                            <li><button className="dropdown-item" type="button">Another action</button></li>
                            <li><button className="dropdown-item" type="button">Something else here</button></li>
                        </ul>
                    </div>
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            data-bs-display="static"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            Start-aligned but end-aligned when lg screen
                        </button>
                        <ul className="dropdown-menu dropdown-menu-start dropdown-menu-lg-end">
                            <li><button className="dropdown-item" type="button">Action</button></li>
                            <li><button className="dropdown-item" type="button">Another action</button></li>
                            <li><button className="dropdown-item" type="button">Something else here</button></li>
                        </ul>
                    </div>
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            data-bs-display="static"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            End-aligned but start-aligned when lg screen
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
                            <li><button className="dropdown-item" type="button">Action</button></li>
                            <li><button className="dropdown-item" type="button">Another action</button></li>
                            <li><button className="dropdown-item" type="button">Something else here</button></li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className="m-0" />
            <div className="card-body">
                <small className="text-light fw-semibold">Sizes</small>
                <div className="demo-inline-spacing">
                    <div className="btn-group">
                        <button
                            className="btn btn-primary btn-xl dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Extra large button
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            className="btn btn-primary btn-lg dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Large button
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            className="btn btn-primary btn-sm dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Small button
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>

                    <div className="btn-group">
                        <button
                            className="btn btn-primary btn-xs dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Extra small button
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <hr className="m-0" />
            <div className="card-body">
                <div className="row gy-3">
                    <div className="col-xl-6">
                        <small className="text-light fw-semibold">Directions</small>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="demo-inline-spacing">
                                    <div className="btn-group">
                                        <button
                                            className="btn btn-primary dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Dropdown
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="demo-inline-spacing">
                                    <div className="btn-group dropup">
                                        <button
                                            type="button"
                                            className="btn btn-primary dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            Dropup
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="demo-inline-spacing">
                                    <div className="btn-group dropend">
                                        <button
                                            type="button"
                                            className="btn btn-primary dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            Dropend
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="demo-inline-spacing">
                                    <div className="btn-group dropstart">
                                        <button
                                            className="btn btn-primary dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Dropstart
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="void(0);">Action</a></li>
                                            <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                                            <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <small className="text-light fw-semibold">Menu Content</small>
                        <div className="demo-inline-spacing">
                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-primary dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    Dropdown Header
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <h6 className="dropdown-header text-uppercase">Dropdown header</h6>
                                    </li>
                                    <li><a className="dropdown-item" href="void(0);">Action</a></li>
                                    <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                                </ul>
                            </div>
                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-primary dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    Divider
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="void(0);">Action</a></li>
                                    <li><a className="dropdown-item" href="void(0);">Another action</a></li>
                                    <li><a className="dropdown-item" href="void(0);">Something else here</a></li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li><a className="dropdown-item" href="void(0);">Separated link</a></li>
                                </ul>
                            </div>
                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-primary dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    Text
                                </button>
                                <div className="dropdown-menu">
                                    <div className="px-3 py-2 text-muted">
                                        <p>Some example text that's free-flowing within the dropdown menu.</p>
                                        <p className="mb-0">And this is more example text.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-primary dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    Forms
                                </button>
                                <div className="dropdown-menu dropdown-menu-end w-px-300">
                                    <form className="p-4" onsubmit="return false">
                                        <div className="mb-3">
                                            <label for="exampleDropdownFormEmail1" className="form-label">Email address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="exampleDropdownFormEmail1"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label for="exampleDropdownFormPassword1" className="form-label">Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="exampleDropdownFormPassword1"
                                                placeholder="Password"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="dropdownCheck" />
                                                <label className="form-check-label" for="dropdownCheck"> Remember me </label>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-primary">Sign in</button>
                                    </form>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="void(0)">New around here? Sign up</a>
                                    <a className="dropdown-item" href="void(0)">Forgot password?</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="m-0" />
            <div className="card-body">
                <div className="row gy-3">
                    <div className="col-xl-6">
                        <small className="text-light fw-semibold"
                        >Options : Use <code>data-bs-offset</code> or <code>data-bs-reference</code> to change the
                            location of the dropdown.</small
                        >
                        <div className="demo-inline-spacing">
                            <div className="btn-group me-1">
                                <button
                                    type="button"
                                    className="btn btn-primary dropdown-toggle"
                                    id="dropdownMenuOffset"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    data-bs-offset="10,20"
                                >
                                    Offset
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuOffset">
                                    <li><a className="dropdown-item" href="void(0)">Action</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Another action</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Something else here</a></li>
                                </ul>
                            </div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-primary">Reference</button>
                                <button
                                    type="button"
                                    className="btn btn-primary dropdown-toggle dropdown-toggle-split"
                                    id="dropdownMenuReference"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    data-bs-reference="parent"
                                >
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuReference">
                                    <li><a className="dropdown-item" href="void(0)">Action</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Another action</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Something else here</a></li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li><a className="dropdown-item" href="void(0)">Separated link</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <small className="text-light fw-semibold">Auto close behavior</small>
                        <div className="demo-inline-spacing">
                            <div className="btn-group">
                                <button
                                    className="btn btn-primary dropdown-toggle"
                                    type="button"
                                    id="defaultDropdown"
                                    data-bs-toggle="dropdown"
                                    data-bs-auto-close="true"
                                    aria-expanded="false"
                                >
                                    Default
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                </ul>
                            </div>
                            <div className="btn-group">
                                <button
                                    className="btn btn-primary dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuClickableOutside"
                                    data-bs-toggle="dropdown"
                                    data-bs-auto-close="inside"
                                    aria-expanded="false"
                                >
                                    Clickable outside
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuClickableOutside">
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                </ul>
                            </div>
                            <div className="btn-group">
                                <button
                                    className="btn btn-primary dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuClickableInside"
                                    data-bs-toggle="dropdown"
                                    data-bs-auto-close="outside"
                                    aria-expanded="false"
                                >
                                    Clickable inside
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuClickableInside">
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                </ul>
                            </div>
                            <div className="btn-group">
                                <button
                                    className="btn btn-primary dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuClickable"
                                    data-bs-toggle="dropdown"
                                    data-bs-auto-close="false"
                                    aria-expanded="false"
                                >
                                    Manual close
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuClickable">
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                    <li><a className="dropdown-item" href="void(0)">Menu item</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiFooter() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Footer</h4>
        <section id="basic-footer">
            <h5 className="pb-1 mt-5 mb-4">Basic Footer</h5>

            <footer className="footer bg-light">
                <div
                    className="container-fluid d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-1 container-p-x py-3"
                >
                    <div>
                        <a
                            href="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/landing/"
                            target="_blank"
                            className="footer-text fw-bolder"
                        >Sneat</a
                        >
                        ©
                    </div>
                    <div>
                        <a href="https://themeselection.com/license/" className="footer-link me-4" target="_blank">License</a>
                        <a href="void(0)" className="footer-link me-4">Help</a>
                        <a href="void(0)" className="footer-link me-4">Contact</a>
                        <a href="void(0)" className="footer-link">Terms &amp; Conditions</a>
                    </div>
                </div>
            </footer>
        </section>
        <hr className="container-m-nx border-light my-5" />
        <section id="component-footer">
            <h5 className="pb-1 mb-4">Footer with Elements</h5>

            <footer className="footer bg-light">
                <div
                    className="container-fluid d-flex flex-md-row flex-column justify-content-between align-items-md-center gap-1 container-p-x py-3"
                >
                    <div>
                        <a
                            href="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/landing/"
                            target="_blank"
                            className="footer-text fw-bolder"
                        >Sneat</a
                        >
                        ©
                    </div>
                    <div>
                        <div className="form-check form-control-sm footer-link me-3">
                            <input className="form-check-input" type="checkbox" value="" id="customCheck2" checked />
                            <label className="form-check-label" for="customCheck2"> Show </label>
                        </div>
                        <div className="dropdown dropup footer-link me-3">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                Currency
                            </button>
                            <div className="dropdown-menu dropdown-menu-end">
                                <a className="dropdown-item" href="void(0);"><i className="bx bx-dollar"></i> USD</a>
                                <a className="dropdown-item" href="void(0);"><i className="bx bx-euro"></i> Euro</a>
                                <a className="dropdown-item" href="void(0);"><i className="bx bx-pound"></i> Pound</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="void(0);"><i className="bx bx-bitcoin"></i> Bitcoin</a>
                            </div>
                        </div>
                        <a href="void(0)" className="btn btn-sm btn-outline-danger"
                        ><i className="bx bx-log-out-circle"></i> Logout</a
                        >
                    </div>
                </div>
            </footer>
        </section>
    </>)
}
function UiListGroups() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> List groups</h4>

        <div className="card mb-4">
            <h5 className="card-header">List groups</h5>
            <div className="card-body">
                <div className="row">
                    <div className="col-lg-6 mb-4 mb-xl-0">
                        <small className="text-light fw-semibold">Basic</small>
                        <div className="demo-inline-spacing mt-3">
                            <div className="list-group">
                                <a href="void(0);" className="list-group-item list-group-item-action active"
                                >Bear claw cake biscuit</a
                                >
                                <a href="void(0);" className="list-group-item list-group-item-action"
                                >Soufflé pastry pie ice</a
                                >
                                <a href="void(0);" className="list-group-item list-group-item-action disabled"
                                >Tart tiramisu cake</a
                                >
                                <a href="void(0);" className="list-group-item list-group-item-action"
                                >Bonbon toffee muffin</a
                                >
                                <a href="void(0);" className="list-group-item list-group-item-action"
                                >Dragée tootsie roll</a
                                >
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <small className="text-light fw-semibold">With Bagdes & Pills</small>
                        <div className="demo-inline-spacing mt-3">
                            <ul className="list-group">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Soufflé pastry pie ice
                                    <span className="badge bg-primary">5</span>
                                </li>
                                <li className="list-group-item disabled">Bear claw cake biscuit</li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Tart tiramisu cake
                                    <span className="badge bg-success">2</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Bonbon toffee muffin
                                    <span className="badge bg-danger rounded-pill">3</span>
                                </li>
                                <li className="list-group-item">Dragée tootsie roll</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="m-0" />
            <div className="card-body">
                <div className="row">
                    <div className="col-lg-6 mb-4 mb-xl-0">
                        <small className="text-light fw-semibold">Flush</small>
                        <div className="demo-inline-spacing mt-3">
                            <div className="list-group list-group-flush">
                                <a href="void(0);" className="list-group-item list-group-item-action"
                                >Bear claw cake biscuit</a
                                >
                                <a href="void(0);" className="list-group-item list-group-item-action"
                                >Soufflé pastry pie ice</a
                                >
                                <a href="void(0);" className="list-group-item list-group-item-action"
                                >Tart tiramisu cake</a
                                >
                                <a href="void(0);" className="list-group-item list-group-item-action"
                                >Bonbon toffee muffin</a
                                >
                                <a href="void(0);" className="list-group-item list-group-item-action"
                                >Dragée tootsie roll</a
                                >
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <small className="text-light fw-semibold">With Icons</small>
                        <div className="demo-inline-spacing mt-3">
                            <ul className="list-group">
                                <li className="list-group-item d-flex align-items-center">
                                    <i className="bx bx-tv me-2"></i>
                                    Soufflé pastry pie ice
                                </li>
                                <li className="list-group-item d-flex align-items-center">
                                    <i className="bx bx-bell me-2"></i>
                                    Bear claw cake biscuit
                                </li>
                                <li className="list-group-item d-flex align-items-center">
                                    <i className="bx bx-support me-2"></i>
                                    Tart tiramisu cake
                                </li>
                                <li className="list-group-item d-flex align-items-center">
                                    <i className="bx bx-purchase-tag-alt me-2"></i>
                                    Bonbon toffee muffin
                                </li>
                                <li className="list-group-item d-flex align-items-center">
                                    <i className="bx bx-closet me-2"></i>
                                    Dragée tootsie roll
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="m-0" />
            <div className="card-body">
                <div className="row">
                    <div className="col-lg-6 mb-4 mb-xl-0">
                        <small className="text-light fw-semibold">Numbered</small>
                        <div className="demo-inline-spacing mt-3">
                            <ol className="list-group list-group-numbered">
                                <li className="list-group-item">Bear claw cake biscuit</li>
                                <li className="list-group-item">Soufflé pastry pie ice</li>
                                <li className="list-group-item">Tart tiramisu cake</li>
                                <li className="list-group-item">Bonbon toffee muffin</li>
                                <li className="list-group-item">Dragée tootsie roll</li>
                            </ol>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <small className="text-light fw-semibold">List Group With Checkbox</small>
                        <div className="demo-inline-spacing mt-3">
                            <div className="list-group">
                                <label className="list-group-item">
                                    <input className="form-check-input me-1" type="checkbox" value="" />
                                    Soufflé pastry pie ice
                                </label>
                                <label className="list-group-item">
                                    <input className="form-check-input me-1" type="checkbox" value="" />
                                    Bear claw cake biscuit
                                </label>
                                <label className="list-group-item">
                                    <input className="form-check-input me-1" type="checkbox" value="" />
                                    Tart tiramisu cake
                                </label>
                                <label className="list-group-item">
                                    <input className="form-check-input me-1" type="checkbox" value="" />
                                    Bonbon toffee muffin
                                </label>
                                <label className="list-group-item">
                                    <input className="form-check-input me-1" type="checkbox" value="" />
                                    Dragée tootsie roll
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="m-0" />
            <div className="card-body">
                <div className="row">
                    <div className="col-lg-6 mb-4 mb-xl-0">
                        <small className="text-light fw-semibold">Contextual classes</small>
                        <div className="demo-inline-spacing mt-3">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-primary">Primary list group item</li>
                                <li className="list-group-item list-group-item-secondary">Secondary list group item</li>
                                <li className="list-group-item list-group-item-success">Success list group item</li>
                                <li className="list-group-item list-group-item-danger">Danger list group item</li>
                                <li className="list-group-item list-group-item-warning">Warning list group item</li>
                                <li className="list-group-item list-group-item-info">Info list group item</li>
                                <li className="list-group-item list-group-item-dark">Dark list group item</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <small className="text-light fw-semibold">Custom content</small>
                        <div className="demo-inline-spacing mt-3">
                            <div className="list-group">
                                <a
                                    href="void(0);"
                                    className="list-group-item list-group-item-action flex-column align-items-start active"
                                >
                                    <div className="d-flex justify-content-between w-100">
                                        <h6>List group item heading</h6>
                                        <small>3 days ago</small>
                                    </div>
                                    <p className="mb-1">
                                        Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
                                        blandit.
                                    </p>
                                    <small>Donec id elit non mi porta.</small>
                                </a>
                                <a
                                    href="void(0);"
                                    className="list-group-item list-group-item-action flex-column align-items-start"
                                >
                                    <div className="d-flex justify-content-between w-100">
                                        <h6>List group item heading</h6>
                                        <small className="text-muted">3 days ago</small>
                                    </div>
                                    <p className="mb-1">
                                        Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
                                        blandit.
                                    </p>
                                    <small className="text-muted">Donec id elit non mi porta.</small>
                                </a>
                                <a
                                    href="void(0);"
                                    className="list-group-item list-group-item-action flex-column align-items-start"
                                >
                                    <div className="d-flex justify-content-between w-100">
                                        <h6>List group item heading</h6>
                                        <small className="text-muted">3 days ago</small>
                                    </div>
                                    <p className="mb-1">
                                        Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
                                        blandit.
                                    </p>
                                    <small className="text-muted">Donec id elit non mi porta.</small>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="card mb-4">
            <h5 className="card-header">Javascript behavior</h5>
            <div className="card-body">
                <div className="row">
                    <div className="col-lg-6 mb-4 mb-xl-0">
                        <small className="text-light fw-semibold">Vertical</small>
                        <div className="mt-3">
                            <div className="row">
                                <div className="col-md-4 col-12 mb-3 mb-md-0">
                                    <div className="list-group">
                                        <a
                                            className="list-group-item list-group-item-action active"
                                            id="list-home-list"
                                            data-bs-toggle="list"
                                            href="#list-home"
                                        >Home</a
                                        >
                                        <a
                                            className="list-group-item list-group-item-action"
                                            id="list-profile-list"
                                            data-bs-toggle="list"
                                            href="#list-profile"
                                        >Profile</a
                                        >
                                        <a
                                            className="list-group-item list-group-item-action"
                                            id="list-messages-list"
                                            data-bs-toggle="list"
                                            href="#list-messages"
                                        >Messages</a
                                        >
                                        <a
                                            className="list-group-item list-group-item-action"
                                            id="list-settings-list"
                                            data-bs-toggle="list"
                                            href="#list-settings"
                                        >Settings</a
                                        >
                                    </div>
                                </div>
                                <div className="col-md-8 col-12">
                                    <div className="tab-content p-0">
                                        <div className="tab-pane fade show active" id="list-home">
                                            Donut sugar plum sweet roll biscuit. Cake oat cake gummi bears. Tart wafer wafer halvah
                                            gummi bears cheesecake. Topping croissant cake sweet roll. Dessert fruitcake gingerbread
                                            halvah marshmallow pudding bear claw cheesecake. Bonbon dragée cookie gummies. Pudding
                                            marzipan liquorice. Sugar plum dragée cupcake cupcake cake dessert chocolate bar. Pastry
                                            lollipop lemon drops lollipop halvah croissant. Pastry sweet gingerbread lemon drops
                                            topping ice cream.
                                        </div>
                                        <div className="tab-pane fade" id="list-profile">
                                            Muffin lemon drops chocolate chupa chups jelly beans dessert jelly-o. Soufflé gummies
                                            gummies. Ice cream powder marshmallow cotton candy oat cake wafer. Marshmallow
                                            gingerbread tootsie roll. Chocolate cake bonbon jelly beans lollipop jelly beans halvah
                                            marzipan danish pie. Oat cake chocolate cake pudding bear claw liquorice gingerbread
                                            icing sugar plum brownie. Toffee cookie apple pie cheesecake bear claw sugar plum wafer
                                            gummi bears fruitcake.
                                        </div>
                                        <div className="tab-pane fade" id="list-messages">
                                            Ice cream dessert candy sugar plum croissant cupcake tart pie apple pie. Pastry
                                            chocolate chupa chups tiramisu. Tiramisu cookie oat cake. Pudding brownie bonbon. Pie
                                            carrot cake chocolate macaroon. Halvah jelly jelly beans cake macaroon jelly-o. Danish
                                            pastry dessert gingerbread powder halvah. Muffin bonbon fruitcake dragée sweet sesame
                                            snaps oat cake marshmallow cheesecake. Cupcake donut sweet bonbon cheesecake soufflé
                                            chocolate bar.
                                        </div>
                                        <div className="tab-pane fade" id="list-settings">
                                            Marzipan cake oat cake. Marshmallow pie chocolate. Liquorice oat cake donut halvah
                                            jelly-o. Jelly-o muffin macaroon cake gingerbread candy cupcake. Cake lollipop lollipop
                                            jelly brownie cake topping chocolate. Pie oat cake jelly. Lemon drops halvah jelly
                                            cookie bonbon cake cupcake ice cream. Donut tart bonbon sweet roll soufflé gummies
                                            biscuit. Wafer toffee topping jelly beans icing pie apple pie toffee pudding. Tiramisu
                                            powder macaroon tiramisu cake halvah.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <small className="text-light fw-semibold">Horizontal</small>
                        <div className="demo-inline-spacing mt-3">
                            <div className="list-group list-group-horizontal-md text-md-center">
                                <a
                                    className="list-group-item list-group-item-action active"
                                    id="home-list-item"
                                    data-bs-toggle="list"
                                    href="#horizontal-home"
                                >Home</a
                                >
                                <a
                                    className="list-group-item list-group-item-action"
                                    id="profile-list-item"
                                    data-bs-toggle="list"
                                    href="#horizontal-profile"
                                >Profile</a
                                >
                                <a
                                    className="list-group-item list-group-item-action"
                                    id="messages-list-item"
                                    data-bs-toggle="list"
                                    href="#horizontal-messages"
                                >Messages</a
                                >
                                <a
                                    className="list-group-item list-group-item-action"
                                    id="settings-list-item"
                                    data-bs-toggle="list"
                                    href="#horizontal-settings"
                                >Settings</a
                                >
                            </div>
                            <div className="tab-content px-0 mt-0">
                                <div className="tab-pane fade show active" id="horizontal-home">
                                    Donut sugar plum sweet roll biscuit. Cake oat cake gummi bears. Tart wafer wafer halvah
                                    gummi bears cheesecake. Topping croissant cake sweet roll. Dessert fruitcake gingerbread
                                    halvah marshmallow pudding bear claw cheesecake. Bonbon dragée cookie gummies. Pudding
                                    marzipan liquorice. Sugar plum dragée cupcake cupcake cake dessert chocolate bar. Pastry
                                    lollipop lemon drops lollipop halvah croissant. Pastry sweet gingerbread lemon drops topping
                                    ice cream.
                                </div>
                                <div className="tab-pane fade" id="horizontal-profile">
                                    Muffin lemon drops chocolate chupa chups jelly beans dessert jelly-o. Soufflé gummies
                                    gummies. Ice cream powder marshmallow cotton candy oat cake wafer. Marshmallow gingerbread
                                    tootsie roll. Chocolate cake bonbon jelly beans lollipop jelly beans halvah marzipan danish
                                    pie. Oat cake chocolate cake pudding bear claw liquorice gingerbread icing sugar plum
                                    brownie. Toffee cookie apple pie cheesecake bear claw sugar plum wafer gummi bears
                                    fruitcake.
                                </div>
                                <div className="tab-pane fade" id="horizontal-messages">
                                    Ice cream dessert candy sugar plum croissant cupcake tart pie apple pie. Pastry chocolate
                                    chupa chups tiramisu. Tiramisu cookie oat cake. Pudding brownie bonbon. Pie carrot cake
                                    chocolate macaroon. Halvah jelly jelly beans cake macaroon jelly-o. Danish pastry dessert
                                    gingerbread powder halvah. Muffin bonbon fruitcake dragée sweet sesame snaps oat cake
                                    marshmallow cheesecake. Cupcake donut sweet bonbon cheesecake soufflé chocolate bar.
                                </div>
                                <div className="tab-pane fade" id="horizontal-settings">
                                    Marzipan cake oat cake. Marshmallow pie chocolate. Liquorice oat cake donut halvah jelly-o.
                                    Jelly-o muffin macaroon cake gingerbread candy cupcake. Cake lollipop lollipop jelly brownie
                                    cake topping chocolate. Pie oat cake jelly. Lemon drops halvah jelly cookie bonbon cake
                                    cupcake ice cream. Donut tart bonbon sweet roll soufflé gummies biscuit. Wafer toffee
                                    topping jelly beans icing pie apple pie toffee pudding. Tiramisu powder macaroon tiramisu
                                    cake halvah.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiModals() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Modals</h4>
        <div className="card mb-4">
            <h5 className="card-header">Bootstrap modals</h5>
            <div className="card-body">
                <div className="row gy-3">
                    <div className="col-lg-4 col-md-6">
                        <small className="text-light fw-semibold">Default</small>
                        <div className="mt-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#basicModal"
                            >
                                Launch modal
                            </button>
                            <div className="modal fade" id="basicModal" tabindex="-1" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel1">Modal title</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col mb-3">
                                                    <label for="nameBasic" className="form-label">Name</label>
                                                    <input type="text" id="nameBasic" className="form-control" placeholder="Enter Name" />
                                                </div>
                                            </div>
                                            <div className="row g-2">
                                                <div className="col mb-0">
                                                    <label for="emailBasic" className="form-label">Email</label>
                                                    <input type="text" id="emailBasic" className="form-control" placeholder="xxxx@xxx.xx" />
                                                </div>
                                                <div className="col mb-0">
                                                    <label for="dobBasic" className="form-label">DOB</label>
                                                    <input type="text" id="dobBasic" className="form-control" placeholder="DD / MM / YY" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                                Close
                                            </button>
                                            <button type="button" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <small className="text-light fw-semibold">Vertically centered</small>
                        <div className="mt-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#modalCenter"
                            >
                                Launch modal
                            </button>
                            <div className="modal fade" id="modalCenter" tabindex="-1" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="modalCenterTitle">Modal title</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col mb-3">
                                                    <label for="nameWithTitle" className="form-label">Name</label>
                                                    <input
                                                        type="text"
                                                        id="nameWithTitle"
                                                        className="form-control"
                                                        placeholder="Enter Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row g-2">
                                                <div className="col mb-0">
                                                    <label for="emailWithTitle" className="form-label">Email</label>
                                                    <input
                                                        type="text"
                                                        id="emailWithTitle"
                                                        className="form-control"
                                                        placeholder="xxxx@xxx.xx"
                                                    />
                                                </div>
                                                <div className="col mb-0">
                                                    <label for="dobWithTitle" className="form-label">DOB</label>
                                                    <input
                                                        type="text"
                                                        id="dobWithTitle"
                                                        className="form-control"
                                                        placeholder="DD / MM / YY"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                                Close
                                            </button>
                                            <button type="button" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <small className="text-light fw-semibold">Slide from Top</small>
                        <div className="mt-3">
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalTop">
                                Launch modal
                            </button>
                            <div className="modal modal-top fade" id="modalTop" tabindex="-1">
                                <div className="modal-dialog">
                                    <form className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="modalTopTitle">Modal title</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col mb-3">
                                                    <label for="nameSlideTop" className="form-label">Name</label>
                                                    <input
                                                        type="text"
                                                        id="nameSlideTop"
                                                        className="form-control"
                                                        placeholder="Enter Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row g-2">
                                                <div className="col mb-0">
                                                    <label for="emailSlideTop" className="form-label">Email</label>
                                                    <input
                                                        type="text"
                                                        id="emailSlideTop"
                                                        className="form-control"
                                                        placeholder="xxxx@xxx.xx"
                                                    />
                                                </div>
                                                <div className="col mb-0">
                                                    <label for="dobSlideTop" className="form-label">DOB</label>
                                                    <input
                                                        type="text"
                                                        id="dobSlideTop"
                                                        className="form-control"
                                                        placeholder="DD / MM / YY"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                                Close
                                            </button>
                                            <button type="button" className="btn btn-primary">Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="m-0" />
            <div className="card-body">
                <div className="row gy-3">
                    <div className="col-lg-4 col-md-6">
                        <small className="text-light fw-semibold">YouTube Video</small>
                        <div className="mt-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#youTubeModal"
                                data-theVideo="https://www.youtube.com/embed/EngW7tLk6R8"
                            >
                                Launch modal
                            </button>
                            <div className="modal fade" id="youTubeModal" tabindex="-1" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <iframe height="350" src="https://www.youtube.com/embed/EngW7tLk6R8"></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <small className="text-light fw-semibold">Toggle Between Modals</small>
                        <div className="mt-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#modalToggle"
                            >
                                Launch modal
                            </button>
                            <div
                                className="modal fade"
                                id="modalToggle"
                                aria-labelledby="modalToggleLabel"
                                tabindex="-1"
                                style="display: none"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="modalToggleLabel">Modal 1</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">Show a second modal and hide this one with the button below.</div>
                                        <div className="modal-footer">
                                            <button
                                                className="btn btn-primary"
                                                data-bs-target="#modalToggle2"
                                                data-bs-toggle="modal"
                                                data-bs-dismiss="modal"
                                            >
                                                Open second modal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="modal fade"
                                id="modalToggle2"
                                aria-hidden="true"
                                aria-labelledby="modalToggleLabel2"
                                tabindex="-1"
                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="modalToggleLabel2">Modal 2</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">Hide this modal and show the first with the button below.</div>
                                        <div className="modal-footer">
                                            <button
                                                className="btn btn-primary"
                                                data-bs-target="#modalToggle"
                                                data-bs-toggle="modal"
                                                data-bs-dismiss="modal"
                                            >
                                                Back to first
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <small className="text-light fw-semibold">Fullscreen</small>
                        <div className="mt-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#fullscreenModal"
                            >
                                Launch modal
                            </button>
                            <div className="modal fade" id="fullscreenModal" tabindex="-1" aria-hidden="true">
                                <div className="modal-dialog modal-fullscreen" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="modalFullTitle">Modal title</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <p>
                                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
                                                facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
                                                at eros.
                                            </p>
                                            <p>
                                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                                lacus vel augue laoreet rutrum faucibus dolor auctor.
                                            </p>
                                            <p>
                                                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                                scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                                auctor fringilla.
                                            </p>
                                            <p>
                                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
                                                facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
                                                at eros.
                                            </p>
                                            <p>
                                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                                lacus vel augue laoreet rutrum faucibus dolor auctor.
                                            </p>
                                            <p>
                                                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                                scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                                auctor fringilla.
                                            </p>
                                            <p>
                                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
                                                facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
                                                at eros.
                                            </p>
                                            <p>
                                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                                lacus vel augue laoreet rutrum faucibus dolor auctor.
                                            </p>
                                            <p>
                                                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                                scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                                auctor fringilla.
                                            </p>
                                            <p>
                                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
                                                facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
                                                at eros.
                                            </p>
                                            <p>
                                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                                lacus vel augue laoreet rutrum faucibus dolor auctor.
                                            </p>
                                            <p>
                                                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                                scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                                auctor fringilla.
                                            </p>
                                            <p>
                                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
                                                facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
                                                at eros.
                                            </p>
                                            <p>
                                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                                lacus vel augue laoreet rutrum faucibus dolor auctor.
                                            </p>
                                            <p>
                                                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                                scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                                auctor fringilla.
                                            </p>
                                            <p>
                                                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
                                                facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
                                                at eros.
                                            </p>
                                            <p>
                                                Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                                lacus vel augue laoreet rutrum faucibus dolor auctor.
                                            </p>
                                            <p>
                                                Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                                scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                                auctor fringilla.
                                            </p>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                                Close
                                            </button>
                                            <button type="button" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="m-0" />
            <div className="card-body">
                <div className="row gy-3">
                    <div className="col-lg-4 col-md-6">
                        <small className="text-light fw-semibold">Sizes</small>
                        <div className="modal fade" id="smallModal" tabindex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-sm" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel2">Modal title</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col mb-3">
                                                <label for="nameSmall" className="form-label">Name</label>
                                                <input type="text" id="nameSmall" className="form-control" placeholder="Enter Name" />
                                            </div>
                                        </div>
                                        <div className="row g-2">
                                            <div className="col mb-0">
                                                <label className="form-label" for="emailSmall">Email</label>
                                                <input type="text" className="form-control" id="emailSmall" placeholder="xxxx@xxx.xx" />
                                            </div>
                                            <div className="col mb-0">
                                                <label for="dobSmall" className="form-label">DOB</label>
                                                <input id="dobSmall" type="text" className="form-control" placeholder="DD / MM / YY" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="largeModal" tabindex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel3">Modal title</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col mb-3">
                                                <label for="nameLarge" className="form-label">Name</label>
                                                <input type="text" id="nameLarge" className="form-control" placeholder="Enter Name" />
                                            </div>
                                        </div>
                                        <div className="row g-2">
                                            <div className="col mb-0">
                                                <label for="emailLarge" className="form-label">Email</label>
                                                <input type="text" id="emailLarge" className="form-control" placeholder="xxxx@xxx.xx" />
                                            </div>
                                            <div className="col mb-0">
                                                <label for="dobLarge" className="form-label">DOB</label>
                                                <input type="text" id="dobLarge" className="form-control" placeholder="DD / MM / YY" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="exLargeModal" tabindex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-xl" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel4">Modal title</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col mb-3">
                                                <label for="nameExLarge" className="form-label">Name</label>
                                                <input type="text" id="nameExLarge" className="form-control" placeholder="Enter Name" />
                                            </div>
                                        </div>
                                        <div className="row g-2">
                                            <div className="col mb-0">
                                                <label for="emailExLarge" className="form-label">Email</label>
                                                <input type="text" id="emailExLarge" className="form-control" placeholder="xxxx@xxx.xx" />
                                            </div>
                                            <div className="col mb-0">
                                                <label for="dobExLarge" className="form-label">DOB</label>
                                                <input type="text" id="dobExLarge" className="form-control" placeholder="DD / MM / YY" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="demo-inline-spacing">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#smallModal"
                            >
                                Small
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#largeModal"
                            >
                                Large
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#exLargeModal"
                            >
                                Extra Large
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-3">
                        <small className="text-light fw-semibold">Scrolling long content</small>
                        <div className="modal fade" id="modalLong" tabindex="-1" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="modalLongTitle">Modal title</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="modalScrollable" tabindex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-scrollable" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="modalScrollableTitle">Modal title</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                        <p>
                                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                                            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                                        </p>
                                        <p>
                                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                                            lacus vel augue laoreet rutrum faucibus dolor auctor.
                                        </p>
                                        <p>
                                            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                                            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                                            auctor fringilla.
                                        </p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="demo-inline-spacing">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#modalLong"
                            >
                                Option 1
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#modalScrollable"
                            >
                                Option 2
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-3">
                        <small className="text-light fw-semibold">Backdrop</small>
                        <div className="mt-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#backDropModal"
                            >
                                Launch modal
                            </button>
                            <div className="modal fade" id="backDropModal" data-bs-backdrop="static" tabindex="-1">
                                <div className="modal-dialog">
                                    <form className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="backDropModalTitle">Modal title</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col mb-3">
                                                    <label for="nameBackdrop" className="form-label">Name</label>
                                                    <input
                                                        type="text"
                                                        id="nameBackdrop"
                                                        className="form-control"
                                                        placeholder="Enter Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row g-2">
                                                <div className="col mb-0">
                                                    <label for="emailBackdrop" className="form-label">Email</label>
                                                    <input
                                                        type="text"
                                                        id="emailBackdrop"
                                                        className="form-control"
                                                        placeholder="xxxx@xxx.xx"
                                                    />
                                                </div>
                                                <div className="col mb-0">
                                                    <label for="dobBackdrop" className="form-label">DOB</label>
                                                    <input
                                                        type="text"
                                                        id="dobBackdrop"
                                                        className="form-control"
                                                        placeholder="DD / MM / YY"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                                Close
                                            </button>
                                            <button type="button" className="btn btn-primary">Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiNavbar() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Navbar</h4>
        <h5 className="pb-1 mt-5 mb-4">Example</h5>
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
            <div className="container-fluid">
                <a className="navbar-brand" href="void(0)">Navbar</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="void(0)">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="void(0)">Link</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="void(0)"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Dropdown
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="void(0)">Action</a></li>
                                <li><a className="dropdown-item" href="void(0)">Another action</a></li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li><a className="dropdown-item" href="void(0)">Something else here</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" href="void(0)" tabindex="-1">Disabled</a>
                        </li>
                    </ul>
                    <form className="d-flex" onsubmit="return false">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-primary" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
        <h5 className="pb-1 mb-4">Supported content</h5>
        <div className="mb-5">
            <h6 className="mt-2 mb-3 text-muted">Text</h6>
            <nav className="navbar navbar-example navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="void(0)">Navbar</a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbar-ex-2"
                        aria-controls="navbar-ex-2"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbar-ex-2">
                        <div className="navbar-nav me-auto">
                            <a className="nav-item nav-link active" href="void(0)">Home</a>
                            <a className="nav-item nav-link" href="void(0)">About</a>
                            <a className="nav-item nav-link" href="void(0)">Contact</a>
                        </div>

                        <span className="navbar-text">Marshmallow brownie lemon drops cheesecake.</span>
                    </div>
                </div>
            </nav>

            <h6 className="mt-4 mb-3 text-muted">Input Group</h6>
            <nav className="navbar navbar-example navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="void(0)">Navbar</a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbar-ex-4"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbar-ex-4">
                        <div className="navbar-nav me-auto">
                            <a className="nav-item nav-link active" href="void(0)">Home</a>
                            <a className="nav-item nav-link" href="void(0)">About</a>
                            <a className="nav-item nav-link" href="void(0)">Contact</a>
                        </div>

                        <form className="d-flex">
                            <div className="input-group">
                                <span className="input-group-text"><i className="tf-icons bx bx-search"></i></span>
                                <input type="text" className="form-control" placeholder="Search..." />
                            </div>
                        </form>
                    </div>
                </div>
            </nav>

            <h6 className="mt-4 mb-3 text-muted">Button</h6>
            <nav className="navbar navbar-example navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="void(0)">Navbar</a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbar-ex-3"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbar-ex-3">
                        <div className="navbar-nav me-auto">
                            <a className="nav-item nav-link active" href="void(0)">Home</a>
                            <a className="nav-item nav-link" href="void(0)">About</a>
                            <a className="nav-item nav-link" href="void(0)">Contact</a>
                        </div>

                        <form onsubmit="return false">
                            <button className="btn btn-outline-primary" type="button">Buy Now</button>
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    </>)
}
function UiOffcanvas() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Offcanvas</h4>
        <div className="card mb-4">
            <h5 className="card-header">Placements</h5>
            <div className="card-body">
                <div className="row gy-3">
                    <div className="col-lg-3 col-md-6">
                        <small className="text-light fw-semibold mb-3">Start (Default)</small>
                        <div className="mt-3">
                            <button
                                className="btn btn-primary"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasStart"
                                aria-controls="offcanvasStart"
                            >
                                Toggle Start
                            </button>
                            <div
                                className="offcanvas offcanvas-start"
                                tabindex="-1"
                                id="offcanvasStart"
                                aria-labelledby="offcanvasStartLabel"
                            >
                                <div className="offcanvas-header">
                                    <h5 id="offcanvasStartLabel" className="offcanvas-title">Offcanvas Start</h5>
                                    <button
                                        type="button"
                                        className="btn-close text-reset"
                                        data-bs-dismiss="offcanvas"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="offcanvas-body my-auto mx-0 flex-grow-0">
                                    <p className="text-center">
                                        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print,
                                        graphic or web designs. The passage is attributed to an unknown typesetter in the 15th
                                        century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum
                                        for use in a type specimen book.
                                    </p>
                                    <button type="button" className="btn btn-primary mb-2 d-grid w-100">Continue</button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary d-grid w-100"
                                        data-bs-dismiss="offcanvas"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <small className="text-light fw-semibold mb-3">End</small>
                        <div className="mt-3">
                            <button
                                className="btn btn-primary"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasEnd"
                                aria-controls="offcanvasEnd"
                            >
                                Toggle End
                            </button>
                            <div
                                className="offcanvas offcanvas-end"
                                tabindex="-1"
                                id="offcanvasEnd"
                                aria-labelledby="offcanvasEndLabel"
                            >
                                <div className="offcanvas-header">
                                    <h5 id="offcanvasEndLabel" className="offcanvas-title">Offcanvas End</h5>
                                    <button
                                        type="button"
                                        className="btn-close text-reset"
                                        data-bs-dismiss="offcanvas"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="offcanvas-body my-auto mx-0 flex-grow-0">
                                    <p className="text-center">
                                        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print,
                                        graphic or web designs. The passage is attributed to an unknown typesetter in the 15th
                                        century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum
                                        for use in a type specimen book.
                                    </p>
                                    <button type="button" className="btn btn-primary mb-2 d-grid w-100">Continue</button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary d-grid w-100"
                                        data-bs-dismiss="offcanvas"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <small className="text-light fw-semibold mb-3">Top</small>
                        <div className="mt-3">
                            <button
                                className="btn btn-primary"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasTop"
                                aria-controls="offcanvasTop"
                            >
                                Toggle Top
                            </button>
                            <div
                                className="offcanvas offcanvas-top"
                                tabindex="-1"
                                id="offcanvasTop"
                                aria-labelledby="offcanvasTopLabel"
                            >
                                <div className="offcanvas-header">
                                    <h5 id="offcanvasTopLabel" className="offcanvas-title">Offcanvas Top</h5>
                                    <button
                                        type="button"
                                        className="btn-close text-reset"
                                        data-bs-dismiss="offcanvas"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="offcanvas-body">
                                    <p>
                                        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print,
                                        graphic or web designs. The passage is attributed to an unknown typesetter in the 15th
                                        century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum
                                        for use in a type specimen book.
                                    </p>
                                    <button type="button" className="btn btn-primary me-2">Continue</button>
                                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <small className="text-light fw-semibold mb-3">Bottom</small>
                        <div className="mt-3">
                            <button
                                className="btn btn-primary"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasBottom"
                                aria-controls="offcanvasBottom"
                            >
                                Toggle Bottom
                            </button>
                            <div
                                className="offcanvas offcanvas-bottom"
                                tabindex="-1"
                                id="offcanvasBottom"
                                aria-labelledby="offcanvasBottomLabel"
                            >
                                <div className="offcanvas-header">
                                    <h5 id="offcanvasBottomLabel" className="offcanvas-title">Offcanvas Bottom</h5>
                                    <button
                                        type="button"
                                        className="btn-close text-reset"
                                        data-bs-dismiss="offcanvas"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="offcanvas-body">
                                    <p>
                                        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print,
                                        graphic or web designs. The passage is attributed to an unknown typesetter in the 15th
                                        century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum
                                        for use in a type specimen book.
                                    </p>
                                    <button type="button" className="btn btn-primary me-2">Continue</button>
                                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card">
            <h5 className="card-header">Backdrop</h5>
            <div className="card-body">
                <div className="row gy-3">
                    <div className="col-lg-4 col-md-6">
                        <small className="text-light fw-semibold mb-3">Enable Body Scrolling</small>
                        <div className="mt-3">
                            <button
                                className="btn btn-primary"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasScroll"
                                aria-controls="offcanvasScroll"
                            >
                                Enable Body Scrolling
                            </button>
                            <div
                                className="offcanvas offcanvas-end"
                                data-bs-scroll="true"
                                data-bs-backdrop="false"
                                tabindex="-1"
                                id="offcanvasScroll"
                                aria-labelledby="offcanvasScrollLabel"
                            >
                                <div className="offcanvas-header">
                                    <h5 id="offcanvasScrollLabel" className="offcanvas-title">Offcanvas Scroll</h5>
                                    <button
                                        type="button"
                                        className="btn-close text-reset"
                                        data-bs-dismiss="offcanvas"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="offcanvas-body my-auto mx-0 flex-grow-0">
                                    <p className="text-center">
                                        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print,
                                        graphic or web designs. The passage is attributed to an unknown typesetter in the 15th
                                        century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum
                                        for use in a type specimen book.
                                    </p>
                                    <button type="button" className="btn btn-primary mb-2 d-grid w-100">Continue</button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary d-grid w-100"
                                        data-bs-dismiss="offcanvas"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <small className="text-light fw-semibold mb-3">Enable backdrop (default)</small>
                        <div className="mt-3">
                            <button
                                className="btn btn-primary"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasBackdrop"
                                aria-controls="offcanvasBackdrop"
                            >
                                Enable backdrop
                            </button>
                            <div
                                className="offcanvas offcanvas-end"
                                tabindex="-1"
                                id="offcanvasBackdrop"
                                aria-labelledby="offcanvasBackdropLabel"
                            >
                                <div className="offcanvas-header">
                                    <h5 id="offcanvasBackdropLabel" className="offcanvas-title">Enable backdrop</h5>
                                    <button
                                        type="button"
                                        className="btn-close text-reset"
                                        data-bs-dismiss="offcanvas"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="offcanvas-body my-auto mx-0 flex-grow-0">
                                    <p className="text-center">
                                        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print,
                                        graphic or web designs. The passage is attributed to an unknown typesetter in the 15th
                                        century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum
                                        for use in a type specimen book.
                                    </p>
                                    <button type="button" className="btn btn-primary mb-2 d-grid w-100">Continue</button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary d-grid w-100"
                                        data-bs-dismiss="offcanvas"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <small className="text-light fw-semibold mb-3">Enable Scrolling & Backdrop</small>
                        <div className="mt-3">
                            <button
                                className="btn btn-primary"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasBoth"
                                aria-controls="offcanvasBoth"
                            >
                                Enable both scrolling & backdrop
                            </button>
                            <div
                                className="offcanvas offcanvas-end"
                                data-bs-scroll="true"
                                tabindex="-1"
                                id="offcanvasBoth"
                                aria-labelledby="offcanvasBothLabel"
                            >
                                <div className="offcanvas-header">
                                    <h5 id="offcanvasBothLabel" className="offcanvas-title">Enable both scrolling & backdrop</h5>
                                    <button
                                        type="button"
                                        className="btn-close text-reset"
                                        data-bs-dismiss="offcanvas"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="offcanvas-body my-auto mx-0 flex-grow-0">
                                    <p className="text-center">
                                        Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print,
                                        graphic or web designs. The passage is attributed to an unknown typesetter in the 15th
                                        century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum
                                        for use in a type specimen book.
                                    </p>
                                    <button type="button" className="btn btn-primary mb-2 d-grid w-100">Continue</button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary d-grid w-100"
                                        data-bs-dismiss="offcanvas"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiPagniationBreadcrumbs() {
    return (<>
        <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">UI elements /</span> Pagination and breadcrumbs
        </h4>
        <div className="card mb-4">
            <h5 className="card-header">Pagination</h5>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <small className="text-light fw-semibold">Basic</small>
                        <div className="demo-inline-spacing">
                            <nav aria-label="Page navigation">
                                <ul className="pagination">
                                    <li className="page-item first">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-left"></i
                                        ></a>
                                    </li>
                                    <li className="page-item prev">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevron-left"></i
                                        ></a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">1</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">2</a>
                                    </li>
                                    <li className="page-item active">
                                        <a className="page-link" href="void(0);">3</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">4</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">5</a>
                                    </li>
                                    <li className="page-item next">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevron-right"></i
                                        ></a>
                                    </li>
                                    <li className="page-item last">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-right"></i
                                        ></a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card mb-4">
            <h5 className="card-header">Sizes & Alignments</h5>
            <div className="card-body">
                <div className="row">
                    <div className="col-lg-4">
                        <small className="text-light fw-semibold">Sizes</small>
                        <div className="demo-inline-spacing">
                            <nav aria-label="Page navigation">
                                <ul className="pagination pagination-sm">
                                    <li className="page-item prev">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-left"></i
                                        ></a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">1</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">2</a>
                                    </li>
                                    <li className="page-item active">
                                        <a className="page-link" href="void(0);">3</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">4</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">5</a>
                                    </li>
                                    <li className="page-item next">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-right"></i
                                        ></a>
                                    </li>
                                </ul>
                            </nav>
                            <nav aria-label="Page navigation">
                                <ul className="pagination">
                                    <li className="page-item prev">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-left"></i
                                        ></a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">1</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">2</a>
                                    </li>
                                    <li className="page-item active">
                                        <a className="page-link" href="void(0);">3</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">4</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">5</a>
                                    </li>
                                    <li className="page-item next">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-right"></i
                                        ></a>
                                    </li>
                                </ul>
                            </nav>
                            <nav aria-label="Page navigation">
                                <ul className="pagination pagination-lg">
                                    <li className="page-item prev">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-left"></i
                                        ></a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">1</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">2</a>
                                    </li>
                                    <li className="page-item active">
                                        <a className="page-link" href="void(0);">3</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">4</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">5</a>
                                    </li>
                                    <li className="page-item next">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-right"></i
                                        ></a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <small className="text-light fw-semibold">Alignments</small>
                        <div className="demo-inline-spacing">
                            <nav aria-label="Page navigation">
                                <ul className="pagination">
                                    <li className="page-item prev">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-left"></i
                                        ></a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">1</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">2</a>
                                    </li>
                                    <li className="page-item active">
                                        <a className="page-link" href="void(0);">3</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">4</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">5</a>
                                    </li>
                                    <li className="page-item next">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-right"></i
                                        ></a>
                                    </li>
                                </ul>
                            </nav>
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-center">
                                    <li className="page-item prev">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-left"></i
                                        ></a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">1</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">2</a>
                                    </li>
                                    <li className="page-item active">
                                        <a className="page-link" href="void(0);">3</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">4</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">5</a>
                                    </li>
                                    <li className="page-item next">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-right"></i
                                        ></a>
                                    </li>
                                </ul>
                            </nav>
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-end">
                                    <li className="page-item prev">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-left"></i
                                        ></a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">1</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">2</a>
                                    </li>
                                    <li className="page-item active">
                                        <a className="page-link" href="void(0);">3</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">4</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="void(0);">5</a>
                                    </li>
                                    <li className="page-item next">
                                        <a className="page-link" href="void(0);"
                                        ><i className="tf-icon bx bx-chevrons-right"></i
                                        ></a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card">
            <h5 className="card-header">Breadcrumbs</h5>
            <div className="card-body">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="void(0);">Home</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href="void(0);">Library</a>
                        </li>
                        <li className="breadcrumb-item active">Data</li>
                    </ol>
                </nav>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-style1">
                        <li className="breadcrumb-item">
                            <a href="void(0);">Home</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href="void(0);">Library</a>
                        </li>
                        <li className="breadcrumb-item active">Data</li>
                    </ol>
                </nav>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-style2 mb-0">
                        <li className="breadcrumb-item">
                            <a href="void(0);">Home</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href="void(0);">Library</a>
                        </li>
                        <li className="breadcrumb-item active">Data</li>
                    </ol>
                </nav>
            </div>
        </div>
    </>)
}
function UiProgress() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Progress bars</h4>
        <div className="card mb-4">
            <h5 className="card-header">Progress bars</h5>
            <div className="card-body">
                <div className="text-light small fw-semibold">Default</div>
                <div className="demo-vertical-spacing">
                    <div className="progress">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style="width: 25%"
                            aria-valuenow="25"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar w-75"
                            role="progressbar"
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                </div>
            </div>
            <hr className="m-0" />
            <div className="card-body">
                <div className="text-light small fw-semibold">Height</div>
                <div className="demo-vertical-spacing">
                    <div className="progress" style="height: 6px">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style="width: 25%"
                            aria-valuenow="25"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress" style="height: 10px">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style="width: 75%"
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                </div>
            </div>
            <hr className="m-0" />
            <div className="card-body">
                <div className="text-light small fw-semibold">With Label</div>
                <div className="demo-vertical-spacing">
                    <div className="progress">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style="width: 25%"
                            aria-valuenow="25"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            25%
                        </div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style="width: 75%"
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            75%
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card mb-4">
            <h5 className="card-header">Backgrounds</h5>
            <div className="card-body">
                <div className="demo-vertical-spacing demo-only-element">
                    <div className="progress">
                        <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style="width: 20%"
                            aria-valuenow="20"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar bg-secondary"
                            role="progressbar"
                            style="width: 30%"
                            aria-valuenow="30"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style="width: 40%"
                            aria-valuenow="40"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style="width: 75%"
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style="width: 60%"
                            aria-valuenow="60"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar bg-info"
                            role="progressbar"
                            style="width: 50%"
                            aria-valuenow="50"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar bg-dark"
                            role="progressbar"
                            style="width: 85%"
                            aria-valuenow="85"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card mb-4">
            <h5 className="card-header">Striped</h5>
            <div className="card-body">
                <div className="demo-vertical-spacing demo-only-element">
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped bg-primary"
                            role="progressbar"
                            style="width: 20%"
                            aria-valuenow="20"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped bg-secondary"
                            role="progressbar"
                            style="width: 30%"
                            aria-valuenow="30"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped bg-success"
                            role="progressbar"
                            style="width: 40%"
                            aria-valuenow="40"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped bg-danger"
                            role="progressbar"
                            style="width: 75%"
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped bg-warning"
                            role="progressbar"
                            style="width: 60%"
                            aria-valuenow="60"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped bg-info"
                            role="progressbar"
                            style="width: 50%"
                            aria-valuenow="50"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped bg-dark"
                            role="progressbar"
                            style="width: 85%"
                            aria-valuenow="85"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card mb-4">
            <h5 className="card-header">Animated</h5>
            <div className="card-body">
                <div className="demo-vertical-spacing demo-only-element">
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                            role="progressbar"
                            style="width: 20%"
                            aria-valuenow="20"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated bg-secondary"
                            role="progressbar"
                            style="width: 30%"
                            aria-valuenow="30"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                            role="progressbar"
                            style="width: 40%"
                            aria-valuenow="40"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                            role="progressbar"
                            style="width: 75%"
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                            role="progressbar"
                            style="width: 60%"
                            aria-valuenow="60"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                            role="progressbar"
                            style="width: 50%"
                            aria-valuenow="50"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated bg-dark"
                            role="progressbar"
                            style="width: 85%"
                            aria-valuenow="85"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card">
            <h5 className="card-header">Multiple bars</h5>
            <div className="card-body">
                <div className="text-light small fw-semibold mb-1">Default</div>
                <div className="progress mb-3">
                    <div
                        className="progress-bar bg-primary shadow-none"
                        role="progressbar"
                        style="width: 15%"
                        aria-valuenow="15"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                    <div
                        className="progress-bar bg-success shadow-none"
                        role="progressbar"
                        style="width: 30%"
                        aria-valuenow="30"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                    <div
                        className="progress-bar bg-danger shadow-none"
                        role="progressbar"
                        style="width: 20%"
                        aria-valuenow="20"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>

                <div className="text-light small fw-semibold mb-1">Striped</div>
                <div className="progress mb-3">
                    <div
                        className="progress-bar bg-primary progress-bar-striped shadow-none"
                        role="progressbar"
                        style="width: 15%"
                        aria-valuenow="15"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                    <div
                        className="progress-bar bg-success progress-bar-striped shadow-none"
                        role="progressbar"
                        style="width: 30%"
                        aria-valuenow="30"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                    <div
                        className="progress-bar bg-danger progress-bar-striped shadow-none"
                        role="progressbar"
                        style="width: 20%"
                        aria-valuenow="20"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>

                <div className="text-light small fw-semibold mb-1">Animated</div>
                <div className="progress">
                    <div
                        className="progress-bar bg-primary progress-bar-striped progress-bar-animated shadow-none"
                        role="progressbar"
                        style="width: 15%"
                        aria-valuenow="15"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                    <div
                        className="progress-bar bg-success progress-bar-striped progress-bar-animated shadow-none"
                        role="progressbar"
                        style="width: 30%"
                        aria-valuenow="30"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                    <div
                        className="progress-bar bg-danger progress-bar-striped progress-bar-animated shadow-none"
                        role="progressbar"
                        style="width: 20%"
                        aria-valuenow="20"
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>
            </div>
        </div>
    </>)
}
function UiSpinners() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Spinners</h4>
        <div className="card mb-4">
            <h5 className="card-header">Style</h5>
            <div className="card-body">
                <div className="row gy-3">
                    <div className="col-md">
                        <div className="text-light small fw-semibold">Border</div>

                        <div className="demo-inline-spacing">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-border text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-border text-danger" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-border text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-border text-info" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-border text-dark" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="text-light small fw-semibold">Growing</div>

                        <div className="demo-inline-spacing">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-grow text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-grow text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-grow text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-grow text-danger" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-grow text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-grow text-info" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-grow text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-grow text-dark" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card mb-4">
            <h5 className="card-header">Size</h5>
            <div className="card-body">
                <div className="row gy-3">
                    <div className="col-md">
                        <div className="text-light small fw-semibold">Large</div>
                        <div className="demo-inline-spacing">
                            <div className="spinner-border spinner-border-lg text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-border spinner-border-lg text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="text-light small fw-semibold">Medium</div>
                        <div className="demo-inline-spacing">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-border text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="text-light small fw-semibold">Small</div>
                        <div className="demo-inline-spacing">
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="spinner-border spinner-border-sm text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiTabsPills() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Tabs & Pills</h4>
        <h5 className="py-3 my-4">Tabs</h5>
        <div className="row">
            <div className="col-xl-6">
                <h6 className="text-muted">Basic</h6>
                <div className="nav-align-top mb-4">
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link active"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-top-home"
                                aria-controls="navs-top-home"
                                aria-selected="true"
                            >
                                Home
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-top-profile"
                                aria-controls="navs-top-profile"
                                aria-selected="false"
                            >
                                Profile
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-top-messages"
                                aria-controls="navs-top-messages"
                                aria-selected="false"
                            >
                                Messages
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="navs-top-home" role="tabpanel">
                            <p>
                                Icing pastry pudding oat cake. Lemon drops cotton candy caramels cake caramels sesame snaps
                                powder. Bear claw candy topping.
                            </p>
                            <p className="mb-0">
                                Tootsie roll fruitcake cookie. Dessert topping pie. Jujubes wafer carrot cake jelly. Bonbon
                                jelly-o jelly-o ice cream jelly beans candy canes cake bonbon. Cookie jelly beans marshmallow
                                jujubes sweet.
                            </p>
                        </div>
                        <div className="tab-pane fade" id="navs-top-profile" role="tabpanel">
                            <p>
                                Donut dragée jelly pie halvah. Danish gingerbread bonbon cookie wafer candy oat cake ice
                                cream. Gummies halvah tootsie roll muffin biscuit icing dessert gingerbread. Pastry ice cream
                                cheesecake fruitcake.
                            </p>
                            <p className="mb-0">
                                Jelly-o jelly beans icing pastry cake cake lemon drops. Muffin muffin pie tiramisu halvah
                                cotton candy liquorice caramels.
                            </p>
                        </div>
                        <div className="tab-pane fade" id="navs-top-messages" role="tabpanel">
                            <p>
                                Oat cake chupa chups dragée donut toffee. Sweet cotton candy jelly beans macaroon gummies
                                cupcake gummi bears cake chocolate.
                            </p>
                            <p className="mb-0">
                                Cake chocolate bar cotton candy apple pie tootsie roll ice cream apple pie brownie cake. Sweet
                                roll icing sesame snaps caramels danish toffee. Brownie biscuit dessert dessert. Pudding jelly
                                jelly-o tart brownie jelly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-6">
                <h6 className="text-muted">Filled Tabs</h6>
                <div className="nav-align-top mb-4">
                    <ul className="nav nav-tabs nav-fill" role="tablist">
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link active"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-justified-home"
                                aria-controls="navs-justified-home"
                                aria-selected="true"
                            >
                                <i className="tf-icons bx bx-home"></i> Home
                                <span className="badge rounded-pill badge-center h-px-20 w-px-20 bg-label-danger">3</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-justified-profile"
                                aria-controls="navs-justified-profile"
                                aria-selected="false"
                            >
                                <i className="tf-icons bx bx-user"></i> Profile
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-justified-messages"
                                aria-controls="navs-justified-messages"
                                aria-selected="false"
                            >
                                <i className="tf-icons bx bx-message-square"></i> Messages
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="navs-justified-home" role="tabpanel">
                            <p>
                                Icing pastry pudding oat cake. Lemon drops cotton candy caramels cake caramels sesame snaps
                                powder. Bear claw candy topping.
                            </p>
                            <p className="mb-0">
                                Tootsie roll fruitcake cookie. Dessert topping pie. Jujubes wafer carrot cake jelly. Bonbon
                                jelly-o jelly-o ice cream jelly beans candy canes cake bonbon. Cookie jelly beans marshmallow
                                jujubes sweet.
                            </p>
                        </div>
                        <div className="tab-pane fade" id="navs-justified-profile" role="tabpanel">
                            <p>
                                Donut dragée jelly pie halvah. Danish gingerbread bonbon cookie wafer candy oat cake ice
                                cream. Gummies halvah tootsie roll muffin biscuit icing dessert gingerbread. Pastry ice cream
                                cheesecake fruitcake.
                            </p>
                            <p className="mb-0">
                                Jelly-o jelly beans icing pastry cake cake lemon drops. Muffin muffin pie tiramisu halvah
                                cotton candy liquorice caramels.
                            </p>
                        </div>
                        <div className="tab-pane fade" id="navs-justified-messages" role="tabpanel">
                            <p>
                                Oat cake chupa chups dragée donut toffee. Sweet cotton candy jelly beans macaroon gummies
                                cupcake gummi bears cake chocolate.
                            </p>
                            <p className="mb-0">
                                Cake chocolate bar cotton candy apple pie tootsie roll ice cream apple pie brownie cake. Sweet
                                roll icing sesame snaps caramels danish toffee. Brownie biscuit dessert dessert. Pudding jelly
                                jelly-o tart brownie jelly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr className="container-m-nx border-light mt-5" />
        <h5 className="py-3 my-4">Pills</h5>
        <div className="row">
            <div className="col-xl-6">
                <h6 className="text-muted">Basic</h6>
                <div className="nav-align-top mb-4">
                    <ul className="nav nav-pills mb-3" role="tablist">
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link active"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-pills-top-home"
                                aria-controls="navs-pills-top-home"
                                aria-selected="true"
                            >
                                Home
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-pills-top-profile"
                                aria-controls="navs-pills-top-profile"
                                aria-selected="false"
                            >
                                Profile
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-pills-top-messages"
                                aria-controls="navs-pills-top-messages"
                                aria-selected="false"
                            >
                                Messages
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="navs-pills-top-home" role="tabpanel">
                            <p>
                                Icing pastry pudding oat cake. Lemon drops cotton candy caramels cake caramels sesame snaps
                                powder. Bear claw candy topping.
                            </p>
                            <p className="mb-0">
                                Tootsie roll fruitcake cookie. Dessert topping pie. Jujubes wafer carrot cake jelly. Bonbon
                                jelly-o jelly-o ice cream jelly beans candy canes cake bonbon. Cookie jelly beans marshmallow
                                jujubes sweet.
                            </p>
                        </div>
                        <div className="tab-pane fade" id="navs-pills-top-profile" role="tabpanel">
                            <p>
                                Donut dragée jelly pie halvah. Danish gingerbread bonbon cookie wafer candy oat cake ice
                                cream. Gummies halvah tootsie roll muffin biscuit icing dessert gingerbread. Pastry ice cream
                                cheesecake fruitcake.
                            </p>
                            <p className="mb-0">
                                Jelly-o jelly beans icing pastry cake cake lemon drops. Muffin muffin pie tiramisu halvah
                                cotton candy liquorice caramels.
                            </p>
                        </div>
                        <div className="tab-pane fade" id="navs-pills-top-messages" role="tabpanel">
                            <p>
                                Oat cake chupa chups dragée donut toffee. Sweet cotton candy jelly beans macaroon gummies
                                cupcake gummi bears cake chocolate.
                            </p>
                            <p className="mb-0">
                                Cake chocolate bar cotton candy apple pie tootsie roll ice cream apple pie brownie cake. Sweet
                                roll icing sesame snaps caramels danish toffee. Brownie biscuit dessert dessert. Pudding jelly
                                jelly-o tart brownie jelly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-6">
                <h6 className="text-muted">Filled Pills</h6>
                <div className="nav-align-top mb-4">
                    <ul className="nav nav-pills mb-3 nav-fill" role="tablist">
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link active"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-pills-justified-home"
                                aria-controls="navs-pills-justified-home"
                                aria-selected="true"
                            >
                                <i className="tf-icons bx bx-home"></i> Home
                                <span className="badge rounded-pill badge-center h-px-20 w-px-20 bg-danger">3</span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-pills-justified-profile"
                                aria-controls="navs-pills-justified-profile"
                                aria-selected="false"
                            >
                                <i className="tf-icons bx bx-user"></i> Profile
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                type="button"
                                className="nav-link"
                                role="tab"
                                data-bs-toggle="tab"
                                data-bs-target="#navs-pills-justified-messages"
                                aria-controls="navs-pills-justified-messages"
                                aria-selected="false"
                            >
                                <i className="tf-icons bx bx-message-square"></i> Messages
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="navs-pills-justified-home" role="tabpanel">
                            <p>
                                Icing pastry pudding oat cake. Lemon drops cotton candy caramels cake caramels sesame snaps
                                powder. Bear claw candy topping.
                            </p>
                            <p className="mb-0">
                                Tootsie roll fruitcake cookie. Dessert topping pie. Jujubes wafer carrot cake jelly. Bonbon
                                jelly-o jelly-o ice cream jelly beans candy canes cake bonbon. Cookie jelly beans marshmallow
                                jujubes sweet.
                            </p>
                        </div>
                        <div className="tab-pane fade" id="navs-pills-justified-profile" role="tabpanel">
                            <p>
                                Donut dragée jelly pie halvah. Danish gingerbread bonbon cookie wafer candy oat cake ice
                                cream. Gummies halvah tootsie roll muffin biscuit icing dessert gingerbread. Pastry ice cream
                                cheesecake fruitcake.
                            </p>
                            <p className="mb-0">
                                Jelly-o jelly beans icing pastry cake cake lemon drops. Muffin muffin pie tiramisu halvah
                                cotton candy liquorice caramels.
                            </p>
                        </div>
                        <div className="tab-pane fade" id="navs-pills-justified-messages" role="tabpanel">
                            <p>
                                Oat cake chupa chups dragée donut toffee. Sweet cotton candy jelly beans macaroon gummies
                                cupcake gummi bears cake chocolate.
                            </p>
                            <p className="mb-0">
                                Cake chocolate bar cotton candy apple pie tootsie roll ice cream apple pie brownie cake. Sweet
                                roll icing sesame snaps caramels danish toffee. Brownie biscuit dessert dessert. Pudding jelly
                                jelly-o tart brownie jelly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiToasts() {
    return (<>
        <h4 className="fw-semibold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Toasts</h4>
        <div className="bs-toast toast toast-placement-ex m-2"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            data-delay="2000">
            <div className="toast-header">
                <i className="bx bx-bell me-2"></i>
                <div className="me-auto fw-semibold">Bootstrap</div>
                <small>11 mins ago</small>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body">Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.</div>
        </div>
        <div className="card mb-4">
            <h5 className="card-header">Bootstrap Toasts Example With Placement</h5>
            <div className="card-body">
                <div className="row gx-3 gy-2 align-items-center">
                    <div className="col-md-3">
                        <label className="form-label" for="selectTypeOpt">Type</label>
                        <select id="selectTypeOpt" className="form-select color-dropdown">
                            <option value="bg-primary" selected>Primary</option>
                            <option value="bg-secondary">Secondary</option>
                            <option value="bg-success">Success</option>
                            <option value="bg-danger">Danger</option>
                            <option value="bg-warning">Warning</option>
                            <option value="bg-info">Info</option>
                            <option value="bg-dark">Dark</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label" for="selectPlacement">Placement</label>
                        <select className="form-select placement-dropdown" id="selectPlacement">
                            <option value="top-0 start-0">Top left</option>
                            <option value="top-0 start-50 translate-middle-x">Top center</option>
                            <option value="top-0 end-0">Top right</option>
                            <option value="top-50 start-0 translate-middle-y">Middle left</option>
                            <option value="top-50 start-50 translate-middle">Middle center</option>
                            <option value="top-50 end-0 translate-middle-y">Middle right</option>
                            <option value="bottom-0 start-0">Bottom left</option>
                            <option value="bottom-0 start-50 translate-middle-x">Bottom center</option>
                            <option value="bottom-0 end-0">Bottom right</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label" for="showToastPlacement">&nbsp;</label>
                        <button id="showToastPlacement" className="btn btn-primary d-block">Show Toast</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="card mb-4">
            <h5 className="card-header">Bootstrap Toasts Styles</h5>
            <div className="row g-0">
                <div className="col-md-6 p-4">
                    <div className="text-light small fw-semibold mb-3">Default</div>
                    <div className="toast-container">
                        <div className="bs-toast toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-primary"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-secondary"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-success"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-danger"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-warning"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-info"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-dark"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 ui-bg-overlay-container p-4">
                    <div className="ui-bg-overlay bg-dark opacity-75 rounded-end-bottom"></div>
                    <div className="text-white small fw-semibold mb-3">Translucent</div>

                    <div className="toast-container">
                        <div className="bs-toast toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-primary"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-secondary"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-success"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-danger"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-warning"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-info"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-dark"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiTooltipsPopovers() {
    return (<>
        <h4 className="fw-semibold py-3 mb-4"><span className="text-muted fw-light">UI elements /</span> Toasts</h4>
        <div className="bs-toast toast toast-placement-ex m-2"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            data-delay="2000" >
            <div className="toast-header">
                <i className="bx bx-bell me-2"></i>
                <div className="me-auto fw-semibold">Bootstrap</div>
                <small>11 mins ago</small>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body">Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.</div>
        </div>
        <div className="card mb-4">
            <h5 className="card-header">Bootstrap Toasts Example With Placement</h5>
            <div className="card-body">
                <div className="row gx-3 gy-2 align-items-center">
                    <div className="col-md-3">
                        <label className="form-label" for="selectTypeOpt">Type</label>
                        <select id="selectTypeOpt" className="form-select color-dropdown">
                            <option value="bg-primary" selected>Primary</option>
                            <option value="bg-secondary">Secondary</option>
                            <option value="bg-success">Success</option>
                            <option value="bg-danger">Danger</option>
                            <option value="bg-warning">Warning</option>
                            <option value="bg-info">Info</option>
                            <option value="bg-dark">Dark</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label" for="selectPlacement">Placement</label>
                        <select className="form-select placement-dropdown" id="selectPlacement">
                            <option value="top-0 start-0">Top left</option>
                            <option value="top-0 start-50 translate-middle-x">Top center</option>
                            <option value="top-0 end-0">Top right</option>
                            <option value="top-50 start-0 translate-middle-y">Middle left</option>
                            <option value="top-50 start-50 translate-middle">Middle center</option>
                            <option value="top-50 end-0 translate-middle-y">Middle right</option>
                            <option value="bottom-0 start-0">Bottom left</option>
                            <option value="bottom-0 start-50 translate-middle-x">Bottom center</option>
                            <option value="bottom-0 end-0">Bottom right</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label" for="showToastPlacement">&nbsp;</label>
                        <button id="showToastPlacement" className="btn btn-primary d-block">Show Toast</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="card mb-4">
            <h5 className="card-header">Bootstrap Toasts Styles</h5>
            <div className="row g-0">
                <div className="col-md-6 p-4">
                    <div className="text-light small fw-semibold mb-3">Default</div>
                    <div className="toast-container">
                        <div className="bs-toast toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-primary"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-secondary"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-success"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-danger"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-warning"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-info"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-dark"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 ui-bg-overlay-container p-4">
                    <div className="ui-bg-overlay bg-dark opacity-75 rounded-end-bottom"></div>
                    <div className="text-white small fw-semibold mb-3">Translucent</div>

                    <div className="toast-container">
                        <div className="bs-toast toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-primary"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-secondary"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-success"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-danger"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-warning"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-info"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>

                        <div
                            className="bs-toast toast fade show bg-dark"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            <div className="toast-header">
                                <i className="bx bx-bell me-2"></i>
                                <div className="me-auto fw-semibold">Bootstrap</div>
                                <small>11 mins ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                                Fruitcake chocolate bar tootsie roll gummies gummies jelly beans cake.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function UiTypography() {
    return (<>
        <h4 className="fw-bold py-3 mb-4">Typography</h4>
        <div className="row">
            <div className="col-lg">
                <div className="card mb-4">
                    <h5 className="card-header">Headings</h5>
                    <table className="table table-borderless">
                        <tbody>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Heading 1</small></td>
                                <td className="py-3">
                                    <h1 className="mb-0">Bootstrap heading</h1>
                                </td>
                            </tr>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Heading 2</small></td>
                                <td className="py-3">
                                    <h2 className="mb-0">Bootstrap heading</h2>
                                </td>
                            </tr>
                            <tr>
                                <td><small className="text-light fw-semibold">Heading 3</small></td>
                                <td className="py-3">
                                    <h3 className="mb-0">Bootstrap heading</h3>
                                </td>
                            </tr>
                            <tr>
                                <td><small className="text-light fw-semibold">Heading 4</small></td>
                                <td className="py-3">
                                    <h4 className="mb-0">Bootstrap heading</h4>
                                </td>
                            </tr>
                            <tr>
                                <td><small className="text-light fw-semibold">Heading 5</small></td>
                                <td className="py-3">
                                    <h5 className="mb-0">Bootstrap heading</h5>
                                </td>
                            </tr>
                            <tr>
                                <td><small className="text-light fw-semibold">Heading 6</small></td>
                                <td className="py-3">
                                    <h6 className="mb-0">Bootstrap heading</h6>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-lg">
                <div className="card mb-4">
                    <h5 className="card-header">Customizing Headings <small className="text-muted ms-1">Default</small></h5>
                    <table className="table table-borderless">
                        <tbody>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Heading 1</small></td>
                                <td className="py-3">
                                    <h1 className="mb-0">Bootstrap <small className="text-muted">heading</small></h1>
                                </td>
                            </tr>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Heading 2</small></td>
                                <td className="py-3">
                                    <h2 className="mb-0">Bootstrap <small className="text-muted">heading</small></h2>
                                </td>
                            </tr>
                            <tr>
                                <td><small className="text-light fw-semibold">Heading 3</small></td>
                                <td className="py-3">
                                    <h3 className="mb-0">Bootstrap <small className="text-muted">heading</small></h3>
                                </td>
                            </tr>
                            <tr>
                                <td><small className="text-light fw-semibold">Heading 4</small></td>
                                <td className="py-3">
                                    <h4 className="mb-0">Bootstrap <small className="text-muted">heading</small></h4>
                                </td>
                            </tr>
                            <tr>
                                <td><small className="text-light fw-semibold">Heading 5</small></td>
                                <td className="py-3">
                                    <h5 className="mb-0">Bootstrap <small className="text-muted">heading</small></h5>
                                </td>
                            </tr>
                            <tr>
                                <td><small className="text-light fw-semibold">Heading 6</small></td>
                                <td className="py-3">
                                    <h6 className="mb-0">Bootstrap <small className="text-muted">heading</small></h6>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-lg">
                <div className="card mb-4">
                    <h5 className="card-header">Display headings</h5>
                    <table className="table table-borderless">
                        <tbody>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Display 1</small></td>
                                <td className="py-3">
                                    <h1 className="display-1 mb-0">Display 1</h1>
                                </td>
                            </tr>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Display 2</small></td>
                                <td className="py-3">
                                    <h1 className="display-2 mb-0">Display 2</h1>
                                </td>
                            </tr>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Display 3</small></td>
                                <td className="py-3">
                                    <h1 className="display-3 mb-0">Display 3</h1>
                                </td>
                            </tr>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Display 4</small></td>
                                <td className="py-3">
                                    <h1 className="display-4 mb-0">Display 4</h1>
                                </td>
                            </tr>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Display 5</small></td>
                                <td className="py-3">
                                    <h1 className="display-5 mb-0">Display 5</h1>
                                </td>
                            </tr>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Display 6</small></td>
                                <td className="py-3">
                                    <h1 className="display-6 mb-0">Display 6</h1>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-lg">
                <div className="card mb-4">
                    <h5 className="card-header">Paragraph</h5>
                    <table className="table table-borderless">
                        <tbody>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Paragraph</small></td>
                                <td className="py-3">
                                    <p className="mb-0">
                                        Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est
                                        non commodo luctus. Duis mollis, est non commodo luctus.Duis mollis, est non commodo
                                        luctus.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Lead Text</small></td>
                                <td className="py-4">
                                    <p className="lead mb-0">
                                        Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est
                                        non commodo luctus.Duis mollis, est non commodo luctus.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td className="align-middle"><small className="text-light fw-semibold">Muted text</small></td>
                                <td className="py-3">
                                    <p className="text-muted mb-0">
                                        Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est
                                        non commodo luctus.
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <div className="card mb-4">
                    <h5 className="card-header">Inline Text Elements</h5>
                    <div className="card-body">
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td className="align-middle"><small className="text-light fw-semibold">Text Highlight</small></td>
                                    <td className="py-3">
                                        <p className="mb-0">You can use the mark tag to <mark>highlight</mark> text.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="align-middle"><small className="text-light fw-semibold">Deleted Text</small></td>
                                    <td className="py-3">
                                        <p className="mb-0"><del>This line of text is meant to be treated as deleted text.</del></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><small className="text-light fw-semibold">No Longer Correct</small></td>
                                    <td className="py-3">
                                        <p className="mb-0"><s>This line of text is meant to be treated as no longer accurate.</s></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><small className="text-light fw-semibold">Addition</small></td>
                                    <td className="py-3">
                                        <p className="mb-0">
                                            <ins>This line of text is meant to be treated as an addition to the document.</ins>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><small className="text-light fw-semibold">Underlined</small></td>
                                    <td className="py-3">
                                        <p className="mb-0"><u>This line of text will render as underlined</u></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><small className="text-light fw-semibold">Fine Print</small></td>
                                    <td className="py-3">
                                        <p className="mb-0"><small>This line of text is meant to be treated as fine print.</small></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><small className="text-light fw-semibold">Bold Text</small></td>
                                    <td className="py-3">
                                        <p className="mb-0"><strong>This line rendered as bold text.</strong></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><small className="text-light fw-semibold">Italicized Text</small></td>
                                    <td className="py-3">
                                        <p className="mb-0"><em>This line rendered as italicized text.</em></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><small className="text-light fw-semibold">Abbreviations</small></td>
                                    <td>
                                        <p><abbr title="attribute">attr</abbr></p>
                                        <p className="mb-0"><abbr title="HyperText Markup Language" className="initialism">HTML</abbr></p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-lg">
                <div className="card mb-4 mb-lg-0">
                    <h5 className="card-header">Blockquote</h5>
                    <div className="card-body">
                        <blockquote className="blockquote mt-3">
                            <p className="mb-0">A well-known quote, contained in a blockquote element.</p>
                        </blockquote>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <small className="text-light fw-semibold">Naming a source</small>
                        <figure className="mt-2">
                            <blockquote className="blockquote">
                                <p className="mb-0">A well-known quote, contained in a blockquote element.</p>
                            </blockquote>
                            <figcaption className="blockquote-footer">
                                Someone famous in <cite title="Source Title">Source Title</cite>
                            </figcaption>
                        </figure>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <small className="text-light fw-semibold">Align Center</small>
                        <figure className="text-center mt-2">
                            <blockquote className="blockquote">
                                <p className="mb-0">A well-known quote, contained in a blockquote element.</p>
                            </blockquote>
                            <figcaption className="blockquote-footer">
                                Someone famous in <cite title="Source Title">Source Title</cite>
                            </figcaption>
                        </figure>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <small className="text-light fw-semibold">Align Right</small>
                        <figure className="text-end mt-2">
                            <blockquote className="blockquote">
                                <p className="mb-0">A well-known quote, contained in a blockquote element.</p>
                            </blockquote>
                            <figcaption className="blockquote-footer">
                                Someone famous in <cite title="Source Title">Source Title</cite>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </div>
            <div className="col-lg">
                <div className="card">
                    <h5 className="card-header">Lists</h5>
                    <div className="card-body">
                        <small className="text-light fw-semibold">Unstyled</small>
                        <ul className="list-unstyled mt-2">
                            <li>Lorem ipsum dolor sit amet</li>
                            <li>Facilisis in pretium nisl aliquet</li>
                            <li>
                                Nulla volutpat aliquam velit
                                <ul>
                                    <li>Phasellus iaculis neque</li>
                                    <li>Ac tristique libero volutpat at</li>
                                </ul>
                            </li>
                            <li>Faucibus porta lacus fringilla vel</li>
                        </ul>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <small className="text-light fw-semibold">Inline</small>
                        <ul className="list-inline mt-2">
                            <li className="list-inline-item">Lorem ipsum</li>
                            <li className="list-inline-item">Phasellus iaculis</li>
                            <li className="list-inline-item">Nulla volutpat</li>
                        </ul>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <small className="text-light fw-semibold">Description list alignment</small>
                        <dl className="row mt-2">
                            <dt className="col-sm-3">Description lists</dt>
                            <dd className="col-sm-9">A description list is perfect for defining terms.</dd>

                            <dt className="col-sm-3">Euismod</dt>
                            <dd className="col-sm-9">
                                <p>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</p>
                            </dd>

                            <dt className="col-sm-3">Malesuada porta</dt>
                            <dd className="col-sm-9">Etiam porta sem malesuada magna mollis euismod.</dd>

                            <dt className="col-sm-3 text-truncate">Truncated term is truncated</dt>
                            <dd className="col-sm-9">
                                Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum.
                            </dd>

                            <dt className="col-sm-3">Nesting</dt>
                            <dd className="col-sm-9">
                                <dl className="row">
                                    <dt className="col-sm-4">Nested definition list</dt>
                                    <dd className="col-sm-8">
                                        Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc.
                                    </dd>
                                </dl>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </>)
}