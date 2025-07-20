import { cn } from '@/lib/utils';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useAccountsList } from '../hooks/use-accounts';

type Props = {} & SelectProps;

function AccountSelect({ className, ...props }: Props) {
    const messages = useTranslations();

    const { data } = useAccountsList({ pageSize: 1000 });

    const options = (data?.data ?? []).map((data) => ({
        value: data.id,
        label: data.name,
    }));

    return (
        <Select
            placeholder={messages('account.title')}
            showSearch
            className={cn('w-full', className)}
            {...props}
            filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase()) ??
                false
            }
            options={options}
        />
    );
}

export default AccountSelect;
