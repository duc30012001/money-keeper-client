// import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
// import type * as React from 'react';

// import { DataTablePagination } from '@/components/data-table/data-table-pagination';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from '@/components/ui/table';
// import { cn } from '@/lib/utils';
// import { ScrollArea } from '../ui/scroll-area';

// interface DataTableProps<TData> extends React.ComponentProps<'div'> {
//     table: TanstackTable<TData>;
//     actionBar?: React.ReactNode;
//     showPagination?: boolean;
//     tableContainerClassName?: string;
// }

// export function DataTable<TData>({
//     table,
//     actionBar,
//     children,
//     className,
//     showPagination = true,
//     tableContainerClassName,
//     ...props
// }: DataTableProps<TData>) {
//     return (
//         <div
//             className={cn(
//                 'flex w-full flex-col gap-2.5 overflow-auto',
//                 className
//             )}
//             {...props}
//         >
//             {children}
//             <ScrollArea
//                 className={cn(
//                     'h-full w-full rounded-md border',
//                     tableContainerClassName
//                 )}
//             >
//                 <Table>
//                     <TableHeader className="sticky top-0">
//                         {table.getHeaderGroups().map((headerGroup) => (
//                             <TableRow key={headerGroup.id}>
//                                 {headerGroup.headers.map((header) => (
//                                     <TableHead
//                                         key={header.id}
//                                         colSpan={header.colSpan}
//                                         style={{
//                                             width: `${header.getSize()}px`,
//                                         }}
//                                         // style={{
//                                         //     ...getCommonPinningStyles({
//                                         //         column: header.column,
//                                         //     }),
//                                         // }}
//                                     >
//                                         {header.isPlaceholder
//                                             ? null
//                                             : flexRender(
//                                                   header.column.columnDef
//                                                       .header,
//                                                   header.getContext()
//                                               )}
//                                     </TableHead>
//                                 ))}
//                             </TableRow>
//                         ))}
//                     </TableHeader>

//                     <TableBody>
//                         {table.getRowModel().rows?.length ? (
//                             table.getRowModel().rows.map((row) => (
//                                 <TableRow
//                                     key={row.id}
//                                     data-state={
//                                         row.getIsSelected() && 'selected'
//                                     }
//                                 >
//                                     {row.getVisibleCells().map((cell) => (
//                                         <TableCell
//                                             className="whitespace-break-spaces break-words"
//                                             key={cell.id}
//                                             // style={{
//                                             //     ...getCommonPinningStyles({
//                                             //         column: cell.column,
//                                             //     }),
//                                             // }}
//                                         >
//                                             {flexRender(
//                                                 cell.column.columnDef.cell,
//                                                 cell.getContext()
//                                             )}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell
//                                     colSpan={table.getAllColumns().length}
//                                     className="h-24 text-center"
//                                 >
//                                     No results.
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </ScrollArea>
//             {showPagination && (
//                 <div className="flex flex-col gap-2.5">
//                     <DataTablePagination table={table} />
//                     {actionBar &&
//                         table.getFilteredSelectedRowModel().rows.length > 0 &&
//                         actionBar}
//                 </div>
//             )}
//         </div>
//     );
// }
