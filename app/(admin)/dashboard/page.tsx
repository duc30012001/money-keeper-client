'use client';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import PageContainer from '@/components/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Heading } from '@/components/ui/heading';
import { useTotalBalance } from '@/modules/account/hooks/use-accounts';
import { CategoryAnalyticTable } from '@/modules/category/components/category-analytic-table';
import { columns } from '@/modules/category/components/category-analytic-table-columns';
import { CategoryType } from '@/modules/category/enums/category';
import { useCategoryAnalytic } from '@/modules/category/hooks/use-categories';
import { DashboardChart } from '@/modules/dashboard/components/dashboard-chart';
import { IncomeExpenseChart } from '@/modules/dashboard/components/income-expense-chart';
import { StatisticCard } from '@/modules/dashboard/components/statistic-card';
import { useTransactionAnalyticSearchParams } from '@/modules/dashboard/hooks/use-dashboard';
import {
    useExpenseByParentCategories,
    useIncomeByParentCategories,
    useTransactionAnalytic,
    useTransactionChart,
} from '@/modules/transaction/hooks/use-transactions';
import { DateRange } from 'react-day-picker';

export default function DashboardPage() {
    const { searchParams, setTransactionDate } =
        useTransactionAnalyticSearchParams();
    const [from, to] = searchParams.transactionDate!.split(',').map(Number);

    const { data: totalBalance, isFetching: isFetchingTotalBalance } =
        useTotalBalance();
    const { data: analytic, isFetching: isFetchingAnalytic } =
        useTransactionAnalytic(searchParams);

    const { data: chart } = useTransactionChart(searchParams);

    const { data: expenseByParentCategories } =
        useExpenseByParentCategories(searchParams);
    const { data: incomeByParentCategories } =
        useIncomeByParentCategories(searchParams);

    const {
        data: expenseByCategories,
        isPending: isPendingExpenseByCategories,
    } = useCategoryAnalytic(CategoryType.EXPENSE, {
        transactionDate: searchParams.transactionDate,
    });
    const { data: incomeByCategories, isPending: isPendingIncomeByCategories } =
        useCategoryAnalytic(CategoryType.INCOME, {
            transactionDate: searchParams.transactionDate,
        });

    const onDateSelect = (date: Date | DateRange | undefined) => {
        if (!date) {
            setTransactionDate(null);
            return;
        }

        if (!('getTime' in date)) {
            const from = date.from?.getTime();
            const to = date.to?.getTime();
            setTransactionDate(from || to ? [from, to].join(',') : null);
        }
    };

    return (
        <PageContainer>
            <div className="flex flex-1 flex-col space-y-10">
                <div className="sticky top-0 z-10 flex flex-col items-start justify-between border-b bg-white py-3 md:flex-row">
                    <Heading title="Dashboard" />
                    <div className="flex items-center gap-2">
                        <DateRangePicker
                            onUpdate={({ range }) => onDateSelect(range)}
                            initialDateFrom={new Date(from)}
                            initialDateTo={new Date(to)}
                            align="start"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <StatisticCard
                        isLoading={isFetchingTotalBalance}
                        title="💼 Total Balance"
                        value={totalBalance?.data ?? 0}
                    />

                    <StatisticCard
                        isLoading={isFetchingAnalytic}
                        title={'💰 Total Income'}
                        value={analytic?.data?.current?.income ?? 0}
                        percentage={analytic?.data?.change?.income ?? 0}
                    />
                    <StatisticCard
                        isLoading={isFetchingAnalytic}
                        title="📊 Net Savings"
                        value={analytic?.data?.current?.net ?? 0}
                        percentage={analytic?.data?.change?.net ?? 0}
                    />
                    <StatisticCard
                        isLoading={isFetchingAnalytic}
                        title="💸 Total Expenses"
                        value={analytic?.data?.current?.expenses ?? 0}
                        percentage={analytic?.data?.change?.expenses ?? 0}
                    />
                </div>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle>Expenses vs Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <IncomeExpenseChart data={chart?.data ?? []} />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <DashboardChart
                        title="Expense Categories"
                        data={expenseByParentCategories?.data ?? []}
                    />
                    <DashboardChart
                        title="Income Categories"
                        data={incomeByParentCategories?.data ?? []}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        {isPendingExpenseByCategories ? (
                            <DataTableSkeleton
                                columnCount={2}
                                filterCount={0}
                                cellWidths={['200px', '100px']}
                            />
                        ) : (
                            <CategoryAnalyticTable
                                title="Expense Categories"
                                data={expenseByCategories?.data ?? []}
                                columns={columns}
                                totalItems={
                                    expenseByCategories?.meta?.total ?? 0
                                }
                                pageSize={
                                    expenseByCategories?.meta?.pageSize ?? 0
                                }
                            />
                        )}
                    </div>
                    <div>
                        {isPendingIncomeByCategories ? (
                            <DataTableSkeleton
                                columnCount={2}
                                filterCount={0}
                                cellWidths={['200px', '100px']}
                            />
                        ) : (
                            <CategoryAnalyticTable
                                title="Income Categories"
                                data={incomeByCategories?.data ?? []}
                                columns={columns}
                                totalItems={
                                    incomeByCategories?.meta?.total ?? 0
                                }
                                pageSize={
                                    incomeByCategories?.meta?.pageSize ?? 0
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
