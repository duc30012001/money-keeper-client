import { cn } from '@/lib/utils';
import { theme } from 'antd';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    title?: ReactNode;
    className?: string;
    contentClassName?: string;
    extra?: ReactNode[];
};

function AppContainer({
    children,
    title,
    className,
    contentClassName,
    extra,
}: Props) {
    const { token } = theme.useToken();
    return (
        <div className={cn('flex h-full flex-col p-2 lg:p-4', className)}>
            <div
                className={cn('mb-4 flex items-center justify-between gap-2', {
                    'mb-0': !title,
                })}
            >
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                <div>{extra?.map((item) => item)}</div>
            </div>
            <div
                className={cn('rounded-2xl border-0', contentClassName)}
                style={{
                    backgroundColor: token.colorBgContainer,
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default AppContainer;
