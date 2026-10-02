import axios from "axios";

type ApiErrorResponse = {
  message?: string;
};

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_Base_Url,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      return Promise.reject(
        new ApiError(
          error.response?.data?.message ?? error.message ?? "Request failed",
          error.response?.status,
        ),
      );
    }
    return Promise.reject(error);
  },
);

export default api;
