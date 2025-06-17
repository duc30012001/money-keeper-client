import { Skeleton } from '@/components/ui/skeleton';

export function IconListSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-x-2 gap-y-5 lg:grid-cols-5 xl:grid-cols-8">
            {Array.from({ length: 40 }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center justify-center rounded-xl px-2 py-4 hover:bg-gray-100"
                >
                    <div className="mb-2 size-10 overflow-hidden rounded-xl">
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
