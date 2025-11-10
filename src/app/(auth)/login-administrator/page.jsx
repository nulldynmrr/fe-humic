"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import request from "@/utils/request";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [validations, setValidations] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verify = searchParams.get("verify");
    const message = searchParams.get("message");

    if (verify === "success") {
      toast.dismiss();
      toast.success("Verifikasi email berhasil!");
    } else if (message) {
      toast.dismiss();
      toast.error(message);
    }

    if (verify) {
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

    try {
      const validation = formSchema.safeParse(formData);

      if (!validation.success) {
        if (validation.error?.issues) {
          setValidations(
            validation.error.issues.map((err) => ({
              name: err.path[0],
              message: err.message,
            }))
          );
        } else {
          setValidations([
            { name: "username", message: "Validation error" },
            { name: "password", message: "Validation error" },
          ]);
        }

        toast.dismiss();
        toast.error("Invalid Input");
        setLoading(false);
        return;
      }

      const response = await request.post("/admin/login", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200 || response.status === 201) {
        const data = response.data;

        console.log("Processed Data:", data);
        console.log("Token:", data?.token);

        if (data?.token) {
          Cookies.set("token", data.token, { expires: 1 });
          console.log("Token saved to cookies successfully");

          toast.dismiss();
          toast.success(data.message || "Login Successful");

          console.log("Redirecting to dashboard...");
          router.push("/administrator/dashboard");
        } else {
          console.error("No token found in response data");
          toast.dismiss();
          toast.error("Login failed - No token received");
          setLoading(false);
        }
      } else {
        console.error("Unexpected status code:", response.status);
        toast.dismiss();
        toast.error("Login failed - Invalid response");
        setLoading(false);
      }
    } catch (error) {
      let errorMessage = "";
      if (error?.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          const backendError =
            data?.errorAdminRouteL2 || data?.errorAdminRouteL3 || data?.message;

          if (backendError && backendError.includes("expiredTokenHandler")) {
            errorMessage = "Username tidak ditemukan";
            setValidations([{ name: "username", message: errorMessage }]);
          } else if (
            backendError &&
            backendError.toLowerCase().includes("password")
          ) {
            errorMessage = backendError;
            setValidations([{ name: "password", message: errorMessage }]);
          } else if (
            backendError &&
            backendError.toLowerCase().includes("username")
          ) {
            errorMessage = backendError;
            setValidations([{ name: "username", message: errorMessage }]);
          } else {
            errorMessage = backendError || "Invalid username or password";
            setValidations([
              { name: "username", message: errorMessage },
              { name: "password", message: errorMessage },
            ]);
          }
        } else if (status === 404) {
          errorMessage = "Account not found";
          setValidations([{ name: "username", message: "Username not found" }]);
        } else if (status === 400) {
          errorMessage = data?.message || "Invalid input";

          if (data?.errors && typeof data.errors === "object") {
            const beValidations = Object.entries(data.errors).map(
              ([key, value]) => ({
                name: key,
                message: Array.isArray(value) ? value[0] : value,
              })
            );
            setValidations(beValidations);
          } else {
            setValidations([
              { name: "username", message: errorMessage },
              { name: "password", message: errorMessage },
            ]);
          }
        } else {
          errorMessage = data?.message || `Server error (${status})`;
          setValidations([{ name: "username", message: errorMessage }]);
        }
      } else if (error?.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        errorMessage = error?.message || "An unexpected error occurred.";
        setValidations([{ name: "username", message: errorMessage }]);
      }

      toast.dismiss();
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const getValidationError = (fieldName) => {
    const error = validations.find((v) => v.name === fieldName);
    return error?.message;
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
                className="text-black bg-white focus:bg-white focus:ring-0 focus:border-gray-300 hover:bg-white autofill:text-black autofill:bg-white"
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="text-black bg-white pr-10 focus:bg-white focus:ring-0 focus:border-gray-300 hover:bg-white"
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

      <div className="hidden md:flex w-1/2 items-center justify-end relative bg-[#F1F5F9] overflow-hidden">
        <Image src="/assets/login/auth-cover.svg" alt="Auth Cover" fill />
      </div>
    </section>
  );
}
