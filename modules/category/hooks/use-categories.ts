import { useApiError } from '@/hooks/use-api-error';
import { CategoryType } from '@/modules/category/enums/category';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { categoryApi } from '../api/category.api';
import {
    AnalyticCategoryDto,
    Category,
    CategoryAnalytic,
    CategorySearchParams,
    CreateCategoryDto,
    UpdateCategoryDto,
    UpdateSortOrderDto,
} from '../types/category';

export const categoryKeys = {
    all: ['categories'] as const,
    lists: (searchParams?: CategorySearchParams) =>
        searchParams
            ? [...categoryKeys.all, 'list', searchParams]
            : ([...categoryKeys.all, 'list'] as const),
    list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...categoryKeys.details(), id] as const,
    analytic: (type: CategoryType, searchParams?: AnalyticCategoryDto) =>
        searchParams
            ? [...categoryKeys.all, 'analytic', type, searchParams]
            : ([...categoryKeys.all, 'analytic', type] as const),
};

export const useCategoriesList = (searchParams: CategorySearchParams) => {
    const { handleError } = useApiError();
    return useQuery<PaginatedResponseDto<Category>>({
        queryKey: categoryKeys.lists(searchParams),
        queryFn: async () => {
            const response = await categoryApi.findAll(searchParams);
            return response.data;
        },
        onError: handleError,
        placeholderData: (prev) => prev,
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
            toast.success('Category created successfully!');
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
            toast.success('Category updated successfully!');
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
            toast.success('Category sort order updated successfully!');
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
            toast.success('Category deleted successfully!');
        },
        onError: handleError,
    });
};

export const useCategoryAnalytic = (
    type: CategoryType,
    searchParams?: AnalyticCategoryDto
) => {
    const { handleError } = useApiError();
    return useQuery<PaginatedResponseDto<CategoryAnalytic>>({
        queryKey: categoryKeys.analytic(type, searchParams),
        queryFn: async () => {
            const response = await categoryApi.analytic(type, searchParams);
            return response.data;
        },
        onError: handleError,
        placeholderData: (prev) => prev,
    } as UseQueryOptions<PaginatedResponseDto<CategoryAnalytic>>);
};
