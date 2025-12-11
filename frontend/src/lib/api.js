import axios from 'axios';
import { useUserStore } from '../store/userStore'; // Adjust path to your store

const API_URL = 'http://localhost:4444'; // Your backend URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
});

// Request Interceptor: Attach token if needed (optional if using cookies only)
api.interceptors.request.use((config) => {
  const user = useUserStore.getState().user;
  if (user?.access_token) {
     // If your backend expects a header, otherwise cookies handle it
     config.headers.Authorization = `Bearer ${user.access_token}`; 
  }
  return config;
});

// Response Interceptor: Handle 401s
api.interceptors.response.use(
  (response) => response, // Return successful responses directly
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 1. Clear Zustand Store (LocalStorage)
      // Assuming you have a logout action in your store
      useUserStore.getState().logout();

      // 2. Clear Cookies manually (Client-side)
      document.cookie = 'auth_token=; Max-Age=0; path=/;';

      // 3. Force Redirect to SignIn
      // We use window.location because we are outside a React Component
      window.location.href = '/signIn';
    }

    return Promise.reject(error);
  }
);

export default api;