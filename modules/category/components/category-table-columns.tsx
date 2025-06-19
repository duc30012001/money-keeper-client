'use client';

import { ActionTypeBadge } from '@/components/action-type-badge';
import { Button } from '@/components/ui/button';
import { CATEGORY_TYPE_OPTIONS } from '@/constants/common';
import { IconLabel } from '@/modules/icon/components/icon-label';
import { ColumnDef } from '@tanstack/react-table';
import { Dot, SquareMinus, SquarePlus, Text } from 'lucide-react';
import { Category } from '../types/category';
import { CellAction } from './category-table-action';

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
        id: 'type',
        accessorKey: 'type',
        header: 'Action Type',
        enableColumnFilter: true,
        meta: {
            label: 'Action type',
            variant: 'multiSelect',
            options: CATEGORY_TYPE_OPTIONS.map((item) => ({
                label: item.label,
                value: item.value,
            })),
        },
        cell: ({ getValue }) => {
            const type = getValue<Category['type']>();
            return <ActionTypeBadge type={type} />;
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
