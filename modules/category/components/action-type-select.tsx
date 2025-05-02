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
import { ACTION_TYPE_OPTIONS } from '@/constants/common';
import { ActionType } from '@/enums/common';
import { SelectProps } from '@radix-ui/react-select';
import { useFormContext } from 'react-hook-form';

interface ActionTypeSelectProps {
    name: string;
    label?: string;
    selectProps?: SelectProps;
}

export function ActionTypeSelect({
    name,
    label = 'Action Type',
    selectProps,
}: ActionTypeSelectProps) {
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
                                <SelectValue placeholder="Select action type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {ACTION_TYPE_OPTIONS.map((option) => (
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

interface ActionTypeFilterProps {
    value: ActionType | 'all';
    onChange: (value: ActionType | 'all') => void;
    label?: string;
}

export function ActionTypeFilter({
    value,
    onChange,
    label = 'Filter by Type',
}: ActionTypeFilterProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>
            <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                    <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value={ActionType.INCOME}>Income</SelectItem>
                    <SelectItem value={ActionType.EXPENSE}>Expense</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
