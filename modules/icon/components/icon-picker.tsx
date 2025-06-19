import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useIconsList } from '../hooks/use-icons';
import { Icon } from '../types/icon';
import { IconItem, IconList } from './icon-list';
import { IconListSkeleton } from './icon-list-skeleton';

interface IconPickerProps {
    value?: Icon['id'];
    onChange?: (icon: Icon) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
    const { data: icons, isLoading } = useIconsList();

    const selectedIcon = icons?.data.find((icon) => icon.id === value);

    return (
        <Popover modal>
            <PopoverTrigger>
                {selectedIcon ? (
                    <IconItem data={selectedIcon} className="w-fit p-4" />
                ) : (
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                    >
                        <span className="text-muted-foreground">
                            Select an icon
                        </span>
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-full max-w-screen-md">
                <div className="flex max-h-[500px] flex-1 flex-col space-y-4 overflow-y-auto">
                    {isLoading ? (
                        <IconListSkeleton className="xl:grid-cols-6" />
                    ) : (
                        <IconList
                            data={icons?.data ?? []}
                            onSelect={onChange}
                            className="xl:grid-cols-6"
                        />
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
