// import axios from "axios";
// import Cookies from "js-cookie";

// const request = axios.create({
//   baseURL: "/api",
//   timeout: 60000,
//   headers: {
//     "Content-Type": "application/json",
//     // "Content-Type": "application/json, multipart/form-data",
//   },
// });

// const requestHandler = (request) => {
//   let token = Cookies.get("token");
//   if (token !== undefined) {
//     request.headers.Authorization = `Bearer ${token}`;
//   }

//   return request;
// };

// const responseHandler = (response) => response;

// const expiredTokenHandler = () => {
//   Cookies.remove("token");
//   if (typeof window !== "undefined") {
//     window.location.href = "/login";
//   }
// };

// const errorHandler = (error) => {
//   if (error.response && error.response.status === 401) {
//     expiredTokenHandler();
//     console.warn("401 Unauthorized — token handling disabled");
//   } else if (error.code === "ERR_NETWORK") {
//     console.log("Network error:", error);
//   }
//   return Promise.reject(error);
// };

// request.interceptors.request.use(
//   (request) => requestHandler(request),
//   (error) => errorHandler(error)
// );

// request.interceptors.response.use(
//   (response) => responseHandler(response),
//   (error) => errorHandler(error)
// );

// export default {
//   get: (url, params = null, headers = {}) =>
//     request({ method: "get", url, params, headers }),
//   post: (url, data, headers = {}) =>
//     request({ method: "post", url, data, headers }),
//   put: (url, data, headers) => request({ method: "put", url, data, headers }),
//   patch: (url, data, headers) =>
//     request({ method: "patch", url, data, headers }),
//   delete: (url, data) => request({ method: "delete", url, data }),

//   // fungsi setToken juga di-nonaktifkan
//   setToken: () => {
//     console.log("setToken disabled for now");
//   },
// };

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
        window.location.href = "/login-administrator";
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
