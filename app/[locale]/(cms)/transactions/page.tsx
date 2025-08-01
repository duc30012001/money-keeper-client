'use client';

import AppContainer from '@/components/app-container';
import ActionButton from '@/components/ui/button/action-button';
import { CreateButton } from '@/components/ui/button/create-button';
import AppRangePicker from '@/components/ui/date-picler/app-range-picker';
import AppSearch from '@/components/ui/input/search';
import ConfirmModal from '@/components/ui/modal/confirm-modal';
import { TRANSFER_ICON } from '@/constants/app';
import { ARRAY_SEPARATOR } from '@/constants/common';
import { ModalType, PageSize, Screen, SortOrder } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import { useModal } from '@/hooks/use-modal';
import { formatDate, formatNumber } from '@/lib/format';
import { getSortOrder, setSortOrder } from '@/lib/sort';
import { arrayFromString, arrayToString } from '@/lib/utils';
import AccountSelect from '@/modules/account/components/account-select';
import CategorySelect from '@/modules/category/components/category-select';
import { CategoryType } from '@/modules/category/enums/category';
import { IconLabel } from '@/modules/icon/components/icon-label';
import TransactionModalForm from '@/modules/transaction/components/transaction-modal-form';
import TransactionTypeSelect from '@/modules/transaction/components/transaction-type-select';
import { defaultTransactionDate } from '@/modules/transaction/constants/transaction';
import {
    TransactionOrderBy,
    TransactionType,
} from '@/modules/transaction/enums/transaction';
import {
    useDeleteTransaction,
    useTransactionsList,
} from '@/modules/transaction/hooks/use-transactions';
import {
    Transaction,
    TransactionSearchParams,
} from '@/modules/transaction/types/transaction';
import {
    getAmountColor,
    getAmountSign,
} from '@/modules/transaction/utils/transaction';
import {
    ProColumns,
    ProTable,
    ProTableProps,
} from '@ant-design/pro-components';
import { Tag, theme } from 'antd';
import { useResponsive } from 'antd-style';
import { SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs';

export default function TransactionsPage() {
    const responsive = useResponsive();
    const { token } = theme.useToken();

    const messages = useTranslations();
    const { editingData, typeModal, openModal, closeModal } =
        useModal<Transaction>();

    const { filterValues, onSearch, onChangeFilter } =
        useFilter<TransactionSearchParams>({
            page: parseAsInteger.withDefault(1),
            pageSize: parseAsInteger.withDefault(PageSize.MEDIUM),
            keyword: parseAsString,
            accountIds: parseAsString,
            categoryIds: parseAsString,
            type: parseAsString,
            transactionDate: parseAsString.withDefault(
                defaultTransactionDate.join(ARRAY_SEPARATOR)
            ),
            order: parseAsStringEnum(Object.values(SortOrder)).withDefault(
                SortOrder.DESC
            ),
            orderBy: parseAsStringEnum(
                Object.values(TransactionOrderBy)
            ).withDefault(TransactionOrderBy.TRANSACTION_DATE),
        });
    const [startTransactionDate, endTransactionDate] = filterValues
        .transactionDate!.split(',')
        .map(Number);

    const { data, isFetching, refetch } = useTransactionsList(filterValues);
    const deleteMutation = useDeleteTransaction();

    const confirmDelete = () => {
        if (editingData) {
            deleteMutation.mutate(editingData.id, {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    const columns: ProColumns<Transaction>[] = [
        {
            title: messages('transaction.date'),
            key: 'transactionDate',
            dataIndex: 'transactionDate',
            width: 130,
            responsive: ['xl'],
            sorter: true,
            defaultSortOrder: getSortOrder(
                filterValues.order,
                'transactionDate',
                filterValues.orderBy
            ),
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
                        description={
                            !responsive.xl && formatDate(transactionDate)
                        }
                        iconProps={{
                            size: responsive.xl ? 20 : 28,
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
            sorter: responsive.xl,
            defaultSortOrder: getSortOrder(
                filterValues.order,
                'amount',
                filterValues.orderBy
            ),
            render: (_, record) => {
                const { amount, type, account, senderAccount } = record;
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
                            className="block truncate text-xs xl:hidden"
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
            hideInSearch: true,
            responsive: ['lg'],
            render: (dom, record) => {
                if (record.description) return dom;
                if (
                    record.type === TransactionType.TRANSFER &&
                    record.receiverAccount
                ) {
                    return messages('transaction.type.transfer.message', {
                        value: record.receiverAccount.name,
                    });
                }
                return dom;
            },
        },
        {
            title: messages('common.createdAt'),
            dataIndex: 'createdAt',
            width: 120,
            hideInSearch: true,
            responsive: ['xl'],
            render: (_, record) => formatDate(record.createdAt),
        },
        {
            title: messages('common.updatedAt'),
            dataIndex: 'updatedAt',
            width: 120,
            hideInSearch: true,
            responsive: ['xl'],
            render: (_, record) => formatDate(record.updatedAt),
        },
        {
            dataIndex: 'action',
            width: responsive.lg ? 80 : 40,
            hideInSearch: true,
            hideInSetting: true,
            fixed: 'right',
            responsive: ['md'],
            render: (_, record) => {
                return [
                    <ActionButton
                        key="action"
                        editProps={{
                            onClick: () => openModal(ModalType.EDIT, record),
                        }}
                        duplicateProps={{
                            onClick: () => openModal(ModalType.CREATE, record),
                            show: true,
                        }}
                        deleteProps={{
                            onClick: () => openModal(ModalType.DELETE, record),
                        }}
                    />,
                ];
            },
        },
    ];

    const onChangeTable = (
        pagination: TablePaginationConfig,
        filters: any,
        sorter: SorterResult<Transaction>
    ) => {
        const order = setSortOrder(sorter.order);
        const orderBy = sorter.field as TransactionOrderBy;
        onChangeFilter(
            {
                order,
                orderBy,
                page: pagination.current,
                pageSize: pagination.pageSize,
            },
            false
        );
    };

    return (
        <AppContainer
            title={messages('transaction.title')}
            extra={[
                <CreateButton
                    key={'create'}
                    onClick={() => openModal(ModalType.CREATE)}
                />,
            ]}
            className="overflow-auto"
        >
            <ProTable<Transaction>
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
                    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-12">
                        <div className="xl:col-span-2">
                            <AppSearch
                                defaultValue={filterValues.keyword}
                                onChange={onSearch}
                            />
                        </div>
                        <div className="xl:col-span-3">
                            <AppRangePicker
                                value={[
                                    dayjs(new Date(startTransactionDate)),
                                    dayjs(new Date(endTransactionDate)),
                                ]}
                                onChange={(value) =>
                                    onChangeFilter({
                                        transactionDate: arrayToString([
                                            value?.[0]
                                                ?.startOf('day')
                                                ?.valueOf(),
                                            value?.[1]?.endOf('day')?.valueOf(),
                                        ]),
                                    })
                                }
                            />
                        </div>
                        <div className="xl:col-span-2">
                            <TransactionTypeSelect
                                allowClear
                                mode="multiple"
                                value={arrayFromString(filterValues.type)}
                                onChange={(value) =>
                                    onChangeFilter({
                                        type: arrayToString(value),
                                    })
                                }
                            />
                        </div>
                        <div className="xl:col-span-2">
                            <AccountSelect
                                mode="multiple"
                                value={arrayFromString(filterValues.accountIds)}
                                onChange={(value) =>
                                    onChangeFilter({
                                        accountIds: arrayToString(value),
                                    })
                                }
                            />
                        </div>
                        <div className="xl:col-span-3">
                            <CategorySelect
                                treeCheckable
                                showCheckedStrategy="SHOW_ALL"
                                type={filterValues.type as CategoryType}
                                value={arrayFromString(
                                    filterValues.categoryIds
                                )}
                                onChange={(value) =>
                                    onChangeFilter({
                                        categoryIds: arrayToString(value),
                                    })
                                }
                            />
                        </div>
                    </div>
                }
                pagination={{
                    current: data?.meta?.page,
                    pageSize: data?.meta?.pageSize,
                    total: data?.meta?.total,
                    // onChange: onChangePage,
                    showTotal: (total, [from, to]) =>
                        messages('table.showTotal', {
                            from: formatNumber(from),
                            to: formatNumber(to),
                            total: formatNumber(total),
                        }),
                    showSizeChanger: true,
                    size: 'default',
                }}
                onChange={
                    onChangeTable as ProTableProps<Transaction, any>['onChange']
                }
                onRow={(data) => {
                    if (responsive.md) return {};
                    return {
                        onClick: () => openModal(ModalType.EDIT, data),
                    };
                }}
            />

            {typeModal &&
                [ModalType.CREATE, ModalType.EDIT].includes(typeModal) && (
                    <TransactionModalForm open />
                )}

            {editingData && typeModal === ModalType.DELETE && (
                <ConfirmModal
                    open
                    onCancel={closeModal}
                    onOk={confirmDelete}
                    title={messages('action.delete.title', {
                        label: editingData.id,
                    })}
                    description={messages('action.delete.alert', {
                        label: editingData.id,
                    })}
                    loading={deleteMutation.isPending}
                />
            )}
        </AppContainer>
    );
}
