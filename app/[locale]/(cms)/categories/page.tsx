'use client';

import AppContainer from '@/components/app-container';
import ActionButton from '@/components/ui/button/action-button';
import { CreateButton } from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import ConfirmModal from '@/components/ui/modal/confirm-modal';
import { ModalType, Screen } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import { useModal } from '@/hooks/use-modal';
import { removeEmptyChildren } from '@/lib/array';
import { formatDate } from '@/lib/format';
import CategoryModalForm from '@/modules/category/components/category-modal-form';
import CategoryTypeSelect from '@/modules/category/components/category-type-select';
import { CategoryType } from '@/modules/category/enums/category';
import {
    useCategoriesList,
    useDeleteCategory,
} from '@/modules/category/hooks/use-categories';
import {
    Category,
    CategorySearchParams,
} from '@/modules/category/types/category';
import { IconLabel } from '@/modules/icon/components/icon-label';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { useResponsive } from 'antd-style';
import { useTranslations } from 'next-intl';
import { parseAsString, parseAsStringEnum } from 'nuqs';

export default function CategoriesPage() {
    const responsive = useResponsive();
    const messages = useTranslations();
    const { editingData, typeModal, openModal, closeModal } =
        useModal<Category>();

    const { filterValues, onSearch, onChangeFilter } =
        useFilter<CategorySearchParams>({
            keyword: parseAsString,
            type: parseAsStringEnum<CategoryType>(
                Object.values(CategoryType)
            ).withDefault(CategoryType.EXPENSE),
        });

    const { data, isFetching, refetch } = useCategoriesList(filterValues);
    const deleteMutation = useDeleteCategory();

    const confirmDelete = () => {
        if (editingData) {
            deleteMutation.mutate(editingData.id, {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    const columns: ProColumns<Category>[] = [
        {
            title: messages('category.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            width: responsive.lg ? 250 : undefined,
            render: (_, record) => (
                <IconLabel title={record.name} url={record.icon?.url} />
            ),
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
            title={messages('category.title')}
            extra={[
                <CreateButton
                    key={'create'}
                    onClick={() => openModal(ModalType.CREATE)}
                />,
            ]}
            className="overflow-auto"
        >
            <ProTable<Category>
                sticky
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
                dataSource={removeEmptyChildren(data?.data ?? [])}
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
                        <CategoryTypeSelect
                            value={filterValues.type}
                            onChange={(value) =>
                                onChangeFilter({ type: value })
                            }
                        />
                    </div>
                }
                pagination={false}
            />

            {typeModal &&
                [ModalType.CREATE, ModalType.EDIT].includes(typeModal) && (
                    <CategoryModalForm
                        open
                        defaultType={filterValues.type as CategoryType}
                    />
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
