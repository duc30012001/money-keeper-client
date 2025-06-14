'use client';

import { DataTable } from '@/components/data-table/data-table';
import { useDataTable } from '@/hooks/use-data-table';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColumnDef, getExpandedRowModel } from '@tanstack/react-table';
import { CategoryAnalytic } from '../types/category';

interface CategoryTableAnalyticParams<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    totalItems: number;
    pageSize: number;
    title: string;
}

export function CategoryAnalyticTable({
    data,
    columns,
    totalItems,
    pageSize,
    title,
}: CategoryTableAnalyticParams<CategoryAnalytic, unknown>) {
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
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable
                    table={table}
                    showPagination={false}
                    className="h-[400px]"
                />
            </CardContent>
        </Card>
    );
}
