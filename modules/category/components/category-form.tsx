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
import { useLoading, UseLoadingType } from '@/hooks/use-loading';
import { IconPicker } from '@/modules/icon/components/icon-picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CategoryType } from '../enums/category';
import { useCreateCategory, useUpdateCategory } from '../hooks/use-categories';
import {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from '../types/category';
import { CategorySelect } from './category-select';
import { CategoryTypeSelect } from './category-type-select';

export const formSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(MaxLength.NAME.VALUE, MaxLength.NAME.MESSAGE),
    description: z
        .string()
        .max(MaxLength.DESCRIPTION.VALUE, MaxLength.DESCRIPTION.MESSAGE)
        .optional(),
    type: z.nativeEnum(CategoryType),
    sortOrder: z.number().nonnegative('Sort order must be positive').optional(),
    parentId: z
        .string()
        .uuid('Parent category must be a valid UUID')
        .optional(),
    iconId: z.string().uuid('Icon must be a valid UUID'),
});

interface CategoryFormProps {
    category?: Category;
    onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
    const isUpdate = !!category;
    const isLoading = useLoading(UseLoadingType.Mutating);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: category?.name || '',
            type: category?.type,
            description: category?.description || '',
            sortOrder: category?.sortOrder || 1,
            parentId: category?.parent?.id,
            iconId: category?.icon?.id,
        },
    });

    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const type = form.watch('type');

    useEffect(() => {
        const newParentId =
            type === category?.type ? category?.parent?.id : undefined;
        form.setValue('parentId', newParentId);
    }, [type, form, category]);

    const resetForm = () => {
        form.resetField('name');
        form.resetField('description');
        form.resetField('iconId');
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (isUpdate) {
                await updateMutation.mutateAsync({
                    id: category.id,
                    data: values as UpdateCategoryDto,
                });
                onSuccess?.();
            } else {
                await createMutation.mutateAsync(values as CreateCategoryDto);
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
                <CategoryTypeSelect
                    name="type"
                    selectProps={{ disabled: isUpdate || isLoading }}
                />
                <FormField
                    control={form.control}
                    name={'parentId'}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Parent Category</FormLabel>
                            <FormControl>
                                <CategorySelect
                                    excludeId={category?.id}
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
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    maxLength={MaxLength.DESCRIPTION.VALUE}
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
                    {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
                </Button>
            </form>
        </Form>
    );
}
