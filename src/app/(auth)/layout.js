import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Login | Admin",
  description: "Login Admin",
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
