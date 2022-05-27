const axios = require('axios');
const serverUrl = 'http://localhost:8001';

export async function getProjectGroups() {
    const response = await axios.get(`${serverUrl}/api/projectgroups`);
    return response.data;
}

export async function getProjects() {
    const response = await axios.get(`${serverUrl}/api/projects`);
    return response.data;
}

export async function createProjectGroup(data) {
    const entry = {
        projectgroup: data
    }
    const response = await axios.post(`${serverUrl}/api/projectgroup`, entry);
    return response.data;
}

export async function editProjectGroup (data) {
    await createProjectGroup(data);
}