import AppForm from '@/components/ui/form/app-form';
import AppModal, { AppModalProps } from '@/components/ui/modal/app-modal';
import { useModal } from '@/hooks/use-modal';
import IconSelect from '@/modules/icon/components/icon-select';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import {
    useCreateAccountType,
    useUpdateAccountType,
} from '../hooks/use-account-types';
import {
    AccountType,
    AccountTypeFormValues,
    CreateAccountTypeDto,
    UpdateAccountTypeDto,
} from '../types/account-type';

interface Props extends AppModalProps {}

export default function AccountTypeModalForm(props: Props) {
    const messages = useTranslations();
    const { editingData, closeModal } = useModal<AccountType>();
    const [form] = AppForm.useForm<AccountTypeFormValues>();

    const createMutation = useCreateAccountType();
    const updateMutation = useUpdateAccountType();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        form.setFieldsValue({
            name: editingData?.name,
            description: editingData?.description ?? undefined,
            iconId: editingData?.icon?.id,
        });
    }, [editingData, form]);

    const onFinish = async () => {
        form.validateFields()
            .then(async (values) => {
                if (editingData) {
                    await updateMutation.mutateAsync({
                        id: editingData.id,
                        data: values as UpdateAccountTypeDto,
                    });
                    closeModal();
                } else {
                    await createMutation.mutateAsync(
                        values as CreateAccountTypeDto
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
                    ? messages('action.update.title', {
                          label: editingData.name,
                      })
                    : messages('action.create.button')
            }
            onOk={onFinish}
        >
            <AppForm disabled={isLoading} form={form} layout="vertical">
                <AppForm.Item
                    label={messages('accountType.name')}
                    name={'name'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 50,
                            message: messages('validation.stringMax', {
                                field: messages('accountType.name'),
                                max: 50,
                            }),
                        },
                    ]}
                >
                    <Input />
                </AppForm.Item>
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
