import { Button, ButtonProps, Tooltip, TooltipProps } from 'antd';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface DeleteButtonProps extends ButtonProps {
    tooltipProps?: TooltipProps;
}

export function DeleteButton({ tooltipProps, ...props }: DeleteButtonProps) {
    const messages = useTranslations();
    return (
        <Tooltip title={messages('common.delete')} {...tooltipProps}>
            <Button type="text" icon={<Trash2 />} {...props} />
        </Tooltip>
    );
}
