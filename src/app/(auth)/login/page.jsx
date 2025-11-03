"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <section className="flex h-screen">
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 md:px-16 lg:px-24">
        <div className="max-w-sm w-full mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Image
              src="/assets/logo-humic-pesergi.png"
              alt="Logo Humic"
              width={40}
              height={40}
              priority
            />
            <h1 className="text-2xl font-semibold text-gray-800">
              Humic Admin Dashboard
            </h1>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900">Sign in</h2>
          <p className="text-[#62748E] mt-2">
            Enter your email and password below to log into your account
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email" className="text-gray-900">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-black bg-white focus:bg-white focus:ring-0 focus:border-gray-300 hover:bg-white autofill:text-black autofill:bg-white"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-900">
                  Password
                </Label>
                <a href="#" className="text-sm text-gray-700 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-black bg-white pr-10 focus:bg-white focus:ring-0 focus:border-gray-300 hover:bg-white "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center mt-4"
              disabled={loading || !email}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 items-center justify-end relative bg-[#F1F5F9] overflow-hidden">
        <Image src="/assets/login/auth-cover.svg" alt="Auth Cover" fill />
      </div>
    </section>
  );
}
