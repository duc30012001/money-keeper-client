import { DateFormat } from '@/enums/common';
import dayjs from 'dayjs';

export function formatDate(
    date: Date | string | number | undefined,
    format = DateFormat.DATETIME
) {
    if (!date) return '';

    try {
        return dayjs(date).format(format);
    } catch (err) {
        console.log('formatDate error:', err);
        return null;
    }
}

export function formatNumber(
    value: number | string = 0,
    options?: Intl.NumberFormatOptions
): string {
    return new Intl.NumberFormat([], options).format(Number(value));
}

export function calculatePercent(value: number, total: number) {
    return ((value / total) * 100).toFixed(2);
}
