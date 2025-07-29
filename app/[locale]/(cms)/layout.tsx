import CMSLayout from '@/components/layouts/cms';

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <CMSLayout>{children}</CMSLayout>;
}
