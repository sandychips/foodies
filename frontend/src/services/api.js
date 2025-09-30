import axios from "axios";

/* global process */

const resolveBaseUrl = () => {
  const envFromImport = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_API_BASE_URL : undefined;
  const envFromProcess = typeof process !== 'undefined' ? process.env?.VITE_API_BASE_URL : undefined;

  return (envFromImport || envFromProcess || 'http://localhost:5000/api/v1').replace(/\/$/, '');
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  const token = storedUser ? JSON.parse(storedUser).token : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
