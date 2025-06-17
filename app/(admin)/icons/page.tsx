'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import PageContainer from '@/components/page-container';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ModalType } from '@/enums/common';
import { useModal } from '@/hooks/use-modal';
import { IconList } from '@/modules/icon/components/icon-list';
import { IconListSkeleton } from '@/modules/icon/components/icon-list-skeleton';
import { useDeleteIcon, useIconsList } from '@/modules/icon/hooks/use-icons';
import { Icon } from '@/modules/icon/types/icon';

export default function IconsPage() {
    const { typeModal, editingData, closeModal } = useModal<Icon>();
    const { data: icons, isLoading } = useIconsList();

    const deleteMutation = useDeleteIcon();

    const onConfirm = async () => {
        if (!editingData) return;
        await deleteMutation.mutateAsync(editingData.id, {
            onSuccess: () => {
                closeModal();
            },
        });
    };

    return (
        <PageContainer>
            <div className="flex flex-1 flex-col space-y-4">
                {/* <div className="flex items-start justify-between">
                    <Heading title="Icons" />
                    <Button onClick={() => openModal(ModalType.CREATE)}>
                        <Plus />
                        Create
                    </Button>
                </div>
                <Separator /> */}

                {isLoading ? (
                    // <DataTableSkeleton
                    //     columnCount={8}
                    //     filterCount={2}
                    //     cellWidths={[
                    //         '200px',
                    //         '200px',
                    //         '200px',
                    //         '150px',
                    //         '200px',
                    //         '150px',
                    //         '150px',
                    //         '80px',
                    //     ]}
                    // />
                    <IconListSkeleton />
                ) : (
                    <IconList
                        data={icons?.data ?? []}
                        // pageCount={accounts?.meta?.totalPages ?? 0}
                        // pageSize={accounts?.meta?.pageSize ?? 0}
                        // pageIndex={accounts?.meta?.page ?? 0}
                        // rowCount={accounts?.meta?.total ?? 0}
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
                                ? 'Edit ' + editingData.name
                                : 'Create Icon'}
                        </DialogTitle>
                    </DialogHeader>
                    {/* <AccountForm
                        account={editingData ?? undefined}
                        onSuccess={closeModal}
                    /> */}
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
