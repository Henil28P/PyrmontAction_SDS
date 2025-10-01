import axios from 'axios';

const server = "http://localhost:5000";

const api = {
    async get(endpoint, token) {
        try {
            const response = await axios.get(`${server}/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from GET Request: ' + error);
            throw error;
        }
    },

    async post(endpoint, data, token) {
        try {
            const response = await axios.post(`${server}/${endpoint}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from POST Request: ' + error);
            throw error;
        }
    },
};

export default api;
