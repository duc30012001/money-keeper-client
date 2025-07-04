import { PageSize } from '@/enums/common';
import { useApiError } from '@/hooks/use-api-error';
import { accountKeys } from '@/modules/account/hooks/use-accounts';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { transactionApi } from '../api/transaction.api';
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

export const transactionKeys = {
    all: ['transactions'] as const,
    lists: (searchParams?: TransactionSearchParams) =>
        searchParams
            ? [...transactionKeys.all, 'list', searchParams]
            : ([...transactionKeys.all, 'list'] as const),
    list: (filters: string) =>
        [...transactionKeys.lists(), { filters }] as const,
    details: () => [...transactionKeys.all, 'detail'] as const,
    detail: (id: string) => [...transactionKeys.details(), id] as const,
    analytic: (searchParams?: TransactionAnalyticSearchParams) =>
        searchParams
            ? [...transactionKeys.all, 'analytic', searchParams]
            : ([...transactionKeys.all, 'analytic'] as const),
    chart: (searchParams?: TransactionAnalyticSearchParams) =>
        searchParams
            ? [...transactionKeys.all, 'chart', searchParams]
            : ([...transactionKeys.all, 'chart'] as const),
    expenseByParentCategories: (
        searchParams?: TransactionAnalyticSearchParams
    ) =>
        searchParams
            ? [
                  ...transactionKeys.all,
                  'expenseByParentCategories',
                  searchParams,
              ]
            : ([...transactionKeys.all, 'expenseByParentCategories'] as const),
    incomeByParentCategories: (
        searchParams?: TransactionAnalyticSearchParams
    ) =>
        searchParams
            ? [...transactionKeys.all, 'incomeByParentCategories', searchParams]
            : ([...transactionKeys.all, 'incomeByParentCategories'] as const),
};

export const useTransactionsList = (searchParams: TransactionSearchParams) => {
    const { handleError } = useApiError();
    return useQuery<PaginatedResponseDto<Transaction>>({
        queryKey: transactionKeys.lists(searchParams),
        queryFn: async () => {
            const response = await transactionApi.findAll(searchParams);
            return response.data;
        },
        onError: handleError,
        placeholderData: (prev) => prev,
    } as UseQueryOptions<PaginatedResponseDto<Transaction>>);
};

export const useTransactionDetail = (id: string) => {
    const { handleError } = useApiError();
    return useQuery<ResponseDto<Transaction>>({
        queryKey: transactionKeys.detail(id),
        queryFn: async () => {
            const response = await transactionApi.findOne(id);
            return response.data;
        },
        enabled: !!id,
        onError: handleError,
    } as UseQueryOptions<ResponseDto<Transaction>>);
};

export const useTransactionAnalytic = (
    searchParams: TransactionAnalyticSearchParams
) => {
    const { handleError } = useApiError();
    return useQuery<ResponseDto<TransactionAnalyticResult>>({
        queryKey: transactionKeys.analytic(searchParams),
        queryFn: async () => {
            const response = await transactionApi.getAnalytic(searchParams);
            return response.data;
        },
        onError: handleError,
        placeholderData: (prev) => prev,
    } as UseQueryOptions<ResponseDto<TransactionAnalyticResult>>);
};

export const useTransactionChart = (
    searchParams: TransactionAnalyticSearchParams
) => {
    const { handleError } = useApiError();
    return useQuery<ResponseDto<ChartResult[]>>({
        queryKey: transactionKeys.chart(searchParams),
        queryFn: async () => {
            const response = await transactionApi.getChart(searchParams);
            return response.data;
        },
        onError: handleError,
        placeholderData: (prev) => prev,
    } as UseQueryOptions<ResponseDto<ChartResult[]>>);
};

export const useExpenseByParentCategories = (
    searchParams: TransactionAnalyticSearchParams
) => {
    const { handleError } = useApiError();
    return useQuery<ResponseDto<ExpenseByParentCategoryResult[]>>({
        queryKey: transactionKeys.expenseByParentCategories(searchParams),
        queryFn: async () => {
            const response =
                await transactionApi.getExpenseByParentCategory(searchParams);
            return response.data;
        },
        onError: handleError,
        placeholderData: (prev) => prev,
    } as UseQueryOptions<ResponseDto<ExpenseByParentCategoryResult[]>>);
};

export const useIncomeByParentCategories = (
    searchParams: TransactionAnalyticSearchParams
) => {
    const { handleError } = useApiError();
    return useQuery<ResponseDto<IncomeByParentCategoryResult[]>>({
        queryKey: transactionKeys.incomeByParentCategories(searchParams),
        queryFn: async () => {
            const response =
                await transactionApi.getIncomeByParentCategory(searchParams);
            return response.data;
        },
        onError: handleError,
        placeholderData: (prev) => prev,
    } as UseQueryOptions<ResponseDto<IncomeByParentCategoryResult[]>>);
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: (data: CreateTransactionDto) => transactionApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transactionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: accountKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: accountKeys.totalBalance(),
            });
            toast.success('Transaction created successfully!');
        },
        onError: handleError,
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateTransactionDto;
        }) => transactionApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: transactionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: transactionKeys.detail(id),
            });
            queryClient.invalidateQueries({
                queryKey: accountKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: accountKeys.totalBalance(),
            });
            toast.success('Transaction updated successfully!');
        },
        onError: handleError,
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: (id: string) => transactionApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: transactionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: accountKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: accountKeys.totalBalance(),
            });
            toast.success('Transaction deleted successfully!');
        },
        onError: handleError,
    });
};

export const useTransactionSearchParams = (): TransactionSearchParams => {
    const searchParams = useSearchParams();

    return {
        page: Number(searchParams.get('page') || 1),
        pageSize: Number(searchParams.get('pageSize') || PageSize.LARGE),
        keyword: searchParams.get('keyword') || undefined,
        transactionDate: searchParams.get('transactionDate') || undefined,
        amount: searchParams.get('amount') || undefined,
        type: searchParams.get('type') as TransactionSearchParams['type'],
        sort: searchParams.get('sort') as TransactionSearchParams['sort'],
        accountIds: searchParams.get('accountIds') || undefined,
        categoryIds: searchParams.get('categoryIds') || undefined,
        senderAccountIds: searchParams.get('senderAccountIds') || undefined,
        receiverAccountIds: searchParams.get('receiverAccountIds') || undefined,
    };
};
