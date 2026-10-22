import axios, { type InternalAxiosRequestConfig } from "axios";

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type FailedRequest = {
  resolve: () => void;
  reject: (reason?: unknown) => void;
};

const axiosConfig = {
  baseURL: "/proxy-backend",
  withCredentials: true,
};

const api = axios.create(axiosConfig);
const refreshApi = axios.create(axiosConfig);

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((promise) => {
    if (error !== undefined) {
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
    const originalRequest = error.config as RetryableRequest | undefined;
    const requestUrl = originalRequest?.url ?? "";
    const isRefreshRequest = /refresh[-_]?token/i.test(requestUrl);
    const isAuthenticationRequest = /(?:^|\/)authentication(?:\/|$)/i.test(
      requestUrl,
    );

    if (
      isRefreshRequest ||
      isAuthenticationRequest ||
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      await refreshApi.get("/api/refresh_token");
      processQueue();
      return api(originalRequest);
    } catch (refreshError) {
      console.log(refreshError)
      processQueue(refreshError);
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
       window.location.replace("/login");
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
