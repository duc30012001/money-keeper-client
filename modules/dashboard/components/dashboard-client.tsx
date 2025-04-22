// app/(admin)/dashboard/dashboard-client.tsx  ← Client Component
'use client';

import type { Session } from 'next-auth';

interface Props {
    session: Session | null;
}

export default function DashboardClient({ session }: Props) {
    console.log('session:', session);
    return <div>Welcome back!</div>;
}
