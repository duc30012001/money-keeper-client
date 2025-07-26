'use client';

import { useFilter } from '@/hooks/use-filter';
import { IconList } from '@/modules/icon/components/icon-list';
import { IconListSkeleton } from '@/modules/icon/components/icon-list-skeleton';
import { useIconsList } from '@/modules/icon/hooks/use-icons';
import { Icon } from '@/modules/icon/types/icon';
import { BaseQuery } from '@/types/common';
import { Anchor, Col, Row, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { parseAsString } from 'nuqs';
import { toast } from 'react-toastify';

export default function IconsPage() {
    const messages = useTranslations();
    const { token } = theme.useToken();
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
        navigator.clipboard.writeText(data.id);
        const message = messages('action.copy.success');
        toast.success(message, {
            position: 'top-center',
            toastId: message,
            pauseOnFocusLoss: false,
        });
    };

    return (
        <Row
            style={{
                backgroundColor: token.colorBgContainer,
            }}
        >
            <Col span={20}>
                <div className="rounded-lg p-5">
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
                    offsetTop={64}
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
