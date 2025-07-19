'use client';

import AppContainer from '@/components/app-container';
import { ProCard } from '@ant-design/pro-components';

export default function DashboardPage() {
    return (
        <AppContainer>
            <ProCard>
                <h2 className="text-gray-900 dark:text-gray-100">Hello</h2>
                <div className="h-[150vh]"></div>
            </ProCard>
        </AppContainer>
    );
}
