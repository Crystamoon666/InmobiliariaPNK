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
  const [error,   setError]   = useState([]); // Ahora es un array de errores
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleChange = (field, value) => {
    if (field === 'rut') value = formatRut(value);
    if (field === 'nombre_completo') value = value.replace(/[0-9]/g, ''); // Evitar números
    if (field === 'telefono') {
       let digits = value.replace(/\D/g, '');
       if (digits.startsWith('56')) digits = digits.substring(2);
       if (digits.length > 9) digits = digits.substring(0, 9);
       
       if (digits.length === 0) value = '';
       else if (digits.length <= 1) value = `+56 ${digits}`;
       else if (digits.length <= 5) value = `+56 ${digits.substring(0,1)} ${digits.substring(1)}`;
       else value = `+56 ${digits.substring(0,1)} ${digits.substring(1,5)} ${digits.substring(5)}`;
    }
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    if (formEl.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      setError(['Por favor, completa todos los campos obligatorios y revisa los campos marcados en rojo.']);
      return;
    }
    
    setError([]);
    setValidated(true);

    // Acumular validaciones personalizadas
    const erroresValidacion = [];

    if (!validarRut(form.rut)) {
      erroresValidacion.push('El RUT ingresado no es válido.');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.correo)) {
      erroresValidacion.push('Debes ingresar un correo electrónico válido (ej: nombre@dominio.com).');
    }

    const phoneClean = form.telefono.replace(/\D/g, '');
    if (phoneClean.length !== 11 || !phoneClean.startsWith('569')) {
      erroresValidacion.push('El teléfono debe tener un formato válido de Chile (ej: +56 9 1234 5678).');
    }

    const errorFecha = validarFecha(form.fecha_nacimiento);
    if (errorFecha) {
      erroresValidacion.push(errorFecha);
    }
    
    if (form.password !== form.confirm) {
      erroresValidacion.push('Las contraseñas no coinciden.');
    } else {
      if (form.password.length < 8) {
        erroresValidacion.push('La contraseña debe tener al menos 8 caracteres.');
      }
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      if (!passwordRegex.test(form.password)) {
        erroresValidacion.push('La contraseña debe incluir al menos una mayúscula, un número y un carácter especial (!@#$%^&*).');
      }
    }

    if (erroresValidacion.length > 0) {
      setError(erroresValidacion);
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
      setError([err.response?.data?.mensaje || err.response?.data?.message || 'No se pudo completar el registro.']);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { fontWeight: 600, fontSize: 'var(--text-sm)' };
  const inputStyle = { borderRadius: 'var(--radius-md)', padding: '0.6rem 0.9rem' };

  // Computed validations for visual feedback
  const isRutValid = form.rut.length > 0 && validarRut(form.rut);
  const isRutInvalid = form.rut.length > 0 && !isRutValid;

  const isNombreValid = form.nombre_completo.length >= 3;
  const isNombreInvalid = form.nombre_completo.length > 0 && !isNombreValid;

  const errorFechaComputed = validarFecha(form.fecha_nacimiento);
  const isFechaValid = form.fecha_nacimiento.length > 0 && !errorFechaComputed;
  const isFechaInvalid = form.fecha_nacimiento.length > 0 && !!errorFechaComputed;

  const isSexoValid = form.sexo !== '';
  const isSexoInvalid = validated && !isSexoValid;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo);
  const isEmailInvalid = form.correo.length > 0 && !isEmailValid;

  const phoneCleanC = form.telefono.replace(/\D/g, '');
  const isPhoneValid = phoneCleanC.length === 11 && phoneCleanC.startsWith('569');
  const isPhoneInvalid = form.telefono.length > 0 && !isPhoneValid;

  const isPasswordValid = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(form.password);
  const isPasswordInvalid = form.password.length > 0 && !isPasswordValid;

  const isConfirmValid = form.confirm.length > 0 && form.confirm === form.password;
  const isConfirmInvalid = form.confirm.length > 0 && !isConfirmValid;

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

            {error.length > 0 && (
              <Alert variant="danger" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                {error.length === 1 ? (
                  <span>{error[0]}</span>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {error.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                )}
              </Alert>
            )}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                  isValid={isRutValid}
                  isInvalid={isRutInvalid || (validated && !form.rut)}
                />
                <Form.Control.Feedback type="invalid">Este campo es obligatorio.</Form.Control.Feedback>
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
                  maxLength={100}
                  style={inputStyle}
                  isValid={isNombreValid}
                  isInvalid={isNombreInvalid || (validated && !form.nombre_completo)}
                />
                <Form.Control.Feedback type="invalid">Debes ingresar tu nombre completo.</Form.Control.Feedback>
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
                      isValid={isFechaValid}
                      isInvalid={isFechaInvalid || (validated && !form.fecha_nacimiento)}
                    />
                    <Form.Control.Feedback type="invalid">Fecha inválida.</Form.Control.Feedback>
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
                      isValid={isSexoValid}
                      isInvalid={isSexoInvalid}
                    >
                      <option value="">Seleccionar</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Prefiero no decir</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Selecciona una opción.</Form.Control.Feedback>
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
                      maxLength={100}
                      style={inputStyle}
                      isValid={isEmailValid}
                      isInvalid={isEmailInvalid || (validated && !form.correo)}
                    />
                    <Form.Control.Feedback type="invalid">Correo inválido.</Form.Control.Feedback>
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
                      maxLength={15}
                      style={inputStyle}
                      isValid={isPhoneValid}
                      isInvalid={isPhoneInvalid || (validated && !form.telefono)}
                    />
                    <Form.Control.Feedback type="invalid">Teléfono requerido.</Form.Control.Feedback>
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
                      maxLength={128}
                      style={inputStyle}
                      isValid={isPasswordValid}
                      isInvalid={isPasswordInvalid || (validated && !form.password)}
                    />
                    <Form.Control.Feedback type="invalid">Contraseña requerida.</Form.Control.Feedback>
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
                      maxLength={128}
                      style={inputStyle}
                      isValid={isConfirmValid}
                      isInvalid={isConfirmInvalid || (validated && !form.confirm)}
                    />
                    <Form.Control.Feedback type="invalid">Confirma la contraseña.</Form.Control.Feedback>
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
