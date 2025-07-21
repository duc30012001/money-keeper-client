import { cn } from '@/lib/utils';
import { Avatar } from 'antd';
import { ReactNode } from 'react';

interface IconLabelProps {
    url?: string;
    name: ReactNode;
    description?: ReactNode;
    className?: string;
    avatarClassName?: string;
    style?: React.CSSProperties;
}

export function IconLabel({
    url,
    name,
    description,
    className,
    avatarClassName,
    style,
}: IconLabelProps) {
    return (
        <div className={cn('flex items-center gap-2', className)} style={style}>
            <Avatar
                className={cn('rounded-none', avatarClassName)}
                src={url}
                alt={''}
                size={24}
                shape="square"
            />
            <div>
                <div className="text-sm">{name}</div>
                <div className="text-sm">{description}</div>
            </div>
        </div>
    );
}
