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
import { TransactionForm } from '@/modules/transaction/components/transaction-form';
import { TransactionTable } from '@/modules/transaction/components/transaction-table';
import {
    useDeleteTransaction,
    useTransactionSearchParams,
    useTransactionsList,
} from '@/modules/transaction/hooks/use-transactions';
import { Transaction } from '@/modules/transaction/types/transaction';
import { Plus } from 'lucide-react';

export default function TransactionPage() {
    const { typeModal, editingData, openModal, closeModal } =
        useModal<Transaction>();
    const searchParams = useTransactionSearchParams();

    const { data: transactions, isLoading } = useTransactionsList(searchParams);

    const deleteMutation = useDeleteTransaction();

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
                    <Heading title="Transactions" />
                    <Button onClick={() => openModal(ModalType.CREATE)}>
                        <Plus />
                        Create
                    </Button>
                </div>
                <Separator />
                {isLoading ? (
                    <DataTableSkeleton
                        columnCount={8}
                        filterCount={7}
                        shrinkZero
                    />
                ) : (
                    <TransactionTable
                        data={transactions?.data ?? []}
                        pageCount={transactions?.meta?.totalPages ?? 0}
                        pageSize={transactions?.meta?.pageSize ?? 0}
                        pageIndex={transactions?.meta?.page ?? 0}
                        rowCount={transactions?.meta?.total ?? 0}
                    />
                )}
            </div>

            <Dialog
                open={
                    typeModal === ModalType.CREATE ||
                    typeModal === ModalType.EDIT
                }
                onOpenChange={(open) => {
                    if (!open) {
                        closeModal();
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingData
                                ? 'Edit ' + editingData.id
                                : 'Create Transaction'}
                        </DialogTitle>
                    </DialogHeader>
                    <TransactionForm
                        transaction={editingData ?? undefined}
                        onSuccess={closeModal}
                    />
                </DialogContent>
            </Dialog>

            <AlertModal
                isOpen={typeModal === ModalType.DELETE}
                onClose={closeModal}
                onConfirm={onConfirm}
                loading={deleteMutation.isPending}
                description={`Are you sure you want to delete "${editingData?.id}"? This action cannot be undone.`}
            />
        </PageContainer>
    );
}
