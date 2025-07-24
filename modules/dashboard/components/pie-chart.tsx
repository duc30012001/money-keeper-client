import { Skeleton } from '@/components/ui/skeleton';
import { PIE_CHART_COLORS } from '@/constants/color';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { calculatePercent, formatNumber } from '@/lib/format';
import { hexToRGB } from '@/lib/utils';
import { Card, Empty, theme } from 'antd';
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
import { ContentType } from 'recharts/types/component/DefaultLegendContent';

export type DashboardChartProps = {
    data: { label: string; value: number }[];
    title: string;
    loading?: boolean;
};

export function DashboardChart({ data, title, loading }: DashboardChartProps) {
    const { token } = theme.useToken();
    const { isDark } = useThemeMode();

    const ALPHA = isDark ? 0.9 : 1;

    const total = useMemo(
        () => data.reduce((acc, curr) => acc + curr.value, 0),
        [data]
    );

    const CustomTooltip: TooltipProps<any, any>['content'] = ({
        active,
        payload,
    }) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0];
            const color = payload[0].payload.fill;
            return (
                <div
                    className="flex items-center gap-1 rounded-md border p-3 shadow"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        borderColor: token.colorBorder,
                    }}
                >
                    <div
                        style={{ backgroundColor: color }}
                        className="mt-0.5 size-2.5 rounded-full dark:brightness-90"
                    />
                    <p className="text-sm">{name}</p>
                    <p className="ml-3 text-sm font-semibold">
                        {formatNumber(value)} ({calculatePercent(value, total)}
                        %)
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend: ContentType = ({ payload }) => {
        return (
            <div className="ml-2 flex w-40 flex-col gap-1 md:w-48">
                {payload?.map((entry, index) => {
                    return (
                        <div
                            key={`legend-${index}`}
                            className="flex items-center gap-2"
                        >
                            <div
                                className="mt-0.5 size-3 flex-none rounded dark:brightness-90"
                                style={{ backgroundColor: entry.color }}
                            />
                            <p className="flex-1 truncate">{entry.value}</p>
                            <p className="font-semibold">
                                {calculatePercent(entry.payload?.value, total)}%
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <Card title={title}>
                <div className="flex h-40 items-center justify-center">
                    <div className="px-5">
                        <Skeleton className="size-36 rounded-full" />
                    </div>
                    <div className="flex w-48 flex-col gap-2">
                        {Array.from({ length: 6 }).map((item, index) => (
                            <div
                                key={`legend-${index}`}
                                className="flex items-center gap-2"
                            >
                                <Skeleton className="mt-0.5 size-3 flex-none rounded dark:brightness-90" />
                                <p className="flex-1 truncate">
                                    <Skeleton className="h-3 w-full" />
                                </p>
                                <p className="font-semibold">
                                    <Skeleton className="h-3 w-10" />
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card title={title}>
                <div className="h-40">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            </Card>
        );
    }

    return (
        <Card title={title}>
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            outerRadius={'100%'}
                            innerRadius={'55%'}
                            begin={0}
                            startAngle={90}
                            endAngle={450}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={hexToRGB(
                                        PIE_CHART_COLORS[
                                            index % PIE_CHART_COLORS.length
                                        ],
                                        ALPHA
                                    )}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            // @ts-ignore
                            content={<CustomTooltip />}
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            content={<CustomLegend />}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
