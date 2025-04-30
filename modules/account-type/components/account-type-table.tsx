import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    useDeleteAccountType,
    useUpdateSortOrder,
} from '../hooks/use-account-types';
import { AccountType } from '../types/account-type';
import { AccountTypesTableSkeleton } from './account-type-table-skeleton';

interface SortableRowProps {
    accountType: AccountType;
    onEdit: (accountType: AccountType) => void;
    onDelete: (id: string) => void;
}

function SortableRow({ accountType, onEdit, onDelete }: SortableRowProps) {
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
            <TableCell>{accountType.description || '-'}</TableCell>
            {/* <TableCell>{accountType.sortOrder}</TableCell> */}
            <TableCell>
                <div className="flex gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(accountType)}
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
                                    onClick={() => onDelete(accountType.id)}
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

interface AccountTypesTableProps {
    onEdit: (accountType: AccountType) => void;
}

export function AccountTypesTable({ onEdit }: AccountTypesTableProps) {
    const [dataSource, setDataSource] = useState<AccountType[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [accountTypeToDelete, setAccountTypeToDelete] =
        useState<AccountType | null>(null);

    const { data: accountTypesResponse, isLoading } = useAccountTypesList();
    const accountTypes = accountTypesResponse?.data || [];
    const deleteMutation = useDeleteAccountType();
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

    const handleDelete = (id: string) => {
        const accountType = dataSource.find((item) => item.id === id);
        if (accountType) {
            setAccountTypeToDelete(accountType);
            setDeleteDialogOpen(true);
        }
    };

    const confirmDelete = () => {
        if (accountTypeToDelete) {
            deleteMutation.mutate(accountTypeToDelete.id, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setAccountTypeToDelete(null);
                },
            });
        }
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
                            <TableHead className="w-60">Description</TableHead>
                            {/* <TableHead>Sort Order</TableHead> */}
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
                                    onEdit={onEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </SortableContext>
                    </TableBody>
                </Table>
            </DndContext>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Account Type</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;
                            {accountTypeToDelete?.name}&quot;? This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending
                                ? 'Deleting...'
                                : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
