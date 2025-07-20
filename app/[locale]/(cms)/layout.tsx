'use client';

import CMSLayout from '@/components/layouts/cms';

export default function Layout({ children }: { children: React.ReactNode }) {
    return <CMSLayout>{children}</CMSLayout>;
}
