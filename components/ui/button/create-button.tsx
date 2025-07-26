import { Button, ButtonProps } from 'antd';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

interface CreateButtonProps extends ButtonProps {
    label?: ReactNode;
}

export function CreateButton({ label, ...props }: CreateButtonProps) {
    const messages = useTranslations();

    return (
        <Button type="primary" {...props}>
            {label ?? messages('action.create.button')}
        </Button>
    );
}
