'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableSortList } from '@/components/data-table/data-table-sort-list';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useModal } from '@/hooks/use-modal';
import { useAccountsList } from '@/modules/account/hooks/use-accounts';
import { useCategoriesList } from '@/modules/category/hooks/use-categories';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Transaction } from '../types/transaction';
import { getTransactionTableColumn } from './transaction-table-column';

interface TransactionTableParams<TData> {
    data: TData[];
    pageCount: number;
    pageSize: number;
    pageIndex: number;
}

export function TransactionTable({
    data,
    pageCount,
    pageSize,
    pageIndex,
}: TransactionTableParams<Transaction>) {
    const { openModal } = useModal<Transaction>();

    const { data: accounts } = useAccountsList({ pageSize: 1000 });
    const { data: categories } = useCategoriesList({ pageSize: 1000 });

    const columns = useMemo<ColumnDef<Transaction>[]>(
        () =>
            getTransactionTableColumn({
                accounts: accounts?.data || [],
                categories: categories?.data || [],
                openModal: openModal,
            }),
        [accounts?.data, categories?.data, openModal]
    );

    const { table } = useDataTable({
        data,
        columns,
        pageCount,
        shallow: false, //Setting to false triggers a network request with the updated querystring.
        getRowId: (originalRow) => originalRow.id,
        clearOnDefault: true,
        defaultColumn: {
            size: 200, //starting column size
            minSize: 50, //enforced during column resizing
            maxSize: 300, //enforced during column resizing
        },
        initialState: {
            columnVisibility: {
                type: false,
            },
            pagination: {
                pageIndex,
                pageSize,
            },
        },
    });

    return (
        <DataTable table={table}>
            <DataTableToolbar table={table}>
                <DataTableSortList table={table} align="end" />
            </DataTableToolbar>
        </DataTable>
    );
}
