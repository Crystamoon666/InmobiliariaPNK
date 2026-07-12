/**
 * AppRoutes.jsx — PNK Inmobiliaria
 * Centraliza toda la navegación de la SPA.
 * Patrón de la Guía 3 (SportClub).
 *
 * Roles:
 *  - Sin sesión     → rutas públicas (/, /login, /registro, /propiedades, etc.)
 *  - 'admin'        → /admin/*
 *  - 'propietario'  → /propietario/*
 */

import { Routes, Route } from 'react-router-dom';

// ── Layouts ──────────────────────────────────────────────────
import PublicLayout   from '../layouts/PublicLayout';
import AdminLayout    from '../layouts/AdminLayout';
import OwnerLayout    from '../layouts/OwnerLayout';

// ── Protección de rutas ──────────────────────────────────────
import ProtectedRoute from './ProtectedRoute';
import RoleRoute      from './RoleRoute';

// ── Páginas públicas ─────────────────────────────────────────
import Home               from '../pages/public/Home';
import Login              from '../pages/public/Login';
import Registro           from '../pages/public/Registro';
import PropiedadesLista   from '../pages/public/PropiedadesLista';
import PropiedadesDetalle from '../pages/public/PropiedadesDetalle';
import About              from '../pages/public/About';
import Contact            from '../pages/public/Contact';
import Unauthorized       from '../pages/public/Unauthorized';
import RecuperarPassword  from '../pages/public/RecuperarPassword';

// ── Páginas Admin ─────────────────────────────────────────────
import DashboardAdmin          from '../pages/admin/DashboardAdmin';
import AdministrarUsers        from '../pages/admin/AdministrarUsers';
import AdministrarpPropiedades from '../pages/admin/AdministrarpPropiedades';
import Settings                from '../pages/admin/Settings';

// ── Páginas Propietario ───────────────────────────────────────
import DashboardPropietario from '../pages/owner/DashboardPropietario';
import MisPropiedades       from '../pages/owner/MisPropiedades';
import PublicarPropiedad    from '../pages/owner/PublicarPropiedad';
import EditarPropiedades    from '../pages/owner/EditarPropiedades';

export default function AppRoutes() {
  return (
    <Routes>

      {/* ── RUTAS PÚBLICAS (accesibles sin sesión) ── */}
      <Route element={<PublicLayout />}>
        <Route path="/"                          element={<Home />} />
        <Route path="/propiedades"               element={<PropiedadesLista />} />
        <Route path="/propiedades/:id"           element={<PropiedadesDetalle />} />
        <Route path="/nosotros"                  element={<About />} />
        <Route path="/contacto"                  element={<Contact />} />
        <Route path="/unauthorized"              element={<Unauthorized />} />
      </Route>

      {/* ── LOGIN Y REGISTRO (sin layout de navbar) ── */}
      <Route path="/login"               element={<Login />} />
      <Route path="/registro"            element={<Registro />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />

      {/* ── RUTAS ADMINISTRADOR (requiere sesión + rol 'admin') ── */}
      <Route element={<RoleRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard"    element={<DashboardAdmin />} />
          <Route path="/admin/usuarios"     element={<AdministrarUsers />} />
          <Route path="/admin/propiedades"  element={<AdministrarpPropiedades />} />
          <Route path="/admin/settings"     element={<Settings />} />
        </Route>
      </Route>

      {/* ── RUTAS PROPIETARIO (requiere sesión + rol 'propietario') ── */}
      <Route element={<RoleRoute allowedRoles={['propietario']} />}>
        <Route element={<OwnerLayout />}>
          <Route path="/propietario/dashboard"  element={<DashboardPropietario />} />
          <Route path="/propietario/mis-propiedades"    element={<MisPropiedades />} />
          <Route path="/propietario/publicar"           element={<PublicarPropiedad />} />
          <Route path="/propietario/editar/:id"         element={<EditarPropiedades />} />
        </Route>
      </Route>

    </Routes>
  );
}
