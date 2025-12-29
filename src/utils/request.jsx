import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function getCurrentAdmin() {
  try {
    const token = Cookies.get("admin_token");
    if (!token) return null;

    const decoded = jwtDecode(token);

    return {
      id: decoded.id || decoded.sub,
      username: decoded.username,
      role: decoded.role,
      avatar: decoded.avatar || "",
    };
  } catch (err) {
    console.error("Invalid token:", err);
    Cookies.remove("admin_token");
    return null;
  }
}

const request = axios.create({
  baseURL: "/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    const token = Cookies.get("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (res) => res,
  (error) => {
    const skipAuthRedirect = error.config?.skipAuthRedirect;

    if (error.response?.status === 401 && !skipAuthRedirect) {
      console.warn("Unauthorized: Token invalid atau expired");

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        if (!currentPath.includes("/login")) {
          Cookies.remove("admin_token");
          localStorage.removeItem("admin");

          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default {
  get: (url, params = null, headers = {}) =>
    request({ method: "get", url, params, headers }),
  post: (url, data, headers = {}, skipAuthRedirect = false) =>
    request({ method: "post", url, data, headers, skipAuthRedirect }),
  put: (url, data, headers = {}) =>
    request({ method: "put", url, data, headers }),
  patch: (url, data, headers = {}) =>
    request({ method: "patch", url, data, headers }),
  delete: (url, data) => request({ method: "delete", url, data }),
};
