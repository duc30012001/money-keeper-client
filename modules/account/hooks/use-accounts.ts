import { useApiError } from '@/hooks/use-api-error';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { accountApi } from '../api/account.api';
import {
    Account,
    AccountSearchParams,
    CreateAccountDto,
    UpdateAccountDto,
    UpdateSortOrderDto,
} from '../types/account';

export const accountKeys = {
    all: ['accounts'] as const,
    lists: (searchParams?: AccountSearchParams) =>
        searchParams
            ? [...accountKeys.all, 'list', searchParams]
            : ([...accountKeys.all, 'list'] as const),
    list: (filters: string) => [...accountKeys.lists(), { filters }] as const,
    details: () => [...accountKeys.all, 'detail'] as const,
    detail: (id: string) => [...accountKeys.details(), id] as const,
    totalBalance: () => [...accountKeys.all, 'total-balance'] as const,
};

export const useAccountsList = (searchParams: AccountSearchParams) => {
    const { handleError } = useApiError();
    return useQuery<PaginatedResponseDto<Account>>({
        queryKey: accountKeys.lists(searchParams),
        queryFn: async () => {
            const response = await accountApi.findAll(searchParams);
            return response.data;
        },
        onError: handleError,
        placeholderData: (prev) => prev,
    } as UseQueryOptions<PaginatedResponseDto<Account>>);
};

export const useAccountDetail = (id: string) => {
    const { handleError } = useApiError();
    return useQuery<ResponseDto<Account>>({
        queryKey: accountKeys.detail(id),
        queryFn: async () => {
            const response = await accountApi.findOne(id);
            return response.data;
        },
        enabled: !!id,
        onError: handleError,
    } as UseQueryOptions<ResponseDto<Account>>);
};

export const useTotalBalance = () => {
    const { handleError } = useApiError();
    return useQuery<ResponseDto<number>>({
        queryKey: accountKeys.totalBalance(),
        queryFn: async () => {
            const response = await accountApi.getTotalBalance();
            return response.data;
        },
        onError: handleError,
        placeholderData: (prev) => prev,
    } as UseQueryOptions<ResponseDto<number>>);
};

export const useCreateAccount = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: (data: CreateAccountDto) => accountApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: accountKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: accountKeys.totalBalance(),
            });
            toast.success('Account created successfully!');
        },
        onError: handleError,
    });
};

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAccountDto }) =>
            accountApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: accountKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: accountKeys.detail(id),
            });
            queryClient.invalidateQueries({
                queryKey: accountKeys.totalBalance(),
            });
            toast.success('Account updated successfully!');
        },
        onError: handleError,
    });
};

export const useUpdateSortOrder = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: (data: UpdateSortOrderDto) =>
            accountApi.updateSortOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: accountKeys.lists(),
            });
            toast.success('Account sort order updated successfully!');
        },
        onError: handleError,
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: (id: string) => accountApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: accountKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: accountKeys.totalBalance(),
            });
            toast.success('Account deleted successfully!');
        },
        onError: handleError,
    });
};
