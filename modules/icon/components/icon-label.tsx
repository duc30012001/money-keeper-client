import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface IconLabelProps {
    url?: string;
    name: string;
    className?: string;
    avatarClassName?: string;
    style?: React.CSSProperties;
}

export function IconLabel({
    url,
    name,
    className,
    avatarClassName,
    style,
}: IconLabelProps) {
    return (
        <div
            title={name}
            className={cn('flex items-center gap-2', className)}
            style={style}
        >
            <Avatar className={cn('size-5 rounded-none', avatarClassName)}>
                <AvatarImage src={url} alt={name} />
                <AvatarFallback className="rounded-lg text-xs">
                    {name?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <p className="text-sm">{name}</p>
        </div>
    );
}
