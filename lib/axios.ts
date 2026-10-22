import axios from "axios";

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};
const api = axios.create({
  baseURL: "/proxy-backend",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // The browser attaches the HttpOnly refresh cookie automatically. Do not
    // attempt another refresh when the refresh endpoint itself returns 401.
    if (/refresh[-_]?token/i.test(originalRequest?.url ?? "")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.get("/api/refresh-token", { withCredentials: true });
        processQueue(null);
        isRefreshing = false;
        return api(originalRequest);
      } catch (error) {
        processQueue(error);
        isRefreshing = false;
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
