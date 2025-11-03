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
      // {
      //   protocol: "https",
      //   hostname: "api.example.com",
      //   pathname: "/img/**",
      // },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_HOST}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
