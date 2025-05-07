import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    Tooltip as UI_Tooltip,
} from '@/components/ui/tooltip';
import { PIE_CHART_COLORS } from '@/constants/color';
import { formatNumber } from '@/lib/format-number';
import { ChartNoAxesColumn, ChartPie, List } from 'lucide-react';
import { useMemo } from 'react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
} from 'recharts';

export type DashboardChartProps = {
    data: { name: string; value: number }[];
    title: string;
};

const toggleGroupItems = [
    {
        value: 'list',
        icon: List,
        label: 'List',
    },
    {
        value: 'bar',
        icon: ChartNoAxesColumn,
        label: 'Bar Chart',
    },
    {
        value: 'pie',
        icon: ChartPie,
        label: 'Pie Chart',
    },
];

export function DashboardChart({ data, title }: DashboardChartProps) {
    const total = useMemo(
        () => data.reduce((acc, curr) => acc + curr.value, 0),
        [data]
    );

    const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0];
            return (
                <div className="flex gap-3 rounded-md bg-white p-3 shadow-lg">
                    <p className="text-sm">{name}</p>
                    <p className="text-sm font-semibold">
                        {formatNumber(value)} (
                        {((value / total) * 100).toFixed(2)}
                        %)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    {title}
                    <TooltipProvider>
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
                    </TooltipProvider>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={'100%'}
                            innerRadius={'65%'}
                            // fill="#8884d8"
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
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
