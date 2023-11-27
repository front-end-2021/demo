import { useContext, useState, useMemo, useReducer } from 'react'
import {
    UserLangs, Currencies, Countries,
    Timezones
} from '../DataSettings'
import {
    RouterContext,
    UserContext, NotifyContext, NotifyTypes,
    nofityReducer, Notifies, router
} from '../DataContext'

import avatar1 from '../assets/img/avatars/1.png'
import icGoogle from '../assets/img/icons/brands/google.png'
import icSlack from '../assets/img/icons/brands/slack.png'
import icGithub from '../assets/img/icons/brands/github.png'
import icMailchimp from '../assets/img/icons/brands/mailchimp.png'
import icAsana from '../assets/img/icons/brands/asana.png'
import icFace from '../assets/img/icons/brands/facebook.png'
import icTwitt from '../assets/img/icons/brands/twitter.png'
import icInst from '../assets/img/icons/brands/instagram.png'
import icDribble from '../assets/img/icons/brands/dribbble.png'
import icBehance from '../assets/img/icons/brands/behance.png'

export function AccountSettings() {
    const { layout, setLayout } = useContext(RouterContext);
    const SubPath = useMemo(() => {
        switch (layout) {
            case router.AccountSettingsAccount: return 'Account';
            case router.AccountSettingsNotify: return 'Notifications';
            case router.AccountSettingsConnect: return 'Connections';
        }
    }, [layout])
    const [notify, setNotify] = useReducer(nofityReducer, Notifies);

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Account Settings /</span> {SubPath}</h4>
            <div className="row">
                <div className="col-md-12">
                    <ul className="nav nav-pills flex-column flex-md-row mb-3">
                        <li className="nav-item">
                            <a className={`nav-link${layout == router.AccountSettingsAccount ? ' active' : ''}`}
                                onClick={e => setLayout('ACCOUNT_SETTINGS_ACCOUNT')}
                                href="#account-settings-account">
                                <i className="bx bx-user me-1"></i> Account</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link${layout == router.AccountSettingsNotify ? ' active' : ''}`}
                                onClick={e => setLayout('ACCOUNT_SETTINGS_NOTIFY')}
                                href="#account-settings-notifications">
                                <i className="bx bx-bell me-1"></i> Notifications</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link${layout == router.AccountSettingsConnect ? ' active' : ''}`}
                                onClick={e => setLayout('ACCOUNT_SETTINGS_CONNECT')}
                                href="#account-settings-connections">
                                <i className="bx bx-link-alt me-1"></i> Connections</a>
                        </li>
                    </ul>
                    <NotifyContext.Provider value={{ notify, setNotify }}>
                        {layout == router.AccountSettingsAccount && <Account />}
                        {layout == router.AccountSettingsNotify && <Notifications />}
                        {layout == router.AccountSettingsConnect && <Connections />}
                    </NotifyContext.Provider>

                </div>
            </div>
        </div>
    )
}

