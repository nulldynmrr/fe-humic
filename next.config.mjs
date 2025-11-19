/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_HOST?.startsWith("https")
          ? "https"
          : "http",
        hostname: process.env.NEXT_PUBLIC_HOST?.replace(
          /^https?:\/\//,
          ""
        ).replace(/\/$/, ""),
        pathname: "/**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  async rewrites() {
    const host = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
    return [
      {
        source: "/api/:path*",
        destination: `${host}/api/:path*`,
      },
      {
        source: "/img/:path*",
        destination: `${host}/img/:path*`,
      },
    ];
  },
};

export default nextConfig;
