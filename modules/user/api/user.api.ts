import axiosInstance from '@/lib/axios';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    CreateUserDto,
    UpdateUserDto,
    User,
    UserSearchParams,
} from '../types/user';

export const userApi = {
    findAll: (searchParams: UserSearchParams) =>
        axiosInstance.get<PaginatedResponseDto<User>>('/users', {
            params: searchParams,
        }),

    findOne: (id: string) =>
        axiosInstance.get<ResponseDto<User>>(`/users/${id}`),

    create: (data: CreateUserDto) =>
        axiosInstance.post<ResponseDto<User>>('/users', data),

    update: (id: string, data: UpdateUserDto) =>
        axiosInstance.patch<ResponseDto<User>>(`/users/${id}`, data),
};
