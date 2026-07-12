/**
 * RecuperarPassword.jsx — Página de recuperación de contraseña
 * El usuario ingresa su correo y recibe un enlace de recuperación.
 * TODO Fase 5: conectar con authService.forgotPassword(correo)
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { alertSuccess } from '../../components/ui/Alerts';
import logoSvg from '../../assets/logo.svg';

export default function RecuperarPassword() {
  const navigate   = useNavigate();
  const [correo,   setCorreo]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [enviado,  setEnviado]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO Fase 5: await authService.forgotPassword(correo)
      await new Promise(r => setTimeout(r, 800));
      setEnviado(true);
      await alertSuccess(
        '¡Correo enviado!',
        `Revisa tu bandeja de entrada en ${correo}. El enlace vence en 30 minutos.`
      );
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'linear-gradient(135deg, var(--color-gray-100) 0%, #fce4e0 100%)',
        padding:        '2rem 1rem',
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
          {/* Cabecera */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              padding:    '1.75rem 2rem',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Link to="/">
              <div style={{ filter: 'brightness(0) invert(1)' }}>
                <img src={logoSvg} alt="PNK Inmobiliaria" style={{ height: '38px' }} />
              </div>
            </Link>
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none' }}>
              ← Volver
            </Link>
          </div>

          <Card.Body style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔑</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-dark)', marginBottom: '0.5rem' }}>
                Recuperar contraseña
              </h2>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)' }}>
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="recCorreo">
                <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Correo electrónico
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="tu@correo.cl"
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                  required
                  style={{ borderRadius: 'var(--radius-md)', padding: '0.65rem 0.9rem' }}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
                style={{
                  borderRadius: 'var(--radius-md)',
                  fontWeight:   700,
                  padding:      '0.75rem',
                  boxShadow:    loading ? 'none' : 'var(--shadow-primary)',
                }}
              >
                {loading ? (
                  <><Spinner size="sm" animation="border" className="me-2" />Enviando...</>
                ) : (
                  'Enviar enlace de recuperación'
                )}
              </Button>
            </Form>
          </Card.Body>

          <div style={{ borderTop: '1px solid var(--color-gray-300)', padding: '1rem 2rem', textAlign: 'center', background: 'var(--color-gray-50)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
            ¿Recordaste tu contraseña?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Iniciar sesión
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}
