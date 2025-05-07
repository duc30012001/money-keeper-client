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

const chartData = [
    { month: 'January', income: 186000, expenses: 80000 },
    { month: 'February', income: 305000, expenses: 200000 },
    { month: 'March', income: 237000, expenses: 120000 },
    { month: 'April', income: 73000, expenses: 190000 },
    { month: 'May', income: 209000, expenses: 130000 },
    { month: 'June', income: 214000, expenses: 140000 },
    { month: 'July', income: 214000, expenses: 140000 },
    { month: 'August', income: 214000, expenses: 140000 },
    { month: 'September', income: 214000, expenses: 140000 },
    { month: 'October', income: 214000, expenses: 140000 },
    { month: 'November', income: 214000, expenses: 140000 },
    { month: 'December', income: 214000, expenses: 140000 },
];

const chartConfig = {
    income: {
        label: 'Income',
        color: '#39ce4f',
    },
    expenses: {
        label: 'Expenses',
        color: '#e34164',
    },
} satisfies ChartConfig;

export function IncomeExpenseChart() {
    return (
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                    tickFormatter={(value) => formatNumber(value)}
                    tickLine={false}
                    tickMargin={10}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="income" fill="var(--color-income)" />
                <Bar dataKey="expenses" fill="var(--color-expenses)" />
            </BarChart>
        </ChartContainer>
    );
}
