import { ActionType } from '@/enums/common';
import { BaseEntity, BaseQuery } from '@/types/common';

export interface Category extends BaseEntity {
    name: string;
    icon?: string;
    actionType: ActionType;
    description?: string;
    sortOrder: number;
    parent?: Category;
    children: Category[];
    // depth: number;
}

export interface CreateCategoryDto {
    name: string;
    actionType: ActionType;
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
    actionType?: string;
}
