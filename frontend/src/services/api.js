import axios from 'axios';

import SERVER_URL from '../config'

const api = {
    async get(endpoint, token) {
        try {
            const response = await axios.get(`${SERVER_URL}/${endpoint}`, {
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
            const response = await axios.post(`${SERVER_URL}/${endpoint}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from POST Request: ' + error);
            throw error;
        }
    },

    async put(endpoint, data, token) {
        try {
            const response = await axios.put(`${SERVER_URL}/${endpoint}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from PUT Request: ' + error);
            throw error;
        }
    },

    async patch(endpoint, data, token) {
        try {
            const response = await axios.patch(`${SERVER_URL}/${endpoint}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from PATCH Request: ' + error);
            throw error;
        }
    },

    async delete(endpoint, token) {
        try {
            const response = await axios.delete(`${SERVER_URL}/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return true;
        } catch (error) {
            console.error('Error caused from DELETE Request: ' + error);
            throw error;
        }
    },

    async postFormData(endpoint, formData, token) {
        try {
            const response = await axios.post(`${SERVER_URL}/${endpoint}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from FormData POST Request: ' + error);
            throw error;
        }
    },

    async putFormData(endpoint, formData, token) {
        try {
            const response = await axios.put(`${SERVER_URL}/${endpoint}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from FormData PUT Request: ' + error);
            throw error;
        }
    },
};

export default api;
