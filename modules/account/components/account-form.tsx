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
import { AccountTypeSelect } from '@/modules/account-type/components/account-type-select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateAccount, useUpdateAccount } from '../hooks/use-accounts';
import { Account, CreateAccountDto, UpdateAccountDto } from '../types/account';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    balance: z.number().optional(),
    description: z.string().optional(),
    sortOrder: z.number().optional(),
    accountTypeId: z.string(),
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
            balance: account?.balance || 0,
        },
    });

    const createMutation = useCreateAccount();
    const updateMutation = useUpdateAccount();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (account) {
                await updateMutation.mutateAsync({
                    id: account.id,
                    data: values as UpdateAccountDto,
                });
            } else {
                await createMutation.mutateAsync(values as CreateAccountDto);
            }
            onSuccess?.();
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
                    name="balance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Balance</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="Enter balance"
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
                <AccountTypeSelect name="accountTypeId" />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
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
                />
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
