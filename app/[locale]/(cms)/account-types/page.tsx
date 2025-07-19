'use client';

import AppContainer from '@/components/app-container';
import { CreateButton } from '@/components/ui/button/create-button';
import { ProCard } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

export default function AccountTypesPage() {
    const messages = useTranslations();

    return (
        <AppContainer
            extra={[<CreateButton key={'create'} />]}
            title={messages('accountType.title')}
        >
            <ProCard>
                <div />
            </ProCard>
        </AppContainer>
    );
}
