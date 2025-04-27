import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import {
    useAccountTypesList,
    useDeleteAccountType,
    useUpdateSortOrder,
} from '../hooks/use-account-types';
import { AccountType } from '../types/account-type';
import { AccountTypesTableSkeleton } from './account-types-table-skeleton';

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
            <TableCell>{accountType.sortOrder}</TableCell>
            <TableCell>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(accountType)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(accountType.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

interface AccountTypesTableProps {
    onEdit: (accountType: AccountType) => void;
}

export function AccountTypesTable({ onEdit }: AccountTypesTableProps) {
    const { data: accountTypesResponse, isLoading } = useAccountTypesList();
    const accountTypes = accountTypesResponse?.data || [];
    const deleteMutation = useDeleteAccountType();
    const updateSortOrderMutation = useUpdateSortOrder();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = accountTypes.findIndex(
            (item: AccountType) => item.id === active.id
        );
        const newIndex = accountTypes.findIndex(
            (item: AccountType) => item.id === over.id
        );

        const newOrder = [...accountTypes];
        const [removed] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, removed);

        updateSortOrderMutation.mutate({
            ids: newOrder.map((item: AccountType) => item.id),
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this account type?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return <AccountTypesTableSkeleton />;
    }

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Sort Order</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <SortableContext
                        items={accountTypes.map((item: AccountType) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {accountTypes.map((accountType: AccountType) => (
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
    );
}
