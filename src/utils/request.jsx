import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function getCurrentAdmin() {
  try {
    const token = Cookies.get("token");
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

request.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default {
  get: (url, params = null, headers = {}) =>
    request({ method: "get", url, params, headers }),
  post: (url, data, headers = {}) =>
    request({ method: "post", url, data, headers }),
  put: (url, data, headers = {}) =>
    request({ method: "put", url, data, headers }),
  patch: (url, data, headers = {}) =>
    request({ method: "patch", url, data, headers }),
  delete: (url, data) => request({ method: "delete", url, data }),
};
