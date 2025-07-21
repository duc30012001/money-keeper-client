import { cn } from '@/lib/utils';
import { Avatar, theme } from 'antd';
import { ReactNode } from 'react';

interface IconLabelProps {
    url?: string;
    title: ReactNode;
    description?: ReactNode;
    className?: string;
    avatarClassName?: string;
    titleClassName?: string;
    descriptionClassname?: string;
    styles?: {
        root?: React.CSSProperties;
        title?: React.CSSProperties;
        description?: React.CSSProperties;
    };
}

export function IconLabel({
    url,
    title,
    description,
    className,
    avatarClassName,
    titleClassName,
    descriptionClassname,
    styles,
}: IconLabelProps) {
    const { token } = theme.useToken();
    return (
        <div
            className={cn('flex items-center gap-3', className)}
            style={styles?.root}
        >
            <Avatar
                className={cn('flex-none rounded-none', avatarClassName)}
                src={url}
                alt={''}
                size={24}
                shape="square"
            />
            <div className="flex-1 truncate">
                <div
                    className={cn(
                        'w-full truncate',
                        {
                            'font-semibold': Boolean(description),
                        },
                        titleClassName
                    )}
                    style={styles?.title}
                >
                    {title}
                </div>
                <div
                    style={{
                        color: token.colorTextTertiary,
                        ...styles?.description,
                    }}
                    className={descriptionClassname}
                >
                    {description}
                </div>
            </div>
        </div>
    );
}
