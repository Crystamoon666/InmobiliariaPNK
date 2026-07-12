/**
 * RoleRoute.jsx — PNK Inmobiliaria
 * Valida que el usuario tenga el rol correcto.
 * - Sin sesión → redirige a /login
 * - Rol incorrecto → redirige a /unauthorized
 * Patrón de la Guía 3 (SportClub).
 *
 * Uso en AppRoutes.jsx:
 *   <Route element={<RoleRoute allowedRoles={['admin']} />}>
 *     <Route path="/admin/dashboard" element={<DashboardAdmin />} />
 *   </Route>
 *
 * Roles del proyecto: 'admin' | 'propietario'
 */

import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getUser } from '../services/authService';

export default function RoleRoute({ allowedRoles = [] }) {
  // Sin sesión → login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();

  // Rol no permitido → unauthorized
  if (!allowedRoles.includes(user?.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
