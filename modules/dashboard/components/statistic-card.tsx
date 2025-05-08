import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/format-number';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { ReactNode } from 'react';

export type StatisticCardProps = {
    title: ReactNode;
    value: number;
    percentage?: number;
};

export function StatisticCard({
    title,
    value,
    percentage,
}: StatisticCardProps) {
    return (
        <Card className="shadow-none">
            <CardHeader className="pb-3">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-semibold">
                        {formatNumber(value)}
                    </h2>
                    {percentage !== undefined && percentage !== null && (
                        <p className="flex flex-col items-end">
                            <span
                                className={cn(
                                    'flex items-center gap-1 font-semibold',
                                    {
                                        'text-green-500': percentage > 0,
                                        'text-red-500': percentage < 0,
                                    }
                                )}
                            >
                                {percentage > 0 && (
                                    <ArrowUp className="size-4" />
                                )}
                                {percentage < 0 && (
                                    <ArrowDown className="size-4" />
                                )}
                                {Math.abs(percentage)}%
                            </span>
                            <span className="text-gray-500">
                                from previous period
                            </span>
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
