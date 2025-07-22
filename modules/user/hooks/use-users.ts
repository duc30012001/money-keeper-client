import { useApiError } from '@/hooks/use-api-error';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { userApi } from '../api/user.api';
import {
    CreateUserDto,
    UpdateUserDto,
    User,
    UserSearchParams,
} from '../types/user';

export const userKeys = {
    all: ['users'] as const,
    lists: (searchParams?: UserSearchParams) =>
        searchParams
            ? [...userKeys.all, 'list', searchParams]
            : ([...userKeys.all, 'list'] as const),
    list: (filters: string) => [...userKeys.lists(), { filters }] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
    totalBalance: () => [...userKeys.all, 'total-balance'] as const,
};

export const useUsersList = (searchParams: UserSearchParams) => {
    const { handleError } = useApiError();
    return useQuery<PaginatedResponseDto<User>>({
        queryKey: userKeys.lists(searchParams),
        queryFn: async () => {
            const response = await userApi.findAll(searchParams);
            return response.data;
        },
        onError: handleError,
        placeholderData: (prev) => prev,
    } as UseQueryOptions<PaginatedResponseDto<User>>);
};

export const useUserDetail = (id: string) => {
    const { handleError } = useApiError();
    return useQuery<ResponseDto<User>>({
        queryKey: userKeys.detail(id),
        queryFn: async () => {
            const response = await userApi.findOne(id);
            return response.data;
        },
        enabled: !!id,
        onError: handleError,
    } as UseQueryOptions<ResponseDto<User>>);
};

export const useCreateUser = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: (data: CreateUserDto) => userApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: userKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: userKeys.totalBalance(),
            });
            toast.success(
                messages('action.create.success', {
                    label: messages('user.title'),
                })
            );
        },
        onError: handleError,
    });
};

export const useUpdateUser = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
            userApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: userKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: userKeys.detail(id),
            });
            queryClient.invalidateQueries({
                queryKey: userKeys.totalBalance(),
            });
            toast.success(
                messages('action.update.success', {
                    label: messages('user.title'),
                })
            );
        },
        onError: handleError,
    });
};
