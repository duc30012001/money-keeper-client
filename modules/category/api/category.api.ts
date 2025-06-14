import axiosInstance from '@/lib/axios';
import { PaginatedResponseDto, ResponseDto } from '@/types/common';
import { CategoryType } from '../enums/category';
import {
    AnalyticCategoryDto,
    Category,
    CategoryAnalytic,
    CategorySearchParams,
    CreateCategoryDto,
    UpdateCategoryDto,
    UpdateSortOrderDto,
} from '../types/category';

export const categoryApi = {
    findAll: (searchParams: CategorySearchParams) =>
        axiosInstance.get<PaginatedResponseDto<Category>>('/categories', {
            params: searchParams,
        }),

    findOne: (id: string) =>
        axiosInstance.get<ResponseDto<Category>>(`/categories/${id}`),

    create: (data: CreateCategoryDto) =>
        axiosInstance.post<ResponseDto<Category>>('/categories', data),

    update: (id: string, data: UpdateCategoryDto) =>
        axiosInstance.patch<ResponseDto<Category>>(`/categories/${id}`, data),

    updateSortOrder: (data: UpdateSortOrderDto) =>
        axiosInstance.patch<ResponseDto<Category[]>>(
            '/categories/sort-order',
            data
        ),

    remove: (id: string) => axiosInstance.delete(`/categories/${id}`),

    analytic: (type: CategoryType, searchParams?: AnalyticCategoryDto) =>
        axiosInstance.get<PaginatedResponseDto<CategoryAnalytic>>(
            `/categories/analytic/${type}`,
            { params: searchParams }
        ),
};
