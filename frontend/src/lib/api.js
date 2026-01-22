import axios from 'axios';
import { useUserStore } from '../store/userStore';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_API,
  withCredentials: true, // Include cookies in requests
});


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
        // Attempt to refresh the token
        console.log('before refresh');
        const response = await axios.post('/api/refreshToken');
        // const { access_token } = response.data.
        if (!response.data.success || !response.data.token) {
          throw new Error('Refresh token failed');
      
        }
        console.log('Token refreshed successfully', response.data.token);
        
        const token = response.data.token;
        document.cookie = `auth_token=${token}; path=/; max-age=900`;

        useUserStore.getState().setAccessToken(token);

        console.log('after', response.data.token);


        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${token}`;

       return api(originalRequest);
      } catch (refreshError) {
        // useUserStore.getState().logout();
        // document.cookie = 'auth_token=; Max-Age=0; path=/;';
        // window.location.href = '/signIn';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;