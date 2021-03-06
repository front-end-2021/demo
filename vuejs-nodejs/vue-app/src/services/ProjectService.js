const axios = require('axios');
const serverUrl = 'http://localhost:8001';

export async function getProjectGroups() {
    const response = await axios.get(`${serverUrl}/api/projectgroups`)
    return response.data
}

export async function getProjects() {
    const response = await axios.get(`${serverUrl}/api/projects`)
    return response.data
}

export async function createProjectGroup(data) {
    const entry = {
        projectgroup: data
    }
    const res = await axios.post(`${serverUrl}/api/projectgroup`, entry)
    return res
}

export async function editProjectGroup (data) {
    return await createProjectGroup(data)
}
export async function deleteProjectGroup(_id) {
    const res = await axios.delete(`${serverUrl}/api/projectgroup`, {
        data: { Id: _id }
    })
    return res;
}