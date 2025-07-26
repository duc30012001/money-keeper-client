import { Button, ButtonProps, Dropdown, MenuProps } from 'antd';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DeleteButton, DeleteButtonProps } from './delete-button';
import { DuplicateButton, DuplicateButtonProps } from './duplicate-button';
import { EditButton, EditButtonProps } from './edit-button';

interface Props extends ButtonProps {
    editProps?: EditButtonProps & {
        show?: boolean;
    };
    duplicateProps?: DuplicateButtonProps & {
        show?: boolean;
    };
    deleteProps?: DeleteButtonProps & {
        show?: boolean;
    };
}

function ActionButton({
    editProps,
    duplicateProps,
    deleteProps,
    ...props
}: Props) {
    const messages = useTranslations();

    const items: MenuProps['items'] = [];

    const showEdit = editProps?.show ?? true;
    const showDuplicate = duplicateProps?.show ?? false;
    const showDelete = deleteProps?.show ?? true;

    if (showEdit) {
        items.push({
            key: 'update',
            label: messages('action.update.button'),
            icon: <Pencil />,
            onClick: (info) =>
                editProps?.onClick?.(
                    info.domEvent as React.MouseEvent<HTMLElement>
                ),
        });
    }

    if (showDuplicate) {
        items.push({
            key: 'duplicate',
            label: messages('action.duplicate.button'),
            icon: <Trash2 />,
            danger: true,
            onClick: (info) =>
                duplicateProps?.onClick?.(
                    info.domEvent as React.MouseEvent<HTMLElement>
                ),
        });
    }

    if (showDelete) {
        items.push({
            key: 'delete',
            label: messages('action.delete.button'),
            icon: <Trash2 />,
            danger: true,
            onClick: (info) =>
                deleteProps?.onClick?.(
                    info.domEvent as React.MouseEvent<HTMLElement>
                ),
        });
    }

    return (
        <div>
            <div className="hidden w-fit lg:flex">
                {showEdit && <EditButton {...editProps} />}
                {showDuplicate && <DuplicateButton {...duplicateProps} />}
                {showDelete && <DeleteButton {...deleteProps} />}
            </div>
            <div className="block lg:hidden">
                <Dropdown menu={{ items }} trigger={['click']}>
                    <Button
                        type="text"
                        icon={<EllipsisVertical />}
                        {...props}
                    />
                </Dropdown>
            </div>
        </div>
    );
}

export default ActionButton;
