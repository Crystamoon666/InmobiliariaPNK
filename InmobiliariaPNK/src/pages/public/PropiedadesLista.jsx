/**
 * PropiedadesLista.jsx — Listado público de propiedades con filtros
 * Layout: sidebar de filtros izquierdo + grid de tarjetas derecho.
 * TODO Fase 5: reemplazar mockProperties con propiedadService.getPublicas(filters)
 */

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import PropertyCard   from '../../components/properties/PropertyCard';
import SearchFilters  from '../../components/search/SearchFilters';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState     from '../../components/ui/EmptyState';
import { getPublicas } from '../../services/propiedadService';

export default function PropiedadesLista() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    tipo:      searchParams.get('tipo')      || '',
    provincia: searchParams.get('provincia') || '',
    comuna:    searchParams.get('comuna')    || '',
    sector:    searchParams.get('sector')    || '',
  });
  const [loading, setLoading] = useState(true);
  const [propiedades, setPropiedades] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Podemos enviar los filtros al backend o filtrar en frontend. 
    // Como el getPublicas acepta params, enviamos los filtros válidos.
    const params = {};
    if (filters.tipo) params.tipo = filters.tipo;
    if (filters.provincia) params.provincia = filters.provincia;
    if (filters.comuna) params.comuna = filters.comuna;
    // El sector podríamos filtrarlo localmente si la API no lo soporta de forma exacta, 
    // pero lo enviaremos por si acaso y hacemos doble chequeo local.
    
    getPublicas(params)
      .then(data => {
        // Filtrado local adicional para 'sector' u otros (opcional, pero asegura resultados)
        const localFiltered = data.filter(p => {
          if (filters.sector && !p.sector?.toLowerCase().includes(filters.sector.toLowerCase())) return false;
          return true;
        });
        setPropiedades(localFiltered);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Header de sección */}
      <div
        style={{
          background:   'linear-gradient(135deg, var(--color-dark) 0%, var(--color-accent) 100%)',
          padding:      '3rem 0 2rem',
          marginBottom: '0',
        }}
      >
        <Container style={{ maxWidth: 'var(--container-max)' }}>
          <div className="divider-primary" />
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize:   'var(--text-3xl)',
              color:      'white',
              marginTop:  '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            Propiedades disponibles
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-sm)' }}>
            Región de Coquimbo · {propiedades.length} propiedad{propiedades.length !== 1 ? 'es' : ''} encontrada{propiedades.length !== 1 ? 's' : ''}
          </p>
        </Container>
      </div>

      <Container style={{ maxWidth: 'var(--container-max)', padding: '2rem 1rem' }}>
        <Row className="g-4">
          {/* ── Sidebar de filtros ── */}
          <Col lg={3}>
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
              <h5
                style={{
                  fontFamily:   'var(--font-heading)',
                  fontWeight:   700,
                  color:        'var(--color-dark)',
                  marginBottom: '1.25rem',
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '0.5rem',
                }}
              >
                🔍 Filtrar
              </h5>
              <SearchFilters onSearch={setFilters} compact={false} />
            </div>
          </Col>

          {/* ── Grid de propiedades ── */}
          <Col lg={9}>
            {loading ? (
              <LoadingSpinner text="Cargando propiedades..." size="lg" />
            ) : propiedades.length === 0 ? (
              <EmptyState
                icon="🏠"
                title="Sin propiedades"
                message="No encontramos propiedades con esos filtros. Intenta ampliar tu búsqueda."
              />
            ) : (
              <div
                style={{
                  display:             'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap:                 '1.5rem',
                }}
              >
                {propiedades.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
