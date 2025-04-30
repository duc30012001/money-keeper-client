'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModalType } from '@/enums/common';
import { useModal } from '@/hooks/use-modal';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDeleteCategory } from '../../hooks/use-categories';
import { Category } from '../../types/category';

interface CellActionProps {
    data: Category;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const [loading] = useState(false);

    const { editingData, typeModal, openModal, closeModal } =
        useModal<Category>();

    const deleteMutation = useDeleteCategory();

    const onConfirm = async () => {
        await deleteMutation.mutateAsync(data.id, {
            onSuccess: () => {
                closeModal();
            },
        });
    };

    return (
        <>
            <AlertModal
                isOpen={typeModal === ModalType.DELETE}
                onClose={closeModal}
                onConfirm={onConfirm}
                loading={loading}
                value={editingData?.name}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <EllipsisVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={() => openModal(ModalType.EDIT, data)}
                    >
                        <Pencil className="mr-2 h-4 w-4" /> Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => openModal(ModalType.DELETE, data)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
