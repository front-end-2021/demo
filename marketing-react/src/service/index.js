import axios from "axios"

const config = {
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
}
const host = `http://localhost:8001/api/`
export function getDataGoalAction(apiPath) {
    const url = `${host}${apiPath}`
    return new Promise((resolve, reject) => {
        axios.get(url, config)
            .then(res => { return res.data })
            .then(rData => { resolve(rData.data) })
    })
}
export function getDataGoalActionWith(apiPath, params) {
    const url = `${host}${apiPath}`
    return new Promise((resolve, reject) => {
        axios.get(url, Object.assign({
            params: params
        }, config)).then(res => { return res.data })
            .then(rData => { resolve(rData.data) })
    })
}
export function updateActionWithId(id, item) {
    const url = `${host}action/${id}`
    return new Promise((resolve, reject) => {
        axios.put(url, Object.assign({
            params: item
        }, config))
            .then(res => { console.log(res) })
    })
}
export function updateGoalWithId(id, item) {
    const url = `${host}goal/${id}`
    return new Promise((resolve, reject) => {
        axios.put(url, Object.assign({
            params: item
        }, config))
            .then(res => { console.log(res) })
    })
}
export function insertMain(goal) {
    return new Promise((resolve, reject) => {
        axios.post(`${host}main`, Object.assign({
            params: goal
        }, config)).then(res => {
            resolve(res.data)
        })
    })
}
export function insertSub(sub) {
    return new Promise((resolve, reject) => {
        axios.post(`${host}sub`, Object.assign({
            params: sub
        }, config)).then(res => {
            resolve(res.data)
        })
    })
}
export function insertAction(item) {
    return new Promise((resolve, reject) => {
        axios.post(`${host}action`, Object.assign({
            params: item
        }, config)).then(res => {
            resolve(res.data)
        })
    })
}
export function deleteAction(id) {
    return axios.delete(`${host}action/${id}`,
        config).then(res => {
            return res
        })
}
export function deleteSubApi(id) {
    return axios.delete(`${host}sub/${id}`,
        config).then(res => {
            return res
        })
}
export function deleteMainApi(id) {
    return axios.delete(`${host}main/${id}`,
        config).then(res => {
            return res
        })
}