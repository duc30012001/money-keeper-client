import { Form, FormItemProps } from 'antd';

interface AppFormItem extends FormItemProps {}

export default function AppFormItem({ children, ...props }: AppFormItem) {
    return <Form.Item {...props}>{children}</Form.Item>;
}
