import { ACTION_TYPE_OPTIONS } from '@/constants/common';
import { ActionType } from '@/enums/common';
import { cn } from '@/lib/utils';
import { CircleMinus, CirclePlus } from 'lucide-react';

interface ActionTypeBadgeProps {
    type: ActionType;
    className?: string;
}

export function ActionTypeBadge({ type, className }: ActionTypeBadgeProps) {
    const isIncome = type === ActionType.INCOME;
    const Icon = isIncome ? CirclePlus : CircleMinus;
    const label = ACTION_TYPE_OPTIONS.find(
        (option) => option.value === type
    )?.label;

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                isIncome
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200',
                className
            )}
        >
            <Icon className="size-3" />
            <span>{label}</span>
        </div>
    );
}
