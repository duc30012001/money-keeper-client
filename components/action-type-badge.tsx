import { ACTION_TYPE_OPTIONS } from '@/constants/common';
import { ActionType } from '@/enums/common';
import { cn } from '@/lib/utils';

interface ActionTypeBadgeProps {
    type: ActionType;
    className?: string;
}

export function ActionTypeBadge({ type, className }: ActionTypeBadgeProps) {
    const actionType = ACTION_TYPE_OPTIONS.find(
        (option) => option.value === type
    );

    if (!actionType) {
        return null;
    }

    const { label, backgroundColor, textColor } = actionType;

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                backgroundColor,
                textColor,
                className
            )}
        >
            <actionType.icon className="size-3" />
            <span>{label}</span>
        </div>
    );
}
