import { getBrowserLocale } from './locale';

export function formatNumber(
    value: number | string,
    options?: Intl.NumberFormatOptions
): string {
    const locale = getBrowserLocale();
    return new Intl.NumberFormat(locale, options).format(Number(value));
}
