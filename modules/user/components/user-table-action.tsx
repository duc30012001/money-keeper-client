'use client';
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
import { EllipsisVertical, Pencil } from 'lucide-react';
import { User } from '../types/user';

interface CellActionProps {
    data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const { openModal } = useModal<User>();

    return (
        <>
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
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
