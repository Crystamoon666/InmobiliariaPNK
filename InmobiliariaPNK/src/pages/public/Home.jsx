/**
 * Home.jsx — Página principal pública
 * Diseño basado en UX de referencia: hero + stats + carrusel + CTA
 * TODO Fase 5: reemplazar mockProperties con llamada a propiedadService.getPublicas()
 */

import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import FeaturedCarousel from '../../components/properties/FeaturedCarousel';
import SearchFilters    from '../../components/search/SearchFilters';
import { mockProperties } from '../../data/mockData';

// Imagen de hero (Unsplash — propiedad libre de uso)
const HERO_IMG = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80';

const STATS = [
  { value: '500+', label: 'Propiedades publicadas' },
  { value: '3',    label: 'Provincias de Coquimbo' },
  { value: '100%', label: 'Verificadas por el equipo' },
  { value: '24h',  label: 'Tiempo de activación' },
];

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    if (filters.tipo)      params.set('tipo',      filters.tipo);
    if (filters.provincia) params.set('provincia', filters.provincia);
    if (filters.comuna)    params.set('comuna',    filters.comuna);
    if (filters.sector)    params.set('sector',    filters.sector);
    navigate(`/propiedades?${params.toString()}`);
  };

  return (
    <div>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${HERO_IMG})`, minHeight: '88vh' }}
      >
        <div className="hero-overlay" />
        <Container className="hero-content" style={{ maxWidth: 'var(--container-max)' }}>
          <Row className="align-items-center" style={{ minHeight: '70vh' }}>
            <Col lg={7}>
              <p
                className="fade-in-up"
                style={{
                  color:         'rgba(255,255,255,0.8)',
                  fontWeight:    600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontSize:      'var(--text-sm)',
                  marginBottom:  '1rem',
                }}
              >
                Región de Coquimbo · Inmobiliaria PNK
              </p>
              <h1
                className="fade-in-up"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize:   'clamp(2.2rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  color:      'white',
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                  animationDelay: '0.1s',
                }}
              >
                Encuentra tu hogar<br />
                <span style={{ color: 'var(--color-primary-light)' }}>ideal en Coquimbo</span>
              </h1>
              <p
                className="fade-in-up"
                style={{
                  color:          'rgba(255,255,255,0.85)',
                  fontSize:       'var(--text-lg)',
                  maxWidth:       '480px',
                  lineHeight:     1.7,
                  marginBottom:   '2rem',
                  animationDelay: '0.2s',
                }}
              >
                Casas, departamentos y terrenos en las provincias de Elqui, Limarí y Choapa.
                Propietarios verificados y propiedades de calidad.
              </p>

              {/* Tags de categorías */}
              <div className="fade-in-up d-flex gap-2 flex-wrap mb-4" style={{ animationDelay: '0.3s' }}>
                {['Casa', 'Departamento', 'Terreno'].map(t => (
                  <button
                    key={t}
                    onClick={() => navigate(`/propiedades?tipo=${t.toLowerCase()}`)}
                    style={{
                      background:   'rgba(255,255,255,0.15)',
                      color:        'white',
                      border:       '1px solid rgba(255,255,255,0.4)',
                      borderRadius: 'var(--radius-full)',
                      padding:      '0.35rem 1rem',
                      fontSize:     'var(--text-sm)',
                      fontWeight:   500,
                      cursor:       'pointer',
                      backdropFilter: 'blur(8px)',
                      transition:   'all var(--transition-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Col>
          </Row>

          {/* Caja de búsqueda flotante */}
          <Row>
            <Col lg={10}>
              <div className="search-box fade-in-up" style={{ animationDelay: '0.4s' }}>
                <p style={{
                  fontFamily:  'var(--font-heading)',
                  fontWeight:  700,
                  fontSize:    'var(--text-lg)',
                  color:       'var(--color-dark)',
                  marginBottom: '1rem',
                }}>
                  🔍 Encuentra el mejor lugar
                </p>
                <SearchFilters onSearch={handleSearch} compact />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── STATS ───────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--color-white)',
          borderBottom: '1px solid var(--color-gray-300)',
          padding: '2.5rem 0',
        }}
      >
        <Container style={{ maxWidth: 'var(--container-max)' }}>
          <Row className="g-3 text-center">
            {STATS.map(({ value, label }) => (
              <Col key={label} xs={6} md={3}>
                <p className="stat-number">{value}</p>
                <p className="stat-label">{label}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── CARRUSEL PROPIEDADES DESTACADAS ─────────────────── */}
      <section className="section-white">
        <Container style={{ maxWidth: 'var(--container-max)' }}>
          <FeaturedCarousel properties={mockProperties} />
          <div className="text-center mt-4">
            <Button
              variant="outline-primary"
              onClick={() => navigate('/propiedades')}
              style={{ borderRadius: 'var(--radius-md)', fontWeight: 600, padding: '0.65rem 2rem' }}
            >
              Ver todas las propiedades →
            </Button>
          </div>
        </Container>
      </section>

      {/* ── ¿POR QUÉ ELEGIRNOS? ─────────────────────────────── */}
      <section className="section-gray">
        <Container style={{ maxWidth: 'var(--container-max)' }}>
          <div className="text-center mb-5">
            <div className="divider-primary mx-auto" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginTop: '0.5rem' }}>
              ¿Por qué elegirnos?
            </h2>
          </div>
          <Row className="g-4">
            {[
              { icon: '🔍', title: 'Búsqueda fácil', desc: 'Filtra por provincia, comuna y sector para encontrar exactamente lo que buscas.' },
              { icon: '✅', title: 'Propietarios verificados', desc: 'Cada propietario pasa por un proceso de verificación antes de publicar.' },
              { icon: '📸', title: 'Galería de fotos', desc: 'Hasta 10 fotografías por propiedad para que conozcas cada detalle.' },
              { icon: '📍', title: 'Mapa interactivo', desc: 'Visualiza la ubicación exacta de cada propiedad en Google Maps.' },
            ].map(({ icon, title, desc }) => (
              <Col key={title} xs={12} sm={6} lg={3}>
                <div
                  style={{
                    background:   'var(--color-white)',
                    borderRadius: 'var(--radius-lg)',
                    padding:      '1.75rem',
                    textAlign:    'center',
                    boxShadow:    'var(--shadow-sm)',
                    height:       '100%',
                    transition:   'box-shadow var(--transition-normal), transform var(--transition-normal)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
                  <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-dark)' }}>{title}</h5>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', margin: 0 }}>{desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────── */}
      <section
        style={{
          background:    `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)`,
          padding:       '4rem 0',
          textAlign:     'center',
          color:         'white',
        }}
      >
        <Container>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-3xl)', marginBottom: '1rem' }}>
            ¿Tienes una propiedad para publicar?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: 'var(--text-lg)' }}>
            Regístrate como propietario y publica gratis tus inmuebles en la Región de Coquimbo.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button
              variant="light"
              onClick={() => navigate('/registro')}
              style={{ fontWeight: 700, borderRadius: 'var(--radius-md)', color: 'var(--color-primary)', padding: '0.75rem 2rem' }}
            >
              Registrarme como propietario
            </Button>
            <Button
              variant="outline-light"
              onClick={() => navigate('/propiedades')}
              style={{ fontWeight: 600, borderRadius: 'var(--radius-md)', padding: '0.75rem 2rem' }}
            >
              Ver propiedades
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
