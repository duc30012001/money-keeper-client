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
import { TRANSACTION_TYPE_OPTIONS } from '@/constants/common';
import { TransactionType } from '@/modules/transaction/enums/transaction';
import { SelectProps } from '@radix-ui/react-select';
import { useFormContext } from 'react-hook-form';

interface TransactionTypeSelectProps {
    name: string;
    label?: string;
    selectProps?: SelectProps;
}

export function TransactionTypeSelect({
    name,
    label = 'Transaction Type',
    selectProps,
}: TransactionTypeSelectProps) {
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
                        value={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {TRANSACTION_TYPE_OPTIONS.map((option) => (
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
    value: TransactionType | 'all';
    onChange: (value: TransactionType | 'all') => void;
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
                    <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {TRANSACTION_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
