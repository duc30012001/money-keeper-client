import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function IconListSkeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'flex flex-wrap items-center justify-start gap-2',
                className
            )}
        >
            {Array.from({ length: 50 }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        'flex-none cursor-pointer rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 lg:p-4',
                        className
                    )}
                >
                    <div className="h-8 w-auto overflow-hidden rounded-lg">
                        <Skeleton className="size-8 rounded-full bg-gray-200 object-cover object-center dark:bg-zinc-900" />
                    </div>
                </div>
            ))}
        </div>
    );
}
