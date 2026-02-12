import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's3.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'retsly-api-production.s3.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'dvvjkgh94f2v6.cloudfront.net',
            },
            {
                protocol: 'https',
                hostname: 'd19kqrrdn1ne5k.cloudfront.net',
            },
            {
                protocol: 'https',
                hostname: 'p.iresis.com',
            },
            {
                protocol: 'https',
                hostname: 'media.mlsgrid.com',
            },
        ],
    },
};

export default nextConfig;
