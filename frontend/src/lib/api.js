import axios from 'axios';
import { useUserStore } from '../store/userStore'; // Adjust path to your store

const API_URL = process.env.NEXT_PUBLIC_BACK_API; // Your backend URL

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

      try {
        const response = await api.post('/refreshToken');
        const { access_token } = response.data;

        // Update Zustand Store with new token
        useUserStore.getState().setUserToken(access_token);

        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        document.cookie = 'auth_token=; Max-Age=0; path=/;';
        window.location.href = '/signIn';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;