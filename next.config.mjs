/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/img/**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_HOST || "http://localhost:3000"
        }/api/:path*`,
      },
      {
        source: "/img/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_HOST || "http://localhost:3000"
        }/img/:path*`,
      },
    ];
  },
};

export default nextConfig;
