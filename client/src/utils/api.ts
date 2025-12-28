import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    
    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        if (window.location.pathname !== '/login') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
        }
        break;
        
      case 403:
        toast.error('Access denied. You do not have permission.');
        break;
        
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
        
      case 500:
        toast.error('Server error. Please try again later.');
        break;
        
      default:
        if (error.message === 'Network Error') {
          toast.error('Network error. Please check your connection.');
        }
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials: { username: string; password: string; role: string }) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set axios default header
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
  },
  
  verifyToken: async () => {
    try {
      const response = await api.get('/api/auth/verify');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Socket.io setup
export const setupSocket = (token: string) => {
  const { io } = require('socket.io-client');
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:5000';
  
  return io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
};

export default api;