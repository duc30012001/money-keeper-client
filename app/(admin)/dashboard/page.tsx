'use client';

import PageContainer from '@/components/page-container';
import { CalendarDatePicker } from '@/components/ui/calendar-date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { AccountSelect } from '@/modules/account/components/account-select';
import { CategorySelect } from '@/modules/category/components/category-select';
import { ChartType } from '@/modules/dashboard/components/chart-type';
import { DashboardChart } from '@/modules/dashboard/components/dashboard-chart';
import { IncomeExpenseChart } from '@/modules/dashboard/components/income-expense-chart';
import { StatisticCard } from '@/modules/dashboard/components/statistic-card';
import dayjs from 'dayjs';

const expenseCategoriesData = [
    { name: 'Personal', value: 250000 },
    { name: 'Housing', value: 100000 },
    { name: 'Transportation', value: 50000 },
    { name: 'Entertainment', value: 20000 },
    { name: 'Food', value: 10000 },
    { name: 'Other', value: 100000 },
];

const incomeCategoriesData = [
    { name: 'Salary', value: 400000 },
    { name: 'Bonus', value: 30000 },
    { name: 'Other', value: 30000 },
    { name: 'Interest', value: 20000 },
];

export default function DashboardPage() {
    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <Heading title="Dashboard" />
                    <div className="flex items-center gap-2">
                        <ChartType />
                        <CalendarDatePicker
                            className="font-normal"
                            variant="outline"
                            date={{
                                from: dayjs().startOf('month').toDate(),
                                to: dayjs().endOf('month').toDate(),
                            }}
                            onDateSelect={() => {}}
                        />
                        <CategorySelect />
                        <AccountSelect />
                    </div>
                </div>
                <Separator />
                <div className="grid grid-cols-4 gap-4">
                    <StatisticCard title="💼 Total Balance" value={1000} />
                    <StatisticCard
                        title="💰 Total Income"
                        value={1000}
                        percentage={10}
                    />
                    <StatisticCard
                        title="💸 Total Expenses"
                        value={1000}
                        percentage={-10}
                    />
                    <StatisticCard
                        title="📊 Net Savings"
                        value={1000}
                        percentage={10}
                    />
                </div>
                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle>Expenses vs Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <IncomeExpenseChart />
                    </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-4">
                    <DashboardChart
                        title="Expense Categories"
                        data={expenseCategoriesData}
                    />
                    <DashboardChart
                        title="Income Categories"
                        data={incomeCategoriesData}
                    />
                </div>
            </div>
        </PageContainer>
    );
}
