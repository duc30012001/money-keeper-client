import { cn } from '@/lib/utils';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { UserRole } from '../enums/user';

interface Props extends SelectProps {}

export default function UserRoleSelect(props: Props) {
    const messages = useTranslations();

    const options: SelectProps['options'] = [
        {
            label: messages('user.role.admin'),
            value: UserRole.ADMIN,
        },
        {
            label: messages('user.role.user'),
            value: UserRole.USER,
        },
    ];

    return (
        <Select
            allowClear
            placeholder={messages('user.role.title')}
            {...props}
            className={cn('w-full', props.className)}
            options={options}
        />
    );
}
