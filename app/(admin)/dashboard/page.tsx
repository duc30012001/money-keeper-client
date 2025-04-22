import { authOptions } from '@/modules/auth/next-auth';
import DashboardClient from '@/modules/dashboard/components/dashboard-client';
import { getServerSession } from 'next-auth';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    return <DashboardClient session={session} />;
}
