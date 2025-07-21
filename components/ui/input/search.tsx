import { cn } from '@/lib/utils';
import { Input, InputProps } from 'antd';
import debounce from 'lodash/debounce';
import { useTranslations } from 'next-intl';
import { ChangeEventHandler } from 'react';

export interface AppSearchProps extends InputProps {
    onChange?: ChangeEventHandler<HTMLInputElement>;
    wrapperClassName?: string;
    delay?: number;
}

export default function AppSearch({
    onChange = () => {},
    wrapperClassName,
    delay = 300,
    ...props
}: AppSearchProps) {
    const messages = useTranslations();

    const debounceSearchChange = debounce(onChange, delay);
    return (
        <div className={cn('w-full lg:w-56', wrapperClassName)}>
            <Input
                id={props.defaultValue?.toString() ?? Math.random().toString()}
                onChange={(e) => debounceSearchChange(e)}
                placeholder={messages('common.search')}
                allowClear
                {...props}
            />
        </div>
    );
}
