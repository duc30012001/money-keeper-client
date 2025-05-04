import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { useCategoriesList } from '../hooks/use-categories';
import { Category } from '../types/category';

interface CategorySelectProps {
    disabled?: boolean;
    excludeId?: string;
    type?: string;
    placeholder?: ReactNode;
    value?: string;
    onChange?: (value: string | undefined) => void;
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
    disabled,
    excludeId,
    type,
    placeholder = 'Select category',
    value,
    onChange,
}: CategorySelectProps) {
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
    const [open, setOpen] = useState(false);

    const { data: categoriesData } = useCategoriesList({ type });

    useEffect(() => {
        if (value) {
            setCategoryId(value);
        }
    }, [value]);

    const categories = categoriesData?.data || [];
    const selectedCategory = categoryId
        ? findCategoryById(categories, categoryId)
        : undefined;

    const handleChange = (selectedValue: string) => {
        const newValue = selectedValue === value ? undefined : selectedValue;
        setCategoryId(newValue);
        onChange?.(newValue);
        setOpen(false);
    };

    const renderCategoryItem = (
        category: Category,
        level: number = 0
    ): JSX.Element => {
        if (category.id === excludeId) return <></>;

        return (
            <>
                <CommandItem
                    key={category.id}
                    value={category.id}
                    onSelect={handleChange}
                    className="flex items-center gap-2"
                    keywords={[category.name]}
                >
                    <span
                        style={{ paddingLeft: `${level * 20}px` }}
                        className="flex items-center gap-2"
                    >
                        {category.name}
                    </span>
                    <Check
                        className={cn(
                            'ml-auto',
                            value === category.id ? 'opacity-100' : 'opacity-0'
                        )}
                    />
                </CommandItem>
                {category.children?.map((child) =>
                    renderCategoryItem(child, level + 1)
                )}
            </>
        );
    };

    return (
        <Popover modal open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    {selectedCategory?.name || placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Search category..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                            {categories.map((category) =>
                                renderCategoryItem(category)
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
