import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';

const replacer = (_key: string, value: any) =>
    value === undefined ? null : value;

const config: AxiosRequestConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    transformRequest: [
        // Use a normal function so `this.method` is available
        function (data: any) {
            const method = this.method?.toLowerCase();
            // Only stringify with replacer on POST/PUT/PATCH
            if (
                method &&
                ['post', 'put', 'patch'].includes(method) &&
                data != null &&
                typeof data === 'object'
            ) {
                return JSON.stringify(data, replacer);
            }
            // Otherwise leave data as-is
            return data;
        },
    ],
    // timeout: 10000,
};

const axiosInstance: AxiosInstance = axios.create(config);

// Attach token if present
axiosInstance.interceptors.request.use(
    async (cfg) => {
        const session = await getSession();
        const token = session?.accessToken;
        if (token && cfg.headers) {
            cfg.headers.Authorization = `Bearer ${token}`;
        }
        return cfg;
    },
    (error) => Promise.reject(error)
);

// Global error handling
axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => res,
    (error) => {
        if (error.response?.status === 401) {
            // logout logic here
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
