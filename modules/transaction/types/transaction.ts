import { SortOrder } from '@/enums/common';
import { Account } from '@/modules/account/types/account';
import { CategoryType } from '@/modules/category/enums/category';
import { Category } from '@/modules/category/types/category';
import { BaseEntity, BaseQuery } from '@/types/common';
import dayjs from 'dayjs';
import {
    AnalyticChartGroupBy,
    TransactionOrderBy,
    TransactionType,
} from '../enums/transaction';

export interface Transaction extends BaseEntity {
    type: TransactionType;
    senderAccount: Account | null;
    receiverAccount: Account | null;
    account: Account | null;
    category: Category | null;
    amount: number;
    description: string | null;
    transactionDate: Date;
}

interface BaseTransactionDto {
    amount: number;
    description?: string;
    transactionDate?: Date;
}

export interface CreateTransferTransactionDto extends BaseTransactionDto {
    type: TransactionType.TRANSFER;
    senderAccountId: Account['id'];
    receiverAccountId: Account['id'];
}

export interface CreateNonTransferTransactionDto extends BaseTransactionDto {
    type: Exclude<TransactionType, TransactionType.TRANSFER>;
    accountId: Account['id'];
    categoryId: Category['id'];
}

export type CreateTransactionDto =
    | CreateTransferTransactionDto
    | CreateNonTransferTransactionDto;

export type UpdateTransactionDto = Partial<CreateTransactionDto>;

export interface TransactionSearchParams extends BaseQuery {
    accountIds?: string;
    categoryIds?: string;
    // senderAccountIds?: string;
    // receiverAccountIds?: string;
    transactionDate?: string;
    amount?: string;
    type?: string;
    // sort?: string;
    order?: SortOrder;
    orderBy?: TransactionOrderBy;
}

export interface TransactionPeriodResult {
    income: number;
    expenses: number;
    net: number;
}

export interface TransactionAnalyticResult {
    current: TransactionPeriodResult;
    previous: TransactionPeriodResult;
    change: {
        income: number | null;
        expenses: number | null;
        net: number | null;
    };
}

export interface TransactionAnalyticSearchParams {
    transactionDate?: string;
    accountIds?: string;
    categoryIds?: string;
    categoryType?: CategoryType;
}

export interface TransactionAnalyticByDateSearchParams {
    transactionDate?: string;
    accountIds?: string;
    categoryIds?: string;
    chartGroupBy?: AnalyticChartGroupBy;
    categoryType?: CategoryType;
}

export interface TransactionAnalyticParentCategorySearchParams {
    transactionDate?: string;
    accountIds?: string;
    categoryIds?: string;
    categoryType: CategoryType;
}

export interface ChartResult {
    label: string;
    income: number;
    expense: number;
}

export interface AnalyticByParentCategoryResult {
    label: string;
    value: number;
}

export interface TransactionFormValues {
    transactionDate: dayjs.Dayjs;
    type: TransactionType;
    amount: number;
    description: string | undefined;
    accountId?: string;
    categoryId?: string;
    senderAccountId?: string;
    receiverAccountId?: string;
}
