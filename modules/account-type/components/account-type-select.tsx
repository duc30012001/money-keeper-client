import { cn } from '@/lib/utils';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useAccountTypesList } from '../hooks/use-account-types';

type Props = {} & SelectProps;

function AccountTypeSelect({ ...props }: Props) {
    const messages = useTranslations();

    const { data } = useAccountTypesList();

    const options = (data?.data ?? []).map((item) => ({
        value: item.id,
        label: item.name,
    }));

    return (
        <Select
            placeholder={messages('accountType.title')}
            showSearch
            allowClear
            maxTagCount="responsive"
            {...props}
            className={cn('w-full', props.className)}
            filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase()) ??
                false
            }
            options={options}
        />
    );
}

export default AccountTypeSelect;
