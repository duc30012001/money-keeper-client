import { cn } from '@/lib/utils';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

interface Props extends SelectProps {}

export default function UserStatusSelect(props: Props) {
    const messages = useTranslations();

    const options: SelectProps['options'] = [
        {
            label: messages('status.active'),
            value: true as any,
        },
        {
            label: messages('status.inactive'),
            value: false as any,
        },
    ];

    return (
        <Select
            allowClear
            placeholder={messages('status.title')}
            {...props}
            className={cn('w-full lg:w-48', props.className)}
            options={options}
        />
    );
}
