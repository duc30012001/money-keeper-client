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
import { useAccountsList } from '../hooks/use-accounts';
import { Account } from '../types/account';

interface AccountSelectProps {
    disabled?: boolean;
    placeholder?: ReactNode;
    value?: string;
    onChange?: (value: string | undefined) => void;
}

const findAccountById = (accounts: Account[], id: string) => {
    return accounts.find((account) => account.id === id);
};

export function AccountSelect({
    disabled,
    placeholder = 'Select account',
    value,
    onChange,
}: AccountSelectProps) {
    const [accountId, setAccountId] = useState<string | undefined>(undefined);
    const [open, setOpen] = useState(false);

    const { data: accountsData } = useAccountsList({ pageSize: 1000 });

    useEffect(() => {
        if (value) {
            setAccountId(value);
        }
    }, [value]);

    const accounts = accountsData?.data || [];
    const selectedAccount = accountId
        ? findAccountById(accounts, accountId)
        : undefined;

    const handleChange = (selectedValue: string) => {
        const newValue = selectedValue === value ? undefined : selectedValue;
        setAccountId(newValue);
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
                    {selectedAccount?.name || placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Search account..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No account found.</CommandEmpty>
                        <CommandGroup>
                            {accounts.map((account) => (
                                <CommandItem
                                    key={account.id}
                                    value={account.id}
                                    onSelect={handleChange}
                                    className="flex items-center gap-2"
                                    keywords={[account.name]}
                                >
                                    {account.name}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === account.id
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
