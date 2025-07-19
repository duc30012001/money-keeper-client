'use client';

import AppLocale from '@/components/app-locale';
import AppTheme from '@/components/app-theme';
import { AppRoute } from '@/enums/routes';
import { Link } from '@/i18n/navigation';
import { Button } from 'antd';

export default function HomePage() {
    // const locale = await getLocale();
    // redirect({ href: AppRoute.DASHBOARD, locale });
    return (
        <div className="flex min-h-screen flex-col items-center justify-center space-y-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <h1>HomePage</h1>
            <AppLocale />
            <AppTheme />
            <Link href={AppRoute.DASHBOARD}>
                <Button type="primary">Dashboard</Button>
            </Link>
        </div>
    );
}
