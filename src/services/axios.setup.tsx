import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://fakestoreapi.com/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Unauthorized! Redirecting...');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;