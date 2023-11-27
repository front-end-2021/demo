import { useEffect } from "react";
import ApexCharts from "apexcharts-clevision";

import wallet from './assets/img/icons/unicons/wallet.png'
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

export function OrderStatistics() {
    useEffect(() => {
        const chartOrderStatistics = document.querySelector('#orderStatisticsChart'),
            orderChartConfig = {
                chart: {
                    height: 165,
                    width: 130,
                    type: 'donut'
                },
                labels: ['Electronic', 'Sports', 'Decor', 'Fashion'],
                series: [85, 15, 50, 50],
                colors: [config.colors.primary, config.colors.secondary, config.colors.info, config.colors.success],
                stroke: {
                    width: 5,
                    colors: cardColor
                },
                dataLabels: {
                    enabled: false,
                    formatter: function (val, opt) {
                        return parseInt(val) + '%';
                    }
                },
                legend: {
                    show: false
                },
                grid: {
                    padding: {
                        top: 0,
                        bottom: 0,
                        right: 15
                    }
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '75%',
                            labels: {
                                show: true,
                                value: {
                                    fontSize: '1.5rem',
                                    fontFamily: 'Public Sans',
                                    color: headingColor,
                                    offsetY: -15,
                                    formatter: function (val) {
                                        return parseInt(val) + '%';
                                    }
                                },
                                name: {
                                    offsetY: 20,
                                    fontFamily: 'Public Sans'
                                },
                                total: {
                                    show: true,
                                    fontSize: '0.8125rem',
                                    color: axisColor,
                                    label: 'Weekly',
                                    formatter: function (w) {
                                        return '38%';
                                    }
                                }
                            }
                        }
                    }
                }
            };
        const statisticsChart = new ApexCharts(chartOrderStatistics, orderChartConfig);
        statisticsChart.render()
        return () => {
            statisticsChart.destroy()
        }
    })
    return (
        <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between pb-0">
                <div className="card-title mb-0">
                    <h5 className="m-0 me-2">Order Statistics</h5>
                    <small className="text-muted">42.82k Total Sales</small>
                </div>
                <div className="dropdown">
                    <button className="btn p-0"
                        type="button"
                        id="orederStatistics"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
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
    );
};
function ExpensesOfWeek() {
    useEffect(() => {
        const weeklyExpensesEl = document.querySelector('#expensesOfWeek'),
            weeklyExpensesConfig = {
                series: [65],
                chart: {
                    width: 60,
                    height: 60,
                    type: 'radialBar'
                },
                plotOptions: {
                    radialBar: {
                        startAngle: 0,
                        endAngle: 360,
                        strokeWidth: '8',
                        hollow: {
                            margin: 2,
                            size: '45%'
                        },
                        track: {
                            strokeWidth: '50%',
                            background: borderColor
                        },
                        dataLabels: {
                            show: true,
                            name: {
                                show: false
                            },
                            value: {
                                formatter: function (val) {
                                    return '$' + parseInt(val);
                                },
                                offsetY: 5,
                                color: '#697a8d',
                                fontSize: '13px',
                                show: true
                            }
                        }
                    }
                },
                fill: {
                    type: 'solid',
                    colors: config.colors.primary
                },
                stroke: {
                    lineCap: 'round'
                },
                grid: {
                    padding: {
                        top: -10,
                        bottom: -15,
                        left: -10,
                        right: -10
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
            };
        const weeklyExpenses = new ApexCharts(weeklyExpensesEl, weeklyExpensesConfig);
        weeklyExpenses.render();
        return () => {
            weeklyExpenses.destroy()
        }
    })
    return (
        <div className="d-flex justify-content-center pt-4 gap-2">
            <div className="flex-shrink-0">
                <div id="expensesOfWeek"></div>
            </div>
            <div>
                <p className="mb-n1 mt-1">Expenses This Week</p>
                <small className="text-muted">$39 less than last week</small>
            </div>
        </div>
    )
};
export function Income() {
    useEffect(() => {
        const incomeChartEl = document.querySelector('#incomeChart'),
            incomeChartConfig = {
                series: [
                    {
                        data: [24, 21, 30, 22, 42, 26, 35, 29]
                    }
                ],
                chart: {
                    height: 215,
                    parentHeightOffset: 0,
                    parentWidthOffset: 0,
                    toolbar: {
                        show: false
                    },
                    type: 'area'
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 2,
                    curve: 'smooth'
                },
                legend: {
                    show: false
                },
                markers: {
                    size: 6,
                    colors: 'transparent',
                    strokeColors: 'transparent',
                    strokeWidth: 4,
                    discrete: [
                        {
                            fillColor: config.colors.white,
                            seriesIndex: 0,
                            dataPointIndex: 7,
                            strokeColor: config.colors.primary,
                            strokeWidth: 2,
                            size: 6,
                            radius: 8
                        }
                    ],
                    hover: {
                        size: 7
                    }
                },
                colors: [config.colors.primary],
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: shadeColor,
                        shadeIntensity: 0.6,
                        opacityFrom: 0.5,
                        opacityTo: 0.25,
                        stops: [0, 95, 100]
                    }
                },
                grid: {
                    borderColor: borderColor,
                    strokeDashArray: 3,
                    padding: {
                        top: -20,
                        bottom: -8,
                        left: -10,
                        right: 8
                    }
                },
                xaxis: {
                    categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    labels: {
                        show: true,
                        style: {
                            fontSize: '13px',
                            colors: axisColor
                        }
                    }
                },
                yaxis: {
                    labels: {
                        show: false
                    },
                    min: 10,
                    max: 50,
                    tickAmount: 4
                }
            };
        const incomeChart = new ApexCharts(incomeChartEl, incomeChartConfig);
        incomeChart.render();

        return () => {
            incomeChart.destroy()
        }
    })
    return (
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
                            aria-selected="true" >Income</button>
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
                        <ExpensesOfWeek></ExpensesOfWeek>
                    </div>
                </div>
            </div>
        </div>
    )
};
export function ProfileChart() {
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
        const chart = new ApexCharts(profileReportChartEl, profileReportChartConfig)
        chart.render()
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
                            <small className="text-success text-nowrap fw-semibold">
                                <i className="bx bx-chevron-up"></i> 68.2%</small>
                            <h3 className="mb-0">$84,686k</h3>
                        </div>
                    </div>
                    <div id="profileReportChart"></div>
                </div>
            </div>
        </div>
    )
};
export function TotalRevenue() {
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
        const tChart = new ApexCharts(totalRevenueChartEl, totalRevenueChartOptions)
        tChart.render()
        return () => {
            tChart.destroy()
        }
    })
    return (
        <div className="col-md-8">
            <h5 className="card-header m-0 me-2 pb-3">Total Revenue</h5>
            <div id="totalRevenueChart" className="px-2"></div>
        </div>
    )
};
export function GrowthChart() {
    useEffect(() => {
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
        const gChart = new ApexCharts(growthChartEl, growthChartOptions)
        gChart.render()
        return () => {
            gChart.destroy()
        }
    })
    return (
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
    )
};
