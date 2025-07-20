import AppForm from '@/components/ui/form/app-form';
import InputNumber from '@/components/ui/input/input-number';
import AppModal, { AppModalProps } from '@/components/ui/modal/app-modal';
import { useModal } from '@/hooks/use-modal';
import { formatNumber } from '@/lib/format';
import AccountTypeSelect from '@/modules/account-type/components/account-type-select';
import IconSelect from '@/modules/icon/components/icon-select';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateAccount, useUpdateAccount } from '../hooks/use-accounts';
import {
    Account,
    AccountFormValues,
    CreateAccountDto,
    UpdateAccountDto,
} from '../types/account';

interface Props extends AppModalProps {}

export default function AccountModalForm(props: Props) {
    const messages = useTranslations();
    const { editingData, closeModal } = useModal<Account>();
    const [form] = AppForm.useForm<AccountFormValues>();

    const createMutation = useCreateAccount();
    const updateMutation = useUpdateAccount();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        form.setFieldsValue({
            name: editingData?.name,
            initialBalance: Number(editingData?.initialBalance || 0),
            description: editingData?.description ?? undefined,
            accountTypeId: editingData?.accountType?.id,
            iconId: editingData?.icon?.id,
        });
    }, [editingData, form]);

    const onFinish = async () => {
        form.validateFields()
            .then(async (values) => {
                if (editingData) {
                    await updateMutation.mutateAsync({
                        id: editingData.id,
                        data: values as UpdateAccountDto,
                    });
                    closeModal();
                } else {
                    await createMutation.mutateAsync(
                        values as CreateAccountDto
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
                    label={messages('account.name')}
                    name={'name'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 50,
                            message: messages('validation.stringMax', {
                                field: messages('account.name'),
                                max: 50,
                            }),
                        },
                    ]}
                >
                    <Input />
                </AppForm.Item>
                <AppForm.Item
                    label={messages('account.initialBalance')}
                    name={'initialBalance'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            type: 'number',
                            max: 999_999_999,
                            message: messages('validation.numberMax', {
                                field: messages('account.initialBalance'),
                                max: formatNumber(999_999_999),
                            }),
                        },
                    ]}
                >
                    <InputNumber />
                </AppForm.Item>
                <AppForm.Item
                    label={messages('accountType.title')}
                    name={'accountTypeId'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <AccountTypeSelect className="lg:w-full" />
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
                    <IconSelect className="lg:w-full" />
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
