import Image from 'next/image';
import { toast } from 'react-toastify';
import { Icon } from '../types/icon';

interface IconListProps {
    data: Icon[];
}

export function IconList({ data }: IconListProps) {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!', { position: 'top-center' });
    };

    return (
        <div className="grid grid-cols-3 gap-x-2 gap-y-5 lg:grid-cols-5 xl:grid-cols-8">
            {data.map((icon: Icon) => (
                <div
                    onClick={() => handleCopy(icon.name)}
                    title={icon.name}
                    key={icon.id}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-4 hover:bg-gray-100"
                >
                    <div className="mb-2 h-10 w-auto overflow-hidden rounded-xl">
                        <Image
                            alt={icon.name}
                            src={icon.url}
                            width={100}
                            height={100}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                    <div className="w-full">
                        <p className="truncate text-center">{icon.name}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
