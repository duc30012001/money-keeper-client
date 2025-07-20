import AppForm from '@/components/ui/form/app-form';
import AppModal, { AppModalProps } from '@/components/ui/modal/app-modal';
import { useModal } from '@/hooks/use-modal';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { UserRole } from '../enums/user';
import { useCreateUser, useUpdateUser } from '../hooks/use-users';
import {
    CreateUserDto,
    UpdateUserDto,
    User,
    UserFormValues,
} from '../types/user';
import UserRoleSelect from './user-role-select';
import UserStatusSelect from './user-status-select';

interface Props extends AppModalProps {}

export default function UserModalForm(props: Props) {
    const messages = useTranslations();
    const { editingData, closeModal } = useModal<User>();
    const [form] = AppForm.useForm<UserFormValues>();

    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        form.setFieldsValue({
            email: editingData?.email,
            password: editingData?.password,
            isActive: editingData?.isActive ?? true,
            role: editingData?.role || UserRole.USER,
        });
    }, [editingData, form]);

    const onFinish = async () => {
        form.validateFields()
            .then(async (values) => {
                if (editingData) {
                    const data = values as UpdateUserDto;
                    if (!data.password) delete data.password;
                    await updateMutation.mutateAsync({
                        id: editingData.id,
                        data,
                    });
                    closeModal();
                } else {
                    await createMutation.mutateAsync(values as CreateUserDto);
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
                          label: editingData.email,
                      })
                    : messages('common.create')
            }
            onOk={onFinish}
        >
            <AppForm disabled={isLoading} form={form}>
                <AppForm.Item
                    label={messages('user.email')}
                    name={'email'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            type: 'email',
                            message: messages('validation.emailFormat'),
                        },
                        {
                            min: 5,
                            message: messages('validation.stringMin', {
                                field: messages('user.email'),
                                min: 5,
                            }),
                        },
                        {
                            max: 50,
                            message: messages('validation.stringMax', {
                                field: messages('user.email'),
                                max: 50,
                            }),
                        },
                    ]}
                >
                    <Input />
                </AppForm.Item>
                <AppForm.Item
                    label={messages('user.password')}
                    name={'password'}
                    rules={
                        !editingData
                            ? [
                                  {
                                      required: true,
                                      message: messages('validation.input'),
                                  },
                                  {
                                      min: 5,
                                      message: messages(
                                          'validation.stringMin',
                                          {
                                              field: messages('user.password'),
                                              min: 5,
                                          }
                                      ),
                                  },
                                  {
                                      max: 50,
                                      message: messages(
                                          'validation.stringMax',
                                          {
                                              field: messages('user.password'),
                                              max: 50,
                                          }
                                      ),
                                  },
                              ]
                            : []
                    }
                >
                    <Input.Password />
                </AppForm.Item>
                <AppForm.Item
                    label={messages('status.title')}
                    name={'isActive'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <UserStatusSelect allowClear={false} />
                </AppForm.Item>
                <AppForm.Item
                    label={messages('user.role.title')}
                    name={'role'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <UserRoleSelect allowClear={false} />
                </AppForm.Item>
            </AppForm>
        </AppModal>
    );
}
