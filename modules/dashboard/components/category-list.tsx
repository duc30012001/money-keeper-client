import { removeEmptyChildren } from '@/lib/array';
import { formatNumber } from '@/lib/format';
import { Card, Table, TableProps } from 'antd';
import { useTranslations } from 'next-intl';
import CategoryTypeSelect from '../../category/components/category-type-select';
import { CategoryType } from '../../category/enums/category';
import { CategoryAnalytic } from '../../category/types/category';
import { IconLabel } from '../../icon/components/icon-label';

type Props = {
    data: CategoryAnalytic[];
    type: CategoryType;
    loading?: boolean;
    onChange?: (value: any) => void;
};

function CategoryList({ data, type, loading, onChange }: Props) {
    const messages = useTranslations();

    const columns: TableProps<CategoryAnalytic>['columns'] = [
        {
            title: messages('category.name'),
            key: 'name',
            dataIndex: 'name',
            ellipsis: true,
            render: (_, record) => (
                <IconLabel
                    className="ml-2"
                    title={record.name}
                    url={record.icon?.url}
                    description={formatNumber(record.amount)}
                    iconProps={{
                        size: 28,
                    }}
                />
            ),
        },
    ];

    return (
        <Card
            title={messages('category.title')}
            className="h-full"
            extra={
                <CategoryTypeSelect
                    className="w-40"
                    value={type}
                    onChange={onChange}
                />
            }
            styles={{
                body: {
                    padding: 0,
                    paddingTop: 1,
                },
            }}
        >
            <Table<CategoryAnalytic>
                showHeader={false}
                columns={columns}
                rowKey="id"
                dataSource={removeEmptyChildren(data ?? [])}
                loading={loading}
                size="small"
                pagination={false}
                scroll={{
                    y: 470,
                }}
            />
        </Card>
    );
}

export default CategoryList;
