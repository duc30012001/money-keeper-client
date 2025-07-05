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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserRole } from '../enums/user';
import { useCreateUser } from '../hooks/use-users';
import { CreateUserDto } from '../types/user';
import { UserRoleSelect } from './user-role-select';

const formSchema = z.object({
    email: z
        .string()
        .email('Invalid email')
        .min(1, 'Email is required')
        .max(MaxLength.EMAIL.VALUE, MaxLength.EMAIL.MESSAGE),
    password: z.string().min(1, 'Password is required'),
    isActive: z.boolean().optional(),
    role: z.nativeEnum(UserRole).optional(),
});

interface UserFormProps {}

export function UserFormCreate({}: UserFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isActive: true,
        },
    });

    const createMutation = useCreateUser();

    const resetForm = () => {
        form.resetField('email');
        form.resetField('password');
        form.resetField('isActive');
        form.resetField('role');
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await createMutation.mutateAsync(values as CreateUserDto);
            resetForm();
        } catch (error) {
            console.log('error:', error);
        }
    };

    const isLoading = createMutation.isPending;

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
                    name={'role'}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <UserRoleSelect
                                    value={field.value}
                                    onChange={field.onChange}
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
                    {isLoading ? 'Saving...' : 'Create'}
                </Button>
            </form>
        </Form>
    );
}
