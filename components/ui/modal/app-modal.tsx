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
            cancelButtonProps={{ disabled: loading }}
            closable={!loading}
            maskClosable={!loading}
            // maskClosable={false}
            {...props}
        >
            {children}
        </Modal>
    );
}

export default AppModal;
