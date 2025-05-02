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
import { ModalType } from '@/enums/common';
import { useModal } from '@/hooks/use-modal';
import { AccountTypeForm } from '@/modules/account-type/components/account-type-form';
import { AccountTypesTable } from '@/modules/account-type/components/account-type-table';
import { useDeleteAccountType } from '@/modules/account-type/hooks/use-account-types';
import { AccountType } from '@/modules/account-type/types/account-type';
import { Plus } from 'lucide-react';

export default function AccountTypesPage() {
    const { typeModal, editingData, openModal, closeModal } =
        useModal<AccountType>();

    const deleteMutation = useDeleteAccountType();

    const confirmDelete = () => {
        if (editingData) {
            deleteMutation.mutate(editingData.id, {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <Heading title="Account Types" />
                    <Button onClick={() => openModal(ModalType.CREATE)}>
                        <Plus />
                        Create
                    </Button>
                </div>
                <div className="border-y">
                    <AccountTypesTable />
                </div>
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
                                ? 'Edit ' + editingData.name
                                : 'Create Account Type'}
                        </DialogTitle>
                    </DialogHeader>
                    <AccountTypeForm
                        accountType={editingData ?? undefined}
                        onSuccess={closeModal}
                    />
                </DialogContent>
            </Dialog>

            <AlertModal
                isOpen={typeModal === ModalType.DELETE}
                onClose={closeModal}
                onConfirm={confirmDelete}
                loading={deleteMutation.isPending}
                description={`Are you sure you want to delete "${editingData?.name}"? This action cannot be undone.`}
            />
        </PageContainer>
    );
}
