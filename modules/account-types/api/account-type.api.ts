import axiosInstance from '@/lib/axios';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    AccountType,
    CreateAccountTypeDto,
    UpdateAccountTypeDto,
    UpdateSortOrderDto,
} from '../types/account-type';

export const accountTypeApi = {
    findAll: () =>
        axiosInstance.get<PaginatedResponseDto<AccountType>>('/account-types'),

    findOne: (id: string) =>
        axiosInstance.get<ResponseDto<AccountType>>(`/account-types/${id}`),

    create: (data: CreateAccountTypeDto) =>
        axiosInstance.post<ResponseDto<AccountType>>('/account-types', data),

    update: (id: string, data: UpdateAccountTypeDto) =>
        axiosInstance.patch<ResponseDto<AccountType>>(
            `/account-types/${id}`,
            data
        ),

    updateSortOrder: (data: UpdateSortOrderDto) =>
        axiosInstance.patch<ResponseDto<AccountType[]>>(
            '/account-types/sort-order',
            data
        ),

    remove: (id: string) => axiosInstance.delete(`/account-types/${id}`),
};
