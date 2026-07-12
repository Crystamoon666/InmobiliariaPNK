/**
 * Registro.jsx — Registro de propietario PNK Inmobiliaria
 * Campos: RUT, Nombre Completo, Fecha Nacimiento, Correo, Contraseña, Sexo, Teléfono.
 * El logo y el botón "← Inicio" redirigen a la página principal.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { alertSuccess, alertError } from '../../components/ui/Alerts';
import { registerOwner } from '../../services/authService';
import logoSvg from '../../assets/logo.svg';

// Validación básica de RUT chileno
const validarRut = (rut) => {
  const cleaned = rut.replace(/[^0-9kK]/g, '');
  if (cleaned.length < 2) return false;
  const cuerpo = cleaned.slice(0, -1);
  const dv     = cleaned.slice(-1).toUpperCase();
  let suma = 0, mul = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const dvEsperado = 11 - (suma % 11);
  const dvCalc = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : String(dvEsperado);
  return dv === dvCalc;
};

const formatRut = (rut) => {
  const cleaned = rut.replace(/[^0-9kK]/g, '');
  if (cleaned.length <= 1) return cleaned;
  const cuerpo = cleaned.slice(0, -1);
  const dv     = cleaned.slice(-1);
  const formatted = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
};

// Retorna la fecha máxima permitida (hoy - 18 años) en formato yyyy-mm-dd
export const maxFechaNacimiento = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split('T')[0];
};

// Valida que la fecha no sea futura y que la persona tenga >= 18 años
const validarFecha = (fecha) => {
  if (!fecha) return 'Debes ingresar tu fecha de nacimiento.';
  const hoy    = new Date();
  const nacido = new Date(fecha);
  if (nacido > hoy) return 'La fecha de nacimiento no puede ser en el futuro.';
  const edad = hoy.getFullYear() - nacido.getFullYear()
    - (hoy < new Date(hoy.getFullYear(), nacido.getMonth(), nacido.getDate()) ? 1 : 0);
  if (edad < 18) return 'Debes ser mayor de 18 años para registrarte.';
  return null;
};

const EMPTY = {
  rut:             '',
  nombre_completo: '',
  fecha_nacimiento:'',
  correo:          '',
  password:        '',
  confirm:         '',
  sexo:            '',
  telefono:        '',
};

export default function Registro() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState(EMPTY);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    if (field === 'rut') value = formatRut(value);
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!validarRut(form.rut)) {
      setError('El RUT ingresado no es válido.');
      return;
    }
    const errorFecha = validarFecha(form.fecha_nacimiento);
    if (errorFecha) {
      setError(errorFecha);
      return;
    }
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
        rut:             form.rut,
        nombre_completo: form.nombre_completo,
        fecha_nacimiento:form.fecha_nacimiento,
        correo:          form.correo,
        password:        form.password,
        sexo:            form.sexo,
        telefono:        form.telefono,
      });
      await alertSuccess(
        '¡Solicitud enviada!',
        'Tu cuenta será activada por el administrador. Te notificaremos por correo.'
      );
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { fontWeight: 600, fontSize: 'var(--text-sm)' };
  const inputStyle = { borderRadius: 'var(--radius-md)', padding: '0.6rem 0.9rem' };

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
      <Container style={{ maxWidth: '560px' }}>
        <Card
          style={{
            border:       'none',
            borderRadius: 'var(--radius-xl)',
            boxShadow:    'var(--shadow-lg)',
            overflow:     'hidden',
          }}
        >
          {/* Cabecera — logo como botón hacia el inicio */}
          <div
            style={{
              background:  'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              padding:     '1.5rem 2rem',
              display:     'flex',
              alignItems:  'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo clickeable → inicio */}
            <Link to="/" title="Ir al inicio">
              <div style={{ filter: 'brightness(0) invert(1)' }}>
                <img src={logoSvg} alt="PNK Inmobiliaria" style={{ height: '40px' }} />
              </div>
            </Link>

            {/* Botón de regreso */}
            <Link
              to="/"
              style={{
                color:          'rgba(255,255,255,0.85)',
                fontSize:       'var(--text-sm)',
                fontWeight:     600,
                textDecoration: 'none',
                display:        'flex',
                alignItems:     'center',
                gap:            '0.3rem',
              }}
            >
              ← Volver al inicio
            </Link>
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
              Tu cuenta será activada por el administrador
            </p>

            {error && (
              <Alert variant="danger" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {/* RUT */}
              <Form.Group className="mb-3" controlId="regRut">
                <Form.Label style={labelStyle}>RUT *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="12.345.678-9"
                  value={form.rut}
                  onChange={e => handleChange('rut', e.target.value)}
                  required
                  maxLength={12}
                  style={inputStyle}
                />
                <Form.Text className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                  Ingresa tu RUT chileno con puntos y guión
                </Form.Text>
              </Form.Group>

              {/* Nombre completo */}
              <Form.Group className="mb-3" controlId="regNombre">
                <Form.Label style={labelStyle}>Nombre completo *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Juan Pérez González"
                  value={form.nombre_completo}
                  onChange={e => handleChange('nombre_completo', e.target.value)}
                  required
                  style={inputStyle}
                />
              </Form.Group>

              {/* Fecha de nacimiento + Sexo */}
              <Row className="g-3 mb-3">
                <Col xs={12} sm={7}>
                  <Form.Group controlId="regFechaNac">
                    <Form.Label style={labelStyle}>Fecha de nacimiento *</Form.Label>
                    <Form.Control
                      type="date"
                      value={form.fecha_nacimiento}
                      onChange={e => handleChange('fecha_nacimiento', e.target.value)}
                      required
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                      style={inputStyle}
                    />
                    <Form.Text className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                      Debes ser mayor de 18 años
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={5}>
                  <Form.Group controlId="regSexo">
                    <Form.Label style={labelStyle}>Sexo *</Form.Label>
                    <Form.Select
                      value={form.sexo}
                      onChange={e => handleChange('sexo', e.target.value)}
                      required
                      style={inputStyle}
                    >
                      <option value="">Seleccionar</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Prefiero no decir</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Correo + Teléfono */}
              <Row className="g-3 mb-3">
                <Col xs={12} sm={7}>
                  <Form.Group controlId="regCorreo">
                    <Form.Label style={labelStyle}>Correo electrónico *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="tu@correo.cl"
                      value={form.correo}
                      onChange={e => handleChange('correo', e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={5}>
                  <Form.Group controlId="regTelefono">
                    <Form.Label style={labelStyle}>Teléfono móvil *</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="+56 9 0000 0000"
                      value={form.telefono}
                      onChange={e => handleChange('telefono', e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Contraseña + Confirmación */}
              <Row className="g-3 mb-4">
                <Col xs={12} sm={6}>
                  <Form.Group controlId="regPassword">
                    <Form.Label style={labelStyle}>Contraseña *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={form.password}
                      onChange={e => handleChange('password', e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group controlId="regConfirm">
                    <Form.Label style={labelStyle}>Confirmar contraseña *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={form.confirm}
                      onChange={e => handleChange('confirm', e.target.value)}
                      required
                      style={inputStyle}
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
                  <><Spinner size="sm" animation="border" className="me-2" />Enviando solicitud...</>
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
