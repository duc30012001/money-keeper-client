import { Icon } from '@/modules/icon/types/icon';
import { BaseEntity } from '@/types/common';

export interface AccountType extends BaseEntity {
    name: string;
    description: string | null;
    sortOrder: number;
    accountCount: number;
    icon?: Icon;
}

export interface CreateAccountTypeDto {
    name: string;
    description?: string;
    sortOrder?: number;
    iconId: Icon['id'];
}

export interface UpdateAccountTypeDto extends Partial<CreateAccountTypeDto> {}

export interface UpdateSortOrderDto {
    ids: string[];
}

export interface AccountTypeFormValues {
    name: string;
    description: string | undefined;
    iconId: string;
}
