import { ActionTypeBadge, MoneyBadge } from '@/components/action-type-badge';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TRANSACTION_TYPE_OPTIONS } from '@/constants/common';
import { ModalType } from '@/enums/common';
import { formatDate } from '@/lib/format';
import { formatNumber } from '@/lib/format-number';
import { Account } from '@/modules/account/types/account';
import { Category } from '@/modules/category/types/category';
import { IconLabel } from '@/modules/icon/components/icon-label';
import { ColumnDef, ColumnMeta } from '@tanstack/react-table';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { Transaction } from '../types/transaction';

interface GetTransactionTableColumnProps {
    accounts: Account[];
    categories: Category[];
    openModal: (type: ModalType, data?: Transaction) => void;
}

function getCategoriesOptions(categories: Category[], level = 0) {
    const result: ColumnMeta<Transaction, unknown>['options'] = [];

    categories.forEach((category) => {
        result.push({
            label: (
                <IconLabel
                    name={category.name}
                    url={category.icon?.url}
                    avatarClassName="size-4"
                    style={{ paddingLeft: `${level * 20}px` }}
                />
            ) as unknown as string,
            value: category.id,
            childrenIds: category.children.map((item) => item.id),
            parentId: category.parent?.id,
        });
        if (category.children.length) {
            result.push(...getCategoriesOptions(category.children, level + 1));
        }
    });

    return result;
}

export function getTransactionTableColumn({
    accounts,
    categories,
    openModal,
}: GetTransactionTableColumnProps): ColumnDef<Transaction>[] {
    return [
        // {
        //     id: 'keyword',
        //     accessorKey: 'keyword',
        //     header: 'Name',
        //     cell: ({ row }) => row.original.name,
        //     meta: {
        //         label: 'Name',
        //         placeholder: 'Search transactions...',
        //         variant: 'text',
        //         icon: Text,
        //     },
        //     enableColumnFilter: true,
        //     enableHiding: false,
        // },
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
            size: 180,
            cell: ({ row }) => formatDate(row.original.transactionDate),
        },
        {
            id: 'amount',
            accessorKey: 'amount',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Amount" />
            ),
            meta: {
                label: 'Amount',
                variant: 'range',
                range: [0, 1000000000],
            },
            enableColumnFilter: true,
            enableHiding: false,
            enableSorting: true,
            size: 150,
            cell: ({ row }) => (
                <MoneyBadge
                    amount={formatNumber(row.original.amount)}
                    type={row.original.type}
                />
            ),
        },
        {
            id: 'type',
            accessorKey: 'type',
            header: 'Type',
            enableColumnFilter: true,
            meta: {
                label: 'Type',
                variant: 'multiSelect',
                options: TRANSACTION_TYPE_OPTIONS.map((transactionType) => ({
                    label: transactionType.label,
                    value: transactionType.value,
                })),
            },
            cell: ({ row }) => <ActionTypeBadge type={row.original.type} />,
            size: 120,
            // enableHiding: false,
            enableSorting: false,
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
                        label: (
                            <IconLabel
                                name={account.name}
                                url={account.icon?.url}
                                avatarClassName="size-4"
                            />
                        ) as unknown as string,
                        value: account.id,
                    })) ?? [],
            },
            cell: ({ row }) => {
                const name = row.original.account?.name;
                const icon = row.original.account?.icon;

                if (!name) return null;

                return <IconLabel name={name} url={icon?.url} />;
            },
            size: 180,
            // enableHiding: false,
            enableSorting: false,
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
            cell: ({ row }) => {
                const name = row.original.category?.name;
                const icon = row.original.category?.icon;

                if (!name) return null;

                return <IconLabel name={name} url={icon?.url} />;
            },
            size: 180,
            // enableHiding: false,
            enableSorting: false,
        },
        {
            id: 'senderAccountIds',
            accessorKey: 'senderAccountIds',
            header: 'Sender Account',
            enableColumnFilter: true,
            meta: {
                label: 'Sender Account',
                variant: 'multiSelect',
                options:
                    accounts?.map((account) => ({
                        label: (
                            <IconLabel
                                name={account.name}
                                url={account.icon?.url}
                                avatarClassName="size-4"
                            />
                        ) as unknown as string,
                        value: account.id,
                    })) ?? [],
            },
            cell: ({ row }) => {
                const name = row.original.senderAccount?.name;
                const icon = row.original.senderAccount?.icon;

                if (!name) return null;

                return <IconLabel name={name} url={icon?.url} />;
            },
            size: 180,
            // enableHiding: false,
            enableSorting: false,
        },
        {
            id: 'receiverAccountIds',
            accessorKey: 'receiverAccountIds',
            header: 'Receiver Account',
            enableColumnFilter: true,
            meta: {
                label: 'Receiver Account',
                variant: 'multiSelect',
                options:
                    accounts?.map((account) => ({
                        label: (
                            <IconLabel
                                name={account.name}
                                url={account.icon?.url}
                                avatarClassName="size-4"
                            />
                        ) as unknown as string,
                        value: account.id,
                    })) ?? [],
            },
            cell: ({ row }) => {
                const name = row.original.receiverAccount?.name;
                const icon = row.original.receiverAccount?.icon;

                if (!name) return null;

                return <IconLabel name={name} url={icon?.url} />;
            },
            size: 180,
            // enableHiding: false,
            enableSorting: false,
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: 'Description',
            meta: {
                label: 'Description',
            },
            size: 350,
            enableSorting: false,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
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
                            onClick={() =>
                                openModal(ModalType.EDIT, row.original)
                            }
                        >
                            <Pencil className="mr-2 h-4 w-4" /> Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                openModal(ModalType.DELETE, row.original)
                            }
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            size: 50,
        },
    ];
}
