import { BaseEntity, BaseQuery } from '@/types/common';
import { CategoryType } from '../enums/category';

export interface Category extends BaseEntity {
    name: string;
    icon?: string;
    type: CategoryType;
    description?: string;
    sortOrder: number;
    parent?: Category;
    children: Category[];
    // depth: number;
}

export interface CreateCategoryDto {
    name: string;
    type: CategoryType;
    parentId?: string;
    icon?: string;
    description?: string;
    sortOrder?: number;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface UpdateSortOrderDto {
    ids: string[];
}

export interface CategorySearchParams extends BaseQuery {
    type?: string;
}
