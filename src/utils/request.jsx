import axios from "axios";
import Cookies from "js-cookie";

const request = axios.create({
  baseURL: "/api", // Use Next.js proxy
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

const requestHandler = (request) => {
  // Token sementara di-nonaktifkan
  // let token = Cookies.get("token");
  // if (token !== undefined) {
  //   request.headers.Authorization = `Bearer ${token}`;
  // }

  return request;
};

const responseHandler = (response) => response;

const errorHandler = (error) => {
  if (error.response && error.response.status === 401) {
    // expiredTokenHandler();
    // console.warn("401 Unauthorized — token handling disabled");
  } else if (error.code === "ERR_NETWORK") {
    console.log("Network error:", error);
  }
  return Promise.reject(error);
};

request.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error)
);

request.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

export default {
  get: (url, params = null, headers = {}) =>
    request({ method: "get", url, params, headers }),
  post: (url, data, headers = {}) =>
    request({ method: "post", url, data, headers }),
  put: (url, data, headers) => request({ method: "put", url, data, headers }),
  patch: (url, data, headers) =>
    request({ method: "patch", url, data, headers }),
  delete: (url, data) => request({ method: "delete", url, data }),

  // fungsi setToken juga di-nonaktifkan
  setToken: () => {
    console.log("setToken disabled for now");
  },
};
