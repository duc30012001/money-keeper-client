import { cn } from '@/lib/utils';
import { Avatar, AvatarProps, theme, Tooltip } from 'antd';
import { ReactNode } from 'react';

interface IconLabelProps {
    url?: string;
    title: ReactNode;
    description?: ReactNode;
    className?: string;
    titleClassName?: string;
    descriptionClassname?: string;
    styles?: {
        root?: React.CSSProperties;
        title?: React.CSSProperties;
        description?: React.CSSProperties;
    };
    iconProps?: AvatarProps;
}

export function IconLabel({
    url,
    title,
    description,
    className,
    titleClassName,
    descriptionClassname,
    styles,
    iconProps,
}: IconLabelProps) {
    const { token } = theme.useToken();
    return (
        <div
            className={cn('flex items-center gap-3', className)}
            style={styles?.root}
        >
            <Avatar
                src={url}
                alt={''}
                size={20}
                shape="square"
                {...iconProps}
                className={cn('flex-none rounded-none', iconProps?.className)}
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
                    <Tooltip
                        title={typeof title === 'string' ? title : ''}
                        trigger={['hover']}
                    >
                        {title}
                    </Tooltip>
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
