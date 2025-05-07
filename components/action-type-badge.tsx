import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { TRANSACTION_TYPE_OPTIONS } from '@/constants/common';
import { cn } from '@/lib/utils';
import { CategoryType } from '@/modules/category/enums/category';
import { TransactionType } from '@/modules/transaction/enums/transaction';

interface ActionTypeBadgeProps {
    type: CategoryType | TransactionType;
    className?: string;
}

export function ActionTypeBadge({ type, className }: ActionTypeBadgeProps) {
    const typeData = TRANSACTION_TYPE_OPTIONS.find(
        (option) => option.value === type
    );

    if (!typeData) {
        return null;
    }

    const { label } = typeData;

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
                {
                    'bg-green-50 text-green-500':
                        type === TransactionType.INCOME,
                    'bg-red-50 text-red-500': type === TransactionType.EXPENSE,
                    'bg-blue-50 text-blue-500':
                        type === TransactionType.TRANSFER,
                },
                className
            )}
        >
            <typeData.icon className="size-3" />
            <span>{label}</span>
        </div>
    );
}

interface MoneyBadgeProps {
    amount: number | string;
    type: TransactionType;
    className?: string;
}

export function MoneyBadge({ amount, type, className }: MoneyBadgeProps) {
    const typeData = TRANSACTION_TYPE_OPTIONS.find(
        (option) => option.value === type
    );

    if (!typeData) {
        return null;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className={cn(
                        'w-fit cursor-pointer rounded-md px-2 py-1 font-medium',
                        {
                            'text-green-500 hover:bg-green-50':
                                type === TransactionType.INCOME,
                            'text-red-500 hover:bg-red-50':
                                type === TransactionType.EXPENSE,
                            'text-blue-500 hover:bg-blue-50':
                                type === TransactionType.TRANSFER,
                        },
                        className
                    )}
                >
                    <span>{amount}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
                <p>{typeData.label}</p>
            </TooltipContent>
        </Tooltip>
    );
}
