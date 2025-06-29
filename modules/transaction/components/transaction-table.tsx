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
import { useTransactionSearchParams } from '../hooks/use-transactions';
import { Transaction } from '../types/transaction';
import { getTransactionTableColumn } from './transaction-table-column';

interface TransactionTableParams<TData> {
    data: TData[];
    pageCount: number;
    pageSize: number;
    pageIndex: number;
    rowCount: number;
}

export function TransactionTable({
    data,
    pageCount,
    pageSize,
    pageIndex,
    rowCount,
}: TransactionTableParams<Transaction>) {
    const { openModal } = useModal<Transaction>();

    const searchParams = useTransactionSearchParams();
    const { data: accounts } = useAccountsList({ pageSize: 1000 });
    const { data: categories } = useCategoriesList({
        pageSize: 1000,
        type: searchParams.type,
    });

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
        rowCount,
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
        <DataTable table={table} className="max-h-[calc(100vh-13rem)]">
            <DataTableToolbar table={table}>
                <DataTableSortList table={table} align="end" />
            </DataTableToolbar>
        </DataTable>
    );
}
