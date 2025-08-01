import AppSearch, { AppSearchProps } from '@/components/ui/input/search';
import { cn } from '@/lib/utils';
import { Empty, theme } from 'antd';
import Image from 'next/image';
import { Icon } from '../types/icon';

interface IconListProps {
    data: Partial<Record<string, Icon[]>>;
    onSelect?: (icon: Icon) => void;
    className?: string;
    titleClassName?: string;
    rootClassName?: string;
    searchProps?: AppSearchProps;
}

export function IconList({
    data,
    onSelect,
    className,
    titleClassName,
    rootClassName,
    searchProps,
}: IconListProps) {
    const { token } = theme.useToken();
    const listKey = Object.keys(data);
    return (
        <div className="">
            <div
                className={cn('sticky top-16 z-[5] mb-2 p-1', rootClassName)}
                style={{ backgroundColor: token.colorBgContainer }}
            >
                <AppSearch {...searchProps} />
            </div>
            <div className="space-y-10">
                {listKey.length > 0 ? (
                    listKey.map((type) => {
                        return (
                            <div id={type} key={type} className="">
                                <h2
                                    className={cn(
                                        'sticky top-24 z-[2] mb-3 py-2.5 font-medium',
                                        titleClassName
                                    )}
                                    style={{
                                        backgroundColor: token.colorBgContainer,
                                    }}
                                >
                                    {type}
                                </h2>
                                <div
                                    className={cn(
                                        'grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10',
                                        className
                                    )}
                                >
                                    {(data[type] ?? []).map((icon: Icon) => (
                                        <IconItem
                                            data={icon}
                                            onSelect={onSelect}
                                            key={icon.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>
        </div>
    );
}

interface IconItemProps {
    data: Icon;
    onSelect?: (icon: Icon) => void;
    className?: string;
}

export function IconItem({ data, onSelect, className }: IconItemProps) {
    return (
        <div
            onClick={() => onSelect?.(data)}
            title={data.name}
            key={data.id}
            className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-lg px-2 py-4 hover:bg-gray-100 dark:hover:bg-zinc-800',
                className
            )}
        >
            <div className="mb-2 h-8 w-auto overflow-hidden rounded-lg">
                <Image
                    alt={data.name}
                    src={data.url}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover object-center"
                />
            </div>
            <div className="w-full">
                <p className="truncate text-center text-sm">{data.name}</p>
            </div>
        </div>
    );
}
