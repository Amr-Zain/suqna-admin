import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: import.meta?.env?.VITE_BASE_GENERAL_URL!,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const locale = Cookies.get("NEXT_LOCALE") || "en";
    const userToken = useAuthStore.getState().token;

    if (!config.params) {
      config.params = {};
    }

    if(userToken){
      config.headers["Authorization"] = `Bearer ${userToken}`;
    }
    config.headers["Accept-Language"] = locale;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearUser();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
