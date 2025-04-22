import { Toaster } from '@/components/ui/sonner';
import { authOptions } from '@/modules/auth/next-auth';
import ReactQueryProviders from '@/provider/react-query';
import SessionProviderClientComponent from '@/provider/session-provider';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'Money Keeper',
    description: 'Money Keeper App',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ReactQueryProviders>
                    <SessionProviderClientComponent session={session}>
                        <NextTopLoader />
                        {children}
                        <Toaster />
                    </SessionProviderClientComponent>
                </ReactQueryProviders>
            </body>
        </html>
    );
}
