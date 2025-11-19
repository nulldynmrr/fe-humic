import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Login | Admin Dashboard",
  description:
    "Admin akan masuk ke dalam dashboard untuk mengelola data pada aplikasi Humic.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AuthLayout({ children }) {
  return (
    <div
      className={`${inter.variable} antialiased bg-gray-50`}
      data-theme="light"
    >
      {children}
    </div>
  );
}
