import { ReactNode } from 'react';
import AppModal, { AppModalProps } from './app-modal';

export type ConfirmModalProps = {
    typeDelete?: boolean;
    description: ReactNode;
} & Omit<AppModalProps, 'children'>;

const ConfirmModal = ({
    description = '',
    typeDelete = true,
    ...props
}: ConfirmModalProps) => {
    return (
        <AppModal
            {...props}
            okButtonProps={{
                danger: typeDelete,
                ghost: typeDelete,
            }}
            cancelButtonProps={{
                type: !typeDelete ? 'default' : 'primary',
                ghost: true,
            }}
        >
            {description}
        </AppModal>
    );
};

export default ConfirmModal;
