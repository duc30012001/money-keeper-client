import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession, signOut } from 'next-auth/react';

const ACCESS_TOKEN_EXPIRED_MESSAGE = 'jwt expired';

const replacer = (_key: string, value: any) =>
    value === undefined ? null : value;

const config: AxiosRequestConfig = {
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    transformRequest: [
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
};

const axiosInstance: AxiosInstance = axios.create(config);

// Global error handling
axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error) => {
        console.log('error:', error);
        if (error.response?.data?.message === ACCESS_TOKEN_EXPIRED_MESSAGE) {
            const cfg = error.config;
            const session = await getSession();
            if (session?.error === 'RefreshFailed') {
                signOut();
                return Promise.reject(error);
            }
            return axiosInstance(cfg);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
