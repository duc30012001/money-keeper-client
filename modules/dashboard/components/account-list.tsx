import { PageSize } from '@/enums/common';
import { AppRoute } from '@/enums/routes';
import { Link } from '@/i18n/navigation';
import { formatNumber } from '@/lib/format';
import { Card, Table, TableProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useAccountsList } from '../../account/hooks/use-accounts';
import { Account } from '../../account/types/account';
import { IconLabel } from '../../icon/components/icon-label';

type Props = {};

function AccountList({}: Props) {
    const messages = useTranslations();

    const { data, isFetching } = useAccountsList({ pageSize: PageSize.XLARGE });

    const columns: TableProps<Account>['columns'] = [
        {
            title: messages('account.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            render: (_, record) => (
                <IconLabel
                    className="ml-2"
                    title={record.name}
                    url={record.icon?.url}
                    description={formatNumber(record.balance)}
                    iconProps={{
                        size: 30,
                    }}
                />
            ),
        },
    ];

    return (
        <Card
            title={messages('account.title')}
            className="h-full"
            styles={{
                body: {
                    padding: 0,
                    paddingTop: 1,
                },
            }}
            extra={
                <Link href={AppRoute.ACCOUNTS}>
                    {messages('common.viewMore')}
                </Link>
            }
        >
            <Table<Account>
                showHeader={false}
                columns={columns}
                rowKey="id"
                dataSource={data?.data}
                loading={isFetching}
                size="small"
                pagination={false}
                scroll={{
                    y: 470,
                }}
            />
        </Card>
    );
}

export default AccountList;
