import { Account } from '@/modules/account/types/account';
import { Category } from '@/modules/category/types/category';
import { BaseEntity, BaseQuery } from '@/types/common';
import { AnalyticChartGroupBy, TransactionType } from '../enums/transaction';

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
    senderAccountIds?: string;
    receiverAccountIds?: string;
    transactionDate?: string;
    amount?: string;
    type?: string;
    sort?: string;
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
    chartGroupBy?: AnalyticChartGroupBy;
}

export interface ChartResult {
    label: string;
    income: number;
    expense: number;
}

export interface ExpenseByParentCategoryResult {
    label: string;
    value: number;
}

export interface IncomeByParentCategoryResult {
    label: string;
    value: number;
}
