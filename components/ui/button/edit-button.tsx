import { Button, ButtonProps, Tooltip, TooltipProps } from 'antd';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface EditButtonProps extends ButtonProps {
    tooltipProps?: TooltipProps;
}

export function EditButton({ tooltipProps, ...props }: EditButtonProps) {
    const messages = useTranslations();
    return (
        <Tooltip title={messages('action.update.button')} {...tooltipProps}>
            <Button type="text" icon={<Pencil />} {...props} />
        </Tooltip>
    );
}
