'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

interface DateTimePicker24hProps {
    value: Date | undefined;
    onChange: (date: Date) => void;
}

export function DateTimePicker24h({
    value: date,
    onChange,
}: DateTimePicker24hProps) {
    // const [date, setDate] = React.useState<Date>();
    const [isOpen, setIsOpen] = React.useState(false);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            // setDate(selectedDate);
            onChange(selectedDate);
        }
    };

    const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
        if (date) {
            const newDate = new Date(date);
            if (type === 'hour') {
                newDate.setHours(parseInt(value));
            } else if (type === 'minute') {
                newDate.setMinutes(parseInt(value));
            }
            // setDate(newDate);
            onChange(newDate);
        }
    };

    return (
        <Popover modal open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(date) : <span>HH:mm DD/MM/YYYY</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                    <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex p-2 sm:flex-col">
                                {hours.map((hour) => (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        variant={
                                            date && date.getHours() === hour
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        className="aspect-square shrink-0 sm:w-full"
                                        onClick={() =>
                                            handleTimeChange(
                                                'hour',
                                                hour.toString()
                                            )
                                        }
                                    >
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                            />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex p-2 sm:flex-col">
                                {Array.from({ length: 60 }, (_, i) => i).map(
                                    (minute) => (
                                        <Button
                                            key={minute}
                                            size="icon"
                                            variant={
                                                date &&
                                                date.getMinutes() === minute
                                                    ? 'default'
                                                    : 'ghost'
                                            }
                                            className="aspect-square shrink-0 sm:w-full"
                                            onClick={() =>
                                                handleTimeChange(
                                                    'minute',
                                                    minute.toString()
                                                )
                                            }
                                        >
                                            {minute.toString().padStart(2, '0')}
                                        </Button>
                                    )
                                )}
                            </div>
                            <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                            />
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
