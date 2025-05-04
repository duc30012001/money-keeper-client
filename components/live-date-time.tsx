'use client';

import { Button } from '@/components/ui/button'; // adjust your import
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LiveDateTimeProps {
    className?: string;
}

export default function LiveDateTime({ className }: LiveDateTimeProps) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className={cn('flex items-center gap-2 text-sm italic', className)}
        >
            <span>{formatDate(now, 'dddd, MMMM D, YYYY HH:mm:ss')}</span>
            <Button variant="ghost" size="icon">
                <CalendarIcon />
            </Button>
        </div>
    );
}
