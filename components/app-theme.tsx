import { ThemeMode } from '@/enums/common';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { Button, ButtonProps, Dropdown, DropdownProps } from 'antd';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AppThemeProps extends DropdownProps {
    buttonProps?: ButtonProps;
}

export default function AppTheme({ buttonProps, ...props }: AppThemeProps) {
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

    const data = items.find((item) => item?.key === themeMode) as MenuItemType;

    return (
        <Dropdown
            trigger={['click']}
            {...props}
            menu={{
                items,
                onClick: (e) => setThemeMode(e.key as ThemeMode),
                activeKey: themeMode,
            }}
        >
            <Button {...buttonProps}>{data?.icon}</Button>
        </Dropdown>
    );
}
