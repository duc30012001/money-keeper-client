import { cn } from '@/lib/utils';
import { Skeleton } from 'antd';

export function IconListSkeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'grid w-full grid-cols-3 gap-x-2 gap-y-5 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10',
                className
            )}
        >
            {Array.from({ length: 40 }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center justify-center space-y-2 rounded-xl px-2 py-4 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Skeleton.Avatar active size={32} />
                    <Skeleton.Button size="small" block active />
                </div>
            ))}
        </div>
    );
}
