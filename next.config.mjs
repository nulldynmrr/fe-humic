/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEBLUM DEPLOY GANTI
  // images: {
  //     remotePatterns: [
  //       {
  //         protocol: "https",
  //         hostname: "api.myapp.com",
  //         pathname: "/img/**",
  //       },
  //     ],
  //   }

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/img/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
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
