'use client';

import { AppRoute } from '@/enums/routes';
import { Link } from '@/i18n/navigation';
import { Button, Result } from 'antd';
import { useTranslations } from 'next-intl';

export default function ForbiddenPage() {
    const messages = useTranslations();
    return (
        <div className={'flex h-full flex-col items-center justify-center'}>
            <Result
                status="error"
                title={messages('auth.forbidden.title')}
                subTitle={messages('auth.forbidden.description')}
                extra={
                    <Link href={AppRoute.HOME} className="mt-6">
                        <Button type="primary">
                            {messages('action.back.button')}
                        </Button>
                    </Link>
                }
            />
        </div>
    );
}
