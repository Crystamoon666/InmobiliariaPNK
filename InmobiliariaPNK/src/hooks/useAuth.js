/**
 * useAuth.js — PNK Inmobiliaria
 * Hook de acceso directo al AuthContext.
 * Re-exporta el hook useAuth desde AuthContext para mayor comodidad.
 *
 * Uso:
 *   import useAuth from '../hooks/useAuth';
 *   const { user, login, logout, isAuthenticated } = useAuth();
 */

export { useAuth as default } from '../context/AuthContext';
