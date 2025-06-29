import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { formatDate } from '@/lib/format';
import { Column, ColumnDef } from '@tanstack/react-table';
import { User } from '../types/user';
import { CellAction } from './user-table-action';

interface GetAccountTableColumnProps {
    onActiveChange: (id: string, isActive: boolean) => void;
}

export function getUserTableColumn({
    onActiveChange,
}: GetAccountTableColumnProps): ColumnDef<User>[] {
    return [
        {
            id: 'keyword',
            accessorKey: 'keyword',
            header: 'Email',
            meta: {
                label: 'Email',
                placeholder: 'Search users...',
                variant: 'text',
            },
            enableColumnFilter: true,
            enableHiding: false,
            size: 250,
            cell: ({ row }) => row.original.email,
        },
        {
            id: 'roles',
            accessorKey: 'roles',
            header: 'Roles',
            enableHiding: false,
            size: 250,
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-2">
                    {row.original.roles.map((item) => (
                        <Badge key={item} variant="outline">
                            {item}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            id: 'isActive',
            accessorKey: 'isActive',
            header: 'Active',
            enableColumnFilter: true,
            enableHiding: false,
            size: 150,
            meta: {
                label: 'Active',
                variant: 'select',
                options: [
                    {
                        label: 'Active',
                        value: 'true',
                    },
                    {
                        label: 'Inactive',
                        value: 'false',
                    },
                ],
            },
            cell: ({ row }) => (
                <Switch
                    checked={row.original.isActive}
                    onCheckedChange={(checked) =>
                        onActiveChange(row.original.id, checked)
                    }
                />
            ),
        },
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: ({ column }: { column: Column<User, unknown> }) => (
                <DataTableColumnHeader column={column} title="Created At" />
            ),
            meta: {
                label: 'Created At',
            },
            enableSorting: true,
            size: 150,
            cell: ({ row }) => formatDate(row.original.createdAt),
        },
        {
            id: 'updatedAt',
            accessorKey: 'updatedAt',
            header: ({ column }: { column: Column<User, unknown> }) => (
                <DataTableColumnHeader column={column} title="Updated At" />
            ),
            meta: {
                label: 'Updated At',
            },
            enableSorting: true,
            size: 150,
            cell: ({ row }) => formatDate(row.original.updatedAt),
        },
        {
            id: 'actions',
            cell: ({ row }) => <CellAction data={row.original} />,
            size: 80,
        },
    ];
}
