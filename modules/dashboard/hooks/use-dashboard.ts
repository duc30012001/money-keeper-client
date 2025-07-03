import {
    AnalyticChartGroupBy,
    ChartType,
} from '@/modules/transaction/enums/transaction';
import { TransactionAnalyticSearchParams } from '@/modules/transaction/types/transaction';
import dayjs from 'dayjs';
import { parseAsString, useQueryState } from 'nuqs';

export const useTransactionAnalyticSearchParams = () => {
    const from = dayjs().startOf('month').valueOf();
    const to = dayjs().endOf('month').valueOf();

    const convertValue = (value: any) => {
        if (Array.isArray(value)) {
            return value.join(',');
        }
        return value;
    };

    const [transactionDate, setTransactionDate] = useQueryState(
        'transactionDate',
        parseAsString.withDefault(`${from},${to}`)
    );
    const [accountIds, setAccountIds] = useQueryState('accountIds');
    const [categoryIds, setCategoryIds] = useQueryState('categoryIds');
    const [chartGroupBy, setChartGroupBy] = useQueryState<AnalyticChartGroupBy>(
        'chartGroupBy',
        parseAsString.withDefault(AnalyticChartGroupBy.MONTH) as any
    );
    const [chartType, setChartType] = useQueryState<ChartType>(
        'chartType',
        parseAsString.withDefault(ChartType.BAR) as any
    );

    const searchParams: TransactionAnalyticSearchParams = {
        transactionDate: transactionDate && convertValue(transactionDate),
        accountIds: accountIds && convertValue(accountIds),
        categoryIds: categoryIds && convertValue(categoryIds),
        chartGroupBy: chartGroupBy,
    };

    return {
        searchParams,
        chartType,
        setTransactionDate,
        setAccountIds,
        setCategoryIds,
        setChartGroupBy,
        setChartType,
    };
};
