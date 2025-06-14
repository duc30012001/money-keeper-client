'use client';

import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/format-number';
import { ColumnDef } from '@tanstack/react-table';
import { Dot, SquareMinus, SquarePlus } from 'lucide-react';
import { CategoryAnalytic } from '../types/category';

export const columns: ColumnDef<CategoryAnalytic>[] = [
    {
        id: 'keyword',
        accessorKey: 'keyword',
        header: ({ table }) => (
            <>
                <Button
                    {...{
                        onClick: table.getToggleAllRowsExpandedHandler(),
                    }}
                    variant="ghost"
                >
                    {table.getIsAllRowsExpanded() ? (
                        <SquareMinus />
                    ) : (
                        <SquarePlus />
                    )}{' '}
                    Name
                </Button>
            </>
        ),
        cell: ({ row }) => (
            <div
                style={{
                    paddingLeft: `${row.depth * 2}rem`,
                }}
            >
                <div className="flex items-center">
                    {row.getCanExpand() ? (
                        <Button
                            {...{
                                onClick: row.getToggleExpandedHandler(),
                            }}
                            variant="ghost"
                        >
                            {row.getIsExpanded() ? (
                                <SquareMinus />
                            ) : (
                                <SquarePlus />
                            )}
                        </Button>
                    ) : (
                        <Button variant="ghost" className="invisible">
                            <Dot />
                        </Button>
                    )}
                    {row.original.name}
                </div>
            </div>
        ),
        size: 400,
    },
    {
        id: 'amount',
        accessorKey: 'amount',
        header: 'Amount',
        size: 200,
        cell: ({ row }) => formatNumber(row.original.amount),
    },
];
