import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountTypeApi } from '../api/account-type.api';
import {
    AccountType,
    CreateAccountTypeDto,
    UpdateAccountTypeDto,
    UpdateSortOrderDto,
} from '../types/account-type';

export const accountTypeKeys = {
    all: ['account-types'] as const,
    lists: () => [...accountTypeKeys.all, 'list'] as const,
    list: (filters: string) =>
        [...accountTypeKeys.lists(), { filters }] as const,
    details: () => [...accountTypeKeys.all, 'detail'] as const,
    detail: (id: string) => [...accountTypeKeys.details(), id] as const,
};

export const useAccountTypesList = () => {
    return useQuery<PaginatedResponseDto<AccountType>>({
        queryKey: accountTypeKeys.lists(),
        queryFn: async () => {
            const response = await accountTypeApi.findAll();
            return response.data;
        },
    });
};

export const useAccountTypeDetail = (id: string) => {
    return useQuery<ResponseDto<AccountType>>({
        queryKey: accountTypeKeys.detail(id),
        queryFn: async () => {
            const response = await accountTypeApi.findOne(id);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useCreateAccountType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAccountTypeDto) => accountTypeApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: accountTypeKeys.lists(),
            });
        },
    });
};

export const useUpdateAccountType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateAccountTypeDto;
        }) => accountTypeApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: accountTypeKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: accountTypeKeys.detail(id),
            });
        },
    });
};

export const useUpdateSortOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateSortOrderDto) =>
            accountTypeApi.updateSortOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: accountTypeKeys.lists(),
            });
        },
    });
};

export const useDeleteAccountType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => accountTypeApi.remove(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: accountTypeKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: accountTypeKeys.detail(id),
            });
        },
    });
};
