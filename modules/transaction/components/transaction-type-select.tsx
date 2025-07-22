import { cn } from '@/lib/utils';
import { Select, SelectProps, theme } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { CircleMinus, CirclePlus, RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TransactionType } from '../enums/transaction';

interface Props extends SelectProps {
    externalOnChange?: (
        value: any,
        option?: DefaultOptionType | DefaultOptionType[] | undefined,
        preValue?: any
    ) => void;
}

export default function TransactionTypeSelect({
    externalOnChange,
    ...props
}: Props) {
    const { token } = theme.useToken();
    const messages = useTranslations();

    const options: SelectProps['options'] = [
        {
            label: messages('transaction.type.expense'),
            value: TransactionType.EXPENSE,
            icon: <CircleMinus />,
            color: token.colorErrorText,
        },
        {
            label: messages('transaction.type.income'),
            value: TransactionType.INCOME,
            icon: <CirclePlus />,
            color: token.colorSuccessText,
        },
        {
            label: messages('transaction.type.transfer.title'),
            value: TransactionType.TRANSFER,
            icon: <RefreshCcw />,
            color: token.colorInfoText,
        },
    ];

    return (
        <Select
            placeholder={messages('transaction.type.title')}
            maxTagCount={'responsive'}
            {...props}
            className={cn('w-full', props.className)}
            options={options}
            onChange={(...agrs) => {
                props.onChange?.(...agrs);
                externalOnChange?.(...agrs, props?.value);
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
