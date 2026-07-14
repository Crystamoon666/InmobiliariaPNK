/**
 * DashboardPropietario.jsx — Panel principal del propietario
 * Muestra resumen de sus propiedades y accesos rápidos.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { PageHeader, StatusBadge } from '../../components/ui';
import useAuth from '../../hooks/useAuth';
import { getMias } from '../../services/propiedadService';
import { getImageUrl } from '../../utils/imageUtils';

export default function DashboardPropietario() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMias()
      .then(data => setPropiedades(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatCLP = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando tu panel...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Hola, ${user?.nombre_completo?.split(' ')[0] || 'Propietario'} 👋`}
        subtitle="Este es tu panel de propiedades"
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/propietario/publicar')}
            style={{ borderRadius: 'var(--radius-md)', fontWeight: 700, boxShadow: 'var(--shadow-primary)' }}
          >
            + Publicar propiedad
          </Button>
        }
      />

      {/* Stats */}
      <Row className="g-3 mb-4">
        {[
          { icon: '🏠', value: propiedades.length,                                     label: 'Mis propiedades',  color: 'var(--color-primary)' },
          { icon: '✅', value: propiedades.filter(p => p.estado === 'publicada').length, label: 'Publicadas',       color: '#10b981' },
          { icon: '⏸',  value: propiedades.filter(p => p.estado === 'pausada').length,  label: 'Pausadas',         color: '#f59e0b' },
        ].map(({ icon, value, label, color }) => (
          <Col xs={4} key={label}>
            <Card style={{ border: 'none', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ height: '3px', background: color }} />
              <Card.Body style={{ padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>{icon}</div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-dark)', margin: '0.25rem 0 0' }}>{value}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)', margin: 0 }}>{label}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mis propiedades recientes */}
      <Card style={{ border: 'none', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <Card.Body style={{ padding: '1.5rem' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, margin: 0 }}>Mis propiedades recientes</h5>
            <Button variant="outline-primary" size="sm" onClick={() => navigate('/propietario/mis-propiedades')} style={{ borderRadius: 'var(--radius-md)' }}>
              Ver todas →
            </Button>
          </div>

          {propiedades.slice(0, 3).map(p => {
            // Manejar foto
            const rawImg = (Array.isArray(p.fotos) && p.fotos.length > 0)
              ? (typeof p.fotos[0] === 'string' ? p.fotos[0] : p.fotos[0]?.url)
              : (p.foto_url || null);
            const urlImg = getImageUrl(rawImg) || '';
                
            return (
              <div
                key={p.id}
                className="d-flex justify-content-between align-items-center py-3"
                style={{ borderBottom: '1px solid var(--color-gray-300)' }}
              >
                <div className="d-flex gap-3 align-items-center">
                  <img
                    src={urlImg}
                    alt={p.tipo}
                    style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                    onError={e => e.currentTarget.style.display = 'none'}
                  />
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}>{p.tipo} en {p.comuna}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>{formatCLP(p.precio_clp)}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <StatusBadge status={p.estado} />
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => navigate(`/propietario/editar/${p.id}`)}
                    style={{ borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
                  >
                    ✏️
                  </Button>
                </div>
              </div>
            );
          })}
        </Card.Body>
      </Card>
    </div>
  );
}
