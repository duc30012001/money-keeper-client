import { Button, ButtonProps } from 'antd';
import { EllipsisVertical } from 'lucide-react';
import { DeleteButton, DeleteButtonProps } from './delete-button';
import { EditButton, EditButtonProps } from './edit-button';

interface Props extends ButtonProps {
    editProps?: EditButtonProps & {
        show?: boolean;
    };
    deleteProps?: DeleteButtonProps & {
        show?: boolean;
    };
}

function ActionButton({ editProps, deleteProps, ...props }: Props) {
    return (
        <div>
            <div className="hidden w-fit lg:flex">
                {(editProps?.show ?? true) && <EditButton {...editProps} />}
                {(deleteProps?.show ?? true) && (
                    <DeleteButton {...deleteProps} />
                )}
            </div>
            <div className="block lg:hidden">
                <Button type="text" icon={<EllipsisVertical />} {...props} />
            </div>
        </div>
    );
}

export default ActionButton;
