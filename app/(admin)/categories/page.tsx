'use client';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { AlertModal } from '@/components/modal/alert-modal';
import PageContainer from '@/components/page-container';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ModalType } from '@/enums/common';
import { useModal } from '@/hooks/use-modal';
import { CategoryForm } from '@/modules/category/components/category-form';
import { CategoryTable } from '@/modules/category/components/category-table';
import { columns } from '@/modules/category/components/category-table-columns';
import {
    useCategoriesList,
    useCategorySearchParams,
    useDeleteCategory,
} from '@/modules/category/hooks/use-categories';
import { Category } from '@/modules/category/types/category';
import { Plus } from 'lucide-react';

export default function CategoryPage() {
    const { typeModal, editingData, openModal, closeModal } =
        useModal<Category>();
    const searchParams = useCategorySearchParams();

    const { data: categories, isLoading } = useCategoriesList(searchParams);

    const deleteMutation = useDeleteCategory();

    const onConfirm = async () => {
        if (!editingData) return;
        await deleteMutation.mutateAsync(editingData.id, {
            onSuccess: () => {
                closeModal();
            },
        });
    };

    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <Heading title="Categories" />
                    <Button onClick={() => openModal(ModalType.CREATE)}>
                        <Plus />
                        Create
                    </Button>
                </div>
                <Separator />
                {isLoading ? (
                    <DataTableSkeleton
                        columnCount={4}
                        filterCount={2}
                        cellWidths={['200px', '150px', '400px', '100px']}
                    />
                ) : (
                    <CategoryTable
                        data={categories?.data ?? []}
                        columns={columns}
                        totalItems={categories?.meta?.total ?? 0}
                        pageSize={categories?.meta?.pageSize ?? 0}
                    />
                )}
            </div>

            <Dialog
                open={
                    typeModal === ModalType.CREATE ||
                    typeModal === ModalType.EDIT
                }
                onOpenChange={(open) => {
                    if (open) {
                        openModal(ModalType.CREATE);
                    } else {
                        closeModal();
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingData
                                ? 'Edit ' + editingData.name
                                : 'Create Category'}
                        </DialogTitle>
                    </DialogHeader>
                    <CategoryForm
                        category={editingData ?? undefined}
                        onSuccess={closeModal}
                    />
                </DialogContent>
            </Dialog>

            <AlertModal
                isOpen={typeModal === ModalType.DELETE}
                onClose={closeModal}
                onConfirm={onConfirm}
                loading={deleteMutation.isPending}
                description={`Are you sure you want to delete "${editingData?.name}"? This action cannot be undone.`}
            />
        </PageContainer>
    );
}
