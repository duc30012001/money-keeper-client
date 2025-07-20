'use client';

import AppContainer from '@/components/app-container';
import { CreateButton } from '@/components/ui/button/create-button';
import { DeleteButton } from '@/components/ui/button/delete-button';
import { EditButton } from '@/components/ui/button/edit-button';
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
import { DragSortTable, ProColumns } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function UsersPage() {
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
        },
        {
            title: messages('accountType.title'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            width: 250,
        },
        {
            title: messages('account.count'),
            dataIndex: 'accountCount',
            width: 150,
            render: (_, record) => formatNumber(record.accountCount),
        },
        {
            title: messages('common.description'),
            key: 'name',
            dataIndex: 'description',
            ellipsis: true,
            width: 250,
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
                const node = [
                    <EditButton
                        key={'edit'}
                        onClick={() => openModal(ModalType.EDIT, record)}
                    />,
                ];
                if (record.accountCount === 0) {
                    node.push(
                        <DeleteButton
                            key={'delete'}
                            onClick={() => openModal(ModalType.DELETE, record)}
                        />
                    );
                }
                return node;
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
            <DragSortTable<AccountType>
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
                    x: Screen.XL,
                }}
                pagination={false}
                dragSortKey="sort"
                onDragSortEnd={handleDragSortEnd}
            />

            {typeModal &&
                [ModalType.CREATE, ModalType.EDIT].includes(typeModal) && (
                    <AccountTypeModalForm open />
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
