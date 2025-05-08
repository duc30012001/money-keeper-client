import axiosInstance from '@/lib/axios';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    ChartResult,
    CreateTransactionDto,
    ExpenseByParentCategoryResult,
    IncomeByParentCategoryResult,
    Transaction,
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

    getChart: (searchParams: TransactionAnalyticSearchParams) =>
        axiosInstance.get<ResponseDto<ChartResult[]>>('/transactions/chart', {
            params: searchParams,
        }),

    getExpenseByParentCategory: (
        searchParams: TransactionAnalyticSearchParams
    ) =>
        axiosInstance.get<ResponseDto<ExpenseByParentCategoryResult[]>>(
            '/transactions/expense-by-parent-categories',
            { params: searchParams }
        ),

    getIncomeByParentCategory: (
        searchParams: TransactionAnalyticSearchParams
    ) =>
        axiosInstance.get<ResponseDto<IncomeByParentCategoryResult[]>>(
            '/transactions/income-by-parent-categories',
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
