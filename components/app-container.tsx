import { cn } from '@/lib/utils';
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
    return (
        <div className={cn('', className)}>
            <div
                className={cn('mb-4 flex items-center justify-between gap-2', {
                    'mb-0': !title,
                })}
            >
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                <div>{extra?.map((item) => item)}</div>
            </div>
            <div className="flex gap-3">
                <div
                    className={cn(
                        'flex-1 rounded-2xl border-0 bg-white',
                        contentClassName
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AppContainer;
