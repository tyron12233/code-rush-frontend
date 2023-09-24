/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        domains: ["avatars.githubusercontent.com"],
    },
    publicRuntimeConfig: {
    }
}

module.exports = nextConfig
