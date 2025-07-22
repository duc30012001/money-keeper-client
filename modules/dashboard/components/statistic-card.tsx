import { Skeleton } from '@/components/ui/skeleton';
import { theme, Tooltip } from 'antd';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

type Props = {
    icon: keyof typeof dynamicIconImports;
    title: ReactNode;
    description: ReactNode;
    percentage?: number | boolean;
    need?: 'up' | 'down';
    color: string;
    backgroundColor: string;
    loading?: boolean;
};

function StatisticCard({
    icon,
    title,
    description,
    percentage,
    need = 'up',
    color,
    backgroundColor,
    loading,
}: Props) {
    const { token } = theme.useToken();
    const messages = useTranslations();

    const getColor = (value: number) => {
        if (value < 0) {
            return need === 'down'
                ? token.colorSuccessText
                : token.colorErrorText;
        }

        if (value > 0) {
            return need === 'down'
                ? token.colorErrorText
                : token.colorSuccessText;
        }

        return token.colorText;
    };

    const percentageColorText = getColor(Number(percentage));

    if (loading) {
        return (
            <div
                className="flex items-center gap-3 rounded-lg p-4"
                style={{
                    backgroundColor: token.colorBgContainer,
                }}
            >
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-5" />
                    <Skeleton className="h-4 w-14" />
                </div>
                {typeof percentage === 'number' && (
                    <Skeleton className="h-5 w-14" />
                )}
            </div>
        );
    }

    return (
        <div
            className="flex items-center gap-3 rounded-lg p-4"
            style={{
                backgroundColor: token.colorBgContainer,
            }}
        >
            <div
                style={{ backgroundColor }}
                className="flex size-12 flex-none items-center justify-center rounded-full"
            >
                <DynamicIcon name={icon} color={color} className="!size-6" />
            </div>
            <div className="flex-1">
                <h2 className="text-lg font-bold">{title}</h2>
                <p
                    style={{
                        color: token.colorTextSecondary,
                    }}
                >
                    {description}
                </p>
            </div>
            {typeof percentage === 'number' && (
                <Tooltip title={messages('dashboard.fromPreviousPeriod')}>
                    <div
                        className="flex items-center gap-1 text-base"
                        style={{
                            color: percentageColorText,
                        }}
                    >
                        <p>
                            {percentage > 0 && <ArrowUp />}
                            {percentage < 0 && <ArrowDown />}
                        </p>
                        <p className="font-semibold">{Math.abs(percentage)}%</p>
                    </div>
                </Tooltip>
            )}
        </div>
    );
}

export default StatisticCard;
