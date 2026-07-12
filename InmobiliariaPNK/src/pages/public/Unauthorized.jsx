/**
 * Unauthorized.jsx — PNK Inmobiliaria
 * Se muestra cuando un usuario intenta acceder a una ruta
 * para la cual no tiene el rol requerido.
 */

import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';

export default function Unauthorized() {
  const { user } = useAuth();

  // Determinar a dónde redirigir según el rol del usuario actual
  const dashboardPath = user?.rol === 'admin'
    ? '/admin/dashboard'
    : '/propietario/dashboard';

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '100vh', textAlign: 'center' }}
    >
      {/* Ícono de candado */}
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔒</div>

      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-4xl)',
          color: 'var(--color-dark)',
          marginBottom: '0.5rem',
        }}
      >
        Acceso denegado
      </h1>

      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem', maxWidth: '400px' }}>
        No tienes permiso para ver esta página. Si crees que es un error,
        contacta al administrador.
      </p>

      <div className="d-flex gap-3">
        <Button as={Link} to={dashboardPath} variant="primary">
          Ir a mi panel
        </Button>
        <Button as={Link} to="/" variant="outline-secondary">
          Volver al inicio
        </Button>
      </div>
    </Container>
  );
}
