import { AppRoute } from '@/constants/sidebar';
import Image from 'next/image';
import Link from 'next/link';

type Props = {};

function AppLogo({}: Props) {
    return (
        <Link href={AppRoute.Dashboard} className="flex items-center gap-2">
            <Image src={'/images/icon.png'} alt="logo" width={32} height={32} />
            <h1 className="hidden text-2xl font-bold sm:block">Money Keeper</h1>
        </Link>
    );
}

export default AppLogo;
