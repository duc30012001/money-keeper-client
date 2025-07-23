import AppModal, { AppModalProps } from '@/components/ui/modal/app-modal';
import { PageSize, Screen } from '@/enums/common';
import { formatDate, formatNumber } from '@/lib/format';
import { arrayToString } from '@/lib/utils';
import { IconLabel } from '@/modules/icon/components/icon-label';
import { useTransactionsList } from '@/modules/transaction/hooks/use-transactions';
import { Transaction } from '@/modules/transaction/types/transaction';
import { getAmountColor } from '@/modules/transaction/utils/transaction';
import { Table, TableProps, Tag, theme } from 'antd';
import { useResponsive } from 'antd-style';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = {
    type: string;
    date: dayjs.Dayjs;
} & AppModalProps;

function DashboardCalendarDetail({ type, date, ...props }: Props) {
    const responsive = useResponsive();
    const { token } = theme.useToken();

    const messages = useTranslations();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PageSize.MEDIUM);

    const format = type === 'month' ? 'MM/YYYY' : 'DD/MM/YYYY';
    const value = type === 'month' ? 'month' : 'day';

    const { data, isFetching } = useTransactionsList({
        page,
        pageSize,
        transactionDate: arrayToString([
            dayjs(date).startOf(value).valueOf(),
            dayjs(date).endOf(value).valueOf(),
        ]),
    });

    const columns: TableProps<Transaction>['columns'] = [
        {
            title: messages('transaction.date'),
            key: 'transactionDate',
            dataIndex: 'transactionDate',
            width: 130,
            responsive: ['xl'],
            render: (_, record) => formatDate(record.transactionDate),
        },
        {
            title: messages('category.title'),
            key: 'category.title',
            dataIndex: 'category.title',
            ellipsis: true,
            width: responsive.sm ? 200 : 170,
            render: (_, record) => {
                const { category, receiverAccount, transactionDate } = record;
                let title: string | undefined = undefined;
                let url: string | undefined = undefined;

                if (category) {
                    title = category.name;
                    url = category.icon?.url;
                }

                if (receiverAccount) {
                    title = messages('transaction.type.transfer.message', {
                        value: receiverAccount.name,
                    });
                    url = receiverAccount.icon?.url;
                }

                if (!title) {
                    return null;
                }

                return (
                    <IconLabel
                        title={title}
                        url={url}
                        description={
                            !responsive.xl && formatDate(transactionDate)
                        }
                        iconProps={{
                            size: responsive.xl ? 20 : 30,
                        }}
                    />
                );
            },
        },
        {
            title: messages('account.title'),
            key: 'account.title',
            dataIndex: 'account.title',
            ellipsis: true,
            width: 200,
            responsive: ['xl'],
            render: (_, record) => {
                const data = record.account || record.senderAccount;
                return <IconLabel title={data?.name} url={data?.icon?.url} />;
            },
        },
        {
            title: messages('transaction.amount'),
            key: 'amount',
            dataIndex: 'amount',
            align: responsive.xl ? 'left' : 'right',
            width: 120,
            render: (_, record) => {
                const { amount, type, account, senderAccount } = record;
                const value = formatNumber(amount);

                return (
                    <p className="space-y-1 truncate">
                        <Tag
                            className="!me-0 !text-sm font-medium"
                            bordered={false}
                            color={getAmountColor(type)}
                        >
                            {value}
                        </Tag>
                        <p
                            style={{ color: token.colorTextSecondary }}
                            className="block truncate xl:hidden"
                        >
                            {account?.name ?? senderAccount?.name}
                        </p>
                    </p>
                );
            },
        },
        {
            title: messages('common.description'),
            key: 'description',
            dataIndex: 'description',
            ellipsis: true,
            width: 250,
            responsive: ['lg'],
        },
    ];

    return (
        <AppModal
            width={1200}
            footer={null}
            {...props}
            className="!top-10 md:!top-20"
            title={messages('transaction.title') + ' ' + date.format(format)}
        >
            <Table<Transaction>
                columns={columns}
                rowKey="id"
                dataSource={data?.data}
                loading={isFetching}
                size={responsive.lg ? 'middle' : 'small'}
                scroll={{
                    x: responsive.lg ? Screen.MD : undefined,
                    y: responsive.lg ? 500 : 400,
                }}
                pagination={{
                    current: data?.meta?.page,
                    pageSize: data?.meta?.pageSize,
                    total: data?.meta?.total,
                    onChange: (newPage, newPageSize) => {
                        setPage(newPage);
                        setPageSize(newPageSize);
                    },
                    showTotal: (total, [from, to]) =>
                        messages('table.showTotal', {
                            from: formatNumber(from),
                            to: formatNumber(to),
                            total: formatNumber(total),
                        }),
                    showSizeChanger: true,
                    size: 'default',
                }}
            />
        </AppModal>
    );
}

export default DashboardCalendarDetail;
