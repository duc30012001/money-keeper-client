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
import { useAccountsList } from '../hooks/use-accounts';
import { Account } from '../types/account';

interface AccountSelectProps {
    name: string;
    label?: string;
    disabled?: boolean;
    placeholder?: ReactNode;
}

const findAccountById = (
    accounts: Account[],
    id: string
): Account | undefined => {
    for (const account of accounts) {
        if (account.id === id) {
            return account;
        }
    }
    return undefined;
};

export function AccountSelect({
    name,
    label = 'Account',
    disabled,
    placeholder = 'Select account',
}: AccountSelectProps) {
    const { data: accountsData } = useAccountsList({});
    const form = useFormContext();
    const selectedAccountId = form.watch(name);

    const accounts =
        (accountsData as PaginatedResponseDto<Account>)?.data || [];
    const selectedAccount = selectedAccountId
        ? findAccountById(accounts, selectedAccountId)
        : undefined;

    const renderAccountItem = (
        account: Account,
        level: number = 0
    ): JSX.Element => {
        return (
            <>
                <CommandItem
                    value={account.id}
                    onSelect={() => {
                        form.setValue(name, account.id);
                    }}
                    className="flex items-center gap-2"
                >
                    <div
                        className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            selectedAccountId === account.id
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
                        {account.name}
                    </span>
                </CommandItem>
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
                                    {selectedAccount
                                        ? selectedAccount.name
                                        : placeholder}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Search account..." />
                                <CommandEmpty>No account found.</CommandEmpty>
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
                                                !selectedAccountId
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible'
                                            )}
                                        >
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <span>None</span>
                                    </CommandItem>
                                    {accounts.map((account: Account) =>
                                        renderAccountItem(account)
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
