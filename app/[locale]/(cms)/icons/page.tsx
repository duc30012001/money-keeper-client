'use client';

import AppContainer from '@/components/app-container';
import { CreateButton } from '@/components/ui/button/create-button';
import { ProCard } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

export default function IconsPage() {
    const messages = useTranslations();

    return (
        <AppContainer
            extra={[<CreateButton key={'create'} />]}
            title={messages('icon.title')}
        >
            <ProCard>
                <div />
            </ProCard>
        </AppContainer>
    );
}
