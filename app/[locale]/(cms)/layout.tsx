'use client';

import CMSLayout from '@/components/layouts/cms';

export default function Layout({ children }: { children: React.ReactNode }) {
    // const { status } = useSession();
    // const { token } = theme.useToken();

    // if (status === 'authenticated') {
    return <CMSLayout>{children}</CMSLayout>;
    // }

    // return (
    //     <div
    //         className="flex min-h-screen w-full items-center justify-center"
    //         style={{ backgroundColor: token.colorBgContainer }}
    //     >
    //         <Spin spinning size="large" />
    //     </div>
    // );
}
