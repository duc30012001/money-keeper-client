'use client';

import AppContainer from '@/components/app-container';
import ActionButton from '@/components/ui/button/action-button';
import { CreateButton } from '@/components/ui/button/create-button';
import ConfirmModal from '@/components/ui/modal/confirm-modal';
import { ModalType, Screen } from '@/enums/common';
import { useModal } from '@/hooks/use-modal';
import { formatDate, formatNumber } from '@/lib/format';
import AccountTypeModalForm from '@/modules/account-type/components/account-type-modal-form';
import {
    useAccountTypesList,
    useDeleteAccountType,
    useUpdateSortOrder,
} from '@/modules/account-type/hooks/use-account-types';
import { AccountType } from '@/modules/account-type/types/account-type';
import { IconLabel } from '@/modules/icon/components/icon-label';
import { DragSortTable, ProColumns } from '@ant-design/pro-components';
import { useResponsive } from 'antd-style';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function UsersPage() {
    const responsive = useResponsive();
    const messages = useTranslations();
    const { editingData, typeModal, openModal, closeModal } =
        useModal<AccountType>();

    const { data, isFetching, refetch } = useAccountTypesList();
    const updateSortOrderMutation = useUpdateSortOrder();
    const deleteMutation = useDeleteAccountType();

    const [dataSource, setDataSource] = useState<AccountType[]>([]);

    useEffect(() => {
        setDataSource(data?.data || []);
    }, [data?.data]);

    const handleDragSortEnd = (
        beforeIndex: number,
        afterIndex: number,
        newDataSource: AccountType[]
    ) => {
        setDataSource(newDataSource);
        updateSortOrderMutation.mutate({
            ids: newDataSource.map((item: AccountType) => item.id),
        });
    };

    const confirmDelete = () => {
        if (editingData) {
            deleteMutation.mutate(editingData.id, {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    const columns: ProColumns<AccountType>[] = [
        {
            dataIndex: 'sort',
            width: 60,
            className: 'drag-visible',
            hideInSetting: true,
        },
        {
            title: messages('accountType.title'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            width: responsive.lg ? 200 : undefined,
            render: (_, record) => (
                <IconLabel
                    title={record.name}
                    descriptionClassname="block lg:hidden"
                    url={record.icon?.url}
                />
            ),
        },
        {
            title: messages('account.count'),
            dataIndex: 'accountCount',
            width: 130,
            render: (_, record) => formatNumber(record.accountCount),
        },
        {
            title: messages('common.description'),
            key: 'name',
            dataIndex: 'description',
            ellipsis: true,
            responsive: ['lg'],
            width: 200,
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
                            show: record.accountCount === 0,
                        }}
                    />,
                ];
            },
        },
    ];

    return (
        <AppContainer
            title={messages('accountType.title')}
            extra={[
                <CreateButton
                    key={'create'}
                    onClick={() => openModal(ModalType.CREATE)}
                />,
            ]}
            className="overflow-auto"
        >
            <DragSortTable<AccountType>
                columnsState={{
                    persistenceType: 'localStorage',
                    defaultValue: {
                        createdAt: { show: false },
                        updatedAt: { show: false },
                    },
                }}
                search={false}
                columns={columns}
                rowKey="id"
                dataSource={dataSource}
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
                pagination={false}
                dragSortKey="sort"
                onDragSortEnd={handleDragSortEnd}
            />

            {typeModal &&
                [ModalType.CREATE, ModalType.EDIT].includes(typeModal) && (
                    <AccountTypeModalForm open />
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
                    loading={deleteMutation.isPending}
                />
            )}
        </AppContainer>
    );
}
