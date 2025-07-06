import { Button } from '@/components/ui/button';
import { AppRoute } from '@/constants/sidebar';
import Image from 'next/image';
import Link from 'next/link';

export default function ForbiddenPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div>
                <Image
                    src={'/images/403.jpg'}
                    alt="403"
                    width={500}
                    height={300}
                />
            </div>
            <h2 className="text-3xl font-bold">Access Denied</h2>
            <p className="text-lg text-muted-foreground">
                You do not have permission to view this resource.
            </p>
            <Link href={AppRoute.Dashboard} className="mt-6">
                <Button>Back to Dashboard</Button>
            </Link>
        </div>
    );
}
