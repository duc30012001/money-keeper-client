'use client';

import { ACTION_TYPE_OPTIONS } from '@/constants/common';
import { ColumnDef } from '@tanstack/react-table';
import { Dot, SquareMinus, SquarePlus, Text } from 'lucide-react';
import { Category } from '../../types/category';

import { ActionTypeBadge } from '@/components/action-type-badge';
import { Button } from '@/components/ui/button';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Category>[] = [
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
                    {row.original.name}
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
        enableHiding: false,
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
        cell: ({ getValue }) => {
            const actionType = getValue<Category['actionType']>();
            return <ActionTypeBadge type={actionType} />;
        },
        size: 150,
        enableHiding: false,
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: 'Description',
        meta: {
            label: 'Description',
        },
        size: 400,
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />,
        size: 100,
    },
];
