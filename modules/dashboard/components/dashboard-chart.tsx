import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PIE_CHART_COLORS } from '@/constants/color';
import { formatNumber } from '@/lib/format-number';
import { useMemo } from 'react';
import {
    Cell,
    Legend,
    LegendProps,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
} from 'recharts';

export type DashboardChartProps = {
    data: { label: string; value: number }[];
    title: string;
};

// const toggleGroupItems = [
//     {
//         value: 'list',
//         icon: List,
//         label: 'List',
//     },
//     {
//         value: 'bar',
//         icon: ChartNoAxesColumn,
//         label: 'Bar Chart',
//     },
//     {
//         value: 'pie',
//         icon: ChartPie,
//         label: 'Pie Chart',
//     },
// ];

export function DashboardChart({ data, title }: DashboardChartProps) {
    const total = useMemo(
        () => data.reduce((acc, curr) => acc + curr.value, 0),
        [data]
    );

    const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0];
            const color = payload[0].payload.fill;
            return (
                <div className="flex items-center gap-1 rounded-md border bg-white p-3 shadow">
                    <div
                        style={{ backgroundColor: color }}
                        className="mt-0.5 size-2.5 rounded-full"
                    />
                    <p className="text-sm text-gray-500">{name}</p>
                    <p className="ml-3 text-sm font-semibold">
                        {formatNumber(value)} (
                        {((value / total) * 100).toFixed(2)}
                        %)
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }: LegendProps) => {
        return (
            <div className="flex flex-col gap-2">
                {payload?.map((entry, index) => {
                    const percent = // @ts-ignore
                        (entry.payload?.percent * 100 || 0)?.toFixed(2);
                    return (
                        <div
                            key={`legend-${index}`}
                            className="flex items-center gap-2"
                        >
                            <div
                                className="size-3 rounded"
                                style={{ backgroundColor: entry.color }}
                            />
                            <p>
                                {entry.value} (
                                <span className="font-semibold">
                                    {percent}%
                                </span>
                                )
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    {title}
                    {/* <TooltipProvider>
                        <ToggleGroup type="single">
                            {toggleGroupItems.map((item) => (
                                <UI_Tooltip key={item.value}>
                                    <TooltipTrigger>
                                        <ToggleGroupItem value={item.value}>
                                            <item.icon />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{item.label}</p>
                                    </TooltipContent>
                                </UI_Tooltip>
                            ))}
                        </ToggleGroup>
                    </TooltipProvider> */}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            outerRadius={'100%'}
                            innerRadius={'65%'}
                            begin={0}
                            startAngle={90}
                            endAngle={450}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        PIE_CHART_COLORS[
                                            index % PIE_CHART_COLORS.length
                                        ]
                                    }
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            content={<CustomLegend />}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
