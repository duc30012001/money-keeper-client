'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { AccountTypeForm } from '@/modules/account-type/components/account-type-form';
import { AccountTypesTable } from '@/modules/account-type/components/account-type-table';
import { AccountType } from '@/modules/account-type/types/account-type';
import { useState } from 'react';

export default function AccountTypesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAccountType, setEditingAccountType] = useState<
        AccountType | undefined
    >();

    const handleEdit = (accountType: AccountType) => {
        setEditingAccountType(accountType);
        setIsDialogOpen(true);
    };

    const handleSuccess = () => {
        setIsDialogOpen(false);
        setEditingAccountType(undefined);
    };

    return (
        <div>
            <div className="">
                <div className="flex items-center justify-end p-2">
                    <Dialog
                        open={isDialogOpen}
                        onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) {
                                setEditingAccountType(undefined);
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button>Create</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingAccountType
                                        ? 'Edit ' + editingAccountType.name
                                        : 'Create Account Type'}
                                </DialogTitle>
                            </DialogHeader>
                            <AccountTypeForm
                                accountType={editingAccountType}
                                onSuccess={handleSuccess}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="border-y">
                    <AccountTypesTable onEdit={handleEdit} />
                </div>
            </div>
        </div>
    );
}
