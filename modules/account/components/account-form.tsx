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
import NumberInput from '@/components/ui/number-input';
import { Textarea } from '@/components/ui/textarea';
import { MaxLength } from '@/constants/rules';
import { AccountTypeSelect } from '@/modules/account-type/components/account-type-select';
import { IconPicker } from '@/modules/icon/components/icon-picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateAccount, useUpdateAccount } from '../hooks/use-accounts';
import { Account, CreateAccountDto, UpdateAccountDto } from '../types/account';

const formSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(MaxLength.NAME.VALUE, MaxLength.NAME.MESSAGE),
    description: z
        .string()
        .max(MaxLength.DESCRIPTION.VALUE, MaxLength.DESCRIPTION.MESSAGE)
        .optional(),
    initialBalance: z
        .number()
        .nonnegative('Initial balance cannot be negative')
        .optional(),
    sortOrder: z.number().nonnegative('Sort order must be positive').optional(),
    accountTypeId: z.string().uuid('Account type must be a valid UUID'),
    iconId: z.string().uuid('Icon must be a valid UUID'),
});

interface AccountFormProps {
    account?: Account;
    onSuccess?: () => void;
}

export function AccountForm({ account, onSuccess }: AccountFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: account?.name || '',
            accountTypeId: account?.accountType.id,
            description: account?.description || '',
            sortOrder: account?.sortOrder || 1,
            initialBalance: Number(account?.initialBalance) || 0,
            iconId: account?.icon?.id,
        },
    });

    const createMutation = useCreateAccount();
    const updateMutation = useUpdateAccount();

    const resetForm = () => {
        form.resetField('name');
        form.resetField('description');
        form.resetField('initialBalance');
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (account) {
                await updateMutation.mutateAsync({
                    id: account.id,
                    data: values as UpdateAccountDto,
                });
                onSuccess?.();
            } else {
                await createMutation.mutateAsync(values as CreateAccountDto);
                resetForm();
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter account name"
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="initialBalance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Initial Balance</FormLabel>
                            <FormControl>
                                <NumberInput
                                    disabled={isLoading}
                                    value={field.value}
                                    onValueChange={(e) => {
                                        field.onChange(e.floatValue);
                                    }}
                                    placeholder="Enter initial balance"
                                    getInputRef={field.ref}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'accountTypeId'}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Account type</FormLabel>
                            <FormControl>
                                <AccountTypeSelect
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    maxLength={MaxLength.DESCRIPTION.VALUE}
                                    placeholder="Enter account description"
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'iconId'}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Icon</FormLabel>
                            <FormControl>
                                <IconPicker
                                    value={field.value}
                                    onChange={(icon) => field.onChange(icon.id)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sort Order</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    placeholder="Enter sort order"
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
                /> */}
                <Button
                    className="ml-auto mt-2"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : account ? 'Update' : 'Create'}
                </Button>
            </form>
        </Form>
    );
}
