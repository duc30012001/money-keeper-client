import AppToast from '@/components/app-toast';
import { appConfig } from '@/constants/app';
import { authOptions } from '@/modules/auth/next-auth';
import ReactQueryProviders from '@/providers/react-query';
import SessionProvider from '@/providers/session-provider';
import '@/styles/globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import React from 'react';

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

const {
    url: appUrl,
    logo: appIcon,
    title: appTitle,
    description: appDescription,
} = appConfig;

export const metadata: Metadata = {
    title: appTitle,
    description: appDescription,
    icons: {
        icon: appIcon,
        shortcut: appIcon,
        apple: appIcon,
        other: {
            rel: 'icon',
            url: appIcon,
        },
    },
    // Open Graph metadata
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: appUrl,
        title: appTitle,
        description: appDescription,
        siteName: appTitle,
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
        title: appTitle,
        description: appDescription,
        images: [appUrl + '/images/background.jpg'],
        creator: '@vietduc_dev',
    },
    // Additional metadata
    metadataBase: new URL(appUrl),
    alternates: {
        canonical: '/',
    },
};

export default async function LocaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AntdRegistry>
                    <NextTopLoader showSpinner={false} />
                    <ReactQueryProviders>
                        <SessionProvider session={session}>
                            {children}
                            <AppToast />
                        </SessionProvider>
                    </ReactQueryProviders>
                </AntdRegistry>
            </body>
        </html>
    );
}
