import { TransactionAnalyticSearchParams } from '@/modules/transaction/types/transaction';
import dayjs from 'dayjs';
import { parseAsString, useQueryState } from 'nuqs';

export const useTransactionAnalyticSearchParams = () => {
    const from = dayjs().startOf('month').valueOf();
    const to = dayjs().endOf('month').valueOf();

    const [transactionDate, setTransactionDate] = useQueryState(
        'transactionDate',
        parseAsString.withDefault(`${from},${to}`)
    );
    const [accountIds, setAccountIds] = useQueryState('accountIds');
    const [categoryIds, setCategoryIds] = useQueryState('categoryIds');

    const searchParams: TransactionAnalyticSearchParams = {
        transactionDate: transactionDate || undefined,
        accountIds: accountIds || undefined,
        categoryIds: categoryIds || undefined,
    };

    return {
        searchParams,
        setTransactionDate,
        setAccountIds,
        setCategoryIds,
    };
};
