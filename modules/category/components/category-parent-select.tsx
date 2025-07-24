import { cn } from '@/lib/utils';
import { IconLabel } from '@/modules/icon/components/icon-label';
import { Select, SelectProps, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { CategoryType } from '../enums/category';
import { useCategoriesList } from '../hooks/use-categories';

type Props = {
    type?: CategoryType;
} & SelectProps;

function CategoryParentSelect({ type, ...props }: Props) {
    const messages = useTranslations();

    const { data, isFetching } = useCategoriesList({
        type,
    });

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
            placeholder={messages('category.parent')}
            showSearch
            allowClear
            maxTagCount="responsive"
            {...props}
            className={cn('w-full', props.className)}
            filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase()) ??
                false
            }
            optionRender={({ data }) => (
                <IconLabel title={data.label} url={data.icon} />
            )}
            options={options}
        />
    );
}

export default CategoryParentSelect;
