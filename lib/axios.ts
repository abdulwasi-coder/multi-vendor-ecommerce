import axios from "axios";

const axiosConfig = {
  baseURL:
    typeof window === "undefined"
      ? process.env.Base_Url
      : "/proxy-backend",
  withCredentials: typeof window === "undefined" ? false : true,
};

const api = axios.create(axiosConfig);

export default api;
