'use client';

import AppLocale from '@/components/app-locale';
import AppLogo from '@/components/app-logo';
import AppTheme from '@/components/app-theme';
import SupportButton from '@/components/ui/button/support-button';
import { theme } from 'antd';
import { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
    const { token } = theme.useToken();

    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center px-4 py-6"
            style={{ backgroundColor: token.colorBgLayout }}
        >
            <div className="w-full max-w-[400px]">
                <div className="mb-8">
                    <AppLogo className="mx-auto" />
                </div>
                <div
                    className="rounded-2xl border p-6 shadow-xl sm:p-8 lg:p-10"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        borderColor: token.colorBorder,
                    }}
                >
                    {children}
                </div>
            </div>
            <SupportButton />
            <div className="fixed right-10 top-10 flex items-center">
                <AppLocale buttonProps={{ type: 'text' }} />
                <AppTheme buttonProps={{ type: 'text' }} />
            </div>
        </div>
    );
}
