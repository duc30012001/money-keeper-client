import { defaultLocale, Locale } from '@/enums/common';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: [Locale.EN, Locale.VI],

    // Used when no locale matches
    defaultLocale: defaultLocale,
});
