/**
 * Navbar.jsx — Barra de navegación pública PNK Inmobiliaria
 * Diseño inspirado en UX de referencia: limpio, logo izquierda, links centro, CTA derecha.
 * Usa React-Bootstrap Navbar con paleta del theme.css.
 */

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';
import logoSvg from '../assets/logo.svg';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Efecto sombra al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Redirigir al dashboard según el rol
  const dashboardPath = user?.rol === 'admin'
    ? '/admin/dashboard'
    : '/propietario/dashboard';

  return (
    <BSNavbar
      expand="lg"
      sticky="top"
      style={{
        backgroundColor: 'var(--color-white)',
        borderBottom: scrolled ? '1px solid var(--color-gray-300)' : '1px solid transparent',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        transition: 'all var(--transition-normal)',
        padding: '0.75rem 0',
      }}
    >
      <Container style={{ maxWidth: 'var(--container-max)' }}>
        {/* Logo */}
        <BSNavbar.Brand as={Link} to="/">
          <img
            src={logoSvg}
            alt="PNK Inmobiliaria"
            style={{ height: '42px', width: 'auto' }}
          />
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-nav" />

        <BSNavbar.Collapse id="main-nav">
          {/* Links de navegación */}
          <Nav className="mx-auto gap-1">
            {[
              { to: '/',            label: 'Inicio' },
              { to: '/propiedades', label: 'Propiedades' },
              { to: '/nosotros',    label: 'Nosotros' },
              { to: '/contacto',    label: 'Contacto' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  fontFamily:  'var(--font-body)',
                  fontSize:    'var(--text-sm)',
                  fontWeight:  isActive ? 600 : 500,
                  color:       isActive ? 'var(--color-primary)' : 'var(--color-dark)',
                  textDecoration: 'none',
                  padding:     '0.4rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--color-primary-alpha)' : 'transparent',
                  transition:  'all var(--transition-fast)',
                })}
              >
                {label}
              </NavLink>
            ))}
          </Nav>

          {/* Botones de sesión */}
          <Nav className="align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <span
                  style={{
                    fontSize:   'var(--text-sm)',
                    color:      'var(--color-gray-600)',
                    fontWeight: 500,
                  }}
                >
                  Hola, {user?.nombre_completo?.split(' ')[0]}
                </span>
                <Button
                  as={Link}
                  to={dashboardPath}
                  variant="outline-primary"
                  size="sm"
                  style={{ borderRadius: 'var(--radius-md)', fontWeight: 600 }}
                >
                  Mi panel
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="primary"
                  size="sm"
                  style={{ borderRadius: 'var(--radius-md)', fontWeight: 600 }}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  size="sm"
                  style={{ borderRadius: 'var(--radius-md)', fontWeight: 600 }}
                >
                  Iniciar sesión
                </Button>
                <Button
                  as={Link}
                  to="/registro"
                  variant="primary"
                  size="sm"
                  style={{ borderRadius: 'var(--radius-md)', fontWeight: 600 }}
                >
                  Registrarme
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
