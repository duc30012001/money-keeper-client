import { ThemeMode } from '@/enums/common';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { Button, Dropdown } from 'antd';
import { ItemType } from 'antd/lib/menu/interface';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

export default function AppTheme() {
    const { themeMode, setThemeMode } = useThemeMode();

    const items: ItemType[] = [
        {
            key: ThemeMode.LIGHT,
            label: 'Light',
            icon: <SunIcon />,
        },
        {
            key: ThemeMode.DARK,
            label: 'Dark',
            icon: <MoonIcon />,
        },
        {
            key: ThemeMode.SYSTEM,
            label: 'System',
            icon: <MonitorIcon />,
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
