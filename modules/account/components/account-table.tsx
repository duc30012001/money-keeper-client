'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useAccountTypesList } from '@/modules/account-type/hooks/use-account-types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Account } from '../types/account';
import { getAccountTableColumn } from './account-table-column';

interface AccountTableParams<TData> {
    data: TData[];
    pageCount: number;
    pageSize: number;
    pageIndex: number;
    rowCount: number;
}

export function AccountTable({
    data,
    pageCount,
    pageSize,
    pageIndex,
    rowCount,
}: AccountTableParams<Account>) {
    const { data: accountTypes } = useAccountTypesList();

    const columns = useMemo<ColumnDef<Account>[]>(
        () =>
            getAccountTableColumn({
                accountTypes: accountTypes?.data || [],
            }),
        [accountTypes?.data]
    );

    const { table } = useDataTable({
        data,
        columns,
        pageCount,
        rowCount,
        shallow: false, //Setting to false triggers a network request with the updated querystring.
        defaultColumn: {
            size: 200, //starting column size
            minSize: 50, //enforced during column resizing
            maxSize: 300, //enforced during column resizing
        },
        initialState: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
    });

    return (
        <DataTable table={table}>
            <DataTableToolbar table={table} />
        </DataTable>
    );
}
