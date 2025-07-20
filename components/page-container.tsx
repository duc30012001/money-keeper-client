import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function PageContainer({
    children,
    scrollable = true,
}: {
    children: React.ReactNode;
    scrollable?: boolean;
}) {
    return (
        <>
            {scrollable ? (
                <ScrollArea className="h-[calc(100dvh-60px)]">
                    <div className="flex flex-1 p-4">{children}</div>
                </ScrollArea>
            ) : (
                <div className="flex flex-1 p-4">{children}</div>
            )}
        </>
    );
}
