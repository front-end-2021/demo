const axios = require('axios');

const serverUrl = 'http://localhost:8001';

export async function getAllUsers() {
    const response = await axios.get(`${serverUrl}/api/users`);
    return response.data;
}

export async function getUser(id, token) {
    const response = await axios.get(`${serverUrl}/api/user`, {
        params: {
          id: id, token: token
        }
    });
    return response.data;
}

export async function createUser(data) {
    const entry = {
        user: data
    }
    const response = await axios.post(`${serverUrl}/api/user`, entry);
    return response.data;
}