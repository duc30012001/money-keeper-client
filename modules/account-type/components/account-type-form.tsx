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
import { MaxLength } from '@/constants/rules';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    useCreateAccountType,
    useUpdateAccountType,
} from '../hooks/use-account-types';
import {
    AccountType,
    CreateAccountTypeDto,
    UpdateAccountTypeDto,
} from '../types/account-type';

const formSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(MaxLength.NAME.VALUE, MaxLength.NAME.MESSAGE),
    description: z
        .string()
        .max(MaxLength.DESCRIPTION.VALUE, MaxLength.DESCRIPTION.MESSAGE)
        .optional(),
    sortOrder: z.number().nonnegative('Sort order must be positive').optional(),
});

interface AccountTypeFormProps {
    accountType?: AccountType;
    onSuccess?: () => void;
}

export function AccountTypeForm({
    accountType,
    onSuccess,
}: AccountTypeFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: accountType?.name || '',
            description: accountType?.description || '',
            sortOrder: accountType?.sortOrder || 1,
        },
    });

    const createMutation = useCreateAccountType();
    const updateMutation = useUpdateAccountType();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (accountType) {
                await updateMutation.mutateAsync({
                    id: accountType.id,
                    data: values as UpdateAccountTypeDto,
                });
                onSuccess?.();
            } else {
                await createMutation.mutateAsync(
                    values as CreateAccountTypeDto
                );
                form.reset();
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
                                    placeholder="Enter account type name"
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    maxLength={MaxLength.DESCRIPTION.VALUE}
                                    placeholder="Enter account type description"
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
                    {isLoading
                        ? 'Saving...'
                        : accountType
                          ? 'Update'
                          : 'Create'}
                </Button>
            </form>
        </Form>
    );
}
