import axios from 'axios';

const server = "http://localhost:5000";

// Create axios instance
const apiClient = axios.create({
    baseURL: server,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Try to refresh the token
                const refreshResponse = await axios.post(`${server}/api/authentication/refresh-token`, {
                    refreshToken
                });

                const newAccessToken = refreshResponse.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);

            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                
                // Redirect to login page
                window.location.href = '/login';
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

const api = {
    async get(endpoint, token = null) {
        try {
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await apiClient.get(`/${endpoint}`, config);
            return response.data;
        } catch (error) {
            console.error('Error caused from GET Request: ' + error);
            throw error;
        }
    },

    async post(endpoint, data, token = null) {
        try {
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await apiClient.post(`/${endpoint}`, data, config);
            return response.data;
        } catch (error) {
            console.error('Error caused from POST Request: ' + error);
            throw error;
        }
    },

    async put(endpoint, data, token = null) {
        try {
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await apiClient.put(`/${endpoint}`, data, config);
            return response.data;
        } catch (error) {
            console.error('Error caused from PUT Request: ' + error);
            throw error;
        }
    },

    async delete(endpoint, token = null) {
        try {
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await apiClient.delete(`/${endpoint}`, config);
            return response.data;
        } catch (error) {
            console.error('Error caused from DELETE Request: ' + error);
            throw error;
        }
    }
};

export default api;
