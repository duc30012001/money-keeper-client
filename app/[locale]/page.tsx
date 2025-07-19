import { AppRoute } from '@/enums/routes';
import { redirect } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';

export default async function HomePage() {
    const locale = await getLocale();
    redirect({ href: AppRoute.DASHBOARD, locale });
}
