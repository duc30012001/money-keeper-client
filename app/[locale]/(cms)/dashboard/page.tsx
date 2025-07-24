'use client';

import AppRangePicker from '@/components/ui/date-picler/app-range-picker';
import { ARRAY_SEPARATOR } from '@/constants/common';
import { useFilter } from '@/hooks/use-filter';
import { formatNumber } from '@/lib/format';
import { arrayToString } from '@/lib/utils';
import { useTotalBalance } from '@/modules/account/hooks/use-accounts';
import { CategoryType } from '@/modules/category/enums/category';
import { useCategoryAnalytic } from '@/modules/category/hooks/use-categories';
import AccountList from '@/modules/dashboard/components/account-list';
import CategoryList from '@/modules/dashboard/components/category-list';
import DashboardCalendar from '@/modules/dashboard/components/dashboard-calendar';
import { DashboardChart } from '@/modules/dashboard/components/pie-chart';
import RecentTransaction from '@/modules/dashboard/components/recent-transactions';
import StatisticCard from '@/modules/dashboard/components/statistic-card';
import { defaultTransactionDate } from '@/modules/transaction/constants/transaction';
import {
    useAnalyticByParentCategories,
    useTransactionAnalytic,
} from '@/modules/transaction/hooks/use-transactions';
import { TransactionAnalyticSearchParams } from '@/modules/transaction/types/transaction';
import { theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { parseAsString, parseAsStringEnum } from 'nuqs';

export default function DashboardPage() {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const { filterValues, onChangeFilter } =
        useFilter<TransactionAnalyticSearchParams>({
            transactionDate: parseAsString.withDefault(
                defaultTransactionDate.join(ARRAY_SEPARATOR)
            ),
            chartGroupBy: parseAsString.withDefault('day'),
            categoryType: parseAsStringEnum(
                Object.values(CategoryType)
            ).withDefault(CategoryType.EXPENSE),
        });
    const [startTransactionDate, endTransactionDate] = filterValues
        .transactionDate!.split(',')
        .map(Number);

    const totalBalance = useTotalBalance();

    const analytic = useTransactionAnalytic({
        transactionDate: filterValues.transactionDate,
        accountIds: filterValues.accountIds,
        categoryIds: filterValues.categoryIds,
    });

    const expenseByParentCategories = useAnalyticByParentCategories({
        transactionDate: filterValues.transactionDate,
        accountIds: filterValues.accountIds,
        categoryIds: filterValues.categoryIds,
        categoryType: CategoryType.EXPENSE,
    });

    const incomeByParentCategories = useAnalyticByParentCategories({
        transactionDate: filterValues.transactionDate,
        accountIds: filterValues.accountIds,
        categoryIds: filterValues.categoryIds,
        categoryType: CategoryType.INCOME,
    });

    const categoryAnalytic = useCategoryAnalytic(
        filterValues.categoryType as CategoryType,
        {
            transactionDate: filterValues.transactionDate,
        }
    );

    return (
        <div className="space-y-4 p-2 lg:p-4">
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                <h1 className="text-xl font-bold">
                    {messages('dashboard.title')}
                </h1>
                <div>
                    <AppRangePicker
                        value={[
                            dayjs(new Date(startTransactionDate)),
                            dayjs(new Date(endTransactionDate)),
                        ]}
                        onChange={(value) =>
                            onChangeFilter({
                                transactionDate: arrayToString([
                                    value?.[0]?.startOf('day')?.valueOf(),
                                    value?.[1]?.endOf('day')?.valueOf(),
                                ]),
                            })
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatisticCard
                    title={formatNumber(totalBalance.data?.data)}
                    description={messages('account.currentBalance')}
                    icon="wallet"
                    percentage={false}
                    backgroundColor={token.colorWarningBg}
                    color={token.colorWarningText}
                    loading={totalBalance.isFetching}
                />
                <StatisticCard
                    title={formatNumber(
                        analytic?.data?.data?.current?.expenses ?? 0
                    )}
                    description={messages('transaction.type.expense')}
                    icon="banknote-arrow-down"
                    percentage={analytic?.data?.data?.change?.expenses ?? 0}
                    backgroundColor={token.colorErrorBg}
                    color={token.colorErrorText}
                    need="down"
                    loading={analytic.isFetching}
                />
                <StatisticCard
                    title={formatNumber(
                        analytic?.data?.data?.current?.income ?? 0
                    )}
                    description={messages('transaction.type.income')}
                    icon="banknote-arrow-up"
                    percentage={analytic?.data?.data?.change?.income ?? 0}
                    backgroundColor={token.colorSuccessBg}
                    color={token.colorSuccessText}
                    loading={analytic.isFetching}
                />
                <StatisticCard
                    title={formatNumber(
                        analytic?.data?.data?.current?.net ?? 0
                    )}
                    description={messages('dashboard.saving')}
                    icon="piggy-bank"
                    percentage={analytic?.data?.data?.change?.net ?? 0}
                    backgroundColor={token.colorInfoBg}
                    color={token.colorInfoText}
                    loading={analytic.isFetching}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-4 md:col-span-2 xl:col-span-1">
                    <DashboardChart
                        title={messages('dashboard.topExpenseByCategory')}
                        data={expenseByParentCategories?.data?.data ?? []}
                        loading={expenseByParentCategories.isFetching}
                    />
                    <DashboardChart
                        title={messages('dashboard.topIncomeByCategory')}
                        data={incomeByParentCategories?.data?.data ?? []}
                        loading={incomeByParentCategories.isFetching}
                    />
                </div>
                <CategoryList
                    data={categoryAnalytic.data?.data ?? []}
                    type={filterValues.categoryType as CategoryType}
                    onChange={(value) =>
                        onChangeFilter({ categoryType: value })
                    }
                    loading={categoryAnalytic.isFetching}
                />
                <AccountList />
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="overflow-hidden rounded-lg xl:col-span-8">
                    <DashboardCalendar />
                </div>
                <div className="xl:col-span-4">
                    <RecentTransaction />
                </div>
            </div>
        </div>
    );
}
