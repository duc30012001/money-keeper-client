'use client';

import AppContainer from '@/components/app-container';
import { CreateButton } from '@/components/ui/button/create-button';
import { EditButton } from '@/components/ui/button/edit-button';
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
            className: '',
            render: (_, record) => {
                return [
                    <EditButton
                        key={'edit'}
                        className="!transition-none lg:invisible lg:group-hover:visible"
                        onClick={() => openModal(ModalType.EDIT, record)}
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
                    x: Screen.XL,
                }}
                headerTitle={
                    <div className="flex w-full flex-col gap-2 md:flex-row">
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
                rowClassName={'group'}
            />

            {typeModal &&
                [ModalType.CREATE, ModalType.EDIT].includes(typeModal) && (
                    <UserModalForm open />
                )}
        </AppContainer>
    );
}
