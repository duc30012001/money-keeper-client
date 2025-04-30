'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Dot, SquareMinus, SquarePlus, Text } from 'lucide-react';
import { Category } from '../../types/category';
import { ACTION_TYPE_OPTIONS } from './options';

import { Button } from '@/components/ui/button';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Category>[] = [
    {
        accessorKey: 'name',
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
        cell: ({ row, cell }) => (
            <div
                style={{
                    // Since rows are flattened by default,
                    // we can use the row.depth property
                    // and paddingLeft to visually indicate the depth
                    // of the row
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
                    {cell.getValue<Category['name']>()}
                </div>
            </div>
        ),
        meta: {
            label: 'Name',
            placeholder: 'Search categories...',
            variant: 'text',
            icon: Text,
        },
        enableColumnFilter: true,
    },
    // {
    //     id: 'name',
    //     accessorKey: 'name',
    //     header: 'Name',
    //     cell: ({ cell }) => <div>{cell.getValue<Category['name']>()}</div>,
    //     meta: {
    //         label: 'Name',
    //         placeholder: 'Search categories...',
    //         variant: 'text',
    //         icon: Text,
    //     },
    //     enableColumnFilter: true,
    // },
    {
        id: 'actionType',
        accessorKey: 'actionType',
        header: 'Action Type',
        enableColumnFilter: true,
        meta: {
            label: 'Action type',
            variant: 'multiSelect',
            options: ACTION_TYPE_OPTIONS,
        },
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: 'Description',
        meta: {
            label: 'Description',
        },
    },

    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
