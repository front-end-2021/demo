const axios = require('axios');

const serverUrl = 'http://localhost:8001';

export async function getAllUsers() {
    const response = await axios.get(`${serverUrl}/api/users`);
    return response.data;
}

export async function createUser(data) {
    const response = await axios.post(`${serverUrl}/api/user`, {user: data});
    return response.data;
}