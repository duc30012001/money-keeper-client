'use client';

import { CreateButton } from '@/components/ui/button/create-button';
import { PageContainer, ProCard } from '@ant-design/pro-components';

export default function DashboardPage() {
    return (
        <PageContainer extra={[<CreateButton key={'create'} />]}>
            <ProCard>
                <h2 className="text-gray-900 dark:text-gray-100">Hello</h2>
            </ProCard>
        </PageContainer>
    );
}
