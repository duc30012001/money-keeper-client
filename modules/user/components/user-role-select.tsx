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
import { UserRole } from '../enums/user';

interface AccountSelectProps {
    disabled?: boolean;
    placeholder?: ReactNode;
    value?: UserRole;
    onChange?: (value: UserRole | undefined) => void;
}

const roles = [
    {
        label: 'Admin',
        value: UserRole.ADMIN,
    },
    {
        label: 'User',
        value: UserRole.USER,
    },
];

const findAccountById = (value: UserRole) => {
    return roles.find((role) => role.value === value);
};

export function UserRoleSelect({
    disabled,
    placeholder = 'Select role',
    value,
    onChange,
}: AccountSelectProps) {
    const [roleId, setRoleId] = useState<UserRole | undefined>(undefined);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (value) {
            setRoleId(value);
        }
    }, [value]);

    const selectedAccount = roleId ? findAccountById(roleId) : undefined;

    const handleChange = (selectedValue: string) => {
        const newValue = selectedValue === value ? undefined : selectedValue;
        setRoleId(newValue as UserRole);
        onChange?.(newValue as UserRole);
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
                    {selectedAccount?.label || placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Search role..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No role found.</CommandEmpty>
                        <CommandGroup>
                            {roles.map((role) => (
                                <CommandItem
                                    key={role.value}
                                    value={role.value}
                                    onSelect={handleChange}
                                    className="flex items-center gap-2"
                                    keywords={[role.label]}
                                >
                                    {role.label}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === role.value
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
