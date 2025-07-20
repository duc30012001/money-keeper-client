import { appConfig } from '@/constants/app';
import { SIDEBAR_ITEMS } from '@/enums/routes';
import { routing } from '@/i18n/routing';
import AntdProvider from '@/providers/antd';
import { Metadata } from 'next';
import { pathname } from 'next-extra/pathname';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const { title } = appConfig;
    let titleValue = title;

    const route = await pathname();

    const value = SIDEBAR_ITEMS.find(
        (item) => `/${locale}` + item.href === route
    );
    if (value) {
        titleValue += ` - ${value.title}`;
    }

    return {
        title: titleValue,
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider>
                    <AntdProvider>
                        <NuqsAdapter>{children}</NuqsAdapter>
                    </AntdProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
