import { Locale } from '@/enums/common';
import { useLocale } from '@/hooks/use-locale';
import { Button, ButtonProps, Dropdown, DropdownProps } from 'antd';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface AppLocaleProps extends DropdownProps {
    buttonProps?: ButtonProps;
}

export default function AppLocale({ buttonProps, ...props }: AppLocaleProps) {
    const { locale, switchLocale } = useLocale();
    const messages = useTranslations();

    const items: ItemType[] = [
        {
            type: 'group',
            label: messages('setting.appearance.alert'),
        },
        {
            label: (
                <p className="flex items-center justify-start gap-2">
                    <Image
                        height={15}
                        width={30}
                        src={'/images/languages/vi.svg'}
                        alt={Locale.VI}
                    />
                    {messages('language.vietnamese')}
                </p>
            ),
            key: Locale.VI,
        },
        {
            label: (
                <p className="flex items-center justify-start gap-2">
                    <Image
                        height={15}
                        width={30}
                        src={'/images/languages/en.svg'}
                        alt={Locale.EN}
                    />
                    {messages('language.english')}
                </p>
            ),
            key: Locale.EN,
        },
    ];

    const currentLocale = items.find(
        (item) => item?.key === locale
    ) as MenuItemType;

    return (
        <Dropdown
            trigger={['click']}
            {...props}
            menu={{
                items,
                onClick: ({ key }) => {
                    switchLocale(key as Locale);
                },
                activeKey: locale,
            }}
        >
            <Button {...buttonProps}>{currentLocale?.label}</Button>
        </Dropdown>
    );
}
