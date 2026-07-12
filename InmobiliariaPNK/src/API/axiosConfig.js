/**
 * axiosConfig.js — PNK Inmobiliaria
 * Instancia centralizada de Axios con:
 *  - baseURL desde variable de entorno VITE_API_URL
 *  - Interceptor que agrega el header Authorization automáticamente
 *
 * Uso en services/:
 *   import axios from '../API/axiosConfig';
 *   const res = await axios.get('/propiedades');
 */

import axios from 'axios';
import { getToken } from '../services/authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptor de peticiones: agrega el token JWT automáticamente ──
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Interceptor de respuestas: maneja errores 401 globalmente ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido — limpiar sesión y redirigir al login
      localStorage.removeItem('pnk_token');
      localStorage.removeItem('pnk_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
