'use client';

import AppContainer from '@/components/app-container';
import { CreateButton } from '@/components/ui/button/create-button';
import { DeleteButton } from '@/components/ui/button/delete-button';
import { EditButton } from '@/components/ui/button/edit-button';
import AppSearch from '@/components/ui/input/search';
import ConfirmModal from '@/components/ui/modal/confirm-modal';
import { ModalType, PageSize, Screen } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import { useModal } from '@/hooks/use-modal';
import { formatDate, formatNumber } from '@/lib/format';
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
import { useTranslations } from 'next-intl';
import { parseAsInteger, parseAsString } from 'nuqs';

export default function AccountsPage() {
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
            width: 250,
            render: (_, record) => (
                <IconLabel name={record.name} url={record.icon?.url} />
            ),
        },
        {
            title: messages('account.balance'),
            key: 'balance',
            dataIndex: 'balance',
            width: 150,
            render: (_, record) => formatNumber(record.balance),
        },
        {
            title: messages('account.initialBalance'),
            key: 'initialBalance',
            dataIndex: 'initialBalance',
            width: 150,

            render: (_, record) => formatNumber(record.initialBalance),
        },
        {
            title: messages('accountType.title'),
            key: 'accountType.name',
            dataIndex: 'accountType.name',
            width: 150,
            render: (_, record) => record.accountType.name,
        },
        {
            title: messages('common.description'),
            key: 'description',
            dataIndex: 'description',
            ellipsis: true,
            width: 200,
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
            width: 80,
            className: '',
            render: (_, record) => {
                return [
                    <EditButton
                        key={'edit'}
                        onClick={() => openModal(ModalType.EDIT, record)}
                    />,
                    <DeleteButton
                        key={'delete'}
                        onClick={() => openModal(ModalType.DELETE, record)}
                    />,
                ];
            },
        },
    ];

    return (
        <AppContainer
            title={messages('account.title')}
            description={`Total Balance: ${formatNumber(totalBalance?.data)}`}
            extra={[
                <CreateButton
                    key={'create'}
                    onClick={() => openModal(ModalType.CREATE)}
                />,
            ]}
            className="overflow-auto"
        >
            <ProTable<Account>
                sticky={{
                    offsetHeader: 64,
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
                    x: Screen.XL,
                }}
                headerTitle={
                    <div className="flex w-full flex-col gap-2 md:flex-row">
                        <AppSearch
                            defaultValue={filterValues.keyword}
                            onChange={onSearch}
                        />
                        <AccountTypeSelect
                            value={filterValues.accountTypeIds}
                            onChange={(value) =>
                                onChangeFilter({ accountTypeIds: value })
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
            />

            {typeModal &&
                [ModalType.CREATE, ModalType.EDIT].includes(typeModal) && (
                    <AccountModalForm open />
                )}

            {typeModal === ModalType.DELETE && (
                <ConfirmModal
                    open
                    onCancel={closeModal}
                    onOk={confirmDelete}
                    title={messages('action.delete.title', {
                        label: editingData?.name ?? '',
                    })}
                    description={messages('action.delete.alert', {
                        label: editingData?.name ?? '',
                    })}
                />
            )}
        </AppContainer>
    );
}
