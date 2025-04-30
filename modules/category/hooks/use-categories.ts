import { useApiError } from '@/hooks/use-api-error';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { categoryApi } from '../api/category.api';
import {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
    UpdateSortOrderDto,
} from '../types/category';

export const categoryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryKeys.all, 'list'] as const,
    list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const useCategoriesList = () => {
    const { handleError } = useApiError();
    return useQuery<PaginatedResponseDto<Category>>({
        queryKey: categoryKeys.lists(),
        queryFn: async () => {
            const response = await categoryApi.findAll();
            return response.data;
        },
        onError: handleError,
    } as UseQueryOptions<PaginatedResponseDto<Category>>);
};

export const useCategoryDetail = (id: string) => {
    const { handleError } = useApiError();
    return useQuery<ResponseDto<Category>>({
        queryKey: categoryKeys.detail(id),
        queryFn: async () => {
            const response = await categoryApi.findOne(id);
            return response.data;
        },
        enabled: !!id,
        onError: handleError,
    } as UseQueryOptions<ResponseDto<Category>>);
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: (data: CreateCategoryDto) => categoryApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoryKeys.lists(),
            });
        },
        onError: handleError,
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
            categoryApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: categoryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: categoryKeys.detail(id),
            });
        },
        onError: handleError,
    });
};

export const useUpdateSortOrder = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: (data: UpdateSortOrderDto) =>
            categoryApi.updateSortOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoryKeys.lists(),
            });
        },
        onError: handleError,
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    return useMutation({
        mutationFn: (id: string) => categoryApi.remove(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: categoryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: categoryKeys.detail(id),
            });
        },
        onError: handleError,
    });
};
