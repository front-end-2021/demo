import React, { useEffect } from "react";
import ApexCharts from "apexcharts-clevision";

import imgLap from './assets/img/illustrations/man-with-laptop-light.png'
import chartSucc from './assets/img/icons/unicons/chart-success.png'
import walletInfo from './assets/img/icons/unicons/wallet-info.png'
import payPal from './assets/img/icons/unicons/paypal.png'
import ccPrime from './assets/img/icons/unicons/cc-primary.png'
import wallet from './assets/img/icons/unicons/wallet.png'
import chart from './assets/img/icons/unicons/chart.png'
import ccSucces from './assets/img/icons/unicons/cc-success.png'
import ccWarning from './assets/img/icons/unicons/cc-warning.png'
const config = {
    colors: {
        primary: '#696cff',
        secondary: '#8592a3',
        success: '#71dd37',
        info: '#03c3ec',
        warning: '#ffab00',
        danger: '#ff3e1d',
        dark: '#233446',
        black: '#000',
        white: '#fff',
        body: '#f4f5fb',
        headingColor: '#566a7f',
        axisColor: '#a1acb8',
        borderColor: '#eceef1'
    }
};

let cardColor, headingColor, axisColor, shadeColor, borderColor;

cardColor = config.colors.white;
headingColor = config.colors.headingColor;
axisColor = config.colors.axisColor;
borderColor = config.colors.borderColor;

