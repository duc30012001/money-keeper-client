import { AccountType } from '@/modules/account-type/types/account-type';
import { BaseEntity, BaseQuery } from '@/types/common';

export interface Account extends BaseEntity {
    name: string;
    balance: string;
    initialBalance: string;
    description: string | null;
    sortOrder: number;
    accountType: AccountType;
}

export interface CreateAccountDto {
    name: string;
    initialBalance?: number;
    description?: string;
    sortOrder?: number;
    accountTypeId: AccountType['id'];
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {}

export interface UpdateSortOrderDto {
    ids: string[];
}

export interface AccountSearchParams extends BaseQuery {
    accountTypeIds?: string;
}
