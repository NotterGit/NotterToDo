/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
            {
                protocol: "https",
                hostname: "db.api.qual.su",
            },
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "storage.yandexcloud.net",
            },
            {
                protocol: "https",
                hostname: "*.storage.yandexcloud.net",
            },
            {
                protocol: "https",
                hostname: "*.qual.su",
            },
            {
                protocol: "https",
                hostname: "*.notter.su",
            }
        ]
    }
};

export default nextConfig;
