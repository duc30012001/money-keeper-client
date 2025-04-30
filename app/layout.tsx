import AppToast from '@/components/app-toast';
import { authOptions } from '@/modules/auth/next-auth';
import ReactQueryProviders from '@/provider/react-query';
import SessionProviderClientComponent from '@/provider/session-provider';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
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

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    title: 'Money Keeper',
    description:
        'Money Keeper App - Track your finances, manage your money, and achieve your financial goals',
    icons: {
        icon: '/images/icon.png',
        shortcut: '/images/icon.png',
        apple: '/images/icon.png',
        other: {
            rel: 'icon',
            url: '/images/icon.png',
        },
    },
    // Open Graph metadata
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: appUrl,
        title: 'Money Keeper',
        description:
            'Money Keeper App - Track your finances, manage your money, and achieve your financial goals',
        siteName: 'Money Keeper',
        images: [
            {
                url: appUrl + '/images/background.jpg',
                width: 1200,
                height: 630,
                alt: 'Money Keeper App',
            },
        ],
    },
    // Twitter metadata
    twitter: {
        card: 'summary_large_image',
        title: 'Money Keeper',
        description:
            'Money Keeper App - Track your finances, manage your money, and achieve your financial goals',
        images: [appUrl + '/images/background.jpg'],
        creator: '@vietduc_dev',
    },
    // Additional metadata
    metadataBase: new URL(appUrl),
    alternates: {
        canonical: '/',
    },
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
                        <NextTopLoader showSpinner={false} />
                        <NuqsAdapter>{children}</NuqsAdapter>
                    </SessionProviderClientComponent>
                </ReactQueryProviders>
                <AppToast />
            </body>
        </html>
    );
}
