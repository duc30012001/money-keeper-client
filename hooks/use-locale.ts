'use client';

import { Locale } from '@/enums/common';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale as useLocaleIntl } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export const useLocale = () => {
    const locale = useLocaleIntl() as Locale;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const queryParams: any = {};
    searchParams?.forEach((value, key) => {
        queryParams[key] = value;
    });

    const switchLocale = (value: Locale) => {
        router.replace({ pathname, query: queryParams }, { locale: value });
    };

    return {
        locale,
        switchLocale,
    };
};
