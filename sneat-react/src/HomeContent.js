import {
    OrderStatistics, Income, ProfileChart,
    TotalRevenue, GrowthChart
} from './ChartLayout'

import imgLap from './assets/img/illustrations/man-with-laptop-light.png'
import chartSucc from './assets/img/icons/unicons/chart-success.png'
import walletInfo from './assets/img/icons/unicons/wallet-info.png'
import payPal from './assets/img/icons/unicons/paypal.png'
import ccPrime from './assets/img/icons/unicons/cc-primary.png'
import wallet from './assets/img/icons/unicons/wallet.png'
import chart from './assets/img/icons/unicons/chart.png'
import ccSucces from './assets/img/icons/unicons/cc-success.png'
import ccWarning from './assets/img/icons/unicons/cc-warning.png'

export default function HomeContent() {

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
                <div className="col-lg-8 mb-4 order-0">
                    <div className="card">
                        <div className="d-flex align-items-end row">
                            <div className="col-sm-7">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">Congratulations John! 🎉</h5>
                                    <p className="mb-4">
                                        You have done <span className="fw-bold">72%</span> more sales today. Check your new badge in
                                        your profile.
                                    </p>

                                    <a href="void(0)" className="btn btn-sm btn-outline-primary">View Badges</a>
                                </div>
                            </div>
                            <div className="col-sm-5 text-center text-sm-left">
                                <div className="card-body pb-0 px-0 px-md-4">
                                    <img src={imgLap}
                                        height="140"
                                        alt="View Badge User"
                                        data-app-dark-img="illustrations/man-with-laptop-dark.png"
                                        data-app-light-img="illustrations/man-with-laptop-light.png"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 order-1">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <img src={chartSucc}
                                                alt="chart success"
                                                className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn p-0"
                                                type="button"
                                                id="cardOpt3"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false" >
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                                                <a className="dropdown-item" href="void(0)">View More</a>
                                                <a className="dropdown-item" href="void(0)">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="fw-semibold d-block mb-1">Profit</span>
                                    <h3 className="card-title mb-2">$12,628</h3>
                                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +72.80%</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <img src={walletInfo}
                                                alt="Credit Card"
                                                className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn p-0"
                                                type="button"
                                                id="cardOpt6"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false" >
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt6">
                                                <a className="dropdown-item" href="void(0)">View More</a>
                                                <a className="dropdown-item" href="void(0)">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <span>Sales</span>
                                    <h3 className="card-title text-nowrap mb-1">$4,679</h3>
                                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +28.42%</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
                    <div className="card">
                        <div className="row row-bordered g-0">
                            <TotalRevenue></TotalRevenue>
                            <GrowthChart></GrowthChart>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
                    <div className="row">
                        <div className="col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <img src={payPal} alt="Credit Card" className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                            <button type="button"
                                                className="btn p-0"
                                                id="cardOpt4"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false" >
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt4">
                                                <a className="dropdown-item" href="void(0)">View More</a>
                                                <a className="dropdown-item" href="void(0)">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="d-block mb-1">Payments</span>
                                    <h3 className="card-title text-nowrap mb-2">$2,456</h3>
                                    <small className="text-danger fw-semibold"><i className="bx bx-down-arrow-alt"></i> -14.82%</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                            <img src={ccPrime} alt="Credit Card" className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                            <button
                                                className="btn p-0"
                                                type="button"
                                                id="cardOpt1"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false" >
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="cardOpt1">
                                                <a className="dropdown-item" href="void(0)">View More</a>
                                                <a className="dropdown-item" href="void(0)">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="fw-semibold d-block mb-1">Transactions</span>
                                    <h3 className="card-title mb-2">$14,857</h3>
                                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +28.14%</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mb-4">
                            <ProfileChart></ProfileChart>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">
                    <OrderStatistics></OrderStatistics>
                </div>

                <div className="col-md-6 col-lg-4 order-1 mb-4">
                    <Income></Income>
                </div>

                <div className="col-md-6 col-lg-4 order-2 mb-4">
                    <div className="card h-100">
                        <div className="card-header d-flex align-items-center justify-content-between">
                            <h5 className="card-title m-0 me-2">Transactions</h5>
                            <div className="dropdown">
                                <button type="button"
                                    className="btn p-0"
                                    id="transactionID"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false" >
                                    <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">
                                    <a className="dropdown-item" href="void(0)">Last 28 Days</a>
                                    <a className="dropdown-item" href="void(0)">Last Month</a>
                                    <a className="dropdown-item" href="void(0)">Last Year</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <ul className="p-0 m-0">
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src={payPal} alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Paypal</small>
                                            <h6 className="mb-0">Send money</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">+82.6</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src={wallet} alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Wallet</small>
                                            <h6 className="mb-0">Mac'D</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">+270.69</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src={chart} alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Transfer</small>
                                            <h6 className="mb-0">Refund</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">+637.91</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src={ccSucces} alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Credit Card</small>
                                            <h6 className="mb-0">Ordered Food</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">-838.71</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src={wallet} alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Wallet</small>
                                            <h6 className="mb-0">Starbucks</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">+203.33</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src={ccWarning} alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <small className="text-muted d-block mb-1">Mastercard</small>
                                            <h6 className="mb-0">Ordered Food</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                            <h6 className="mb-0">-92.45</h6>
                                            <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
