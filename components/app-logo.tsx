import { appConfig } from '@/constants/app';
import { AppRoute } from '@/enums/routes';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface AppLogoProps {
    className?: string;
}

function AppLogo({ className }: AppLogoProps) {
    return (
        <Link
            href={AppRoute.DASHBOARD}
            className={cn('flex w-fit items-center gap-2', className)}
        >
            <Image src={appConfig.logo} alt="logo" width={32} height={32} />
            <h1 className="text-2xl font-bold">{appConfig.title}</h1>
        </Link>
    );
}

export default AppLogo;
