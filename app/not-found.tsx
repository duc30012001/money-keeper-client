import { Button } from '@/components/ui/button';
import { AppRoute } from '@/constants/sidebar';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div>
                <Image
                    src={'/images/404.jpg'}
                    alt="404"
                    width={500}
                    height={300}
                />
            </div>
            <h2 className="text-3xl font-bold">Sorry, Page Not Found</h2>
            <p className="text-lg text-muted-foreground">
                The page you requested could not be found.
            </p>
            <Link href={AppRoute.Dashboard} className="mt-6">
                <Button>Back to Dashboard</Button>
            </Link>
        </div>
    );
}
