'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';

import { formatNumber } from '@/lib/format-number';
import { useAccountTypesList } from '@/modules/account-type/hooks/use-account-types';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { useMemo } from 'react';
import { Account } from '../../types/account';
import { CellAction } from './cell-action';

interface AccountTableParams<TData> {
    data: TData[];
    totalItems: number;
    pageSize: number;
}

export function AccountTable({
    data,
    totalItems,
    pageSize,
}: AccountTableParams<Account>) {
    const { data: accountTypes } = useAccountTypesList();

    const columns = useMemo<ColumnDef<Account>[]>(
        () => [
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
                        accountTypes?.data?.map((accountType) => ({
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
                size: 400,
            },
            {
                id: 'actions',
                cell: ({ row }) => <CellAction data={row.original} />,
                size: 100,
            },
        ],
        [accountTypes?.data]
    );

    const pageCount = Math.ceil(totalItems / pageSize);

    const { table } = useDataTable({
        data,
        columns,
        pageCount: pageCount,
        shallow: false, //Setting to false triggers a network request with the updated querystring.
        defaultColumn: {
            size: 200, //starting column size
            minSize: 50, //enforced during column resizing
            maxSize: 300, //enforced during column resizing
        },
    });

    return (
        <DataTable table={table}>
            <DataTableToolbar table={table} />
        </DataTable>
    );
}
