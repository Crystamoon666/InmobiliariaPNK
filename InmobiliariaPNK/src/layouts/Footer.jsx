/**
 * Footer.jsx — Pie de página PNK Inmobiliaria
 * Diseño: fondo oscuro, logo, links útiles, info de contacto y copyright.
 */

import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import logoSvg from '../assets/logo.svg';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-dark" style={{ paddingTop: '3rem', paddingBottom: '1.5rem' }}>
      <Container style={{ maxWidth: 'var(--container-max)' }}>
        <Row className="g-4 mb-4">
          {/* Columna 1: Logo y descripción */}
          <Col md={4}>
            {/* Logo en fondo oscuro con filtro para hacerlo blanco */}
            <div style={{ filter: 'brightness(0) invert(1)', display: 'inline-block', marginBottom: '1rem' }}>
              <img src={logoSvg} alt="PNK Inmobiliaria" style={{ height: '36px' }} />
            </div>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
              Tu plataforma inmobiliaria de confianza en la Región de Coquimbo.
              Conectamos propietarios con las mejores oportunidades.
            </p>
          </Col>

          {/* Columna 2: Navegación */}
          <Col md={2}>
            <h6 style={{ color: 'var(--color-white)', fontWeight: 700, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              Navegación
            </h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { to: '/',            label: 'Inicio' },
                { to: '/propiedades', label: 'Propiedades' },
                { to: '/nosotros',    label: 'Nosotros' },
                { to: '/contacto',   label: 'Contacto' },
              ].map(({ to, label }) => (
                <li key={to} style={{ marginBottom: '0.5rem' }}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Columna 3: Propietarios */}
          <Col md={3}>
            <h6 style={{ color: 'var(--color-white)', fontWeight: 700, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              Propietarios
            </h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { to: '/registro', label: 'Registrarme como propietario' },
                { to: '/login',    label: 'Iniciar sesión' },
              ].map(({ to, label }) => (
                <li key={to} style={{ marginBottom: '0.5rem' }}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Columna 4: Contacto */}
          <Col md={3}>
            <h6 style={{ color: 'var(--color-white)', fontWeight: 700, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              Contacto
            </h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--text-sm)' }}>
              <li style={{ marginBottom: '0.5rem' }}>📍 Región de Coquimbo, Chile</li>
              <li style={{ marginBottom: '0.5rem' }}>📧 contacto@pnkinmobiliaria.cl</li>
              <li>📞 +56 9 0000 0000</li>
            </ul>
          </Col>
        </Row>

        {/* Divisor y copyright */}
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1.5rem 0 1rem' }} />
        <div
          className="d-flex justify-content-between align-items-center flex-wrap gap-2"
          style={{ fontSize: 'var(--text-xs)' }}
        >
          <span>© {year} PNK Inmobiliaria. Todos los derechos reservados.</span>
          <span>Región de Coquimbo, Chile</span>
        </div>
      </Container>
    </footer>
  );
}
