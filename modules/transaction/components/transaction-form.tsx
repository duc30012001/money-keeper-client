import { DateTimePicker24h } from '@/components/date-n-time/date-time-picker-24h';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import NumberInput from '@/components/ui/number-input';
import { Textarea } from '@/components/ui/textarea';
import { MaxLength } from '@/constants/rules';
import { useLoading, UseLoadingType } from '@/hooks/use-loading';
import { AccountSelect } from '@/modules/account/components/account-select';
import { CategorySelect } from '@/modules/category/components/category-select';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TransactionType } from '../enums/transaction';
import {
    useCreateTransaction,
    useUpdateTransaction,
} from '../hooks/use-transactions';
import {
    CreateTransactionDto,
    Transaction,
    UpdateTransactionDto,
} from '../types/transaction';
import { TransactionTypeSelect } from './transaction-type-select';

const formSchema = z
    .object({
        type: z.nativeEnum(TransactionType),
        accountId: z.string().uuid('Account must be a valid UUID').optional(),
        categoryId: z.string().uuid('Category must be a valid UUID').optional(),
        senderAccountId: z
            .string()
            .uuid('Sender account must be a valid UUID')
            .optional(),
        receiverAccountId: z
            .string()
            .uuid('Receiver account must be a valid UUID')
            .optional(),
        amount: z.number().positive('Amount must be positive'),
        description: z
            .string()
            .max(200, 'Description must be less than 200 characters')
            .optional(),
        transactionDate: z.date().optional(),
    })
    .superRefine((values, ctx) => {
        if (values.type === TransactionType.TRANSFER) {
            if (!values.senderAccountId) {
                ctx.addIssue({
                    path: ['senderAccountId'],
                    code: z.ZodIssueCode.custom,
                    message:
                        'Sender account is required for this transaction type',
                });
            }
            if (!values.receiverAccountId) {
                ctx.addIssue({
                    path: ['receiverAccountId'],
                    code: z.ZodIssueCode.custom,
                    message:
                        'Receiver account is required for this transaction type',
                });
            }
            // <-- new: ensure they're not the same
            if (
                values.senderAccountId &&
                values.receiverAccountId &&
                values.senderAccountId === values.receiverAccountId
            ) {
                ctx.addIssue({
                    path: ['receiverAccountId'],
                    code: z.ZodIssueCode.custom,
                    message: 'Receiver must be different from sender',
                });
            }
        } else {
            if (!values.accountId) {
                ctx.addIssue({
                    path: ['accountId'],
                    code: z.ZodIssueCode.custom,
                    message: 'Account is required for this transaction type',
                });
            }
            if (!values.categoryId) {
                ctx.addIssue({
                    path: ['categoryId'],
                    code: z.ZodIssueCode.custom,
                    message: 'Category is required for this transaction type',
                });
            }
        }
    });

interface TransactionFormProps {
    transaction?: Transaction;
    onSuccess?: () => void;
}

export function TransactionForm({
    transaction,
    onSuccess,
}: TransactionFormProps) {
    const isLoading = useLoading(UseLoadingType.Mutating);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: transaction?.type ?? TransactionType.EXPENSE,
            accountId: transaction?.account?.id,
            categoryId: transaction?.category?.id,
            senderAccountId: transaction?.senderAccount?.id,
            receiverAccountId: transaction?.receiverAccount?.id,
            amount: transaction?.amount
                ? Math.abs(Number(transaction.amount))
                : 0,
            description: transaction?.description || '',
            transactionDate: dayjs(transaction?.transactionDate).toDate(),
        },
    });

    const createMutation = useCreateTransaction();
    const updateMutation = useUpdateTransaction();
    const type = form.watch('type');

    useEffect(() => {
        if (type === TransactionType.TRANSFER) {
            form.setValue('accountId', undefined);
            form.setValue('categoryId', undefined);
        } else {
            form.setValue('senderAccountId', undefined);
            form.setValue('receiverAccountId', undefined);
        }
    }, [type, form]);

    const resetForm = () => {
        form.resetField('amount');
        form.resetField('description');
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (transaction) {
                await updateMutation.mutateAsync({
                    id: transaction.id,
                    data: values as UpdateTransactionDto,
                });
                onSuccess?.();
            } else {
                await createMutation.mutateAsync(
                    values as CreateTransactionDto
                );
                resetForm();
            }
        } catch (error) {
            console.log('error:', error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="transactionDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Transaction date</FormLabel>
                            <FormControl>
                                <DateTimePicker24h
                                    value={field.value}
                                    onChange={field.onChange}
                                    // className="w-full"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <NumberInput
                                        disabled={isLoading}
                                        value={field.value}
                                        onValueChange={(e) => {
                                            field.onChange(e.floatValue);
                                        }}
                                        placeholder="Enter amount"
                                        getInputRef={field.ref}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <TransactionTypeSelect
                    name="type"
                    selectProps={{ disabled: isLoading }}
                />
                {type && type === TransactionType.TRANSFER && (
                    <>
                        <FormField
                            control={form.control}
                            name={'senderAccountId'}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Sender account</FormLabel>
                                    <FormControl>
                                        <AccountSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select sender account"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'receiverAccountId'}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Receiver account</FormLabel>
                                    <FormControl>
                                        <AccountSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select receiver account"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}
                {type && type !== TransactionType.TRANSFER && (
                    <>
                        <FormField
                            control={form.control}
                            name={'accountId'}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Account</FormLabel>
                                    <FormControl>
                                        <AccountSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'categoryId'}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <CategorySelect
                                            type={type}
                                            disabled={!type || isLoading}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={
                                                type
                                                    ? 'Select parent category'
                                                    : 'Please select action type first'
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    maxLength={MaxLength.DESCRIPTION.VALUE}
                                    placeholder="Enter transaction description"
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className="ml-auto mt-2"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading
                        ? 'Saving...'
                        : transaction
                          ? 'Update'
                          : 'Create'}
                </Button>
            </form>
        </Form>
    );
}
