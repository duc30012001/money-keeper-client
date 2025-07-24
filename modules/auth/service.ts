import { ResponseDto } from '@/types/common';
import axios, { AxiosInstance } from 'axios';
import { User } from '../user/types/user';
import { GetTokenResponse, RefreshDto, SigninDto } from './types';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    signin: (payload: SigninDto) =>
        axiosInstance.post<ResponseDto<GetTokenResponse>>(`/signin`, payload),

    register: (payload: SigninDto) =>
        axiosInstance.post<ResponseDto<User>>(`/register`, payload),

    getCurrentUser: (token?: string) =>
        axiosInstance.get<ResponseDto<User>>(`/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),

    refreshToken: (payload: RefreshDto) =>
        axiosInstance.post<ResponseDto<GetTokenResponse>>(`/refresh`, payload),

    logout: () => axiosInstance.post(`/logout`),
};
