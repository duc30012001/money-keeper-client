import axiosInstance from '@/lib/axios';
import { ResponseDto } from '@/types/common';
import axios, { AxiosInstance } from 'axios';
import { User } from '../../user/types/user';
import { GetTokenResponse, RefreshDto, SigninDto } from '../types/auth';

const axiosAuth: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    signin: (payload: SigninDto) =>
        axiosAuth.post<ResponseDto<GetTokenResponse>>(`/signin`, payload),

    register: (payload: SigninDto) =>
        axiosAuth.post<ResponseDto<User>>(`/register`, payload),

    getCurrentUser: () => axiosInstance.get<ResponseDto<User>>(`/auth/me`),

    refreshToken: (payload: RefreshDto) =>
        axiosAuth.post<ResponseDto<GetTokenResponse>>(`/refresh`, payload),
};
