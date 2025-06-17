/** @type {import('next').NextConfig} */
const nextConfig = {
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
            {
                protocol: 'https',
                hostname: 'drive.google.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
        minimumCacheTTL: 1500000,
    },
};

export default nextConfig;
