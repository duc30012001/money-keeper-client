// lib/axios.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';

const config: AxiosRequestConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // timeout: 10000, // nếu cần
};

const axiosInstance: AxiosInstance = axios.create(config);

// Request interceptor (nếu cần gắn token)
axiosInstance.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        const token = session?.accessToken;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor (bắt lỗi chung)
axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => res,
    (error) => {
        // xử lý lỗi toàn cục, ví dụ logout khi 401
        if (error.response?.status === 401) {
            // logout logic
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
