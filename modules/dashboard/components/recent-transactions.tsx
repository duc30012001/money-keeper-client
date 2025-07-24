import { TRANSFER_ICON } from '@/constants/app';
import { PageSize } from '@/enums/common';
import { AppRoute } from '@/enums/routes';
import { Link } from '@/i18n/navigation';
import { formatDate, formatNumber } from '@/lib/format';
import {
    getAmountColor,
    getAmountSign,
} from '@/modules/transaction/utils/transaction';
import { Card, Table, TableProps, Tag, theme } from 'antd';
import { useResponsive } from 'antd-style';
import { useTranslations } from 'next-intl';
import { IconLabel } from '../../icon/components/icon-label';
import { useTransactionsList } from '../../transaction/hooks/use-transactions';
import { Transaction } from '../../transaction/types/transaction';

type Props = {};

function RecentTransaction({}: Props) {
    const responsive = useResponsive();
    const { token } = theme.useToken();

    const messages = useTranslations();

    const { data, isFetching } = useTransactionsList({
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
                    title = messages('transaction.type.transfer.title');
                    url = TRANSFER_ICON;
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
                            size: 28,
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
                return (
                    <p className="space-y-1 truncate">
                        <Tag
                            className="!me-0 !text-sm font-medium"
                            bordered={false}
                            color={getAmountColor(type)}
                        >
                            {getAmountSign(type) + formatNumber(amount)}
                        </Tag>
                        <p
                            style={{ color: token.colorTextSecondary }}
                            className="truncate text-xs"
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
                loading={isFetching}
                size="small"
                pagination={false}
                scroll={{
                    y: responsive.lg ? 720 : 490,
                }}
            />
        </Card>
    );
}

export default RecentTransaction;
