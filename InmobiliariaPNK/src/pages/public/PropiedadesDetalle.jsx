/**
 * PropiedadesDetalle.jsx — Vista detalle de una propiedad
 * Muestra galería de fotos, características, mapa y botón de visita.
 * TODO Fase 5: reemplazar mockProperties con propiedadService.getById(id)
 */

import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { mockProperties } from '../../data/mockData';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { alertSuccess } from '../../components/ui/Alerts';

const TIPO_LABEL = { casa: 'Casa', departamento: 'Departamento', terreno: 'Terreno' };

const Caracteristica = ({ icon, label, value }) =>
  value ? (
    <div
      style={{
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        padding:         '0.75rem 0.5rem',
        background:      'var(--color-gray-50)',
        borderRadius:    'var(--radius-md)',
        border:          '1px solid var(--color-gray-300)',
        textAlign:       'center',
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-dark)' }}>{value}</span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>{label}</span>
    </div>
  ) : null;

export default function PropiedadesDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO Fase 5: reemplazar con llamada al servicio
  const property = mockProperties.find(p => p.id === Number(id));

  if (!property) {
    return (
      <Container className="py-5 text-center">
        <div style={{ fontSize: '4rem' }}>🏚</div>
        <h2>Propiedad no encontrada</h2>
        <Button variant="primary" onClick={() => navigate('/propiedades')} className="mt-3">
          Ver todas las propiedades
        </Button>
      </Container>
    );
  }

  const formatCLP = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  const handleSolicitarVisita = async () => {
    await alertSuccess(
      '¡Solicitud enviada!',
      'El propietario recibirá tu solicitud y te contactará a la brevedad.'
    );
  };

  const amenidades = [
    { key: 'bodega',           icon: '🏪', label: 'Bodega' },
    { key: 'estacionamiento',  icon: '🚗', label: 'Estacionamiento' },
    { key: 'logia',            icon: '🧺', label: 'Logia' },
    { key: 'cocina_amoblada',  icon: '🍳', label: 'Cocina amoblada' },
    { key: 'antejardin',       icon: '🌿', label: 'Antejardín' },
    { key: 'patio_trasero',    icon: '🌳', label: 'Patio trasero' },
    { key: 'piscina',          icon: '🏊', label: 'Piscina' },
  ].filter(a => property[a.key]);

  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Imagen principal */}
      <div
        style={{
          height:          '480px',
          backgroundImage: `url(${property.foto_url})`,
          backgroundSize:  'cover',
          backgroundPosition: 'center',
          position:        'relative',
        }}
      >
        <div
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6))',
          }}
        />
        <Container
          style={{
            position:  'absolute',
            bottom:    '2rem',
            left:      '50%',
            transform: 'translateX(-50%)',
            maxWidth:  'var(--container-max)',
            width:     '100%',
          }}
        >
          <Badge
            style={{
              background:    'var(--color-primary)',
              padding:       '0.4rem 1rem',
              borderRadius:  'var(--radius-full)',
              fontSize:      'var(--text-sm)',
              marginBottom:  '0.5rem',
            }}
          >
            {TIPO_LABEL[property.tipo] || property.tipo}
          </Badge>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize:   'clamp(1.5rem, 4vw, 2.25rem)',
              color:      'white',
              margin:     '0 0 0.25rem',
            }}
          >
            {property.descripcion}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0 }}>
            📍 {property.sector ? `${property.sector} · ` : ''}{property.comuna}, {property.provincia}
          </p>
        </Container>
      </div>

      {/* Contenido principal */}
      <Container style={{ maxWidth: 'var(--container-max)', padding: '2rem 1rem' }}>
        <Row className="g-4">
          {/* Columna izquierda */}
          <Col lg={8}>
            {/* Precio */}
            <div
              style={{
                background:   'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                padding:      '1.5rem',
                boxShadow:    'var(--shadow-sm)',
                marginBottom: '1.5rem',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'space-between',
                flexWrap:     'wrap',
                gap:          '1rem',
              }}
            >
              <div>
                <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-xs)', margin: '0 0 0.25rem' }}>Precio</p>
                <p className="price" style={{ fontSize: 'var(--text-3xl)', margin: 0 }}>{formatCLP(property.precio_clp)}</p>
                {property.precio_uf > 0 && (
                  <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', margin: 0 }}>
                    UF {Number(property.precio_uf).toLocaleString('es-CL')}
                  </p>
                )}
              </div>
              <Button
                variant="primary"
                onClick={() => navigate('/propiedades')}
                style={{ borderRadius: 'var(--radius-md)', fontWeight: 600 }}
              >
                ← Volver al listado
              </Button>
            </div>

            {/* Características numéricas */}
            <div
              style={{
                background:   'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                padding:      '1.5rem',
                boxShadow:    'var(--shadow-sm)',
                marginBottom: '1.5rem',
              }}
            >
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1rem' }}>Características</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem' }}>
                <Caracteristica icon="🛏" label="Dormitorios"   value={property.dormitorios || null} />
                <Caracteristica icon="🚿" label="Baños"         value={property.banos       || null} />
                <Caracteristica icon="📐" label="Construido"    value={property.area_construida > 0 ? `${property.area_construida} m²` : null} />
                <Caracteristica icon="🌍" label="Terreno"       value={property.area_terreno > 0    ? `${property.area_terreno} m²`    : null} />
              </div>
            </div>

            {/* Amenidades */}
            {amenidades.length > 0 && (
              <div
                style={{
                  background:   'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding:      '1.5rem',
                  boxShadow:    'var(--shadow-sm)',
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1rem' }}>Amenidades</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {amenidades.map(({ icon, label }) => (
                    <span
                      key={label}
                      style={{
                        display:       'flex',
                        alignItems:    'center',
                        gap:           '0.35rem',
                        padding:       '0.4rem 0.9rem',
                        background:    'var(--color-primary-alpha)',
                        color:         'var(--color-primary)',
                        borderRadius:  'var(--radius-full)',
                        fontSize:      'var(--text-sm)',
                        fontWeight:    600,
                        border:        '1px solid rgba(232,54,26,0.2)',
                      }}
                    >
                      {icon} {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Col>

          {/* Columna derecha: acciones */}
          <Col lg={4}>
            <div
              style={{
                background:   'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                padding:      '1.5rem',
                boxShadow:    'var(--shadow-sm)',
                position:     'sticky',
                top:          '80px',
              }}
            >
              <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1.25rem' }}>
                ¿Te interesa esta propiedad?
              </h5>
              {property.solicitar_visita ? (
                <>
                  <Button
                    variant="primary"
                    className="w-100 mb-3"
                    onClick={handleSolicitarVisita}
                    style={{ borderRadius: 'var(--radius-md)', fontWeight: 700, padding: '0.75rem', boxShadow: 'var(--shadow-primary)' }}
                  >
                    📅 Solicitar visita
                  </Button>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)', textAlign: 'center' }}>
                    El propietario te contactará para coordinar
                  </p>
                </>
              ) : (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                  Esta propiedad no acepta solicitudes de visita actualmente.
                </p>
              )}

              <hr style={{ borderColor: 'var(--color-gray-300)' }} />

              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: 'var(--color-dark)' }}>📋 Detalles</p>
                <p style={{ margin: '0 0 0.25rem' }}>
                  📅 Publicada: {new Date(property.fecha_publicacion).toLocaleDateString('es-CL')}
                </p>
                <p style={{ margin: 0 }}>
                  🏷 ID: #{property.id}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
