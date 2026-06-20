import { LOCAL_STORE_KEY, OBJ_FIELD } from '../constants'
import { biObj } from './themen'

export function emptyAcc() { return { id: 0, name: '', pass: '' } }
export function getUsers() {
    let ls_ = localStorage.getItem(LOCAL_STORE_KEY.Users)
    if (ls_) {
        ls_ = JSON.parse(ls_)
    } else {
        ls_ = [
            Object.assign(emptyAcc(), {
                id: 1, name: 'Guest', pass: '123'
            }),
            Object.assign(emptyAcc(), {
                id: 2, name: 'DaiNB', pass: '123'
            })
        ]
        return ls_
    }
}
export function getRegions() {
    let ls = localStorage.getItem(LOCAL_STORE_KEY.Regions)
    if (ls) {
        ls = JSON.parse(ls)
        ls = ls.map(x => localR(x, 2))
    } else {
        ls = [
            { id: 1, title: 'Führungsteam' },
            { id: 2, title: 'Produktionsleitung' },
            { id: 3, title: 'Marketing' },
            { id: 4, title: 'Verkauf' },
            { id: 5, title: 'Logistik' },
            { id: 6, title: 'Qualiätssicherung' },
            { id: 7, title: 'Social Media' },
            { id: 8, title: 'Support' },
            { id: 9, title: 'Service' }
        ]

    }
    return ls;
}
export function localR(r, type = 1) { return biObj(r, type, OBJ_FIELD.region) }