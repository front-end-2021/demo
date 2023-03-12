import axios from "axios"

const config = {
    headers: {
        'Access-Control-Allow-Origin': '*'
    }, timeout: 9999,
}
const host = `http://localhost:8001/api/`
function callApiData(testMs) {
    testMs = testMs || 1500
    return new Promise(res => {
        setTimeout(res, testMs)
    })
}
export function getDataGoalAction(apiPath) {
    const url = `${host}${apiPath}`
    return callApiData().then(r => {
        return axios.get(url, config)
            .then(res => { return res.data })
            .then(rData => { return rData.data })
    })

}
export function getDataGoalActionWith(apiPath, params) {
    const url = `${host}${apiPath}`
    return callApiData().then(r => {
        return axios.get(url, Object.assign({
            params: params
        }, config)).then(res => { return res.data })
            .then(rData => { return rData.data })
    })
}
export function updateActionWithId(id, item) {
    const url = `${host}action/${id}`
    return callApiData().then(r => {
        return axios.put(url, Object.assign({
            params: item,
        }, config)).then(res => { return res })
    })
}
export function updateGoalWithId(id, item) {
    const url = `${host}goal/${id}`
    return callApiData().then(r => {
        return axios.put(url, Object.assign({
            params: item
        }, config)).then(res => { return res })
    })
}
export function apiInsertMain(goal) {
    return callApiData().then(d => {
        return axios.post(`${host}main`, Object.assign({
            params: goal
        }, config)).then(res => { return res.data })
    })
}
export function apiInsertSub(sub) {
    return axios.post(`${host}sub`, Object.assign({
        params: sub
    }, config)).then(res => { return res.data })
}
export function apiInsertAction(item) {
    delete item.Id
    return callApiData().then(d => {
        return axios.post(`${host}action`,
            Object.assign({
                params: item
            }, config)).then(res => { return res.data })
    })
}
export function apiDeleteAction(id) {
    return callApiData().then(d => {
        return axios.delete(`${host}action/${id}`,
            config).then(res => { return res })
    })
}
export function apiDeleteSub(id) {
    return callApiData().then(d => {
        return axios.delete(`${host}sub/${id}`,
            config).then(res => { return res })
    })
}
export function apiDeleteMain(id) {
    return callApiData().then(d => {
        return axios.delete(`${host}main/${id}`,
            config).then(res => { return res })
    })
}
export function apiDuplicateSub(sub) {
    return callApiData().then(d => {
        return axios.post(`${host}copysub`,
            Object.assign({
                params: sub
            }, config)).then(res => { return res.data })
    })
}