'use client';

import { Locale } from '@/enums/common';
import { useLocale } from '@/hooks/use-locale';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import { PropsWithChildren } from 'react';

function AntdProvider({ children }: PropsWithChildren) {
    const { locale } = useLocale();
    const { algorithm } = useThemeMode();

    return (
        <ConfigProvider
            locale={locale === Locale.VI ? viVN : enUS}
            form={{
                requiredMark: 'optional',
            }}
            theme={{
                algorithm,
            }}
        >
            {children}
        </ConfigProvider>
    );
}

export default AntdProvider;
