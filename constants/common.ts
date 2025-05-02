import { ActionType } from '@/enums/common';
import { Minus, Plus } from 'lucide-react';

export const ACTION_TYPE_OPTIONS = [
    {
        value: ActionType.INCOME,
        label: 'Income',
        icon: Plus,
    },
    {
        value: ActionType.EXPENSE,
        label: 'Expense',
        icon: Minus,
    },
];
