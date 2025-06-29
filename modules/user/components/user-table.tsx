'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useUpdateUser } from '../hooks/use-users';
import { User } from '../types/user';
import { getUserTableColumn } from './user-table-column';

interface UserTableParams<TData> {
    data: TData[];
    pageCount: number;
    pageSize: number;
    pageIndex: number;
    rowCount: number;
}

export function UserTable({
    data,
    pageCount,
    pageSize,
    pageIndex,
    rowCount,
}: UserTableParams<User>) {
    const updateMutation = useUpdateUser();

    const onActiveChange = (id: string, isActive: boolean) => {
        updateMutation.mutateAsync({
            id,
            data: {
                isActive,
            },
        });
    };

    const columns = getUserTableColumn({
        onActiveChange,
    });

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
            columnVisibility: {
                initialBalance: false,
            },
        },
    });

    return (
        <DataTable table={table} className="max-h-[calc(100vh-14rem)]">
            <DataTableToolbar table={table} />
        </DataTable>
    );
}
