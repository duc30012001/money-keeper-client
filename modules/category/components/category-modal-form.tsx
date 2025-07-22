import AppForm from '@/components/ui/form/app-form';
import AppModal, { AppModalProps } from '@/components/ui/modal/app-modal';
import { useModal } from '@/hooks/use-modal';
import IconSelect from '@/modules/icon/components/icon-select';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { CategoryType } from '../enums/category';
import { useCreateCategory, useUpdateCategory } from '../hooks/use-categories';
import {
    Category,
    CategoryFormValues,
    CreateCategoryDto,
    UpdateCategoryDto,
} from '../types/category';
import CategoryParentSelect from './category-parent-select';
import CategoryTypeSelect from './category-type-select';

interface Props extends AppModalProps {
    defaultType?: CategoryType;
}

export default function CategoryModalForm({ defaultType, ...props }: Props) {
    const messages = useTranslations();
    const { editingData, closeModal } = useModal<Category>();
    const [form] = AppForm.useForm<CategoryFormValues>();

    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        form.setFieldsValue({
            name: editingData?.name,
            description: editingData?.description ?? undefined,
            parentId: editingData?.parent?.id,
            iconId: editingData?.icon?.id,
            type: editingData?.type || defaultType,
        });
    }, [editingData, form, defaultType]);

    const onFinish = async () => {
        form.validateFields()
            .then(async (values) => {
                if (editingData) {
                    await updateMutation.mutateAsync({
                        id: editingData.id,
                        data: values as UpdateCategoryDto,
                    });
                    closeModal();
                } else {
                    await createMutation.mutateAsync(
                        values as CreateCategoryDto
                    );
                    form.resetFields();
                }
            })
            .catch((error) => {
                console.log('error:', error);
            });
    };

    return (
        <AppModal
            {...props}
            loading={isLoading}
            onCancel={closeModal}
            title={
                editingData
                    ? messages('common.edit.title', {
                          label: editingData.name,
                      })
                    : messages('common.create')
            }
            onOk={onFinish}
        >
            <AppForm disabled={isLoading} form={form} layout="vertical">
                <AppForm.Item
                    label={messages('category.name')}
                    name={'name'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 50,
                            message: messages('validation.stringMax', {
                                field: messages('category.name'),
                                max: 50,
                            }),
                        },
                    ]}
                >
                    <Input />
                </AppForm.Item>
                {!editingData && (
                    <AppForm.Item
                        label={messages('category.type')}
                        name={'type'}
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <CategoryTypeSelect
                            externalOnChange={() =>
                                form.resetFields(['parentId'])
                            }
                        />
                    </AppForm.Item>
                )}
                {(editingData?.children?.length ?? 0) === 0 && (
                    <AppForm.Item
                        noStyle
                        shouldUpdate={(pre, cur) => pre.type !== cur.type}
                    >
                        {({ getFieldValue }) => (
                            <AppForm.Item
                                name="parentId"
                                label={messages('category.parent')}
                            >
                                <CategoryParentSelect
                                    type={getFieldValue('type')}
                                />
                            </AppForm.Item>
                        )}
                    </AppForm.Item>
                )}
                <AppForm.Item
                    label={messages('icon.title')}
                    name={'iconId'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <IconSelect />
                </AppForm.Item>
                <AppForm.Item
                    label={messages('common.description')}
                    name={'description'}
                    rules={[
                        {
                            max: 150,
                            message: messages('validation.stringMax', {
                                field: messages('common.description'),
                                max: 150,
                            }),
                        },
                    ]}
                >
                    <Input.TextArea autoSize={{ maxRows: 10, minRows: 3 }} />
                </AppForm.Item>
            </AppForm>
        </AppModal>
    );
}
