import { ActionType } from '@/enums/common';
import { CircleMinus, CirclePlus } from 'lucide-react';

export const ACTION_TYPE_OPTIONS = [
    {
        value: ActionType.INCOME,
        label: 'Income',
        backgroundColor: 'bg-green-100 dark:bg-green-900',
        textColor: 'text-green-600 dark:text-green-200',
        icon: CirclePlus,
    },
    {
        value: ActionType.EXPENSE,
        label: 'Expense',
        backgroundColor: 'bg-red-100 dark:bg-red-900',
        textColor: 'text-red-600 dark:text-red-200',
        icon: CircleMinus,
    },
];
