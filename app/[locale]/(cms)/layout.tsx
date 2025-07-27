import CMSLayout from '@/components/layouts/cms';
import { Spin } from 'antd';
import axios from 'axios';
import { cookies } from 'next/headers';

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const cookieString = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');

    const url = process.env.NEXTAUTH_URL + '/api/auth/session';
    const { data } = await axios.get(url, {
        headers: {
            Cookie: cookieString,
        },
    });

    // const session = await getServerSession(authOptions);

    if (data?.user) {
        return <CMSLayout>{children}</CMSLayout>;
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <Spin spinning />
        </div>
    );
}
