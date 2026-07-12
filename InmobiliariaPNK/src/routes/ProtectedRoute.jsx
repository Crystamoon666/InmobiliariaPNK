/**
 * ProtectedRoute.jsx — PNK Inmobiliaria
 * Redirige a /login si el usuario no tiene sesión activa.
 * Patrón de la Guía 3 (SportClub).
 *
 * Uso en AppRoutes.jsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/admin/dashboard" element={<DashboardAdmin />} />
 *   </Route>
 */

import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

export default function ProtectedRoute() {
  // Si no hay sesión, redirige al login
  // replace evita que el botón "atrás" regrese a la ruta protegida
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Renderiza la ruta hija (children o Outlet)
  return <Outlet />;
}
