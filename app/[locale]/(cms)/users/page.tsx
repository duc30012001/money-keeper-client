'use client';

import AppContainer from '@/components/app-container';
import ActionButton from '@/components/ui/button/action-button';
import { CreateButton } from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import { ModalType, PageSize, Screen } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import { useModal } from '@/hooks/use-modal';
import { formatDate, formatNumber } from '@/lib/format';
import UserModalForm from '@/modules/user/components/user-modal-form';
import UserRoleSelect from '@/modules/user/components/user-role-select';
import UserStatusSelect from '@/modules/user/components/user-status-select';
import { UserRole } from '@/modules/user/enums/user';
import { useUpdateUser, useUsersList } from '@/modules/user/hooks/use-users';
import { User, UserSearchParams } from '@/modules/user/types/user';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs';

export default function UsersPage() {
    const messages = useTranslations();
    const { typeModal, openModal } = useModal<User>();

    const { filterValues, onChangePage, onSearch, onChangeFilter } =
        useFilter<UserSearchParams>({
            page: parseAsInteger.withDefault(1),
            pageSize: parseAsInteger.withDefault(PageSize.MEDIUM),
            keyword: parseAsString,
            isActive: parseAsString,
            role: parseAsStringEnum<UserRole>(Object.values(UserRole)),
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
            ellipsis: true,
            width: 300,
        },
        {
            title: messages('user.role.title'),
            dataIndex: 'role',
            width: 130,
        },
        {
            title: messages('status.title'),
            dataIndex: 'status',
            width: 130,
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
            width: 130,
            responsive: ['xl'],
            render: (_, record) => formatDate(record.createdAt),
        },
        {
            title: messages('common.updatedAt'),
            dataIndex: 'updatedAt',
            width: 130,
            responsive: ['xl'],
            render: (_, record) => formatDate(record.updatedAt),
        },
        {
            dataIndex: 'action',
            width: 50,
            hideInSetting: true,
            fixed: 'right',
            render: (_, record) => {
                return [
                    <ActionButton
                        key="action"
                        editProps={{
                            onClick: () => openModal(ModalType.EDIT, record),
                        }}
                        deleteProps={{
                            onClick: () => openModal(ModalType.DELETE, record),
                            show: false,
                        }}
                    />,
                ];
            },
        },
    ];

    return (
        <AppContainer
            title={messages('user.title')}
            extra={[
                <CreateButton
                    key={'create'}
                    onClick={() => openModal(ModalType.CREATE)}
                />,
            ]}
            className="overflow-auto"
        >
            <ProTable<User>
                sticky
                columnsState={{ persistenceType: 'localStorage' }}
                search={false}
                columns={columns}
                rowKey="id"
                dataSource={data?.data}
                loading={isFetching}
                size="small"
                options={{
                    fullScreen: true,
                    reload: () => refetch(),
                    density: false,
                }}
                scroll={{
                    x: Screen.SM,
                }}
                headerTitle={
                    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                        <AppSearch
                            defaultValue={filterValues.keyword}
                            onChange={onSearch}
                        />
                        <UserStatusSelect
                            value={filterValues.isActive}
                            onChange={(value) =>
                                onChangeFilter({ isActive: value })
                            }
                        />
                        <UserRoleSelect
                            value={filterValues.role}
                            onChange={(value) =>
                                onChangeFilter({ role: value })
                            }
                        />
                    </div>
                }
                pagination={{
                    size: 'default',
                    current: data?.meta?.page,
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

            {typeModal &&
                [ModalType.CREATE, ModalType.EDIT].includes(typeModal) && (
                    <UserModalForm open />
                )}
        </AppContainer>
    );
}
