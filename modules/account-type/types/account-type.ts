import { BaseEntity } from '@/types/common';

export interface AccountType extends BaseEntity {
    name: string;
    description?: string;
    sortOrder: number;
}

export interface CreateAccountTypeDto {
    name: string;
    description?: string;
    sortOrder?: number;
}

export interface UpdateAccountTypeDto extends Partial<CreateAccountTypeDto> {}

export interface UpdateSortOrderDto {
    ids: string[];
}
