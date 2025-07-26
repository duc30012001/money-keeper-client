'use client';

import CMSLayout from '@/components/layouts/cms';
import { Spin, theme } from 'antd';
import { useSession } from 'next-auth/react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { data } = useSession();
    console.log('data:', data);
    const { token } = theme.useToken();

    if (data?.user) {
        return <CMSLayout>{children}</CMSLayout>;
    }

    return (
        <div
            className="flex min-h-screen w-full items-center justify-center"
            style={{ backgroundColor: token.colorBgContainer }}
        >
            <Spin spinning />
        </div>
    );
}
