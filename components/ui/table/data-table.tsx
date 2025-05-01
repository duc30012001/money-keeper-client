import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import * as React from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
    table: TanstackTable<TData>;
    actionBar?: React.ReactNode;
    showPagination?: boolean;
    // isLoading?: boolean;
    // skeletonProps?: DataTableSkeletonProps;
}

export function DataTable<TData>({
    table,
    actionBar,
    children,
    showPagination = true,
    // isLoading = false,
    // skeletonProps,
}: DataTableProps<TData>) {
    // if (isLoading) {
    //     return (
    //         <div className="flex flex-1 flex-col space-y-4">
    //             {children}
    //             <DataTableSkeleton withViewOptions={false} {...skeletonProps} />
    //         </div>
    //     );
    // }

    return (
        <div className="flex flex-1 flex-col space-y-4">
            {children}
            <div className="relative flex flex-1 overflow-hidden rounded-lg border">
                {/* <div className="absolute inset-0 flex overflow-hidden rounded-lg border"> */}
                {/* <ScrollArea className='h-full w-full'> */}
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={{
                                            width: `${header.getSize()}px`,
                                        }}
                                        // style={{
                                        //     ...getCommonPinningStyles({
                                        //         column: header.column,
                                        //     }),
                                        // }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            className="whitespace-break-spaces break-words"
                                            key={cell.id}
                                            // style={{
                                            //     ...getCommonPinningStyles({
                                            //         column: cell.column,
                                            //     }),
                                            // }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* <ScrollBar orientation="horizontal" /> */}
                {/* </ScrollArea> */}
                {/* </div> */}
            </div>
            {showPagination && (
                <div className="flex flex-col gap-2.5">
                    <DataTablePagination table={table} />
                    {actionBar &&
                        table.getFilteredSelectedRowModel().rows.length > 0 &&
                        actionBar}
                </div>
            )}
        </div>
    );
}
