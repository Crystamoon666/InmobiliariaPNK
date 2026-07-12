/**
 * AdminLayout.jsx — Layout para el panel del administrador
 * Estructura: Sidebar izquierdo + Topbar + Contenido (Outlet)
 */

import { Outlet, useNavigate } from 'react-router-dom';
import { Container, Button, Dropdown } from 'react-bootstrap';
import Sidebar from './Sidebar';
import useAuth from '../hooks/useAuth';

const ADMIN_LINKS = [
  { to: '/admin/dashboard',   label: 'Dashboard',      icon: '📊' },
  { to: '/admin/usuarios',    label: 'Usuarios',        icon: '👥' },
  { to: '/admin/propiedades', label: 'Propiedades',     icon: '🏠' },
  { to: '/admin/settings',    label: 'Configuración',   icon: '⚙️' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-gray-100)' }}>
      {/* Sidebar */}
      <Sidebar links={ADMIN_LINKS} />

      {/* Contenido principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header
          style={{
            backgroundColor:  'var(--color-white)',
            borderBottom:     '1px solid var(--color-gray-300)',
            padding:          '0.75rem 1.5rem',
            display:          'flex',
            justifyContent:   'space-between',
            alignItems:       'center',
            position:         'sticky',
            top:              0,
            zIndex:           100,
            boxShadow:        'var(--shadow-sm)',
          }}
        >
          <div>
            <span
              style={{
                fontSize:    'var(--text-xs)',
                color:       'var(--color-gray-600)',
                fontWeight:  500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Panel Administrador
            </span>
          </div>

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              size="sm"
              style={{
                borderRadius:    'var(--radius-full)',
                border:          '1px solid var(--color-gray-300)',
                fontWeight:      600,
                fontSize:        'var(--text-sm)',
                display:         'flex',
                alignItems:      'center',
                gap:             '0.5rem',
              }}
            >
              <span
                style={{
                  width:           '28px',
                  height:          '28px',
                  borderRadius:    '50%',
                  backgroundColor: 'var(--color-primary)',
                  color:           'white',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  fontSize:        'var(--text-xs)',
                  fontWeight:      700,
                }}
              >
                {user?.nombre_completo?.[0] || 'A'}
              </span>
              {user?.nombre_completo?.split(' ')[0] || 'Admin'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item disabled style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>
                {user?.correo}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as="a" href="/" style={{ fontWeight: 600 }}>
                🏠 Ir al sitio
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                🚪 Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </header>

        {/* Página actual */}
        <main style={{ flex: 1, padding: '2rem 1.5rem', overflowY: 'auto' }}>
          <Container fluid style={{ maxWidth: '1100px' }}>
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
}
