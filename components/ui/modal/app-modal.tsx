import { Modal, ModalProps } from 'antd';
import { ReactNode } from 'react';

export type AppModalProps = {
    children?: ReactNode;
    loading?: boolean;
} & ModalProps;

function AppModal({ loading, children, ...props }: AppModalProps) {
    return (
        <Modal
            confirmLoading={loading}
            closable={!loading}
            maskClosable={!loading}
            // maskClosable={false}
            {...props}
            cancelButtonProps={{
                disabled: loading,
                ...props.cancelButtonProps,
            }}
        >
            {children}
        </Modal>
    );
}

export default AppModal;
