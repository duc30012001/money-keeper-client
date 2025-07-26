import { Button, ButtonProps, Tooltip, TooltipProps } from 'antd';
import { Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface DuplicateButtonProps extends ButtonProps {
    tooltipProps?: TooltipProps;
}

export function DuplicateButton({
    tooltipProps,
    ...props
}: DuplicateButtonProps) {
    const messages = useTranslations();
    return (
        <Tooltip title={messages('action.duplicate.button')} {...tooltipProps}>
            <Button type="text" icon={<Copy />} {...props} />
        </Tooltip>
    );
}
