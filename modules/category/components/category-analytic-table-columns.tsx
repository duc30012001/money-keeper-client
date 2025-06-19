'use client';

import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/format-number';
import { IconLabel } from '@/modules/icon/components/icon-label';
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
        cell: ({ row }) => {
            const { name, icon } = row.original;
            return (
                <div
                    style={{
                        // Since rows are flattened by default,
                        // we can use the row.depth property
                        // and paddingLeft to visually indicate the depth
                        // of the row
                        paddingLeft: `${row.depth * 2}rem`,
                    }}
                >
                    <div className="flex items-center gap-2">
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
                        <IconLabel name={name} url={icon?.url} />
                    </div>
                </div>
            );
        },
    },
    {
        id: 'amount',
        accessorKey: 'amount',
        header: 'Amount',
        size: 200,
        cell: ({ row }) => formatNumber(row.original.amount),
    },
];
