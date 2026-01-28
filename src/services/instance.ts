
import i18n from '@/i18n';
import { useAuthStore } from '@/stores/authStore';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

interface ErrorResponse {
  status: number;
  message: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use((config: any) => {
  const user_token = useAuthStore.getState().token;

  if(user_token){
    config.headers["Authorization"] = `Bearer ${user_token}`;
  }
  config.headers['user-type'] = 'admin';

  config.headers = {
    ...config.headers,
    'Accept-Language': `${i18n.language || 'ar'}`,
  };

  return config;
});


// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> => response,
  (error: AxiosError<ErrorResponse>) => {
    console.log("🚀 ~ error:", error)
    const { status } = error.response || {};
    switch (status) {
      case 400:
        console.error('Bad Request:', status);
        break;
      case 401:
        console.error('Unauthorized:', status);
        useAuthStore.getState().clearUser()        
        window.location.replace('/auth/login');
        break;
      case 404:
        console.error('Not Found:', status);
        break;
      case 500:
        console.error('Server Error:', status);
        break;
      default:
        console.error('Unhandled Error:', status);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
