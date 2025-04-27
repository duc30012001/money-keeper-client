'use client';

import { LoginForm } from '@/components/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    useEffect(() => {
        if (error) {
            toast(decodeURIComponent(error), {
                type: 'error',
            });
        }
    }, [error]);
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a
                    href="#"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <Image
                        src="/icon.png"
                        alt="Money Keeper"
                        width={24}
                        height={24}
                        unoptimized
                    />
                    Money Keeper.
                </a>
                <div className={cn('flex flex-col gap-6')}>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">
                                Welcome back
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LoginForm />
                        </CardContent>
                    </Card>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                        By clicking continue, you agree to our{' '}
                        <a href="#">Terms of Service</a> and{' '}
                        <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    );
}
