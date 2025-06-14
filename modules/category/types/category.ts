import { Transaction } from '@/modules/transaction/types/transaction';
import { BaseEntity, BaseQuery } from '@/types/common';
import { CategoryType } from '../enums/category';

export interface Category extends BaseEntity {
    name: string;
    icon?: string;
    type: CategoryType;
    description?: string;
    sortOrder: number;
    parent?: Category | null;
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

export interface CategoryAnalytic extends Omit<Category, 'children'> {
    transaction: Transaction[];
    amount: number;
    children: CategoryAnalytic[];
}

export interface AnalyticCategoryDto {
    transactionDate?: string;
}
