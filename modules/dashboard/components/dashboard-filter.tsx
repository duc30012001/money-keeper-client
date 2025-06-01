'use client';

import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useAccountsList } from '@/modules/account/hooks/use-accounts';
import { useCategoriesList } from '@/modules/category/hooks/use-categories';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { getDashboardTableColumn } from './dashboard-column';

interface DashboardFilterParams {}

export function DashboardFilter({}: DashboardFilterParams) {
    const { data: accounts } = useAccountsList({ pageSize: 1000 });
    const { data: categories } = useCategoriesList({ pageSize: 1000 });

    const columns = useMemo<ColumnDef<any>[]>(
        () =>
            getDashboardTableColumn({
                accounts: accounts?.data || [],
                categories: categories?.data || [],
            }),
        [accounts?.data, categories?.data]
    );

    const { table } = useDataTable({
        data: [],
        columns,
        pageCount: 0,
        rowCount: 0,
        shallow: false, //Setting to false triggers a network request with the updated querystring.
        getRowId: (originalRow) => originalRow.id,
        clearOnDefault: true,
    });

    return (
        <DataTableToolbar className="w-fit" table={table} viewOptions={false} />
    );
}
