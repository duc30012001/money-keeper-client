import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/format-number';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

export type StatisticCardProps = {
    title: string;
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
            <CardContent className="space-y-2">
                <h2 className="text-3xl font-semibold">
                    {formatNumber(value)}
                </h2>
                {!!percentage && (
                    <p className="flex items-center gap-1">
                        <span
                            className={cn('flex items-center gap-1', {
                                'text-green-500': percentage > 0,
                                'text-red-500': percentage < 0,
                            })}
                        >
                            {percentage > 0 && <ArrowUp className="size-4" />}
                            {percentage < 0 && <ArrowDown className="size-4" />}
                            {Math.abs(percentage)}%
                        </span>
                        <span className="text-gray-400">
                            compared to previous period
                        </span>
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
