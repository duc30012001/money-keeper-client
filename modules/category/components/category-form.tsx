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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateCategory, useUpdateCategory } from '../hooks/use-categories';
import {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from '../types/category';
import { ActionTypeSelect } from './action-type-select';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    actionType: z.enum(['income', 'expense']),
    description: z.string().optional(),
    sortOrder: z.number().optional(),
});

interface CategoryFormProps {
    category?: Category;
    onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: category?.name || '',
            actionType: category?.actionType,
            description: category?.description || '',
            sortOrder: category?.sortOrder || 1,
        },
    });

    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (category) {
                await updateMutation.mutateAsync({
                    id: category.id,
                    data: values as UpdateCategoryDto,
                });
            } else {
                await createMutation.mutateAsync(values as CreateCategoryDto);
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
                                    placeholder="Enter category name"
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ActionTypeSelect name="actionType" />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter category description"
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
                    {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
                </Button>
            </form>
        </Form>
    );
}
