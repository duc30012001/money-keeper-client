import { cn } from '@/lib/utils';
import { Select, SelectProps, theme } from 'antd';
import { CircleMinus, CirclePlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CategoryType } from '../enums/category';

interface Props extends SelectProps {
    externalOnChange?: SelectProps['onChange'];
}

export default function CategoryTypeSelect({
    externalOnChange,
    ...props
}: Props) {
    const { token } = theme.useToken();
    const messages = useTranslations();

    const options: SelectProps['options'] = [
        {
            label: messages('transaction.type.expense'),
            value: CategoryType.EXPENSE,
            icon: <CircleMinus />,
            color: token.colorErrorText,
        },
        {
            label: messages('transaction.type.income'),
            value: CategoryType.INCOME,
            icon: <CirclePlus />,
            color: token.colorSuccessText,
        },
    ];

    return (
        <Select
            placeholder={messages('category.type')}
            {...props}
            className={cn('w-full', props.className)}
            options={options}
            onChange={(...agrs) => {
                props.onChange?.(...agrs);
                externalOnChange?.(...agrs);
            }}
            optionRender={({ data }) => (
                <p
                    className="flex items-center gap-2"
                    style={{
                        color: data.color,
                    }}
                >
                    {data.icon}
                    <span>{data.label}</span>
                </p>
            )}
        />
    );
}
