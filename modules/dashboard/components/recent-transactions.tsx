import { PageSize } from '@/enums/common';
import { AppRoute } from '@/enums/routes';
import { Link } from '@/i18n/navigation';
import { formatDate, formatNumber } from '@/lib/format';
import { Card, Table, TableProps, Tag, theme } from 'antd';
import { useResponsive } from 'antd-style';
import { useTranslations } from 'next-intl';
import { IconLabel } from '../../icon/components/icon-label';
import { TransactionType } from '../../transaction/enums/transaction';
import { useTransactionsList } from '../../transaction/hooks/use-transactions';
import { Transaction } from '../../transaction/types/transaction';

type Props = {};

function RecentTransaction({}: Props) {
    const responsive = useResponsive();
    const { token } = theme.useToken();

    const messages = useTranslations();

    const { data, isLoading } = useTransactionsList({
        pageSize: PageSize.MEDIUM,
    });

    const columns: TableProps<Transaction>['columns'] = [
        {
            title: messages('category.title'),
            key: 'category.title',
            dataIndex: 'category.title',
            ellipsis: true,
            width: 200,
            render: (_, record) => {
                const { category, receiverAccount } = record;
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
                        description={formatDate(record.transactionDate)}
                        iconProps={{
                            size: 30,
                        }}
                    />
                );
            },
        },
        {
            title: messages('transaction.amount'),
            key: 'amount',
            dataIndex: 'amount',
            ellipsis: true,
            width: 120,
            align: 'right',
            render: (_, record) => {
                const { amount, type } = record;
                const value = formatNumber(amount);

                let color: string = 'default';

                switch (type) {
                    case TransactionType.EXPENSE:
                        color = 'error';
                        break;
                    case TransactionType.INCOME:
                        color = 'success';
                        break;
                    case TransactionType.TRANSFER:
                        color = 'processing';
                        break;
                    default:
                        break;
                }

                return (
                    <p className="space-y-1 truncate">
                        <Tag
                            className="!text-sm font-medium"
                            bordered={false}
                            color={color}
                        >
                            {value}
                        </Tag>
                        <p
                            style={{ color: token.colorTextSecondary }}
                            className="truncate"
                        >
                            {record.account?.name ?? record.senderAccount?.name}
                        </p>
                    </p>
                );
            },
        },
    ];

    return (
        <Card
            title={messages('transaction.recent')}
            className="h-full"
            styles={{
                body: {
                    padding: 0,
                    paddingTop: 1,
                },
            }}
            extra={
                <Link href={AppRoute.TRANSACTIONS}>
                    {messages('common.viewMore')}
                </Link>
            }
        >
            <Table<Transaction>
                showHeader={false}
                columns={columns}
                rowKey="id"
                dataSource={data?.data}
                loading={isLoading}
                pagination={false}
                scroll={{
                    y: responsive.lg ? 720 : 490,
                }}
            />
        </Card>
    );
}

export default RecentTransaction;
