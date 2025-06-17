import { useApiError } from '@/hooks/use-api-error';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { iconApi } from '../api/icon.api';
import { CreateIconDto, Icon, UpdateIconDto } from '../types/icon';

export const iconKeys = {
    all: ['icons'] as const,
    lists: () => [...iconKeys.all, 'list'] as const,
    list: (filters: string) => [...iconKeys.lists(), { filters }] as const,
    details: () => [...iconKeys.all, 'detail'] as const,
    detail: (id: string) => [...iconKeys.details(), id] as const,
};

export const useIconsList = () => {
    const { handleError } = useApiError();
    return useQuery<PaginatedResponseDto<Icon>>({
        queryKey: iconKeys.lists(),
        queryFn: async () => {
            const response = await iconApi.findAll();
            return response.data;
        },
        onError: handleError,
        placeholderData: (prev) => prev,
    } as UseQueryOptions<PaginatedResponseDto<Icon>>);
};

export const useIconDetail = (id: string) => {
    const { handleError } = useApiError();
    return useQuery<ResponseDto<Icon>>({
        queryKey: iconKeys.detail(id),
        queryFn: async () => {
            const response = await iconApi.findOne(id);
            return response.data;
        },
        enabled: !!id,
        onError: handleError,
    } as UseQueryOptions<ResponseDto<Icon>>);
};

export const useCreateIcon = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: (data: CreateIconDto) => iconApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: iconKeys.lists(),
            });
            toast.success('Icon created successfully!');
        },
        onError: handleError,
    });
};

export const useUpdateIcon = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateIconDto }) =>
            iconApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: iconKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: iconKeys.detail(id),
            });
            toast.success('Icon updated successfully!');
        },
        onError: handleError,
    });
};

export const useDeleteIcon = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: (id: string) => iconApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: iconKeys.lists(),
            });
            toast.success('Icon deleted successfully!');
        },
        onError: handleError,
    });
};
