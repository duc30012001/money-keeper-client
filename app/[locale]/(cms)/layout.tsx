import CMSLayout from '@/components/layouts/cms';
import { authOptions } from '@/modules/auth/next-auth';
import { Spin } from 'antd';
import { getServerSession } from 'next-auth';

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const cookieStore = await cookies();
    // const cookieData = cookieStore.getAll();
    // console.log('cookieData:', cookieData);

    // const url = process.env.NEXTAUTH_URL + '/api/auth/session';
    // const { data } = await axios.get(url);
    // console.log('data:', data);

    const session = await getServerSession(authOptions);

    if (session?.user) {
        return <CMSLayout>{children}</CMSLayout>;
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <Spin spinning />
        </div>
    );
}
