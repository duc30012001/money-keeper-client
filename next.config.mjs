import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ant-group.net',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '**',
            },
            // {
            //     protocol: 'https',
            //     hostname: 'drive.google.com',
            //     pathname: '**',
            // },
            // {
            //     protocol: 'https',
            //     hostname: '**',
            // },
            // {
            //     protocol: 'http',
            //     hostname: '**',
            // },
        ],
        minimumCacheTTL: 1500000,
    },
    output: 'standalone',
};

export default withNextIntl(nextConfig);
