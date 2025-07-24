import { formatNumber } from '@/lib/format';
import { arrayToString } from '@/lib/utils';
import {
    Calendar,
    CalendarProps,
    Radio,
    Select,
    theme,
    Typography,
} from 'antd';
import { useResponsive } from 'antd-style';
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { AnalyticChartGroupBy } from '../../transaction/enums/transaction';
import { useTransactionChart } from '../../transaction/hooks/use-transactions';
import { TransactionAnalyticByDateSearchParams } from '../../transaction/types/transaction';
import DashboardCalendarDetail from './dashboard-calendar-detail';

dayjs.extend(dayLocaleData);

type Props = {};

function getRangeDay(value: dayjs.Dayjs) {
    return [
        dayjs(value).subtract(30, 'day').startOf('day').valueOf(),
        dayjs(value).add(30, 'day').endOf('day').valueOf(),
    ];
}

function DashboardCalendar({}: Props) {
    const responsive = useResponsive();
    const { token } = theme.useToken();
    const messages = useTranslations();

    const [selectedData, setSelectedData] = useState<{
        date: dayjs.Dayjs;
        type: string;
    }>();

    const [dataFilter, setDataFilter] =
        useState<TransactionAnalyticByDateSearchParams>({
            transactionDate: arrayToString(getRangeDay(dayjs())),
            chartGroupBy: AnalyticChartGroupBy.DAY,
        });

    const { data: chart } = useTransactionChart(dataFilter);

    const cellRender: CalendarProps<dayjs.Dayjs>['cellRender'] = (
        value,
        info
    ) => {
        if (['date', 'month'].includes(info.type)) {
            const format = info.type === 'date' ? 'DD MMM YYYY' : 'MMM YYYY';
            const data = chart?.data?.find(
                (item) => item.label === dayjs(value).format(format)
            );

            if (!data) return null;

            const options = responsive.mobile
                ? ({
                      notation: 'compact',
                      maximumFractionDigits: 0,
                  } as Intl.NumberFormatOptions)
                : undefined;

            return (
                <div className="mt-3 text-right">
                    {data.expense > 0 && (
                        <p
                            className="text-xs font-semibold lg:text-sm"
                            style={{
                                color: token.colorErrorText,
                            }}
                        >
                            {formatNumber(data.expense, options)}
                        </p>
                    )}
                    {data.income > 0 && (
                        <p
                            className="text-xs font-semibold lg:text-sm"
                            style={{
                                color: token.colorSuccessText,
                            }}
                        >
                            {formatNumber(data.income, options)}
                        </p>
                    )}
                </div>
            );
        }

        return info.originNode;
    };

    const onPanelChange: CalendarProps<dayjs.Dayjs>['onPanelChange'] = (
        date,
        mode
    ) => {
        if (mode === 'month') {
            setDataFilter({
                chartGroupBy: AnalyticChartGroupBy.DAY,
                transactionDate: arrayToString(getRangeDay(date)),
            });
        } else {
            setDataFilter({
                chartGroupBy: AnalyticChartGroupBy.MONTH,
                transactionDate: arrayToString([
                    dayjs(date).startOf('year').valueOf(),
                    dayjs(date).endOf('year').valueOf(),
                ]),
            });
        }
    };

    const headerRender: CalendarProps<dayjs.Dayjs>['headerRender'] = ({
        value,
        type,
        onChange,
        onTypeChange,
    }) => {
        const year = value.year();
        const month = value.month();

        const yearOptions = Array.from({ length: 20 }, (_, i) => {
            const label = year - 10 + i;
            return { label, value: label };
        });

        const monthOptions = value
            .localeData()
            .months()
            .map((label, index) => ({
                label,
                value: index,
            }));

        return (
            <div
                className="flex flex-col justify-between p-4 md:flex-row md:items-center"
                style={{
                    borderColor: token.colorBorder,
                }}
            >
                <Typography.Title level={5}>
                    {messages('dashboard.calendar')}
                </Typography.Title>
                <div className="flex items-center gap-2">
                    <Select
                        popupMatchSelectWidth={false}
                        value={year}
                        options={yearOptions}
                        onChange={(newYear) => {
                            const now = value.clone().year(newYear);
                            onChange(now);
                        }}
                    />
                    <Select
                        popupMatchSelectWidth={false}
                        value={month}
                        options={monthOptions}
                        onChange={(newMonth) => {
                            const now = value.clone().month(newMonth);
                            onChange(now);
                        }}
                    />
                    <Radio.Group
                        onChange={(e) => onTypeChange(e.target.value)}
                        value={type}
                    >
                        <Radio.Button value="month">
                            {messages('date.month')}
                        </Radio.Button>
                        <Radio.Button value="year">
                            {messages('date.year')}
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </div>
        );
    };

    return (
        <div
            className="rounded-lg px-2"
            style={{ backgroundColor: token.colorBgContainer }}
        >
            <Calendar
                onPanelChange={onPanelChange}
                cellRender={cellRender}
                headerRender={headerRender}
                onSelect={(date, info) => {
                    setSelectedData({
                        date,
                        type: info.source,
                    });
                }}
            />
            {selectedData && (
                <DashboardCalendarDetail
                    open
                    onCancel={() => setSelectedData(undefined)}
                    type={selectedData.type}
                    date={selectedData.date}
                />
            )}
        </div>
    );
}

export default DashboardCalendar;
