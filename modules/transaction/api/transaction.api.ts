import axiosInstance from '@/lib/axios';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    CreateTransactionDto,
    Transaction,
    TransactionSearchParams,
    UpdateTransactionDto,
} from '../types/transaction';

export const transactionApi = {
    findAll: (searchParams: TransactionSearchParams) =>
        axiosInstance.get<PaginatedResponseDto<Transaction>>('/transactions', {
            params: searchParams,
        }),

    findOne: (id: string) =>
        axiosInstance.get<ResponseDto<Transaction>>(`/transactions/${id}`),

    create: (data: CreateTransactionDto) =>
        axiosInstance.post<ResponseDto<Transaction>>('/transactions', data),

    update: (id: string, data: UpdateTransactionDto) =>
        axiosInstance.patch<ResponseDto<Transaction>>(
            `/transactions/${id}`,
            data
        ),

    remove: (id: string) => axiosInstance.delete(`/transactions/${id}`),
};
