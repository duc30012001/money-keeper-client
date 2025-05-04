import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { PaginatedResponseDto } from '@/types/common';
import { Check, ChevronsUpDown } from 'lucide-react';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { useCategoriesList } from '../hooks/use-categories';
import { Category } from '../types/category';

interface CategorySelectProps {
    name: string;
    label?: string;
    disabled?: boolean;
    excludeId?: string;
    type?: string;
    placeholder?: ReactNode;
}

const findCategoryById = (
    categories: Category[],
    id: string
): Category | undefined => {
    for (const category of categories) {
        if (category.id === id) {
            return category;
        }
        if (category.children?.length) {
            const found = findCategoryById(category.children, id);
            if (found) {
                return found;
            }
        }
    }
    return undefined;
};

export function CategorySelect({
    name,
    label = 'Parent Category',
    disabled,
    excludeId,
    type,
    placeholder = 'Select category',
}: CategorySelectProps) {
    const { data: categoriesData } = useCategoriesList({ type });
    const form = useFormContext();
    const selectedCategoryId = form.watch(name);

    const categories =
        (categoriesData as PaginatedResponseDto<Category>)?.data || [];
    const selectedCategory = selectedCategoryId
        ? findCategoryById(categories, selectedCategoryId)
        : undefined;

    const renderCategoryItem = (
        category: Category,
        level: number = 0
    ): JSX.Element => {
        if (category.id === excludeId) return <></>;

        return (
            <>
                <CommandItem
                    value={category.id}
                    onSelect={() => {
                        form.setValue(name, category.id);
                    }}
                    className="flex items-center gap-2"
                >
                    <div
                        className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            selectedCategoryId === category.id
                                ? 'bg-primary text-primary-foreground'
                                : 'opacity-50 [&_svg]:invisible'
                        )}
                    >
                        <Check className="h-4 w-4" />
                    </div>
                    <span
                        style={{ paddingLeft: `${level * 20}px` }}
                        className="flex items-center gap-2"
                    >
                        {category.name}
                    </span>
                </CommandItem>
                {category.children?.map((child) =>
                    renderCategoryItem(child, level + 1)
                )}
            </>
        );
    };

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={disabled}
                                    className={cn(
                                        'w-full justify-between',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    {selectedCategory
                                        ? selectedCategory.name
                                        : placeholder}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Search category..." />
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup>
                                    <CommandItem
                                        value={undefined}
                                        onSelect={() => {
                                            form.setValue(name, '');
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                !selectedCategoryId
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible'
                                            )}
                                        >
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <span>None</span>
                                    </CommandItem>
                                    {categories.map((category: Category) =>
                                        renderCategoryItem(category)
                                    )}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
