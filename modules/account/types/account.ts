import { AccountType } from '@/modules/account-type/types/account-type';
import { Icon } from '@/modules/icon/types/icon';
import { BaseEntity, BaseQuery } from '@/types/common';

export interface Account extends BaseEntity {
    name: string;
    balance: string;
    initialBalance: string;
    description: string | null;
    sortOrder: number;
    accountType: AccountType;
    icon: Pick<Icon, 'id' | 'name' | 'url'> | null;
}

export interface CreateAccountDto {
    name: string;
    initialBalance?: number;
    description?: string;
    sortOrder?: number;
    accountTypeId: AccountType['id'];
    iconId: Icon['id'];
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {}

export interface UpdateSortOrderDto {
    ids: string[];
}

export interface AccountSearchParams extends BaseQuery {
    accountTypeIds?: string;
    sort?: string;
}

export interface AccountFormValues {
    name: string;
    initialBalance: number;
    accountTypeId: string;
    description: string | undefined;
    iconId: string;
}
