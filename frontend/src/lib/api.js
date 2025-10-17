import axios from 'axios';
import { useUserStore } from '../store/userStore';

const API_URL = 'http://localhost:4444';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().user?.access_token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useUserStore.getState().getRefreshToken();
        const { data } = await axios.post(`${API_URL}/refreshToken`, { refreshToken });
        const { user, setUser } = useUserStore.getState();
        const updatedUser = { ...user, access_token: data.accessToken };
        setUser(updatedUser, refreshToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().clearUser();
        window.location.href = '/signIn';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;