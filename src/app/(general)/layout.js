"use client";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }) {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-24 bg-white text-black min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
