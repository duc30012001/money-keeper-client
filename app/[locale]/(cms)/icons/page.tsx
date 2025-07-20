'use client';

import { useFilter } from '@/hooks/use-filter';
import { IconList } from '@/modules/icon/components/icon-list';
import { IconListSkeleton } from '@/modules/icon/components/icon-list-skeleton';
import { useIconsList } from '@/modules/icon/hooks/use-icons';
import { Icon } from '@/modules/icon/types/icon';
import { BaseQuery } from '@/types/common';
import { Anchor, Col, Row } from 'antd';
import { parseAsString } from 'nuqs';
import { toast } from 'react-toastify';

export default function IconsPage() {
    const { filterValues, onSearch } = useFilter<BaseQuery>({
        keyword: parseAsString,
    });

    const { data: icons, isLoading } = useIconsList();

    const filteredData = (icons?.data ?? []).filter((icon: Icon) =>
        icon.name
            .toLowerCase()
            .includes(filterValues.keyword?.toLowerCase() ?? '')
    );

    const groupByTypeData = Object.groupBy(filteredData, ({ type }) => type);

    const handleCopy = (data: Icon) => {
        navigator.clipboard.writeText(data.name);
        toast.success('Copied to clipboard!', { position: 'top-center' });
    };

    return (
        <Row>
            <Col span={20}>
                <div className="rounded-lg bg-white p-5">
                    {isLoading ? (
                        <IconListSkeleton />
                    ) : (
                        <IconList
                            data={groupByTypeData}
                            onSelect={handleCopy}
                            searchProps={{
                                defaultValue: filterValues.keyword,
                                onChange: onSearch,
                            }}
                        />
                    )}
                </div>
            </Col>
            <Col span={4}>
                <Anchor
                    items={Object.keys(groupByTypeData).map((type) => {
                        return {
                            key: type,
                            href: `#${type}`,
                            title: type,
                        };
                    })}
                />
            </Col>
        </Row>
    );
}
