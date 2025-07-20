import { ThemeMode } from '@/enums/common';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { Button, Dropdown } from 'antd';
import { ItemType } from 'antd/lib/menu/interface';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AppTheme() {
    const messages = useTranslations();
    const { themeMode, setThemeMode } = useThemeMode();

    const items: ItemType[] = [
        {
            type: 'group',
            label: messages('setting.appearance.alert'),
        },
        {
            key: ThemeMode.SYSTEM,
            label: messages('setting.appearance.device'),
            icon: <MonitorIcon />,
        },
        {
            key: ThemeMode.LIGHT,
            label: messages('setting.appearance.light'),
            icon: <SunIcon />,
        },
        {
            key: ThemeMode.DARK,
            label: messages('setting.appearance.dark'),
            icon: <MoonIcon />,
        },
    ];

    const data = items.find((item) => item?.key === themeMode);

    return (
        <Dropdown
            menu={{
                items,
                onClick: (e) => setThemeMode(e.key as ThemeMode),
                activeKey: themeMode,
            }}
            trigger={['click']}
        >
            {/* @ts-ignore */}
            <Button>{data?.icon}</Button>
        </Dropdown>
    );
}
