'use client';

import PageContainer from '@/components/page-container';
import { IconList } from '@/modules/icon/components/icon-list';
import { IconListSkeleton } from '@/modules/icon/components/icon-list-skeleton';
import { useIconsList } from '@/modules/icon/hooks/use-icons';
import { Icon } from '@/modules/icon/types/icon';
import { toast } from 'react-toastify';

export default function IconsPage() {
    const { data: icons, isLoading } = useIconsList();

    const handleCopy = (data: Icon) => {
        navigator.clipboard.writeText(data.name);
        toast.success('Copied to clipboard!', { position: 'top-center' });
    };

    return (
        <PageContainer>
            <div className="flex flex-1 flex-col space-y-4">
                {isLoading ? (
                    <IconListSkeleton />
                ) : (
                    <IconList data={icons?.data ?? []} onSelect={handleCopy} />
                )}
            </div>
        </PageContainer>
    );
}
