import { cn } from '@/lib/utils';
import { Avatar } from 'antd';

interface IconLabelProps {
    url?: string;
    name: string;
    className?: string;
    avatarClassName?: string;
    style?: React.CSSProperties;
}

export function IconLabel({
    url,
    name,
    className,
    avatarClassName,
    style,
}: IconLabelProps) {
    return (
        <div
            title={name}
            className={cn('flex items-center gap-2', className)}
            style={style}
        >
            <Avatar
                className={cn('rounded-none', avatarClassName)}
                src={url}
                alt={name}
                size={24}
                shape="square"
            />
            <p className="text-sm">{name}</p>
        </div>
    );
}
