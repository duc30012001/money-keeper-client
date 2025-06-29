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
import { Switch } from '@/components/ui/switch';
import { MaxLength } from '@/constants/rules';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag, TagInput } from 'emblor';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateUser, useUpdateUser } from '../hooks/use-users';
import { UpdateUserDto, User } from '../types/user';

const formSchema = z.object({
    email: z
        .string()
        .email('Invalid email')
        .min(1, 'Email is required')
        .max(MaxLength.EMAIL.VALUE, MaxLength.EMAIL.MESSAGE),
    password: z.string().optional(),
    isActive: z.boolean().optional(),
    roles: z.array(z.string()).optional(),
});

interface UserFormProps {
    user: User;
    onSuccess?: () => void;
}

export function UserFormUpdate({ user, onSuccess }: UserFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: user.email,
            isActive: user.isActive,
            roles: user.roles,
        },
    });

    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();

    const resetForm = () => {
        form.resetField('password');
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const data = values as UpdateUserDto;
            if (!data.password) delete data.password;
            await updateMutation.mutateAsync({
                id: user.id,
                data,
            });
            resetForm();
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter email"
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter password"
                                    {...field}
                                    disabled={isLoading}
                                    type="password"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'isActive'}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Active</FormLabel>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={'roles'}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Roles</FormLabel>
                            <FormControl>
                                <TagInput
                                    tags={(field.value || []).map((item) => ({
                                        text: item,
                                        id: item,
                                    }))}
                                    placeholder="Enter roles"
                                    setTags={(newTags) => {
                                        field.onChange(
                                            (newTags as Tag[]).map(
                                                (item) => item.text
                                            )
                                        );
                                    }}
                                    activeTagIndex={null}
                                    setActiveTagIndex={() => {}}
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
                    {isLoading ? 'Saving...' : 'Update'}
                </Button>
            </form>
        </Form>
    );
}
