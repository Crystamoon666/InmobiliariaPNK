/**
 * AuthContext.jsx — PNK Inmobiliaria
 * Estado global de sesión: token, user, login(), logout(), loading.
 * Persiste en localStorage para mantener la sesión al refrescar.
 *
 * Uso en componentes:
 *   import { useAuth } from './context/AuthContext';
 *   const { user, login, logout } = useAuth();
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, saveSession, logout as clearSession } from '../services/authService';
import { loginUser } from '../services/authService';

// Crear el contexto
export const AuthContext = createContext(null);

// Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
};

// Proveedor del contexto
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true); // true mientras carga desde localStorage

  // Al montar, restaurar sesión desde localStorage
  useEffect(() => {
    const savedToken = getToken();
    const savedUser  = getUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  /**
   * login({ correo, password })
   * Llama al backend, guarda la sesión y actualiza el estado global.
   * Retorna el objeto user para que el componente pueda redirigir según el rol.
   */
  const login = async (credentials) => {
    const data = await loginUser(credentials);
    const { token: newToken, usuario: newUser } = data;
    saveSession(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
    return newUser; // el componente Login usará newUser.rol para redirigir
  };

  /**
   * logout()
   * Limpia localStorage y resetea el estado global.
   */
  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  // Mientras restauramos la sesión, no renderizamos nada
  // (evita parpadeo de rutas protegidas)
  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
