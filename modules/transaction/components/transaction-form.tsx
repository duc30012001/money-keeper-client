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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AccountSelect } from '@/modules/account/components/account-select';
import { CategorySelect } from '@/modules/category/components/category-select';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
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
        accountId: z.string().optional(),
        categoryId: z.string().optional(),
        senderAccountId: z.string().optional(),
        receiverAccountId: z.string().optional(),
        amount: z.number().positive(),
        description: z.string().optional(),
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
                form.reset({
                    type: values.type,
                    transactionDate: values.transactionDate,
                    amount: 0,
                });
            }
        } catch (error) {
            console.log('error:', error);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="transactionDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
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
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="Enter amount"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <TransactionTypeSelect name="type" />
                {type && type === TransactionType.TRANSFER && (
                    <>
                        <AccountSelect
                            label="Sender account"
                            placeholder="Select sender account"
                            name="senderAccountId"
                        />
                        <AccountSelect
                            label="Receiver account"
                            name="receiverAccountId"
                        />
                    </>
                )}
                {type && type !== TransactionType.TRANSFER && (
                    <>
                        <AccountSelect name="accountId" />
                        <CategorySelect name="categoryId" type={type} />
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
