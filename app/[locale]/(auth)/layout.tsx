import AuthLayout from '@/components/layouts/auth';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
    return <AuthLayout>{children}</AuthLayout>;
}
