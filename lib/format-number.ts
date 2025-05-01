import { getBrowserLocale } from './locale';

export function formatNumber(
    value: number,
    options?: Intl.NumberFormatOptions
): string {
    const locale = getBrowserLocale();
    return new Intl.NumberFormat(locale, options).format(value);
}
