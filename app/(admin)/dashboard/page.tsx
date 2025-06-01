'use client';

import PageContainer from '@/components/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { useTotalBalance } from '@/modules/account/hooks/use-accounts';
import { DashboardChart } from '@/modules/dashboard/components/dashboard-chart';
import { DashboardFilter } from '@/modules/dashboard/components/dashboard-filter';
import { IncomeExpenseChart } from '@/modules/dashboard/components/income-expense-chart';
import { StatisticCard } from '@/modules/dashboard/components/statistic-card';
import { useTransactionAnalyticSearchParams } from '@/modules/dashboard/hooks/use-dashboard';
import {
    useExpenseByParentCategories,
    useIncomeByParentCategories,
    useTransactionAnalytic,
    useTransactionChart,
} from '@/modules/transaction/hooks/use-transactions';

export default function DashboardPage() {
    const { searchParams } = useTransactionAnalyticSearchParams();
    // const [from, to] = searchParams.transactionDate!.split(',').map(Number);

    const { data: totalBalance, isFetching: isFetchingTotalBalance } =
        useTotalBalance();
    const { data: analytic, isFetching: isFetchingAnalytic } =
        useTransactionAnalytic(searchParams);
    const { data: chart } = useTransactionChart(searchParams);
    const { data: expenseByParentCategories } =
        useExpenseByParentCategories(searchParams);
    const { data: incomeByParentCategories } =
        useIncomeByParentCategories(searchParams);

    // const onDateSelect = (date: Date | DateRange | undefined) => {
    //     if (!date) {
    //         setTransactionDate(null);
    //         return;
    //     }

    //     if (!('getTime' in date)) {
    //         const from = date.from?.getTime();
    //         const to = date.to?.getTime();
    //         setTransactionDate(from || to ? [from, to].join(',') : null);
    //     }
    // };

    return (
        <PageContainer>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white py-3">
                    <Heading title="Dashboard" />
                    <DashboardFilter />
                    {/* <div className="flex items-center gap-2">
                        <CalendarDatePicker
                            className="font-normal"
                            variant="outline"
                            date={{
                                from: new Date(from),
                                to: new Date(to),
                            }}
                            onDateSelect={onDateSelect}
                        />
                        <CategorySelect />
                        <AccountSelect />
                    </div> */}
                </div>
                <div className="grid grid-cols-2 gap-4">
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
            </div>
        </PageContainer>
    );
}
