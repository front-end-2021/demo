import axios from "axios"
import {
    getListMain, getListSubActionWith, saveAction,
    saveGoal, insertMain, insertSub,
    insertAction, deleteAction,
    deleteSub, deleteMain,
    duplicateSub, duplicateMain
} from "./localData"

const config = {
    headers: {
        'Access-Control-Allow-Origin': '*'
    }, timeout: 9999,
}
const host = `http://localhost:8001/api/`
function callApiData(testMs) {
    testMs = testMs || 555
    return new Promise(res => {
        setTimeout(res, testMs)
    })
}
export function getDataGoalAction(apiPath) {
    const url = `${host}${apiPath}`
    return callApiData().then(r => {
        return getListMain()
        return axios.get(url, config)
            .then(res => { return res.data })
            .then(rData => { return rData.data })
    })
}
export function getDataGoalActionWith(apiPath, params) {
    const url = `${host}${apiPath}`
    return callApiData().then(r => {
        return getListSubActionWith(apiPath, params)
        return axios.get(url, Object.assign({
            params: params
        }, config)).then(res => { return res.data })
            .then(rData => { return rData.data })
    })
}
export function apiUpdateAction(id, item) {
    const url = `${host}action/${id}`
    return callApiData(item.ExpectCost).then(r => {
        return saveAction(id, item)
        return axios.put(url, Object.assign({
            params: item,
        }, config)).then(res => { return res })
    })
}
export function updateGoalWithId(id, item) {
    const url = `${host}goal/${id}`
    return callApiData(item.Budget).then(r => {
        return saveGoal(id, item)
        return axios.put(url, Object.assign({
            params: item
        }, config)).then(res => { return res })
    })
}
export function apiInsertMain(goal) {
    return callApiData(goal.Budget).then(d => {
        return insertMain(goal)
        return axios.post(`${host}main`, Object.assign({
            params: goal
        }, config)).then(res => { return res.data })
    })
}
export function apiInsertSub(sub) {
    return callApiData(sub.Budget).then(d => {
        return insertSub(sub)
        return axios.post(`${host}sub`, Object.assign({
            params: sub
        }, config)).then(res => { return res.data })
    })
}
export function apiInsertAction(item) {
    delete item.Id
    return callApiData(item.ExpectCost).then(d => {
        return insertAction(item)
        return axios.post(`${host}action`,
            Object.assign({
                params: item
            }, config)).then(res => { return res.data })
    })
}
export function apiDeleteAction(id) {
    return callApiData().then(d => {
        return deleteAction()
        return axios.delete(`${host}action/${id}`,
            config).then(res => { return res })
    })
}
export function apiDeleteSub(id) {
    return callApiData().then(d => {
        return deleteSub(id)
        return axios.delete(`${host}sub/${id}`,
            config).then(res => { return res })
    })
}
export function apiDeleteMain(id) {
    return callApiData().then(d => {
        return deleteMain(id)
        return axios.delete(`${host}main/${id}`,
            config).then(res => { return res })
    })
}
export function apiDuplicateSub(subid) {
    return callApiData().then(d => {
        return duplicateSub(subid)
        return axios.put(`${host}copysub/${subid}`, config)
            .then(res => { return res.data })
    })
}
export function apiDuplicateMain(mainid) {
    return callApiData().then(d => {
        return duplicateMain(mainid)
        return axios.put(`${host}copymain/${mainid}`, config)
            .then(res => { return res.data })
    })
}