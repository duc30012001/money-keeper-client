import { cn } from '@/lib/utils';
import { IconLabel } from '@/modules/icon/components/icon-label';
import { Spin, TreeSelect, TreeSelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { CategoryType } from '../enums/category';
import { useCategoriesList } from '../hooks/use-categories';
import { Category } from '../types/category';

type Props = {
    type?: CategoryType;
} & TreeSelectProps;

function CategorySelect({ type, ...props }: Props) {
    const messages = useTranslations();

    const { data, isFetching } = useCategoriesList({
        type,
    });

    const getTreeData = (data: Category[]): TreeSelectProps['treeData'] => {
        const result = data.map((item) => {
            const children =
                item.children.length > 0
                    ? getTreeData(item.children)
                    : undefined;
            return {
                value: item.id,
                title: item.name,
                icon: item.icon?.url,
                children,
            };
        });
        return result;
    };

    const treeData = getTreeData(data?.data ?? []);

    return (
        <TreeSelect
            notFoundContent={
                !isFetching ? (
                    <div className="flex h-10 w-full items-center justify-center">
                        <Spin size="small" />
                    </div>
                ) : undefined
            }
            placeholder={messages('category.title')}
            showSearch
            filterTreeNode={(input, option) =>
                (option?.title as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase()) ?? false
            }
            allowClear
            maxTagCount="responsive"
            treeDefaultExpandAll
            {...props}
            className={cn('w-full', props.className)}
            treeData={treeData}
            treeTitleRender={(data) => (
                <IconLabel
                    title={data.title as string}
                    url={data.icon as string}
                />
            )}
        />
    );
}

export default CategorySelect;
