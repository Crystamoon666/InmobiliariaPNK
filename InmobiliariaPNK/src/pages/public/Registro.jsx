/**
 * Registro.jsx — Página de registro de propietario PNK Inmobiliaria
 * Crea cuenta con rol 'propietario'. Usa React-Bootstrap + SweetAlert2.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { alertSuccess, alertError } from '../../components/ui/Alerts';
import { registerOwner } from '../../services/authService';
import logoSvg from '../../assets/logo.svg';

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre_completo: '',
    correo:          '',
    telefono:        '',
    password:        '',
    confirm:         '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación de contraseñas
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await registerOwner({
        nombre_completo: form.nombre_completo,
        correo:          form.correo,
        telefono:        form.telefono,
        password:        form.password,
      });
      await alertSuccess('¡Cuenta creada!', 'Tu solicitud fue enviada. El administrador activará tu cuenta pronto.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo completar el registro.';
      setError(msg);
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
      <Container style={{ maxWidth: '520px' }}>
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
              padding:    '2rem',
              textAlign:  'center',
            }}
          >
            <div style={{ filter: 'brightness(0) invert(1)', display: 'inline-block' }}>
              <img src={logoSvg} alt="PNK Inmobiliaria" style={{ height: '48px' }} />
            </div>
          </div>

          <Card.Body style={{ padding: '2rem' }}>
            <h2
              style={{
                fontFamily:   'var(--font-heading)',
                fontWeight:   700,
                fontSize:     'var(--text-2xl)',
                color:        'var(--color-dark)',
                marginBottom: '0.25rem',
              }}
            >
              Crear cuenta de propietario
            </h2>
            <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
              Tu cuenta será activada por un administrador
            </p>

            {error && (
              <Alert variant="danger" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="regNombre">
                <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Nombre completo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Juan Pérez González"
                  value={form.nombre_completo}
                  onChange={e => handleChange('nombre_completo', e.target.value)}
                  required
                  style={{ borderRadius: 'var(--radius-md)', padding: '0.65rem 0.9rem' }}
                />
              </Form.Group>

              <Row className="g-3 mb-3">
                <Col xs={12} sm={6}>
                  <Form.Group controlId="regCorreo">
                    <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="tu@correo.com"
                      value={form.correo}
                      onChange={e => handleChange('correo', e.target.value)}
                      required
                      style={{ borderRadius: 'var(--radius-md)', padding: '0.65rem 0.9rem' }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group controlId="regTelefono">
                    <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="+56 9 0000 0000"
                      value={form.telefono}
                      onChange={e => handleChange('telefono', e.target.value)}
                      style={{ borderRadius: 'var(--radius-md)', padding: '0.65rem 0.9rem' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-4">
                <Col xs={12} sm={6}>
                  <Form.Group controlId="regPassword">
                    <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={form.password}
                      onChange={e => handleChange('password', e.target.value)}
                      required
                      style={{ borderRadius: 'var(--radius-md)', padding: '0.65rem 0.9rem' }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group controlId="regConfirm">
                    <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Confirmar contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={form.confirm}
                      onChange={e => handleChange('confirm', e.target.value)}
                      required
                      style={{ borderRadius: 'var(--radius-md)', padding: '0.65rem 0.9rem' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

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
                  <><Spinner size="sm" animation="border" className="me-2" />Registrando...</>
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </Form>
          </Card.Body>

          <div
            style={{
              borderTop:  '1px solid var(--color-gray-300)',
              padding:    '1rem 2rem',
              textAlign:  'center',
              background: 'var(--color-gray-50)',
              fontSize:   'var(--text-sm)',
              color:      'var(--color-gray-600)',
            }}
          >
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Iniciar sesión
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}
