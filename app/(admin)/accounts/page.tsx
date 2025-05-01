'use client';

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
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { ModalType } from '@/enums/common';
import { useModal } from '@/hooks/use-modal';
import { AccountForm } from '@/modules/account/components/account-form';
import { AccountTable } from '@/modules/account/components/account-table';
import {
    useAccountSearchParams,
    useAccountsList,
    useDeleteAccount,
} from '@/modules/account/hooks/use-accounts';
import { Account } from '@/modules/account/types/account';
import { Plus } from 'lucide-react';

export default function AccountPage() {
    const { typeModal, editingData, openModal, closeModal } =
        useModal<Account>();
    const searchParams = useAccountSearchParams();

    const { data: accounts, isLoading } = useAccountsList(searchParams);

    const deleteMutation = useDeleteAccount();

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
                    <Heading title="Accounts" />
                    <Button onClick={() => openModal(ModalType.CREATE)}>
                        <Plus />
                        Create
                    </Button>
                </div>
                <Separator />
                {isLoading ? (
                    <DataTableSkeleton
                        columnCount={5}
                        rowCount={8}
                        filterCount={2}
                    />
                ) : (
                    <AccountTable
                        data={accounts?.data ?? []}
                        totalItems={accounts?.meta?.total ?? 0}
                        pageSize={accounts?.meta?.pageSize ?? 0}
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
                                : 'Create Account'}
                        </DialogTitle>
                    </DialogHeader>
                    <AccountForm
                        account={editingData ?? undefined}
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
