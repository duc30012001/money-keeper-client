import { InputNumber as InputNumberAntd, InputNumberProps } from 'antd';

interface Props extends InputNumberProps {}

export function inputNumberParse(value: string | undefined): number | string {
    return (value ?? '').replace(/,/g, '');
}

export default function InputNumber(props: Props) {
    return (
        <InputNumberAntd
            formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => inputNumberParse(value)}
            {...props}
            style={{ width: '100%', ...props.style }}
        />
    );
}
