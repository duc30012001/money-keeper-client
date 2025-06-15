import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import type * as React from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
    table: TanstackTable<TData>;
    actionBar?: React.ReactNode;
    showPagination?: boolean;
}

export function DataTable<TData>({
    table,
    actionBar,
    children,
    className,
    showPagination = true,
    ...props
}: DataTableProps<TData>) {
    return (
        <div className="space-y-2.5">
            {children}
            <div
                className={cn(
                    'flex flex-col overflow-hidden rounded-md border',
                    className
                )}
                {...props}
            >
                <div className="sticky top-0 z-10 bg-background">
                    <Table>
                        <TableHeader>
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
                    </Table>
                </div>
                <div className="flex-1 overflow-auto">
                    <Table>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <colgroup key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <col
                                        key={header.id}
                                        style={{
                                            width: `${header.getSize()}px`,
                                        }}
                                    />
                                ))}
                            </colgroup>
                        ))}
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
                </div>
                {showPagination && (
                    <div className="sticky bottom-0 z-10 border-t">
                        <Table>
                            <TableFooter>
                                <DataTablePagination table={table} />
                                {actionBar &&
                                    table.getFilteredSelectedRowModel().rows
                                        .length > 0 &&
                                    actionBar}
                            </TableFooter>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}
