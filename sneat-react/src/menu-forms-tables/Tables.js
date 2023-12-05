
import imgAvt5 from '../assets/img/avatars/5.png'
import imgAvt6 from '../assets/img/avatars/6.png'
import imgAvt7 from '../assets/img/avatars/7.png'

const heads = ['Project', 'Client', 'Users', 'Status', 'Actions']
const lstUser = [
    { Name: 'Lilian Fuller', Avatar: imgAvt5 },
    { Name: 'Sophia Wilkerson', Avatar: imgAvt6 },
    { Name: 'Christina Parker', Avatar: imgAvt7 },
]
export function TablesBasic() {

    return (<div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Tables /</span> Basic Tables</h4>
        <div className="card">
            <h5 className="card-header">Table Basic</h5>
            <div className="table-responsive text-nowrap">
                <table className="table">
                    <thead>
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                        <tr>
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                            <td>Albert Cook</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item"
                                            href="#drp-menu"><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item"
                                            href="#drp-menu"><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                            <td>Barry Hunter</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item"
                                            href="#drp-menu"><i className="bx bx-edit-alt me-2"></i> Edit</a>
                                        <a className="dropdown-item"
                                            href="#drp-menu"><i className="bx bx-trash me-2"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                            <td>Trevor Baker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-2"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-2"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-2"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-2"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Table Dark</h5>
            <div className="table-responsive text-nowrap">
                <table className="table table-dark">
                    <thead>
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                        <tr>
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                            <td>Albert Cook</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                            <td>Barry Hunter</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                            <td>Trevor Baker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Dark Table head</h5>
            <div className="table-responsive text-nowrap">
                <table className="table">
                    <thead className="table-dark">
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                        <tr>
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                            <td>Albert Cook</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                            <td>Barry Hunter</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                            <td>Trevor Baker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Light Table head</h5>
            <div className="table-responsive text-nowrap">
                <table className="table">
                    <thead className="table-light">
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                        <tr>
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                            <td>Albert Cook</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                            <td>Barry Hunter</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                            <td>Trevor Baker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Table Header & Footer</h5>
            <div className="table-responsive text-nowrap">
                <table className="table">
                    <thead>
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                            <td>Albert Cook</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a>
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                            <td>Barry Hunter</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                            <td>Trevor Baker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot className="table-border-bottom-0">
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Table Caption</h5>
            <div className="table-responsive text-nowrap">
                <table className="table">
                    <caption className="ms-4">
                        List of Projects
                    </caption>
                    <thead>
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                            <td>Albert Cook</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                            <td>Barry Hunter</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                            <td>Trevor Baker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Striped rows</h5>
            <div className="table-responsive text-nowrap">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                        <tr>
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                            <td>Albert Cook</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                            <td>Barry Hunter</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                            <td>Trevor Baker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Bordered Table</h5>
            <div className="card-body">
                <div className="table-responsive text-nowrap">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong>
                                </td>
                                <td>Albert Cook</td>
                                <td>
                                    <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                        {lstUser.map(({ Name, Avatar }) => (<li
                                            data-bs-toggle="tooltip"
                                            data-popup="tooltip-custom"
                                            data-bs-placement="top"
                                            className="avatar avatar-xs pull-up"
                                            title={Name} >
                                            <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                        </li>)
                                        )}
                                    </ul>
                                </td>
                                <td><span className="badge bg-label-primary me-1">Active</span></td>
                                <td>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            className="btn p-0 dropdown-toggle hide-arrow"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="bx bx-dots-vertical-rounded"></i>
                                        </button>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="#drp-menu"
                                            ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                            >
                                            <a className="dropdown-item" href="#drp-menu"
                                            ><i className="bx bx-trash me-1"></i> Delete</a
                                            >
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                                <td>Barry Hunter</td>
                                <td>
                                    <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                        {lstUser.map(({ Name, Avatar }) => (<li
                                            data-bs-toggle="tooltip"
                                            data-popup="tooltip-custom"
                                            data-bs-placement="top"
                                            className="avatar avatar-xs pull-up"
                                            title={Name} >
                                            <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                        </li>)
                                        )}
                                    </ul>
                                </td>
                                <td><span className="badge bg-label-success me-1">Completed</span></td>
                                <td>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            className="btn p-0 dropdown-toggle hide-arrow"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="bx bx-dots-vertical-rounded"></i>
                                        </button>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="#drp-menu"
                                            ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                            >
                                            <a className="dropdown-item" href="#drp-menu"
                                            ><i className="bx bx-trash me-1"></i> Delete</a
                                            >
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                                <td>Trevor Baker</td>
                                <td>
                                    <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                        {lstUser.map(({ Name, Avatar }) => (<li
                                            data-bs-toggle="tooltip"
                                            data-popup="tooltip-custom"
                                            data-bs-placement="top"
                                            className="avatar avatar-xs pull-up"
                                            title={Name} >
                                            <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                        </li>)
                                        )}
                                    </ul>
                                </td>
                                <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                                <td>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            className="btn p-0 dropdown-toggle hide-arrow"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="bx bx-dots-vertical-rounded"></i>
                                        </button>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="#drp-menu"
                                            ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                            >
                                            <a className="dropdown-item" href="#drp-menu"
                                            ><i className="bx bx-trash me-1"></i> Delete</a
                                            >
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                                </td>
                                <td>Jerry Milton</td>
                                <td>
                                    <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                        {lstUser.map(({ Name, Avatar }) => (<li
                                            data-bs-toggle="tooltip"
                                            data-popup="tooltip-custom"
                                            data-bs-placement="top"
                                            className="avatar avatar-xs pull-up"
                                            title={Name} >
                                            <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                        </li>)
                                        )}
                                    </ul>
                                </td>
                                <td><span className="badge bg-label-warning me-1">Pending</span></td>
                                <td>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            className="btn p-0 dropdown-toggle hide-arrow"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="bx bx-dots-vertical-rounded"></i>
                                        </button>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="#drp-menu"
                                            ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                            >
                                            <a className="dropdown-item" href="#drp-menu"
                                            ><i className="bx bx-trash me-1"></i> Delete</a
                                            >
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Borderless Table</h5>
            <div className="table-responsive text-nowrap">
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                            <td>Albert Cook</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                            <td>Barry Hunter</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                            <td>Trevor Baker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Hoverable rows</h5>
            <div className="table-responsive text-nowrap">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                        <tr>
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                            <td>Albert Cook</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                            <td>Barry Hunter</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                            <td>Trevor Baker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Small Table</h5>
            <div className="table-responsive text-nowrap">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                        <tr>
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                            <td>Albert Cook</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                            <td>Barry Hunter</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                            <td>Trevor Baker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Contextual Classes</h5>
            <div className="table-responsive text-nowrap">
                <table className="table">
                    <thead>
                        <tr>
                            {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                        <tr className="table-default">
                            <td><i className="fab fa-sketch fa-lg text-warning me-3"></i> <strong>Sketch Project</strong></td>
                            <td>Ronnie Shane</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr className="table-active">
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                            <td>Barry Hunter</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr className="table-primary">
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                            <td>Albert Cook</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr className="table-secondary">
                            <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                            <td>Trevor Baker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr className="table-success">
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                            </td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr className="table-danger">
                            <td><i className="fab fa-sketch fa-lg text-warning me-3"></i> <strong>Sketch Project</strong></td>
                            <td>Sarah Banks</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-primary me-1">Active</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr className="table-warning">
                            <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Custom</strong></td>
                            <td>Ted Richer</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr className="table-info">
                            <td>
                                <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Latest Bootstrap</strong>
                            </td>
                            <td>Perry Parker</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-warning me-1">Pending</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr className="table-light">
                            <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular UI</strong></td>
                            <td>Ana Bell</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr className="table-dark">
                            <td><i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap UI</strong></td>
                            <td>Jerry Milton</td>
                            <td>
                                <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                    {lstUser.map(({ Name, Avatar }) => (<li
                                        data-bs-toggle="tooltip"
                                        data-popup="tooltip-custom"
                                        data-bs-placement="top"
                                        className="avatar avatar-xs pull-up"
                                        title={Name} >
                                        <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                    </li>)
                                    )}
                                </ul>
                            </td>
                            <td><span className="badge bg-label-success me-1">Completed</span></td>
                            <td>
                                <div className="dropdown">
                                    <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                        >
                                        <a className="dropdown-item" href="#drp-menu"
                                        ><i className="bx bx-trash me-1"></i> Delete</a
                                        >
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <hr className="my-5" />
        <h5 className="mb-4">Table without Card</h5>
        <div className="table-responsive text-nowrap">
            <table className="table card-table">
                <thead>
                    <tr>
                        {heads.map((name, i) => <th key={`thead-${i}`}>{name}</th>)}
                    </tr>
                </thead>
                <tbody className="table-border-bottom-0">
                    <tr>
                        <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                        <td>Albert Cook</td>
                        <td>
                            <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                {lstUser.map(({ Name, Avatar }) => (<li
                                    data-bs-toggle="tooltip"
                                    data-popup="tooltip-custom"
                                    data-bs-placement="top"
                                    className="avatar avatar-xs pull-up"
                                    title={Name} >
                                    <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                </li>)
                                )}
                            </ul>
                        </td>
                        <td><span className="badge bg-label-primary me-1">Active</span></td>
                        <td>
                            <div className="dropdown">
                                <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                    <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#drp-menu"
                                    ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                    >
                                    <a className="dropdown-item" href="#drp-menu"
                                    ><i className="bx bx-trash me-1"></i> Delete</a
                                    >
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><i className="fab fa-react fa-lg text-info me-3"></i> <strong>React Project</strong></td>
                        <td>Barry Hunter</td>
                        <td>
                            <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                {lstUser.map(({ Name, Avatar }) => (<li
                                    data-bs-toggle="tooltip"
                                    data-popup="tooltip-custom"
                                    data-bs-placement="top"
                                    className="avatar avatar-xs pull-up"
                                    title={Name} >
                                    <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                </li>)
                                )}
                            </ul>
                        </td>
                        <td><span className="badge bg-label-success me-1">Completed</span></td>
                        <td>
                            <div className="dropdown">
                                <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                    <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#drp-menu"
                                    ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                    >
                                    <a className="dropdown-item" href="#drp-menu"
                                    ><i className="bx bx-trash me-1"></i> Delete</a
                                    >
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><i className="fab fa-vuejs fa-lg text-success me-3"></i> <strong>VueJs Project</strong></td>
                        <td>Trevor Baker</td>
                        <td>
                            <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                {lstUser.map(({ Name, Avatar }) => (<li
                                    data-bs-toggle="tooltip"
                                    data-popup="tooltip-custom"
                                    data-bs-placement="top"
                                    className="avatar avatar-xs pull-up"
                                    title={Name} >
                                    <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                </li>)
                                )}
                            </ul>
                        </td>
                        <td><span className="badge bg-label-info me-1">Scheduled</span></td>
                        <td>
                            <div className="dropdown">
                                <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                    <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#drp-menu"
                                    ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                    >
                                    <a className="dropdown-item" href="#drp-menu"
                                    ><i className="bx bx-trash me-1"></i> Delete</a
                                    >
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i className="fab fa-bootstrap fa-lg text-primary me-3"></i> <strong>Bootstrap Project</strong>
                        </td>
                        <td>Jerry Milton</td>
                        <td>
                            <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                {lstUser.map(({ Name, Avatar }) => (<li
                                    data-bs-toggle="tooltip"
                                    data-popup="tooltip-custom"
                                    data-bs-placement="top"
                                    className="avatar avatar-xs pull-up"
                                    title={Name} >
                                    <img src={Avatar} alt="Avatar" className="rounded-circle" />
                                </li>)
                                )}
                            </ul>
                        </td>
                        <td><span className="badge bg-label-warning me-1">Pending</span></td>
                        <td>
                            <div className="dropdown">
                                <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                    <i className="bx bx-dots-vertical-rounded"></i>
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#drp-menu"
                                    ><i className="bx bx-edit-alt me-1"></i> Edit</a
                                    >
                                    <a className="dropdown-item" href="#drp-menu"
                                    ><i className="bx bx-trash me-1"></i> Delete</a
                                    >
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <hr className="my-5" />
        <div className="card">
            <h5 className="card-header">Responsive Table</h5>
            <div className="table-responsive text-nowrap">
                <table className="table">
                    <thead>
                        <tr className="text-nowrap">
                            <th>#</th>
                            {[...Array(9)].map((x, i) => <th key={`head-${i}`}>Table heading</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            {[...Array(9)].map((x, i) => <td key={`brow-1-${i}`}>Table cell</td>
                            )}
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            {[...Array(9)].map((x, i) => <td key={`brow-2-${i}`}>Table cell</td>
                            )}
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            {[...Array(9)].map((x, i) => <td key={`brow-3-${i}`}>Table cell</td>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>)
}