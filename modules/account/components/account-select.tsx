import { cn } from '@/lib/utils';
import { IconLabel } from '@/modules/icon/components/icon-label';
import { Select, SelectProps, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useAccountsList } from '../hooks/use-accounts';

type Props = {} & SelectProps;

function AccountSelect({ className, ...props }: Props) {
    const messages = useTranslations();

    const { data, isFetching } = useAccountsList({ pageSize: 1000 });

    const options = (data?.data ?? []).map((item) => ({
        value: item.id,
        label: item.name,
        icon: item.icon?.url,
    }));

    return (
        <Select
            notFoundContent={
                !isFetching ? (
                    <div className="flex h-10 w-full items-center justify-center">
                        <Spin size="small" />
                    </div>
                ) : undefined
            }
            placeholder={messages('account.title')}
            showSearch
            className={cn('w-full', className)}
            maxTagCount={'responsive'}
            allowClear
            {...props}
            filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase()) ??
                false
            }
            options={options}
            optionRender={({ data }) => (
                <IconLabel title={data.label} url={data.icon} />
            )}
        />
    );
}

export default AccountSelect;
