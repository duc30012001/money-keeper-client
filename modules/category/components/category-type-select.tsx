import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CATEGORY_TYPE_OPTIONS } from '@/constants/common';
import { CategoryType } from '@/modules/category/enums/category';
import { SelectProps } from '@radix-ui/react-select';
import { useFormContext } from 'react-hook-form';

interface CategoryTypeSelectProps {
    name: string;
    label?: string;
    selectProps?: SelectProps;
}

export function CategoryTypeSelect({
    name,
    label = 'Category Type',
    selectProps,
}: CategoryTypeSelectProps) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        {...selectProps}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {CATEGORY_TYPE_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

interface CategoryTypeFilterProps {
    value: CategoryType | 'all';
    onChange: (value: CategoryType | 'all') => void;
    label?: string;
}

export function CategoryTypeFilter({
    value,
    onChange,
    label = 'Filter by Type',
}: CategoryTypeFilterProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>
            <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                    <SelectValue placeholder="Select category type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {CATEGORY_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
