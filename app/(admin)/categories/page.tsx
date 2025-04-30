'use client';

import PageContainer from '@/components/page-container';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { ModalType } from '@/enums/common';
import { useModal } from '@/hooks/use-modal';
import { CategoryForm } from '@/modules/category/components/category-form';
import { CategoryTable } from '@/modules/category/components/category-table';
import { columns } from '@/modules/category/components/category-table/columns';
import { useCategoriesList } from '@/modules/category/hooks/use-categories';
import { Category } from '@/modules/category/types/category';
import { Plus } from 'lucide-react';

export default function CategoryPage() {
    const { typeModal, editingData, openModal, closeModal } =
        useModal<Category>();

    const { data: categories, isLoading } = useCategoriesList();

    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <Heading title="Categories" />
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
                        <DialogTrigger asChild>
                            <Button>
                                <Plus />
                                Create
                            </Button>
                        </DialogTrigger>
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
                </div>
                <Separator />
                {isLoading ? (
                    <DataTableSkeleton
                        columnCount={5}
                        rowCount={8}
                        filterCount={2}
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
        </PageContainer>
    );
}
