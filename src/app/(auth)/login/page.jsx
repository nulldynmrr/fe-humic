"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { loginAdmin } from "@/utils/auth";

const formSchema = z.object({
  username: z
    .string({ required_error: "Username wajib diisi" })
    .min(3, "Username minimal 3 karakter"),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(8, "Password minimal 8 karakter"),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [validations, setValidations] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchParams) return;

    const verify = searchParams.get("verify");
    const message = searchParams.get("message");

    if (verify === "success") {
      toast.dismiss();
      toast.success("Verifikasi email berhasil!");
    } else if (message) {
      toast.dismiss();
      toast.error(message);
    }

    if (verify || message) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("verify");
      newParams.delete("message");
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidations([]);

    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      setValidations(
        validation.error?.issues.map((err) => ({
          name: err.path[0],
          message: err.message,
        }))
      );
      toast.dismiss();
      toast.error("Invalid Input");
      setLoading(false);
      return;
    }

    try {
      const data = await loginAdmin(formData.username, formData.password);

      if (data?.token) {
        Cookies.set("token", data.token, { expires: 1 });

        const adminData = {
          id: data.id || data.adminId || data._id,
          username: data.username || formData.username,
          name:
            data.name || data.fullName || data.displayName || formData.username,
          email: data.email || "",
          avatar: data.avatar || data.profileImage || data.photo || "",
          role: data.role || "admin",
        };

        localStorage.setItem("admin", JSON.stringify(adminData));

        toast.dismiss();
        toast.success(data.message || "Login Successful");

        router.push("/administrator/dashboard");
      } else {
        toast.dismiss();
        toast.error("Login failed - No token received");
        setLoading(false);
      }
    } catch (error) {
      let errorMessage =
        error?.response?.data?.message || error?.message || "Login failed";
      setValidations([{ name: "username", message: errorMessage }]);
      toast.dismiss();
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const getValidationError = (fieldName) => {
    return validations.find((v) => v.name === fieldName)?.message;
  };

  return (
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
          Enter your username and password below to log into your account
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="username" className="text-gray-900">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="text-black !bg-white focus:bg-white focus:ring-0 focus:border-gray-300 hover:bg-white autofill:text-black autofill:bg-white"
            />
            {getValidationError("username") && (
              <p className="text-sm text-red-500">
                {getValidationError("username")}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-gray-900">
                Password
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
                className="text-black !bg-white pr-10 focus:bg-white focus:ring-0 focus:border-gray-300 hover:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {getValidationError("password") && (
              <p className="text-sm text-red-500">
                {getValidationError("password")}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center mt-4"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <section className="flex h-screen">
      <Suspense
        fallback={
          <div className="flex flex-col justify-center w-full md:w-1/2 px-8 md:px-16 lg:px-24">
            <div className="max-w-sm w-full mx-auto">
              <p>Loading...</p>
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>

      <div className="hidden md:flex w-1/2 items-center justify-end relative bg-[#F1F5F9] overflow-hidden">
        <Image src="/assets/login/auth-cover.png" alt="Auth Cover" fill />
      </div>
    </section>
  );
}
