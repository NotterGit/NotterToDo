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
            }
        ]
    }
};

export default nextConfig;
