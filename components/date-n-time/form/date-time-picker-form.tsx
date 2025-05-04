'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const FormSchema = z.object({
    time: z.date({
        required_error: 'A date and time is required.',
    }),
});

export function DateTimePickerForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast.success(
            `Selected date and time: ${format(data.time, 'PPPPpppp')}`
        );
    }

    function handleDateSelect(date: Date | undefined) {
        if (date) {
            form.setValue('time', date);
        }
    }

    function handleTimeChange(type: 'hour' | 'minute' | 'ampm', value: string) {
        const currentDate = form.getValues('time') || new Date();
        let newDate = new Date(currentDate);

        if (type === 'hour') {
            const hour = parseInt(value, 10);
            newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
        } else if (type === 'minute') {
            newDate.setMinutes(parseInt(value, 10));
        } else if (type === 'ampm') {
            const hours = newDate.getHours();
            if (value === 'AM' && hours >= 12) {
                newDate.setHours(hours - 12);
            } else if (value === 'PM' && hours < 12) {
                newDate.setHours(hours + 12);
            }
        }

        form.setValue('time', newDate);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={'outline'}
                                            className={cn(
                                                'w-full pl-3 text-left font-normal',
                                                !field.value &&
                                                    'text-muted-foreground'
                                            )}
                                        >
                                            {field.value ? (
                                                format(
                                                    field.value,
                                                    'MM/dd/yyyy hh:mm aa'
                                                )
                                            ) : (
                                                <span>MM/DD/YYYY hh:mm aa</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <div className="sm:flex">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={handleDateSelect}
                                            initialFocus
                                        />
                                        <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                                            <ScrollArea className="w-64 sm:w-auto">
                                                <div className="flex p-2 sm:flex-col">
                                                    {Array.from(
                                                        { length: 12 },
                                                        (_, i) => i + 1
                                                    )
                                                        .reverse()
                                                        .map((hour) => (
                                                            <Button
                                                                key={hour}
                                                                size="icon"
                                                                variant={
                                                                    field.value &&
                                                                    field.value.getHours() %
                                                                        12 ===
                                                                        hour %
                                                                            12
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
                                                    {Array.from(
                                                        { length: 12 },
                                                        (_, i) => i * 5
                                                    ).map((minute) => (
                                                        <Button
                                                            key={minute}
                                                            size="icon"
                                                            variant={
                                                                field.value &&
                                                                field.value.getMinutes() ===
                                                                    minute
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
                                                            {minute
                                                                .toString()
                                                                .padStart(
                                                                    2,
                                                                    '0'
                                                                )}
                                                        </Button>
                                                    ))}
                                                </div>
                                                <ScrollBar
                                                    orientation="horizontal"
                                                    className="sm:hidden"
                                                />
                                            </ScrollArea>
                                            <ScrollArea className="">
                                                <div className="flex p-2 sm:flex-col">
                                                    {['AM', 'PM'].map(
                                                        (ampm) => (
                                                            <Button
                                                                key={ampm}
                                                                size="icon"
                                                                variant={
                                                                    field.value &&
                                                                    ((ampm ===
                                                                        'AM' &&
                                                                        field.value.getHours() <
                                                                            12) ||
                                                                        (ampm ===
                                                                            'PM' &&
                                                                            field.value.getHours() >=
                                                                                12))
                                                                        ? 'default'
                                                                        : 'ghost'
                                                                }
                                                                className="aspect-square shrink-0 sm:w-full"
                                                                onClick={() =>
                                                                    handleTimeChange(
                                                                        'ampm',
                                                                        ampm
                                                                    )
                                                                }
                                                            >
                                                                {ampm}
                                                            </Button>
                                                        )
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Please select your preferred date and time.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
