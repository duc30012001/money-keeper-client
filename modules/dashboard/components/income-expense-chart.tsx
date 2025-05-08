'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { formatNumber } from '@/lib/format-number';
import { ChartResult } from '@/modules/transaction/types/transaction';

const chartConfig = {
    income: {
        label: 'Income',
        color: '#39ce4f',
    },
    expense: {
        label: 'Expenses',
        color: '#e34164',
    },
} satisfies ChartConfig;

export interface IncomeExpenseChartProps {
    data: ChartResult[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
    return (
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                    tickFormatter={(value) =>
                        formatNumber(value, {
                            notation: 'compact',
                            maximumSignificantDigits: 2,
                        })
                    }
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                    dataKey="income"
                    fill="var(--color-income)"
                    maxBarSize={50}
                />
                <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    maxBarSize={50}
                />
            </BarChart>
        </ChartContainer>
    );
}
