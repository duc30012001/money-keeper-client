import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function IconListSkeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'grid grid-cols-3 gap-x-2 gap-y-5 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10',
                className
            )}
        >
            {Array.from({ length: 40 }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center justify-center rounded-xl px-2 py-4 hover:bg-gray-100"
                >
                    <div className="mb-2 size-8 overflow-hidden rounded-xl">
                        <Skeleton className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="w-full">
                        <Skeleton className="mx-auto h-4 w-28" />
                    </div>
                </div>
            ))}
        </div>
    );
}
