import { createContext } from 'react'
import {
    UserLangs, Currencies, Countries,
    Timezones
} from './DataSettings'

export const router = {
    Home: '',
    LayoutWithoutMenu: '#layoutWithoutMenu',
    LayoutWithoutNavbar: '#layoutWithoutNavbar',
    LayoutWithContainer: '#layoutWithContainer',
    LayoutWithFluid: '#layoutWithFluid',
    LayoutWithBlank: '#layoutWithBlank',
    AccountSettingsAccount: '#accSettingsAccount',
    AccountSettingsNotify: '#accSettingsNotify',
    AccountSettingsConnect: '#accSettingsConnect',
    AuthLoginBasic: '#formLoginBasic',
    AuthRegisterBasic: '#formRegisterBasic',
    AuthForgotPassword: '#formForgotPass',
}
export const RouterContext = createContext(router.Home);
export const routerReducer = (state, action) => {
    switch (action) {
        case 'BACK_ROOT':
            return router.Home
        case 'LAYOUT_WITHOUT_MENU':
            return router.LayoutWithoutMenu
        case 'LAYOUT_WITHOUT_NAVBAR':
            return router.LayoutWithoutNavbar
        case 'LAYOUT_WITH_CONTAINER':
            return router.LayoutWithContainer
        case 'LAYOUT_WITH_FLUID':
            return router.LayoutWithFluid
        case 'LAYOUT_WITH_BLANK':
            return router.LayoutWithBlank
        case 'ACCOUNT_SETTINGS_ACCOUNT':
            return router.AccountSettingsAccount
        case 'ACCOUNT_SETTINGS_NOTIFY':
            return router.AccountSettingsNotify
        case 'ACCOUNT_SETTINGS_CONNECT':
            return router.AccountSettingsConnect
        case 'AUTH_FORGOT_PASS':
            return router.AuthForgotPassword
        case 'AUTH_LOGIN_BASIC':
            return router.AuthLoginBasic
        case 'AUTH_REGISTER_BASIC':
            return router.AuthRegisterBasic
    }
    return state
}

const user = {
    FirstName: 'John', LastName: 'Doe',
    Email: 'dainb.vn@email.com', Organization: 'Theme React',
    Phone: '', Address: '',
    State: '', Zipcode: '', Country: Countries[0].value,
    Language: UserLangs[0].value, Timezone: Timezones[0].value, Currency: Currencies[1].value
}
Object.freeze(user);
export { user }
export const UserContext = createContext(user)
export const userReducer = (sUser, action) => {
    if (typeof action.Key == 'string' && action.Key != '') {
        const userCopy = JSON.parse(JSON.stringify(sUser))
        userCopy[action.Key] = action.Value
        return userCopy
    }
    if (typeof action.Key == 'undefined') return action
    return sUser
}

export const NotifyTypes = [
    { value: 1, name: 'Only when I am online' },
    { value: 2, name: 'Anytime' }
]
const Notifies = {
    ListType: [
        { Type: 'New for you', IsEmail: true, IsBrowser: true, IsApp: true },
        { Type: 'Account activity', IsEmail: true, IsBrowser: true, IsApp: true },
        { Type: 'A new browser used to sign in', IsEmail: true, IsBrowser: true, IsApp: false },
        { Type: 'A new device is linked', IsEmail: true, IsBrowser: false, IsApp: false }
    ],
    TimeOut: NotifyTypes[0].value
}
Object.freeze(Notifies);
export { Notifies }
export const NotifyContext = createContext(Notifies)
export const nofityReducer = (notify, action) => {
    const { Type, Value } = action
    const notifyCopy = JSON.parse(JSON.stringify(notify))
    switch (Type) {
        case 'ListType':
            notifyCopy.ListType = Value
            break;
        case 'TimeOut':
            notifyCopy.TimeOut = Value
            break;
        default: return notify;
    }
    return notifyCopy
}