export default function LayoutContent() {
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

                <ApexChart></ApexChart>

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
                    <div className="card h-100">
                        <div className="card-header d-flex align-items-center justify-content-between pb-0">
                            <div className="card-title mb-0">
                                <h5 className="m-0 me-2">Order Statistics</h5>
                                <small className="text-muted">42.82k Total Sales</small>
                            </div>
                            <div className="dropdown">
                                <button
                                    className="btn p-0"
                                    type="button"
                                    id="orederStatistics"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="orederStatistics">
                                    <a className="dropdown-item" href="void(0)">Select All</a>
                                    <a className="dropdown-item" href="void(0)">Refresh</a>
                                    <a className="dropdown-item" href="void(0)">Share</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex flex-column align-items-center gap-1">
                                    <h2 className="mb-2">8,258</h2>
                                    <span>Total Orders</span>
                                </div>
                                <div id="orderStatisticsChart"></div>
                            </div>
                            <ul className="p-0 m-0">
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-primary"
                                        ><i className="bx bx-mobile-alt"></i
                                        ></span>
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Electronic</h6>
                                            <small className="text-muted">Mobile, Earbuds, TV</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-semibold">82.5k</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-success"><i className="bx bx-closet"></i></span>
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Fashion</h6>
                                            <small className="text-muted">T-shirt, Jeans, Shoes</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-semibold">23.8k</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-info"><i className="bx bx-home-alt"></i></span>
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Decor</h6>
                                            <small className="text-muted">Fine Art, Dining</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-semibold">849k</small>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <span className="avatar-initial rounded bg-label-secondary"
                                        ><i className="bx bx-football"></i
                                        ></span>
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <h6 className="mb-0">Sports</h6>
                                            <small className="text-muted">Football, Cricket Kit</small>
                                        </div>
                                        <div className="user-progress">
                                            <small className="fw-semibold">99</small>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4 order-1 mb-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <ul className="nav nav-pills" role="tablist">
                                <li className="nav-item">
                                    <button type="button"
                                        className="nav-link active"
                                        role="tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#navs-tabs-line-card-income"
                                        aria-controls="navs-tabs-line-card-income"
                                        aria-selected="true" >
                                        Income
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button type="button" className="nav-link" role="tab">Expenses</button>
                                </li>
                                <li className="nav-item">
                                    <button type="button" className="nav-link" role="tab">Profit</button>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body px-0">
                            <div className="tab-content p-0">
                                <div className="tab-pane fade show active" id="navs-tabs-line-card-income" role="tabpanel">
                                    <div className="d-flex p-4 pt-3">
                                        <div className="avatar flex-shrink-0 me-3">
                                            <img src={wallet} alt="User" />
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Total Balance</small>
                                            <div className="d-flex align-items-center">
                                                <h6 className="mb-0 me-1">$459.10</h6>
                                                <small className="text-success fw-semibold">
                                                    <i className="bx bx-chevron-up"></i>
                                                    42.9%
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="incomeChart"></div>
                                    <div className="d-flex justify-content-center pt-4 gap-2">
                                        <div className="flex-shrink-0">
                                            <div id="expensesOfWeek"></div>
                                        </div>
                                        <div>
                                            <p className="mb-n1 mt-1">Expenses This Week</p>
                                            <small className="text-muted">$39 less than last week</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
function ProfileChart() {
    useEffect(() => {
        const profileReportChartEl = document.querySelector('#profileReportChart'),
            profileReportChartConfig = {
                chart: {
                    height: 80,
                    // width: 175,
                    type: 'line',
                    toolbar: {
                        show: false
                    },
                    dropShadow: {
                        enabled: true,
                        top: 10,
                        left: 5,
                        blur: 3,
                        color: config.colors.warning,
                        opacity: 0.15
                    },
                    sparkline: {
                        enabled: true
                    }
                },
                grid: {
                    show: false,
                    padding: {
                        right: 8
                    }
                },
                colors: [config.colors.warning],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 5,
                    curve: 'smooth'
                },
                series: [
                    {
                        data: [110, 270, 145, 245, 205, 285]
                    }
                ],
                xaxis: {
                    show: false,
                    lines: {
                        show: false
                    },
                    labels: {
                        show: false
                    },
                    axisBorder: {
                        show: false
                    }
                },
                yaxis: {
                    show: false
                }
            };
        const chart = new ApexCharts(profileReportChartEl, profileReportChartConfig).render()
        return () => {
            chart.destroy()
        }
    })
    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between flex-sm-row flex-column gap-3">
                    <div className="d-flex flex-sm-column flex-row align-items-start justify-content-between">
                        <div className="card-title">
                            <h5 className="text-nowrap mb-2">Profile Report</h5>
                            <span className="badge bg-label-warning rounded-pill">Year 2021</span>
                        </div>
                        <div className="mt-sm-auto">
                            <small className="text-success text-nowrap fw-semibold"
                            ><i className="bx bx-chevron-up"></i> 68.2%</small
                            >
                            <h3 className="mb-0">$84,686k</h3>
                        </div>
                    </div>
                    <div id="profileReportChart"></div>
                </div>
            </div>
        </div>
    )
}
function ApexChart() {
    useEffect(() => {
        const totalRevenueChartEl = document.querySelector('#totalRevenueChart'),
            totalRevenueChartOptions = {
                series: [
                    {
                        name: '2021',
                        data: [18, 7, 15, 29, 18, 12, 9]
                    },
                    {
                        name: '2020',
                        data: [-13, -18, -9, -14, -5, -17, -15]
                    }
                ],
                chart: {
                    height: 300,
                    stacked: true,
                    type: 'bar',
                    toolbar: { show: false }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '33%',
                        borderRadius: 12,
                        startingShape: 'rounded',
                        endingShape: 'rounded'
                    }
                },
                colors: [config.colors.primary, config.colors.info],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 6,
                    lineCap: 'round',
                    colors: [cardColor]
                },
                legend: {
                    show: true,
                    horizontalAlign: 'left',
                    position: 'top',
                    markers: {
                        height: 8,
                        width: 8,
                        radius: 12,
                        offsetX: -3
                    },
                    labels: {
                        colors: axisColor
                    },
                    itemMargin: {
                        horizontal: 10
                    }
                },
                grid: {
                    borderColor: borderColor,
                    padding: {
                        top: 0,
                        bottom: -8,
                        left: 20,
                        right: 20
                    }
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    labels: {
                        style: {
                            fontSize: '13px',
                            colors: axisColor
                        }
                    },
                    axisTicks: {
                        show: false
                    },
                    axisBorder: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            fontSize: '13px',
                            colors: axisColor
                        }
                    }
                },
                responsive: [
                    {
                        breakpoint: 1700,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '32%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 1580,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '35%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 1440,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '42%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 1300,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '48%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 1200,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '40%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 1040,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 11,
                                    columnWidth: '48%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 991,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '30%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 840,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '35%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 768,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '28%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 640,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '32%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 576,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '37%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 480,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '45%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 420,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '52%'
                                }
                            }
                        }
                    },
                    {
                        breakpoint: 380,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 10,
                                    columnWidth: '60%'
                                }
                            }
                        }
                    }
                ],
                states: {
                    hover: {
                        filter: {
                            type: 'none'
                        }
                    },
                    active: {
                        filter: {
                            type: 'none'
                        }
                    }
                }
            }
        const tChart = new ApexCharts(totalRevenueChartEl, totalRevenueChartOptions).render()

        const growthChartEl = document.querySelector('#growthChart'),
            growthChartOptions = {
                series: [78],
                labels: ['Growth'],
                chart: {
                    height: 240,
                    type: 'radialBar'
                },
                plotOptions: {
                    radialBar: {
                        size: 150,
                        offsetY: 10,
                        startAngle: -150,
                        endAngle: 150,
                        hollow: {
                            size: '55%'
                        },
                        track: {
                            background: cardColor,
                            strokeWidth: '100%'
                        },
                        dataLabels: {
                            name: {
                                offsetY: 15,
                                color: headingColor,
                                fontSize: '15px',
                                fontWeight: '600',
                                fontFamily: 'Public Sans'
                            },
                            value: {
                                offsetY: -25,
                                color: headingColor,
                                fontSize: '22px',
                                fontWeight: '500',
                                fontFamily: 'Public Sans'
                            }
                        }
                    }
                },
                colors: [config.colors.primary],
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        shadeIntensity: 0.5,
                        gradientToColors: [config.colors.primary],
                        inverseColors: true,
                        opacityFrom: 1,
                        opacityTo: 0.6,
                        stops: [30, 70, 100]
                    }
                },
                stroke: {
                    dashArray: 5
                },
                grid: {
                    padding: {
                        top: -35,
                        bottom: -10
                    }
                },
                states: {
                    hover: {
                        filter: {
                            type: 'none'
                        }
                    },
                    active: {
                        filter: {
                            type: 'none'
                        }
                    }
                }
            }
        const gChart = new ApexCharts(growthChartEl, growthChartOptions).render()
        return () => {
            tChart.destroy()
            gChart.destroy()
        }
    })

    return (
        <div className="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
            <div className="card">
                <div className="row row-bordered g-0">
                    <div className="col-md-8">
                        <h5 className="card-header m-0 me-2 pb-3">Total Revenue</h5>
                        <div id="totalRevenueChart" className="px-2"></div>
                    </div>
                    <div className="col-md-4">
                        <div className="card-body">
                            <div className="text-center">
                                <div className="dropdown">
                                    <button type="button"
                                        className="btn btn-sm btn-outline-primary dropdown-toggle"
                                        id="growthReportId"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false" >
                                        2022
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="growthReportId">
                                        <a className="dropdown-item" href="void(0)">2021</a>
                                        <a className="dropdown-item" href="void(0)">2020</a>
                                        <a className="dropdown-item" href="void(0)">2019</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="growthChart"></div>
                        <div className="text-center fw-semibold pt-3 mb-2">62% Company Growth</div>

                        <div className="d-flex px-xxl-4 px-lg-2 p-4 gap-xxl-3 gap-lg-1 gap-3 justify-content-between">
                            <div className="d-flex">
                                <div className="me-2">
                                    <span className="badge bg-label-primary p-2"><i className="bx bx-dollar text-primary"></i></span>
                                </div>
                                <div className="d-flex flex-column">
                                    <small>2022</small>
                                    <h6 className="mb-0">$32.5k</h6>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="me-2">
                                    <span className="badge bg-label-info p-2"><i className="bx bx-wallet text-info"></i></span>
                                </div>
                                <div className="d-flex flex-column">
                                    <small>2021</small>
                                    <h6 className="mb-0">$41.2k</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}