'use client';

import {
    CartesianGrid,
    Line,
    LineChart,
    TooltipProps,
    XAxis,
    YAxis,
} from 'recharts';

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartTooltip,
} from '@/components/ui/chart';
import { formatNumber } from '@/lib/format-number';
import { ChartResult } from '@/modules/transaction/types/transaction';
import { Props as LegendProps } from 'recharts/types/component/Legend';

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

export interface IncomeExpenseLineChartProps {
    data: ChartResult[];
}

export function IncomeExpenseLineChart({ data }: IncomeExpenseLineChartProps) {
    const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-md border bg-white p-3 shadow">
                    <p className="text-sm font-semibold">
                        {payload[0].payload.label}
                    </p>
                    {payload.map((item, index) => {
                        const { name, value, fill } = item;
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-1"
                            >
                                <div
                                    style={{ backgroundColor: fill }}
                                    className="mt-0.5 size-3 rounded"
                                />
                                <p className="text-sm capitalize text-gray-500">
                                    {name}
                                </p>
                                <p className="ml-3 flex-1 text-right text-sm font-semibold">
                                    {formatNumber(value)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }: LegendProps) => {
        return (
            <div className="mx-auto flex w-fit items-center gap-10">
                {payload?.map((entry, index) => (
                    <div
                        key={`legend-${index}`}
                        className="flex items-center gap-1.5"
                    >
                        <div
                            className="mt-0.5 size-3 rounded"
                            style={{ backgroundColor: entry.color }}
                        />
                        <p className="text-sm capitalize">{entry.value}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
            <LineChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    // tickFormatter={(value) => value.split(0, 3)}
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
                <ChartTooltip content={<CustomTooltip />} />
                <ChartLegend content={<CustomLegend />} />
                <Line
                    dot={false}
                    type="monotone"
                    dataKey="income"
                    stroke="var(--color-income)"
                />
                <Line
                    dot={false}
                    type="monotone"
                    dataKey="expense"
                    stroke="var(--color-expense)"
                />
            </LineChart>
        </ChartContainer>
    );
}