function Account() {
    const { person, setPerson } = useContext(UserContext);
    const [user, setUser] = useState(person)

    const IsChanged = useMemo(
        () => {
            if (user.FirstName != person.FirstName) return true
            if (user.LastName != person.LastName) return true
            if (user.Email != person.Email) return true
            if (user.Organization != person.Organization) return true
            if (user.Phone != person.Phone) return true
            if (user.Address != person.Address) return true
            if (user.State != person.State) return true
            if (user.Zipcode != person.Zipcode) return true
            if (user.Country != person.Country) return true
            if (user.Language != person.Language) return true
            if (user.Timezone != person.Timezone) return true
            if (user.Currency != person.Currency) return true
            return false
        },
        [user, person]
    );

    const onUserChanged = (e, type) => {
        const userCopy = JSON.parse(JSON.stringify(user))
        userCopy[type] = e.target.value
        setUser(userCopy)
    }
    const onChangeFile = (e) => {
        console.log('on change file', e)
    }
    const onChangeCheckbox = (e) => {
        console.log('on change check box', e)
    }
    const onSaveChange = (e) => {
        e.preventDefault()
        if (!IsChanged) return
        setPerson(user)
    }
    const onCancelChange = (e) => {
        e.preventDefault()
        setUser(person)
    }

    return (
        <>
            <div className="card mb-4">
                <h5 className="card-header">Profile Details</h5>
                <div className="card-body">
                    <div className="d-flex align-items-start align-items-sm-center gap-4">
                        <img src={avatar1}
                            alt="user-avatar"
                            className="d-block rounded"
                            height="100"
                            width="100"
                            id="uploadedAvatar" />
                        <div className="button-wrapper">
                            <label htmlFor="upload" className="btn btn-primary me-2 mb-4" tabIndex="0">
                                <span className="d-none d-sm-block">Upload new photo</span>
                                <i className="bx bx-upload d-block d-sm-none"></i>
                                <input type="file" onChange={onChangeFile}
                                    id="upload"
                                    className="account-file-input"
                                    hidden
                                    accept="image/png, image/jpeg" />
                            </label>
                            <button type="button" className="btn btn-outline-secondary account-image-reset mb-4">
                                <i className="bx bx-reset d-block d-sm-none"></i>
                                <span className="d-none d-sm-block">Reset</span>
                            </button>

                            <p className="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
                        </div>
                    </div>
                </div>
                <hr className="my-0" />
                <div className="card-body">
                    <form id="formAccountSettings"
                        method="POST" onSubmit={(e) => { e.preventDefault() }}>
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input className="form-control"
                                    type="text" onChange={e => onUserChanged(e, 'FirstName')}
                                    id="firstName"
                                    name="firstName"
                                    value={user.FirstName}
                                    autoFocus={true} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input className="form-control"
                                    type="text" onChange={e => onUserChanged(e, 'LastName')}
                                    value={user.LastName}
                                    name="lastName" id="lastName" />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="email" className="form-label">E-mail</label>
                                <input className="form-control"
                                    type="text" onChange={e => onUserChanged(e, 'Email')}
                                    id="email" name="email"
                                    value={user.Email}
                                    placeholder="john.doe@example.com" />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="organization" className="form-label">Organization</label>
                                <input type="text" onChange={e => onUserChanged(e, 'Organization')}
                                    className="form-control"
                                    id="organization"
                                    name="organization"
                                    value={user.Organization} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                                <div className="input-group input-group-merge">
                                    <span className="input-group-text">VN (+84)</span>
                                    <input type="number" onChange={e => onUserChanged(e, 'Phone')}
                                        id="phoneNumber"
                                        name="phoneNumber" value={user.Phone}
                                        className="form-control"
                                        placeholder="349697441" />
                                </div>
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input type="text" onChange={e => onUserChanged(e, 'Address')}
                                    className="form-control" id="address" value={user.Address}
                                    name="address" placeholder="Address" />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="state" className="form-label">State</label>
                                <input className="form-control" value={user.State}
                                    type="text" onChange={e => onUserChanged(e, 'State')}
                                    id="state" name="state" placeholder="California" />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="zipCode" className="form-label">Zip Code</label>
                                <input type="text" onChange={e => onUserChanged(e, 'Zipcode')}
                                    className="form-control"
                                    id="zipCode" name="zipCode" value={user.Zipcode}
                                    placeholder="231465"
                                    maxLength="6" />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="country">Country</label>
                                <select id="country" className="select2 form-select"
                                    value={user.Country} onChange={e => onUserChanged(e, 'Country')}>
                                    {Countries.map(({ value, name }, i) => <option value={value} key={`country-${i}_${value}`}>{name}</option>)}
                                </select>
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="language" className="form-label">Language</label>
                                <select id="language" className="select2 form-select"
                                    value={user.Language} onChange={e => onUserChanged(e, 'Language')}>
                                    {UserLangs.map(({ value, name }, i) => <option value={value} key={`lang-${i}_${value}`}>{name}</option>)}
                                </select>
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="timeZones" className="form-label">Timezone</label>
                                <select id="timeZones" className="select2 form-select"
                                    value={user.Timezone} onChange={e => onUserChanged(e, 'Timezone')}>
                                    {Timezones.map(({ value, name }, i) => <option value={value} key={`time-${i}_${value}`}>{name}</option>)}
                                </select>
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="currency" className="form-label">Currency</label>
                                <select id="currency" className="select2 form-select"
                                    value={user.Currency} onChange={e => onUserChanged(e, 'Currency')}>
                                    {Currencies.map(({ value, name }, i) => <option value={value} key={`currency-${i}_${value}`}>{name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="mt-2">
                            <button type="submit"
                                className={`btn me-2${IsChanged ? ' btn-primary' : ''}`}
                                onClick={onSaveChange}>Save changes</button>
                            <button type="reset" className="btn btn-outline-secondary"
                                onClick={onCancelChange}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="card">
                <h5 className="card-header">Delete Account</h5>
                <div className="card-body">
                    <div className="mb-3 col-12 mb-0">
                        <div className="alert alert-warning">
                            <h6 className="alert-heading fw-bold mb-1">Are you sure you want to delete your account?</h6>
                            <p className="mb-0">Once you delete your account, there is no going back. Please be certain.</p>
                        </div>
                    </div>
                    <form id="formAccountDeactivation"
                        onSubmit={(e) => { e.preventDefault() }}>
                        <div className="form-check mb-3">
                            <input className="form-check-input"
                                type="checkbox" onChange={onChangeCheckbox}
                                name="accountActivation"
                                id="accountActivation" />
                            <label className="form-check-label"
                                htmlFor="accountActivation">I confirm my account deactivation</label>
                        </div>
                        <button type="submit" className="btn btn-danger deactivate-account">Deactivate Account</button>
                    </form>
                </div>
            </div>
        </>
    )
}
function Notifications() {
    const { notify, setNotify } = useContext(NotifyContext);
    const [listType, setListType] = useState(notify.ListType)
    const [notifyType, setNotifyType] = useState(notify.TimeOut)

    const onUserChangeNofity = (i, type) => {
        const lstTypeCopy = JSON.parse(JSON.stringify(listType))

        const itemCopy = lstTypeCopy[i]
        itemCopy[type] = !itemCopy[type]
        setListType(lstTypeCopy)
    }

    const IsChangedDropDown = useMemo(
        () => {
            if (notifyType != notify.TimeOut) return true
            return false
        },
        [notifyType, notify]
    );

    const IsChangedListType = useMemo(
        () => {
            for (let ii = 0; ii < listType.length; ii++) {
                const nItem = notify.ListType[ii]
                if (!nItem) return true

                const item = listType[ii]
                if (item.IsEmail != nItem.IsEmail) return true
                if (item.IsBrowser != nItem.IsBrowser) return true
                if (item.IsApp != nItem.IsApp) return true
            }
            return false
        },
        [listType, notify]
    );

    const onSaveChange = (e) => {
        e.preventDefault()
        if (IsChangedListType) setNotify({ Type: 'ListType', Value: listType })
        if (IsChangedDropDown) setNotify({ Type: 'TimeOut', Value: listType })
    }
    const onCancelChange = (e) => {
        e.preventDefault()
        setListType(notify.ListType)
        setNotifyType(notify.TimeOut)
    }


    return (
        <div className="card">
            <h5 className="card-header">Recent Devices</h5>
            <div className="card-body">
                <span
                >We need permission from your browser to show notifications.
                    <span className="notificationRequest"><strong>Request Permission</strong></span></span
                >
                <div className="error"></div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-borderless border-bottom">
                    <thead>
                        <tr>
                            <th className="text-nowrap">Type</th>
                            <th className="text-nowrap text-center">✉️ Email</th>
                            <th className="text-nowrap text-center">🖥 Browser</th>
                            <th className="text-nowrap text-center">👩🏻‍💻 App</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listType.map((item, i) => {
                            return (
                                <tr key={`type-item_${i}`}>
                                    <td className="text-nowrap">{item.Type}</td>
                                    <td>
                                        <div className="form-check d-flex justify-content-center">
                                            <input className="form-check-input" type="checkbox" id={`ck-mail_${i}`}
                                                onChange={e => onUserChangeNofity(i, 'IsEmail')}
                                                checked={item.IsEmail} />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check d-flex justify-content-center">
                                            <input className="form-check-input" type="checkbox" id={`ck-browser_${i}`}
                                                onChange={e => onUserChangeNofity(i, 'IsBrowser')}
                                                checked={item.IsBrowser} />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="form-check d-flex justify-content-center">
                                            <input className="form-check-input" type="checkbox" id={`ck-app_${i}`}
                                                onChange={e => onUserChangeNofity(i, 'IsApp')}
                                                checked={item.IsApp} />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="card-body">
                <h6>When should we send you notifications?</h6>
                <form action="void(0)">
                    <div className="row">
                        <div className="col-sm-6">
                            <select id="sendNotification" value={notifyType} onChange={e => setNotifyType(e.target.value)}
                                className="form-select" name="sendNotification">
                                {NotifyTypes.map(({ value, name }, i) => <option value={value} key={`lst-type_${i}`}>{name}</option>)}
                            </select>
                        </div>
                        <div className="mt-4">
                            <button className={`btn me-2${IsChangedDropDown || IsChangedListType ? ' btn-primary' : ''}`}
                                onClick={onSaveChange}
                                type="submit">Save changes</button>
                            <button type="reset" className="btn btn-outline-secondary"
                                onClick={onCancelChange}>Discard</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
function Connections() {
    return (
        <div className="row">
            <div className="col-md-6 col-12 mb-md-0 mb-4">
                <div className="card">
                    <h5 className="card-header">Connected Accounts</h5>
                    <div className="card-body">
                        <p>Display content from your connected accounts on your site</p>
                        <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                                <img src={icGoogle} alt="google" className="me-3" height="30" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-9 mb-sm-0 mb-2">
                                    <h6 className="mb-0">Google</h6>
                                    <small className="text-muted">Calendar and contacts</small>
                                </div>
                                <div className="col-3 text-end">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input float-end" type="checkbox" role="switch" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                                <img src={icSlack} alt="slack" className="me-3" height="30" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-9 mb-sm-0 mb-2">
                                    <h6 className="mb-0">Slack</h6>
                                    <small className="text-muted">Communication</small>
                                </div>
                                <div className="col-3 text-end">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input float-end" type="checkbox" role="switch" checked />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                                <img src={icGithub} alt="github" className="me-3" height="30" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-9 mb-sm-0 mb-2">
                                    <h6 className="mb-0">Github</h6>
                                    <small className="text-muted">Manage your Git repositories</small>
                                </div>
                                <div className="col-3 text-end">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input float-end" type="checkbox" role="switch" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                                <img src={icMailchimp}
                                    alt="mailchimp"
                                    className="me-3"
                                    height="30" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-9 mb-sm-0 mb-2">
                                    <h6 className="mb-0">Mailchimp</h6>
                                    <small className="text-muted">Email marketing service</small>
                                </div>
                                <div className="col-3 text-end">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input float-end" type="checkbox" role="switch" checked />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="flex-shrink-0">
                                <img src={icAsana} alt="asana" className="me-3" height="30" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-9 mb-sm-0 mb-2">
                                    <h6 className="mb-0">Asana</h6>
                                    <small className="text-muted">Communication</small>
                                </div>
                                <div className="col-3 text-end">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input float-end" type="checkbox" role="switch" checked />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-12">
                <div className="card">
                    <h5 className="card-header">Social Accounts</h5>
                    <div className="card-body">
                        <p>Display content from social accounts on your site</p>
                        <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                                <img src={icFace}
                                    alt="facebook"
                                    className="me-3"
                                    height="30" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-8 col-sm-7 mb-sm-0 mb-2">
                                    <h6 className="mb-0">Facebook</h6>
                                    <small className="text-muted">Not Connected</small>
                                </div>
                                <div className="col-4 col-sm-5 text-end">
                                    <button type="button" className="btn btn-icon btn-outline-secondary">
                                        <i className="bx bx-link-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                                <img src={icTwitt}
                                    alt="twitter"
                                    className="me-3"
                                    height="30" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-8 col-sm-7 mb-sm-0 mb-2">
                                    <h6 className="mb-0">Twitter</h6>
                                    <a href="#Theme_Selection" target="_blank">@ThemeSelection</a>
                                </div>
                                <div className="col-4 col-sm-5 text-end">
                                    <button type="button" className="btn btn-icon btn-outline-danger">
                                        <i className="bx bx-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                                <img src={icInst}
                                    alt="instagram"
                                    className="me-3"
                                    height="30" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-8 col-sm-7 mb-sm-0 mb-2">
                                    <h6 className="mb-0">instagram</h6>
                                    <a href="#themeselection/">@ThemeSelection</a>
                                </div>
                                <div className="col-4 col-sm-5 text-end">
                                    <button type="button" className="btn btn-icon btn-outline-danger">
                                        <i className="bx bx-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                                <img src={icDribble}
                                    alt="dribbble"
                                    className="me-3"
                                    height="30" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-8 col-sm-7 mb-sm-0 mb-2">
                                    <h6 className="mb-0">Dribbble</h6>
                                    <small className="text-muted">Not Connected</small>
                                </div>
                                <div className="col-4 col-sm-5 text-end">
                                    <button type="button" className="btn btn-icon btn-outline-secondary">
                                        <i className="bx bx-link-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="flex-shrink-0">
                                <img src={icBehance}
                                    alt="behance"
                                    className="me-3"
                                    height="30" />
                            </div>
                            <div className="flex-grow-1 row">
                                <div className="col-8 col-sm-7 mb-sm-0 mb-2">
                                    <h6 className="mb-0">Behance</h6>
                                    <small className="text-muted">Not Connected</small>
                                </div>
                                <div className="col-4 col-sm-5 text-end">
                                    <button type="button" className="btn btn-icon btn-outline-secondary">
                                        <i className="bx bx-link-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}