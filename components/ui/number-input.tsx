import { cn } from '@/lib/utils';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Input } from './input';

type Props = {} & NumericFormatProps;

function NumberInput({ className, ...props }: Props) {
    return (
        <NumericFormat
            thousandSeparator={','}
            decimalScale={0}
            fixedDecimalScale={true}
            allowNegative={false}
            valueIsNumericString
            {...props}
            customInput={Input}
            className={cn(
                'relative [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                className
            )}
        />
    );
}

export default NumberInput;
