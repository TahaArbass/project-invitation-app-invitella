// centrelised api calls
import axios from 'axios';
import baseURL from '../apiConfig';

const api = axios.create({
    baseURL: baseURL,
});

// refresh token
api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const response = await api.post('/api/users/refresh-token', {
                refresh_token: localStorage.getItem('refresh_token'),
            });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.id_token);
                return api(originalRequest);
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
        }
    }
    return Promise.reject(error);
});

// Interceptor to add token to every request
api.interceptors.request.use(async (config) => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');
        if (token) {
            // Attach the token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('User token not found in local storage, proceeding without token');
        }

    } catch (error) {
        console.error('Error adding token to request:', error);
    }

    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

export default api;