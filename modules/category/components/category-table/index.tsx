'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';

import { ColumnDef, getExpandedRowModel } from '@tanstack/react-table';
import { Category } from '../../types/category';

interface CategoryTableParams<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    totalItems: number;
    pageSize: number;
}

export function CategoryTable({
    data,
    columns,
    totalItems,
    pageSize,
}: CategoryTableParams<Category, unknown>) {
    const pageCount = Math.ceil(totalItems / pageSize);

    const { table } = useDataTable({
        data,
        columns,
        pageCount: pageCount,
        shallow: false, //Setting to false triggers a network request with the updated querystring.
        getSubRows: (row) => row.children,
        getExpandedRowModel: getExpandedRowModel(),
        defaultColumn: {
            size: 200, //starting column size
            minSize: 50, //enforced during column resizing
            maxSize: 300, //enforced during column resizing
        },
    });

    return (
        <DataTable table={table} showPagination={false}>
            <DataTableToolbar table={table} />
        </DataTable>
    );
}
