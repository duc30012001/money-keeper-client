import { formatDate } from '@/lib/format';
import { formatNumber } from '@/lib/format-number';
import { AccountType } from '@/modules/account-type/types/account-type';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { Account } from '../types/account';
import { CellAction } from './account-table-action';

interface GetAccountTableColumnProps {
    accountTypes: AccountType[];
}

export function getAccountTableColumn({
    accountTypes,
}: GetAccountTableColumnProps): ColumnDef<Account>[] {
    return [
        {
            id: 'keyword',
            accessorKey: 'keyword',
            header: 'Name',
            cell: ({ row }) => row.original.name,
            meta: {
                label: 'Name',
                placeholder: 'Search accounts...',
                variant: 'text',
                icon: Text,
            },
            enableColumnFilter: true,
            enableHiding: false,
        },
        {
            id: 'balance',
            accessorKey: 'balance',
            header: 'Balance',
            // header: ({ column }: { column: Column<Account, unknown> }) => (
            //     <DataTableColumnHeader column={column} title="Balance" />
            // ),
            meta: {
                label: 'Balance',
                variant: 'range',
                // range: [0, 1000000000],
            },
            // enableColumnFilter: true,
            enableHiding: false,
            // enableSorting: true,
            cell: ({ row }) => formatNumber(row.original.balance),
        },
        {
            id: 'initialBalance',
            accessorKey: 'initialBalance',
            header: 'Initial Balance',
            meta: {
                label: 'Initial Balance',
                variant: 'range',
                range: [0, 1000000000],
            },
            // enableColumnFilter: true,
            enableHiding: false,
            cell: ({ row }) => formatNumber(row.original.initialBalance),
        },
        {
            id: 'accountTypeIds',
            accessorKey: 'accountTypeIds',
            header: 'Account Type',
            enableColumnFilter: true,
            meta: {
                label: 'Account type',
                variant: 'multiSelect',
                options:
                    accountTypes.map((accountType) => ({
                        label: accountType.name,
                        value: accountType.id,
                    })) ?? [],
            },
            cell: ({ row }) => row.original.accountType.name,
            size: 150,
            enableHiding: false,
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: 'Description',
            meta: {
                label: 'Description',
            },
            size: 200,
        },
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: 'Created At',
            meta: {
                label: 'Updated At',
            },
            enableSorting: true,
            size: 150,
            cell: ({ row }) => formatDate(row.original.createdAt),
        },
        {
            id: 'updatedAt',
            accessorKey: 'updatedAt',
            header: 'Updated At',
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
