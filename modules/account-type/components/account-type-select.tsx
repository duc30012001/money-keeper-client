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
import { useAccountTypesList } from '../hooks/use-account-types';
import { AccountType } from '../types/account-type';

interface AccountTypeSelectProps {
    name: string;
    label?: string;
    disabled?: boolean;
    placeholder?: ReactNode;
}

const findAccountTypeById = (
    accountTypes: AccountType[],
    id: string
): AccountType | undefined => {
    for (const accountType of accountTypes) {
        if (accountType.id === id) {
            return accountType;
        }
    }
    return undefined;
};

export function AccountTypeSelect({
    name,
    label = 'Account Type',
    disabled,
    placeholder = 'Select account type',
}: AccountTypeSelectProps) {
    const { data: accountTypesData } = useAccountTypesList();
    const form = useFormContext();
    const selectedAccountTypeId = form.watch(name);

    const accountTypes =
        (accountTypesData as PaginatedResponseDto<AccountType>)?.data || [];
    const selectedAccountType = selectedAccountTypeId
        ? findAccountTypeById(accountTypes, selectedAccountTypeId)
        : undefined;

    const renderAccountTypeItem = (
        accountType: AccountType,
        level: number = 0
    ): JSX.Element => {
        return (
            <>
                <CommandItem
                    value={accountType.id}
                    onSelect={() => {
                        form.setValue(name, accountType.id);
                    }}
                    className="flex items-center gap-2"
                >
                    <div
                        className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            selectedAccountTypeId === accountType.id
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
                        {accountType.name}
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
                                    {selectedAccountType
                                        ? selectedAccountType.name
                                        : placeholder}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Search account type..." />
                                <CommandEmpty>
                                    No account type found.
                                </CommandEmpty>
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
                                                !selectedAccountTypeId
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible'
                                            )}
                                        >
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <span>None</span>
                                    </CommandItem>
                                    {accountTypes.map(
                                        (accountType: AccountType) =>
                                            renderAccountTypeItem(accountType)
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
