import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '../types/icon';

interface IconListProps {
    data: Icon[];
    onSelect?: (icon: Icon) => void;
    className?: string;
}

export function IconList({ data, onSelect, className }: IconListProps) {
    const [keyword, setKeyword] = useState<string>();

    const filteredData = data.filter((icon: Icon) =>
        icon.name.toLowerCase().includes(keyword?.toLowerCase() ?? '')
    );

    const groupByData = Object.groupBy(filteredData, ({ type }) => type);
    return (
        <div>
            <div className="mb-2 p-1">
                <Input
                    placeholder="Search icon..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>
            <div className="space-y-10">
                {Object.keys(groupByData).map((type) => {
                    return (
                        <div key={type} className="">
                            <h2 className="mb-3 font-medium">{type}</h2>
                            <div
                                className={cn(
                                    'grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10',
                                    className
                                )}
                            >
                                {(groupByData[type] ?? []).map((icon: Icon) => (
                                    <IconItem
                                        data={icon}
                                        onSelect={onSelect}
                                        key={icon.id}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
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
                'flex cursor-pointer flex-col items-center justify-center rounded-lg px-2 py-4 hover:bg-gray-100',
                className
            )}
        >
            <div className="mb-2 h-8 w-auto overflow-hidden rounded-lg">
                <Image
                    alt={data.name}
                    src={data.url}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover object-center"
                />
            </div>
            <div className="w-full">
                <p className="truncate text-center text-sm">{data.name}</p>
            </div>
        </div>
    );
}
