'use client';

import AppContainer from '@/components/app-container';
import { CreateButton } from '@/components/ui/button/create-button';
import { EditButton } from '@/components/ui/button/edit-button';
import AppSearch from '@/components/ui/input/search';
import { PageSize, Screen } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import { formatDate, formatNumber } from '@/lib/format';
import { useUpdateUser, useUsersList } from '@/modules/user/hooks/use-users';
import { User, UserSearchParams } from '@/modules/user/types/user';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { parseAsInteger, parseAsString } from 'nuqs';

export default function UsersPage() {
    const messages = useTranslations();
    const { filterValues, onChangePage, onSearch } =
        useFilter<UserSearchParams>({
            page: parseAsInteger.withDefault(1),
            pageSize: parseAsInteger.withDefault(PageSize.MEDIUM),
            keyword: parseAsString,
            isActive: parseAsString,
        });

    const { data, isFetching, refetch } = useUsersList(filterValues);
    const updateMutation = useUpdateUser();

    const onActiveChange = (id: string, isActive: boolean) => {
        updateMutation.mutateAsync({
            id,
            data: {
                isActive,
            },
        });
    };

    const columns: ProColumns<User>[] = [
        {
            title: messages('user.email'),
            dataIndex: 'email',
            copyable: true,
            ellipsis: true,
            width: 350,
        },
        {
            title: messages('user.role.title'),
            dataIndex: 'role',
            width: 150,
        },
        {
            title: messages('status.title'),
            dataIndex: 'status',
            width: 150,
            render: (_, record) => (
                <Switch
                    checked={record.isActive}
                    onChange={(checked) => onActiveChange(record.id, checked)}
                />
            ),
        },
        {
            title: messages('common.createdAt'),
            dataIndex: 'createdAt',
            width: 150,
            render: (_, record) => formatDate(record.createdAt),
        },
        {
            title: messages('common.updatedAt'),
            dataIndex: 'updatedAt',
            width: 150,
            render: (_, record) => formatDate(record.updatedAt),
        },
        {
            dataIndex: 'action',
            width: 100,
            render: () => {
                return [<EditButton key={'edit'} />];
            },
        },
    ];

    return (
        <AppContainer
            title={messages('user.title')}
            extra={[<CreateButton key={'create'} />]}
        >
            <ProTable<User>
                search={false}
                columns={columns}
                rowKey="id"
                dataSource={data?.data}
                loading={isFetching}
                options={{
                    fullScreen: true,
                    reload: () => refetch(),
                }}
                scroll={{
                    x: Screen.XL,
                }}
                headerTitle={
                    <AppSearch
                        defaultValue={filterValues.keyword}
                        onChange={onSearch}
                    />
                }
                pagination={{
                    current: data?.meta?.page,
                    hideOnSinglePage: true,
                    pageSize: data?.meta?.pageSize,
                    total: data?.meta?.total,
                    onChange: onChangePage,
                    showTotal: (total, [from, to]) =>
                        messages('table.showTotal', {
                            from: formatNumber(from),
                            to: formatNumber(to),
                            total: formatNumber(total),
                        }),
                }}
            />
        </AppContainer>
    );
}
