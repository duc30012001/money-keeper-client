import { Locale } from '@/enums/common';
import { cn } from '@/lib/utils';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

interface Props extends SelectProps {}

export default function LocaleSelect(props: Props) {
    const messages = useTranslations();

    const options: SelectProps['options'] = [
        {
            label: messages('language.english'),
            value: Locale.EN,
        },
        {
            label: messages('language.vietnamese'),
            value: Locale.VI,
        },
    ];

    return (
        <Select
            placeholder={messages('language.select')}
            {...props}
            className={cn('w-full', props.className)}
            options={options}
        />
    );
}
