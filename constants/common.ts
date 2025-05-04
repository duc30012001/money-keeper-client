import { CategoryType } from '@/modules/category/enums/category';
import { TransactionType } from '@/modules/transaction/enums/transaction';
import { ArrowRightLeft, Minus, Plus } from 'lucide-react';

export const CATEGORY_TYPE_OPTIONS = [
    {
        value: CategoryType.INCOME,
        label: 'Income',
        icon: Plus,
    },
    {
        value: CategoryType.EXPENSE,
        label: 'Expense',
        icon: Minus,
    },
];

export const TRANSACTION_TYPE_OPTIONS = [
    {
        value: TransactionType.INCOME,
        label: 'Income',
        icon: Plus,
    },
    {
        value: TransactionType.EXPENSE,
        label: 'Expense',
        icon: Minus,
    },
    {
        value: TransactionType.TRANSFER,
        label: 'Transfer',
        icon: ArrowRightLeft,
    },
];
