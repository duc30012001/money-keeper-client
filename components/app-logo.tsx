import { appConfig } from '@/constants/app';
import { AppRoute } from '@/enums/routes';
import { cn } from '@/lib/utils';
import { theme } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

interface AppLogoProps {
    className?: string;
    logoClassName?: string;
    labelClassName?: string;
}

function AppLogo({ className, labelClassName, logoClassName }: AppLogoProps) {
    const {
        token: { colorText },
    } = theme.useToken();
    return (
        <Link
            href={AppRoute.DASHBOARD}
            className={cn('flex w-fit items-center gap-2', className)}
        >
            <Image
                src={appConfig.logo}
                alt="logo"
                width={32}
                height={32}
                className={logoClassName}
            />
            <h1
                className={cn('text-2xl font-bold', labelClassName)}
                style={{ color: colorText }}
            >
                {appConfig.title}
            </h1>
        </Link>
    );
}

export default AppLogo;
