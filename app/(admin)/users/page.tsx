'use client';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
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
import { UserFormCreate } from '@/modules/user/components/user-form-create';
import { UserFormUpdate } from '@/modules/user/components/user-form-update';
import { UserTable } from '@/modules/user/components/user-table';
import {
    useUserSearchParams,
    useUsersList,
} from '@/modules/user/hooks/use-users';
import { User } from '@/modules/user/types/user';
import { Plus } from 'lucide-react';

export default function UserPage() {
    const { typeModal, editingData, openModal, closeModal } = useModal<User>();
    const searchParams = useUserSearchParams();

    const { data: users, isLoading } = useUsersList(searchParams);

    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <Heading title="Users" />
                    <Button onClick={() => openModal(ModalType.CREATE)}>
                        <Plus />
                        Create
                    </Button>
                </div>
                <Separator />
                {isLoading ? (
                    <DataTableSkeleton
                        columnCount={8}
                        filterCount={2}
                        cellWidths={[
                            '200px',
                            '200px',
                            '200px',
                            '150px',
                            '200px',
                            '150px',
                            '150px',
                            '80px',
                        ]}
                    />
                ) : (
                    <UserTable
                        data={users?.data ?? []}
                        pageCount={users?.meta?.totalPages ?? 0}
                        pageSize={users?.meta?.pageSize ?? 0}
                        pageIndex={users?.meta?.page ?? 0}
                        rowCount={users?.meta?.total ?? 0}
                    />
                )}
            </div>

            {typeModal === ModalType.CREATE && (
                <Dialog
                    open
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
                                    ? 'Edit ' + editingData.email
                                    : 'Create User'}
                            </DialogTitle>
                        </DialogHeader>
                        <UserFormCreate />
                    </DialogContent>
                </Dialog>
            )}

            {typeModal === ModalType.EDIT && (
                <Dialog
                    open
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
                                    ? 'Edit ' + editingData.email
                                    : 'Edit User'}
                            </DialogTitle>
                        </DialogHeader>
                        <UserFormUpdate
                            user={editingData!}
                            onSuccess={closeModal}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </PageContainer>
    );
}
