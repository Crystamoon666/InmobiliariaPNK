/**
 * authService.js — PNK Inmobiliaria
 * Maneja login, registro, sesión y cierre de sesión.
 * Patrón de la Guía 3 (SportClub) adaptado a los roles admin / propietario.
 *
 * Respuesta esperada del backend (POST /api/auth/login):
 * {
 *   ok: true,
 *   message: "Login exitoso.",
 *   data: {
 *     token: "jwt...",
 *     user: { id, nombre_completo, correo, rol, estado }
 *   }
 * }
 */

import axios from '../API/axiosConfig';

// ── Login ──────────────────────────────────────────────────
export const loginUser = async ({ correo, password }) => {
  const response = await axios.post('/auth/login', { correo, password });
  return response.data;
};

// ── Registro público de propietario ────────────────────────
export const registerOwner = async (formData) => {
  const response = await axios.post('/auth/register', formData);
  return response.data;
};

// ── Guardar sesión en localStorage ─────────────────────────
export const saveSession = (token, user) => {
  localStorage.setItem('pnk_token', token);
  localStorage.setItem('pnk_user', JSON.stringify(user));
};

// ── Obtener token ───────────────────────────────────────────
export const getToken = () => {
  return localStorage.getItem('pnk_token');
};

// ── Obtener usuario ─────────────────────────────────────────
export const getUser = () => {
  const user = localStorage.getItem('pnk_user');
  return user ? JSON.parse(user) : null;
};

// ── Verificar si está autenticado ──────────────────────────
export const isAuthenticated = () => {
  return !!getToken();
};

// ── Cerrar sesión ───────────────────────────────────────────
export const logout = () => {
  localStorage.removeItem('pnk_token');
  localStorage.removeItem('pnk_user');
};
