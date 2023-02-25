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
        }, config))
            .then(res => { return res.data })
            .then(rData => { resolve(rData.data) })
    })
}