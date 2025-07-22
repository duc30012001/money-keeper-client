'use client';

import AppContainer from '@/components/app-container';
import ActionButton from '@/components/ui/button/action-button';
import { CreateButton } from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import ConfirmModal from '@/components/ui/modal/confirm-modal';
import { ModalType, PageSize, Screen } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import { useModal } from '@/hooks/use-modal';
import { formatDate, formatNumber } from '@/lib/format';
import { arrayFromString, arrayToString } from '@/lib/utils';
import AccountTypeSelect from '@/modules/account-type/components/account-type-select';
import AccountModalForm from '@/modules/account/components/account-modal-form';
import {
    useAccountsList,
    useDeleteAccount,
    useTotalBalance,
} from '@/modules/account/hooks/use-accounts';
import { Account, AccountSearchParams } from '@/modules/account/types/account';
import { IconLabel } from '@/modules/icon/components/icon-label';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useResponsive } from 'antd-style';
import { useTranslations } from 'next-intl';
import { parseAsInteger, parseAsString } from 'nuqs';

export default function AccountsPage() {
    const { token } = theme.useToken();
    const responsive = useResponsive();
    const messages = useTranslations();
    const { editingData, typeModal, openModal, closeModal } =
        useModal<Account>();

    const { filterValues, onChangePage, onSearch, onChangeFilter } =
        useFilter<AccountSearchParams>({
            page: parseAsInteger.withDefault(1),
            pageSize: parseAsInteger.withDefault(PageSize.MEDIUM),
            keyword: parseAsString,
            accountTypeIds: parseAsString,
        });

    const { data: totalBalance } = useTotalBalance();
    const { data, isFetching, refetch } = useAccountsList(filterValues);
    const deleteMutation = useDeleteAccount();

    const confirmDelete = () => {
        if (editingData) {
            deleteMutation.mutate(editingData.id, {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    const columns: ProColumns<Account>[] = [
        {
            title: messages('account.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            width: responsive.lg ? 250 : undefined,
            render: (_, record) => (
                <IconLabel
                    title={record.name}
                    description={formatNumber(record.balance)}
                    descriptionClassname="block lg:hidden"
                    styles={{
                        description: {
                            color:
                                Number(record.balance) >= 0
                                    ? token.colorTextSecondary
                                    : token.colorErrorText,
                        },
                    }}
                    url={record.icon?.url}
                />
            ),
        },
        {
            title: messages('account.balance'),
            key: 'balance',
            dataIndex: 'balance',
            width: 150,
            responsive: ['lg'],
            render: (_, record) => formatNumber(record.balance),
        },
        {
            title: messages('account.initialBalance'),
            key: 'initialBalance',
            dataIndex: 'initialBalance',
            width: 150,
            responsive: ['xl'],
            render: (_, record) => formatNumber(record.initialBalance),
        },
        {
            title: messages('accountType.title'),
            key: 'accountType.name',
            dataIndex: 'accountType.name',
            width: 150,
            responsive: ['md'],
            render: (_, record) => record.accountType.name,
        },
        {
            title: messages('common.description'),
            key: 'description',
            dataIndex: 'description',
            ellipsis: true,
            width: 200,
            responsive: ['lg'],
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
            width: responsive.lg ? 80 : 50,
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
                        }}
                    />,
                ];
            },
        },
    ];

    return (
        <AppContainer
            title={messages('account.title')}
            description={messages('account.totalBalance', {
                value: formatNumber(totalBalance?.data),
            })}
            extra={[
                <CreateButton
                    key={'create'}
                    onClick={() => openModal(ModalType.CREATE)}
                />,
            ]}
            className="overflow-auto"
        >
            <ProTable<Account>
                sticky
                columnsState={{
                    persistenceType: 'localStorage',
                    defaultValue: {
                        initialBalance: { show: false },
                        createdAt: { show: false },
                        updatedAt: { show: false },
                    },
                }}
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
                    x: responsive.lg ? Screen.MD : undefined,
                }}
                headerTitle={
                    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AppSearch
                            defaultValue={filterValues.keyword}
                            onChange={onSearch}
                        />
                        <AccountTypeSelect
                            mode="multiple"
                            value={arrayFromString(filterValues.accountTypeIds)}
                            onChange={(value) =>
                                onChangeFilter({
                                    accountTypeIds: arrayToString(value),
                                })
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
                    <AccountModalForm open />
                )}

            {editingData && typeModal === ModalType.DELETE && (
                <ConfirmModal
                    open
                    onCancel={closeModal}
                    onOk={confirmDelete}
                    title={messages('action.delete.title', {
                        label: editingData.name,
                    })}
                    description={messages('action.delete.alert', {
                        label: editingData.name,
                    })}
                />
            )}
        </AppContainer>
    );
}
