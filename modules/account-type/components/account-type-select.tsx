import { cn } from '@/lib/utils';
import { IconLabel } from '@/modules/icon/components/icon-label';
import { Select, SelectProps, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useAccountTypesList } from '../hooks/use-account-types';

type Props = {
    externalOnChange?: SelectProps['onChange'];
} & SelectProps;

function AccountTypeSelect({ externalOnChange, ...props }: Props) {
    const messages = useTranslations();

    const { data, isFetching } = useAccountTypesList();

    const options = (data?.data ?? []).map((item) => ({
        value: item.id,
        label: item.name,
        icon: item.icon?.url,
        iconId: item.icon?.id,
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
            placeholder={messages('accountType.title')}
            showSearch
            allowClear
            maxTagCount="responsive"
            {...props}
            onChange={(...agrs) => {
                props.onChange?.(...agrs);
                externalOnChange?.(...agrs);
            }}
            className={cn('w-full', props.className)}
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

export default AccountTypeSelect;
