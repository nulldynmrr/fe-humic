"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = Cookies.get("admin_token");

    if (!token) {
      console.warn("No admin token, redirecting to login");
      router.replace("/login");
    } else {
      console.log("Admin token found, authorized");
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return children;
}
