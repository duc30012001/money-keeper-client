'use client';

import AppContainer from '@/components/app-container';
import { CreateButton } from '@/components/ui/button/create-button';
import { useTranslations } from 'next-intl';

export default function AccountsPage() {
    const messages = useTranslations();

    return (
        <AppContainer
            extra={[<CreateButton key={'create'} />]}
            title={messages('account.title')}
        >
            <div className="h-full bg-zinc-700">AccountsPage</div>
        </AppContainer>
    );
}
