import { cn } from '@/lib/utils';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useIconsList } from '../hooks/use-icons';

type Props = {} & SelectProps;

function IconSelect({ ...props }: Props) {
    const messages = useTranslations();

    const { data } = useIconsList();

    const options = (data?.data ?? []).map((data) => ({
        value: data.id,
        label: (
            <p className="flex items-center gap-2">
                <Image src={data.url} width={24} height={24} alt={data.name} />
                <span>{data.name}</span>
            </p>
        ),
        string: data.name + ' ' + data.id,
    }));

    return (
        <Select
            placeholder={messages('icon.title')}
            showSearch
            allowClear
            {...props}
            className={cn('w-full lg:w-48', props.className)}
            filterOption={(input, option) =>
                option?.string.toLowerCase().includes(input.toLowerCase()) ??
                false
            }
            options={options}
        />
    );
}

export default IconSelect;
