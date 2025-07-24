import { SortOrder } from '@/enums/common';
import { ColumnType } from 'antd/lib/table';

export function getSortOrder(
    value: SortOrder | undefined,
    columnKey: string,
    orderBy?: string
): ColumnType['sortOrder'] {
    if (columnKey !== orderBy) return null;
    if (value === SortOrder.ASC) return 'ascend';
    if (value === SortOrder.DESC) return 'descend';
    return null;
}

export const setSortOrder = (sort: ColumnType['sortOrder']) => {
    if (sort === 'ascend') return SortOrder.ASC;
    if (sort === 'descend') return SortOrder.DESC;
    return undefined;
};
