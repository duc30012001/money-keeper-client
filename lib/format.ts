import dayjs from 'dayjs';
import { getBrowserLocale } from './locale';

export function formatDate(
    date: Date | string | number | undefined,
    format = 'HH:mm DD/MM/YYYY'
) {
    if (!date) return '';

    try {
        const locale = getBrowserLocale();
        return dayjs(date).locale(locale).format(format);
    } catch (err) {
        console.log('formatDate error:', err);
        return null;
    }
}
