import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { formatDate } from '@/lib/format';
import { Account } from '@/modules/account/types/account';
import { Category } from '@/modules/category/types/category';
import { ColumnDef, ColumnMeta } from '@tanstack/react-table';

interface GetTransactionTableColumnProps {
    accounts: Account[];
    categories: Category[];
}

function getCategoriesOptions(categories: Category[], level = 0) {
    const result: ColumnMeta<any, unknown>['options'] = [];

    // two non-breaking spaces per level
    const indentUnit = '\u00A0';

    categories.forEach((category) => {
        const indent = indentUnit.repeat(level * 5);
        result.push({
            label: `${indent}${category.name}`,
            value: category.id,
        });
        if (category.children.length) {
            result.push(...getCategoriesOptions(category.children, level + 1));
        }
    });

    return result;
}

export function getDashboardTableColumn({
    accounts,
    categories,
}: GetTransactionTableColumnProps): ColumnDef<any>[] {
    return [
        {
            id: 'transactionDate',
            accessorKey: 'transactionDate',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Transaction Date"
                />
            ),
            meta: {
                label: 'Transaction Date',
                variant: 'dateRange',
            },
            enableColumnFilter: true,
            enableHiding: false,
            enableSorting: true,
            size: 200,
            cell: ({ row }) => formatDate(row.original.transactionDate),
        },
        {
            id: 'accountIds',
            accessorKey: 'accountIds',
            header: 'Account',
            enableColumnFilter: true,
            meta: {
                label: 'Account',
                variant: 'multiSelect',
                options:
                    accounts?.map((account) => ({
                        label: account.name,
                        value: account.id,
                    })) ?? [],
            },
            cell: ({ row }) => row.original.account?.name,
            size: 150,
            // enableHiding: false,
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: 'categoryIds',
            accessorKey: 'categoryIds',
            header: 'Category',
            enableColumnFilter: true,
            meta: {
                label: 'Category',
                variant: 'multiSelect',
                options: getCategoriesOptions(categories),
            },
            cell: ({ row }) => row.original.category?.name,
            size: 150,
            // enableHiding: false,
            enableSorting: false,
            enableHiding: false,
        },
    ];
}
