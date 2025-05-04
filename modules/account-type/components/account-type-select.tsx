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
import { useAccountTypesList } from '@/modules/account-type/hooks/use-account-types';
import { AccountType } from '@/modules/account-type/types/account-type';
import { Check, ChevronsUpDown } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

interface AccountTypeSelectProps {
    disabled?: boolean;
    placeholder?: ReactNode;
    value?: string;
    onChange?: (value: string | undefined) => void;
}

const findAccountTypeById = (accountTypes: AccountType[], id: string) => {
    return accountTypes.find((accountType) => accountType.id === id);
};

export function AccountTypeSelect({
    disabled,
    placeholder = 'Select account type',
    value,
    onChange,
}: AccountTypeSelectProps) {
    const [accountTypeId, setAccountTypeId] = useState<string | undefined>(
        undefined
    );
    const [open, setOpen] = useState(false);

    const { data: accountTypesData } = useAccountTypesList();

    useEffect(() => {
        if (value) {
            setAccountTypeId(value);
        }
    }, [value]);

    const accountTypes = accountTypesData?.data || [];
    const selectedAccountType = accountTypeId
        ? findAccountTypeById(accountTypes, accountTypeId)
        : undefined;

    const handleChange = (selectedValue: string) => {
        const newValue = selectedValue === value ? undefined : selectedValue;
        setAccountTypeId(newValue);
        onChange?.(newValue);
        setOpen(false);
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
                    {selectedAccountType?.name || placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Search account type..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No account type found.</CommandEmpty>
                        <CommandGroup>
                            {accountTypes.map((accountType) => (
                                <CommandItem
                                    key={accountType.id}
                                    value={accountType.id}
                                    onSelect={handleChange}
                                    className="flex items-center gap-2"
                                    keywords={[accountType.name]}
                                >
                                    {accountType.name}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === accountType.id
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
