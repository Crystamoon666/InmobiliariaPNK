/**
 * Login.jsx — Página de inicio de sesión PNK Inmobiliaria
 * Patrón Guía 3: Form, Alert, Spinner de React-Bootstrap.
 * Roles: admin → /admin/dashboard | propietario → /propietario/dashboard
 *
 * MODO DEMO: mientras el backend no esté listo, usa los botones de acceso rápido
 * para simular sesiones de admin y propietario con datos mock en localStorage.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import logoSvg from '../../assets/logo.svg';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [correo,   setCorreo]   = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ correo, password });

      // Redirigir según rol
      if (user.rol === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/propietario/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight:       '100vh',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        background:      'linear-gradient(135deg, var(--color-gray-100) 0%, #fce4e0 100%)',
        padding:         '2rem 1rem',
      }}
    >
      <Container style={{ maxWidth: '420px' }}>
        <Card
          style={{
            border:       'none',
            borderRadius: 'var(--radius-xl)',
            boxShadow:    'var(--shadow-lg)',
            overflow:     'hidden',
          }}
        >
          {/* Cabecera con logo */}
          <div
            style={{
              background:  'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              padding:     '2rem',
              textAlign:   'center',
            }}
          >
            <div style={{ filter: 'brightness(0) invert(1)', display: 'inline-block' }}>
              <img src={logoSvg} alt="PNK Inmobiliaria" style={{ height: '48px' }} />
            </div>
          </div>

          <Card.Body style={{ padding: '2rem' }}>
            <h2
              style={{
                fontFamily:  'var(--font-heading)',
                fontWeight:  700,
                fontSize:    'var(--text-2xl)',
                color:       'var(--color-dark)',
                marginBottom: '0.25rem',
              }}
            >
              Bienvenido de vuelta
            </h2>
            <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
              Inicia sesión para acceder a tu panel
            </p>

            {error && <Alert variant="danger" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="loginCorreo">
                <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="tu@correo.com"
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                  required
                  style={{ borderRadius: 'var(--radius-md)', padding: '0.65rem 0.9rem' }}
                />
              </Form.Group>

              <Form.Group className="mb-2" controlId="loginPassword">
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: 0 }}>Contraseña</Form.Label>
                  <Link
                    to="/recuperar-password"
                    style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 600 }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Form.Control
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ borderRadius: 'var(--radius-md)', padding: '0.65rem 0.9rem', marginTop: '0.4rem' }}
                />
              </Form.Group>
              <div style={{ marginBottom: '1.25rem' }} />

              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
                style={{
                  borderRadius: 'var(--radius-md)',
                  fontWeight:   700,
                  padding:      '0.75rem',
                  fontSize:     'var(--text-base)',
                  boxShadow:    loading ? 'none' : 'var(--shadow-primary)',
                }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Ingresando...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </Form>
          </Card.Body>

          {/* Footer del card */}
          <div
            style={{
              borderTop:   '1px solid var(--color-gray-300)',
              padding:     '1rem 2rem',
              textAlign:   'center',
              background:  'var(--color-gray-50)',
              fontSize:    'var(--text-sm)',
              color:       'var(--color-gray-600)',
              display:     'flex',
              flexDirection: 'column',
              gap:         '0.5rem',
            }}
          >
            <span>
              ¿No tienes cuenta?{' '}
              <Link to="/registro" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                Regístrate como propietario
              </Link>
            </span>
            <Link to="/" style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)' }}>
              ← Volver al inicio
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}
