import axiosInstance from '@/lib/axios';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    Account,
    AccountSearchParams,
    CreateAccountDto,
    UpdateAccountDto,
    UpdateSortOrderDto,
} from '../types/account';

export const accountApi = {
    findAll: (searchParams: AccountSearchParams) =>
        axiosInstance.get<PaginatedResponseDto<Account>>('/accounts', {
            params: searchParams,
        }),

    getTotalBalance: () =>
        axiosInstance.get<ResponseDto<number>>('/accounts/total-balance'),

    findOne: (id: string) =>
        axiosInstance.get<ResponseDto<Account>>(`/accounts/${id}`),

    create: (data: CreateAccountDto) =>
        axiosInstance.post<ResponseDto<Account>>('/accounts', data),

    update: (id: string, data: UpdateAccountDto) =>
        axiosInstance.patch<ResponseDto<Account>>(`/accounts/${id}`, data),

    updateSortOrder: (data: UpdateSortOrderDto) =>
        axiosInstance.patch<ResponseDto<Account[]>>(
            '/accounts/sort-order',
            data
        ),

    remove: (id: string) => axiosInstance.delete(`/accounts/${id}`),
};
