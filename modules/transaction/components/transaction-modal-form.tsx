import AppForm from '@/components/ui/form/app-form';
import InputNumber from '@/components/ui/input/input-number';
import AppModal, { AppModalProps } from '@/components/ui/modal/app-modal';
import { DateFormat } from '@/enums/common';
import { useModal } from '@/hooks/use-modal';
import { formatNumber } from '@/lib/format';
import AccountSelect from '@/modules/account/components/account-select';
import CategorySelect from '@/modules/category/components/category-select';
import { DatePicker, Input } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Fragment, useEffect } from 'react';
import { TransactionType } from '../enums/transaction';
import {
    useCreateTransaction,
    useUpdateTransaction,
} from '../hooks/use-transactions';
import {
    CreateTransactionDto,
    Transaction,
    TransactionFormValues,
    UpdateTransactionDto,
} from '../types/transaction';
import TransactionTypeSelect from './transaction-type-select';

interface Props extends AppModalProps {}

export default function TransactionModalForm({ ...props }: Props) {
    const messages = useTranslations();
    const { editingData, closeModal } = useModal<Transaction>();
    const [form] = AppForm.useForm<TransactionFormValues>();

    const createMutation = useCreateTransaction();
    const updateMutation = useUpdateTransaction();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const onFinish = async () => {
        form.validateFields()
            .then(async (values) => {
                const data = {
                    ...values,
                    transactionDate: values.transactionDate.toDate(),
                };

                if (editingData) {
                    await updateMutation.mutateAsync({
                        id: editingData.id,
                        data: data as UpdateTransactionDto,
                    });
                    closeModal();
                } else {
                    await createMutation.mutateAsync(
                        data as CreateTransactionDto
                    );
                    form.resetFields(['amount', 'description']);
                }
            })
            .catch((error) => {
                console.log('error:', error);
            });
    };

    const handleChangeType = (
        type: TransactionType,
        preType: TransactionType
    ) => {
        if (
            (type === TransactionType.INCOME &&
                preType === TransactionType.EXPENSE) ||
            (type === TransactionType.EXPENSE &&
                preType === TransactionType.INCOME)
        ) {
            form.setFieldValue('categoryId', undefined);
        } else if (type === TransactionType.TRANSFER) {
            const accountId = form.getFieldValue('accountId');
            form.setFieldValue('accountId', undefined);
            form.setFieldValue('categoryId', undefined);
            form.setFieldValue('senderAccountId', accountId);
        } else {
            const senderAccountId = form.getFieldValue('senderAccountId');
            form.setFieldValue('senderAccountId', undefined);
            form.setFieldValue('receiverAccountId', undefined);
            form.setFieldValue('accountId', senderAccountId);
        }
    };

    useEffect(() => {
        form.setFieldsValue({
            type: editingData?.type ?? TransactionType.EXPENSE,
            accountId: editingData?.account?.id,
            categoryId: editingData?.category?.id,
            senderAccountId: editingData?.senderAccount?.id,
            receiverAccountId: editingData?.receiverAccount?.id,
            amount: editingData?.amount
                ? Math.abs(Number(editingData.amount))
                : 0,
            description: editingData?.description || '',
            transactionDate: dayjs(editingData?.transactionDate),
        });
    }, [editingData, form]);

    return (
        <AppModal
            {...props}
            loading={isLoading}
            onCancel={closeModal}
            title={
                editingData
                    ? messages('transaction.edit.title', {
                          label: editingData.id,
                      })
                    : messages('transaction.create')
            }
            onOk={onFinish}
        >
            <AppForm disabled={isLoading} form={form} layout="vertical">
                <AppForm.Item
                    name="transactionDate"
                    label={messages('transaction.date')}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <DatePicker
                        showTime
                        className="w-full"
                        format={DateFormat.DATETIME}
                    />
                </AppForm.Item>
                <AppForm.Item
                    name="type"
                    label={messages('transaction.type.title')}
                >
                    <TransactionTypeSelect
                        externalOnChange={(value, _, preValue) =>
                            handleChangeType(value, preValue)
                        }
                    />
                </AppForm.Item>
                <AppForm.Item
                    label={messages('transaction.amount')}
                    name={'amount'}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            type: 'number',
                            min: 0.01,
                            message: messages('validation.numberMin', {
                                field: messages('transaction.amount'),
                                min: formatNumber(0.01),
                            }),
                        },
                        {
                            type: 'number',
                            max: 999_999_999_999,
                            message: messages('validation.numberMax', {
                                field: messages('transaction.amount'),
                                max: formatNumber(999_999_999_999),
                            }),
                        },
                    ]}
                >
                    <InputNumber min={0.01} />
                </AppForm.Item>

                <AppForm.Item
                    noStyle
                    shouldUpdate={(pre, cur) => pre.type !== cur.type}
                >
                    {({ getFieldValue }) => {
                        const type = getFieldValue('type');

                        if (type === TransactionType.TRANSFER) {
                            return (
                                <Fragment>
                                    <AppForm.Item
                                        name="senderAccountId"
                                        label={messages(
                                            'transaction.type.transfer.from'
                                        )}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.select'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <AccountSelect />
                                    </AppForm.Item>
                                    <AppForm.Item
                                        name="receiverAccountId"
                                        label={messages(
                                            'transaction.type.transfer.to'
                                        )}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.select'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <AccountSelect />
                                    </AppForm.Item>
                                </Fragment>
                            );
                        }

                        return (
                            <Fragment>
                                <AppForm.Item
                                    name="accountId"
                                    label={messages('account.title')}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.select'),
                                        },
                                    ]}
                                >
                                    <AccountSelect />
                                </AppForm.Item>
                                <AppForm.Item
                                    name="categoryId"
                                    label={messages('category.title')}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.select'),
                                        },
                                    ]}
                                >
                                    <CategorySelect
                                        type={getFieldValue('type')}
                                    />
                                </AppForm.Item>
                            </Fragment>
                        );
                    }}
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
