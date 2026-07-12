/**
 * SearchFilters.jsx — Filtros de búsqueda de propiedades
 * Provincia → Comuna → Sector + Tipo de propiedad
 * Usado en Home.jsx (hero) y PropiedadesLista.jsx (sidebar de filtros)
 *
 * Props:
 *  - onSearch(filters) : callback con { provincia, comuna, sector, tipo }
 *  - compact           : diseño compacto para uso dentro de hero (default: false)
 */

import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { UBICACIONES } from '../../data/mockData';

export default function SearchFilters({ onSearch, compact = false }) {
  const [filters, setFilters] = useState({
    provincia: '',
    comuna:    '',
    sector:    '',
    tipo:      '',
  });

  const comunas = filters.provincia ? UBICACIONES[filters.provincia] || [] : [];

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      // Si cambia la provincia, limpiamos la comuna
      ...(field === 'provincia' ? { comuna: '', sector: '' } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(filters);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className={compact ? 'g-2 align-items-end' : 'g-3'}>
        {/* Tipo de propiedad */}
        <Col xs={12} md={compact ? 'auto' : 6} lg={compact ? 'auto' : 3}>
          <Form.Group>
            {!compact && <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Tipo</Form.Label>}
            <Form.Select
              value={filters.tipo}
              onChange={e => handleChange('tipo', e.target.value)}
              style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}
            >
              <option value="">Todos los tipos</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Provincia */}
        <Col xs={12} md={compact ? 'auto' : 6} lg={compact ? 'auto' : 3}>
          <Form.Group>
            {!compact && <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Provincia</Form.Label>}
            <Form.Select
              value={filters.provincia}
              onChange={e => handleChange('provincia', e.target.value)}
              style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}
            >
              <option value="">Toda la región</option>
              {Object.keys(UBICACIONES).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Comuna */}
        <Col xs={12} md={compact ? 'auto' : 6} lg={compact ? 'auto' : 3}>
          <Form.Group>
            {!compact && <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Comuna</Form.Label>}
            <Form.Select
              value={filters.comuna}
              onChange={e => handleChange('comuna', e.target.value)}
              disabled={!comunas.length}
              style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}
            >
              <option value="">Todas las comunas</option>
              {comunas.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Sector (texto libre) */}
        <Col xs={12} md={compact ? 'auto' : 6} lg={compact ? 'auto' : 3}>
          <Form.Group>
            {!compact && <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Sector</Form.Label>}
            <Form.Control
              type="text"
              placeholder="Sector (ej: El Milagro)"
              value={filters.sector}
              onChange={e => handleChange('sector', e.target.value)}
              style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}
            />
          </Form.Group>
        </Col>

        {/* Botón de búsqueda */}
        <Col xs={12} md={compact ? 'auto' : 12} lg={compact ? 'auto' : 12}>
          <Button
            type="submit"
            variant="primary"
            className={compact ? '' : 'w-100'}
            style={{
              borderRadius: 'var(--radius-md)',
              fontWeight:   700,
              padding:      compact ? '0.5rem 1.25rem' : '0.65rem',
              whiteSpace:   'nowrap',
            }}
          >
            🔍 {compact ? 'Buscar' : 'Buscar propiedades'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
