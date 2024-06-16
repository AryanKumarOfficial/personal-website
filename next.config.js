// next.config.js

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['avatars0.githubusercontent.com'],
    },
    i18n: {
        locales: ['en', 'fr', 'es'],
        defaultLocale: 'en',
    },
    env: {
        CUSTOM_API_ENDPOINT: 'https://api.example.com',
    },
    webpack: (config, { isServer }) => {
        // Example of custom webpack configuration
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/about',
                destination: '/',
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/about',
                destination: '/',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
