

export function UiAccordion() {
    return (<div className="container-xxl flex-grow-1 container-p-y">
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
    </div>)
}
export function UiAlert() {
    return (<div className="container-xxl flex-grow-1 container-p-y">
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
    </div>)
}
export function UiBadges() {
    return (<div className="container-xxl flex-grow-1 container-p-y">
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
    </div>)
}