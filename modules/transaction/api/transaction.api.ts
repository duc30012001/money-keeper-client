import axiosInstance from '@/lib/axios';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    AnalyticByParentCategoryResult,
    ChartResult,
    CreateTransactionDto,
    Transaction,
    TransactionAnalyticByDateSearchParams,
    TransactionAnalyticParentCategorySearchParams,
    TransactionAnalyticResult,
    TransactionAnalyticSearchParams,
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

    getAnalytic: (searchParams: TransactionAnalyticSearchParams) =>
        axiosInstance.get<ResponseDto<TransactionAnalyticResult>>(
            '/transactions/analytics',
            { params: searchParams }
        ),

    getChart: (searchParams: TransactionAnalyticByDateSearchParams) =>
        axiosInstance.get<ResponseDto<ChartResult[]>>(
            '/transactions/analytics/chart',
            {
                params: searchParams,
            }
        ),

    getAnalyticParentCategory: (
        searchParams: TransactionAnalyticParentCategorySearchParams
    ) =>
        axiosInstance.get<ResponseDto<AnalyticByParentCategoryResult[]>>(
            '/transactions/analytics/parent-categories',
            { params: searchParams }
        ),

    create: (data: CreateTransactionDto) =>
        axiosInstance.post<ResponseDto<Transaction>>('/transactions', data),

    update: (id: string, data: UpdateTransactionDto) =>
        axiosInstance.patch<ResponseDto<Transaction>>(
            `/transactions/${id}`,
            data
        ),

    remove: (id: string) => axiosInstance.delete(`/transactions/${id}`),
};
