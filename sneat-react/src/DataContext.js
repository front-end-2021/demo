import { createContext } from 'react'
import {
    UserLangs, Currencies, Countries,
    Timezones
} from './DataSettings'

const router = {
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
    PageMiscError: '#pageMiscError',
    PageMiscMaintain: '#pageMiscMaintain',
    ComponentsCards: '#componentsCards',
    UIAccordion: '#userInterfaceAccordion',
    UIAlert: '#userInterfaceAlert',
    UIBadges: '#userInterfaceBadge',
    UIButtons: '#userInterfaceButtons',
    UICarousel: '#userInterfaceCarousel',
    UIDropdowns: '#userInterfaceDropdowns',
    UICollapse: '#userInterfaceCollapse',
    UIFooter: '#userInterfaceFooter',
    UIListGroups: '#userInterfaceListGroup',
    UIModals: '#userInterfaceModals',
    UINavbar: '#userInterfaceNavbar',
    UIOffcanvas: '#userInterfaceOffcanvas',
    UIPaginationBreadcrumbs: '#uiPaginationBreadcrumbs',
    UIProgress: '#userInterfaceProgress',
    UISpinners: '#userInterfaceSpinners',
    UITabsPills: '#userInterfaceTabsPills',
    UIToasts: '#userInterfaceToasts',
    UITooltipsPopovers: '#uiTooltipsPopovers',
    UITypography: '#userInterfaceTypography',
    UITypography: '#userInterfaceTypography',
    ExtUiPerfectScrollbar: '#extUiPerfectScrollbar',
    ExtUiTextDivider: '#extUiTextDivider',
    CompBoxicons: '#compBoxicons',
    FormBasicInputs: '#formBasicInputs',
    FormInputGroups: '#formInputGroups',
    FormLayoutVertical: '#formLayoutVertical',
    FormLayoutHorizontal: '#formLayoutHorizontal',
    Tables: '#menuTables',
}
Object.freeze(router);

export const RouterContext = createContext(router.Home);
export const routerReducer = (state, action) => {
    return action
}

const user = {
    FirstName: 'John', LastName: 'Doe',
    Email: 'dainb.vn@email.com', Organization: 'Theme React',
    Phone: '', Address: '',
    State: '', Zipcode: '', Country: Countries[0].value,
    Language: UserLangs[0].value, Timezone: Timezones[0].value, Currency: Currencies[1].value
}
Object.freeze(user);
export { user, router }
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