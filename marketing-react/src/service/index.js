import axios from "axios"
import { logItem } from "../global/GlobalLog"
import {
    getSubsBy,
    saveAction, saveGoal, saveIndexAction,
    insertMain, insertSub, insertAction,
    deleteAction, deleteSub, deleteMain,
    duplicateSub, duplicateMain, saveCollapse,
} from "./localData"
import { getDemoData } from "./demoData"

const config = {
    headers: {
        'Access-Control-Allow-Origin': '*'
    }, timeout: 9999,
}
const host = `http://localhost:8001/api/`
function callApiData(testMs) {
    testMs = typeof testMs === 'number' ? testMs : 555
    return new Promise(res => {
        setTimeout(res, testMs)
    })
}
const demoData = getDemoData()
export function apiGetMains(apiPath) {
    const url = `${host}${apiPath}`
    return callApiData(1).then(r => {
        return demoData.getListMain()
        return axios.get(url, config)
            .then(res => { return res.data })
            .then(rData => { return rData.data })
    })
}
export function getSubsActionsBy(apiPath, params) {
    const url = `${host}${apiPath}`
    return callApiData().then(r => {
        return demoData.getListSubActionWith(apiPath, params)
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
export function updateGoalWith(id, item) {
    const url = `${host}goal/${id}`
    return callApiData(item.Budget).then(r => {
        return saveGoal(id, item)
        return axios.put(url, Object.assign({
            params: item
        }, config)).then(res => { return res })
    })
}
export function apiAddMain(goal) {
    return callApiData(goal.Budget).then(d => {
        return insertMain(goal)
        return axios.post(`${host}main`, Object.assign({
            params: goal
        }, config)).then(res => { return res.data })
    })
}
export function apiAddSub(sub) {
    return callApiData(sub.Budget).then(d => {
        return insertSub(sub)
        return axios.post(`${host}sub`, Object.assign({
            params: sub
        }, config)).then(res => { return res.data })
    })
}
export function apiAddAction(item) {
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
        return deleteAction(id)
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
export function apiCopySub(subid) {
    return callApiData().then(d => {
        return duplicateSub(subid)
        return axios.put(`${host}copysub/${subid}`, config)
            .then(res => { return res.data })
    })
}
export function apiCopyMain(mainid) {
    return callApiData().then(d => {
        return duplicateMain(mainid)
        return axios.put(`${host}copymain/${mainid}`, config)
            .then(res => { return res.data })
    })
}
export function apiSetIndexAction({ src, des, item }) {
    const srcSubId = src.SubId
    const desSubId = des.SubId
    const desItemIds = des.Ids

    return callApiData(123).then(d => {
        const newIndexes = desItemIds.map((id, i) => {
            return { Id: id, Index: i }
        })
        if (srcSubId !== desSubId) {
            saveIndexAction(newIndexes, { Id: item.Id, ParentId: desSubId })
        } else {
            saveIndexAction(newIndexes)
        }
        if (srcSubId !== desSubId)      // khac sub
            return {
                desSubs: getSubsBy([srcSubId, desSubId]),
            }
        else return {
            desSubs: getSubsBy([desSubId])
        }
    })
}
export function apiSetCollapse(ids, isExpand) {
    if(demoData.IsView) return
    return callApiData(1).then(d => {
        return saveCollapse(ids, isExpand)
    })
}