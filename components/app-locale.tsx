import { Locale } from '@/enums/common';
import { useLocale } from '@/hooks/use-locale';
import { Button, ButtonProps, Dropdown, DropdownProps } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface AppLocaleProps extends DropdownProps {
    buttonProps?: ButtonProps;
}

export default function AppLocale({ buttonProps, ...props }: AppLocaleProps) {
    const { locale, switchLocale } = useLocale();
    const messages = useTranslations();

    const options = [
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
            value: Locale.VI,
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
            value: Locale.EN,
        },
    ];

    const currentLocale = options.find((option) => option.value === locale);

    return (
        <Dropdown
            {...props}
            trigger={['click']}
            menu={{
                items: options.map((option) => ({
                    key: option.value,
                    label: option.label,
                })),
                onClick: ({ key }) => switchLocale(key as Locale),
                activeKey: locale,
            }}
        >
            <Button {...buttonProps}>{currentLocale?.label}</Button>
        </Dropdown>
    );
}
