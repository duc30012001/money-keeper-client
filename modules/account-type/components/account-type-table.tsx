import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { ModalType } from '@/enums/common';
import { useModal } from '@/hooks/use-modal';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    useAccountTypesList,
    useUpdateSortOrder,
} from '../hooks/use-account-types';
import { AccountType } from '../types/account-type';
import { AccountTypesTableSkeleton } from './account-type-table-skeleton';

interface SortableRowProps {
    accountType: AccountType;
}

function SortableRow({ accountType }: SortableRowProps) {
    const { openModal } = useModal<AccountType>();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: accountType.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell>
                <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-grab"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4" />
                </Button>
            </TableCell>
            <TableCell>{accountType.name}</TableCell>
            <TableCell>{accountType.accountCount}</TableCell>
            <TableCell>{accountType.description || '-'}</TableCell>
            <TableCell>
                <div className="flex gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        openModal(ModalType.EDIT, accountType)
                                    }
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        openModal(ModalType.DELETE, accountType)
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    );
}

interface AccountTypesTableProps {}

export function AccountTypesTable({}: AccountTypesTableProps) {
    const [dataSource, setDataSource] = useState<AccountType[]>([]);

    const { data: accountTypesResponse, isLoading } = useAccountTypesList();
    const accountTypes = accountTypesResponse?.data || [];
    const updateSortOrderMutation = useUpdateSortOrder();

    useEffect(() => {
        setDataSource(accountTypes);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(accountTypes)]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = dataSource.findIndex(
            (item: AccountType) => item.id === active.id
        );
        const newIndex = dataSource.findIndex(
            (item: AccountType) => item.id === over.id
        );

        const newOrder = [...dataSource];
        const [removed] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, removed);

        updateSortOrderMutation.mutate({
            ids: newOrder.map((item: AccountType) => item.id),
        });

        setDataSource(newOrder);
    };

    if (isLoading) {
        return <AccountTypesTableSkeleton />;
    }

    return (
        <>
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20"></TableHead>
                            <TableHead className="w-48">Name</TableHead>
                            <TableHead className="w-20">
                                Account Count
                            </TableHead>
                            <TableHead className="w-60">Description</TableHead>
                            <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <SortableContext
                            items={dataSource.map(
                                (item: AccountType) => item.id
                            )}
                            strategy={verticalListSortingStrategy}
                        >
                            {dataSource.map((accountType: AccountType) => (
                                <SortableRow
                                    key={accountType.id}
                                    accountType={accountType}
                                />
                            ))}
                        </SortableContext>
                    </TableBody>
                </Table>
            </DndContext>
        </>
    );
}
