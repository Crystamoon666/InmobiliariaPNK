/**
 * PropertyFormModal.jsx — Modal para crear/editar propiedades
 * Reutilizado por PublicarPropiedad y EditarPropiedades.
 *
 * Props:
 *  - show       : boolean — muestra/oculta el modal
 *  - onHide     : función para cerrar
 *  - onSave(formData) : callback con los datos del formulario
 *  - initial    : objeto con datos iniciales (para editar)
 *  - loading    : boolean — estado de carga del botón guardar
 */

import { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { PrimaryButton } from '../ui';
import { UBICACIONES } from '../../data/mockData';

const EMPTY = {
  tipo: 'casa', descripcion: '', precio_clp: '', precio_uf: '',
  banos: '', dormitorios: '', area_construida: '', area_terreno: '',
  provincia: '', comuna: '', sector: '',
  bodega: false, estacionamiento: false, logia: false,
  cocina_amoblada: false, antejardin: false, patio_trasero: false, piscina: false,
  solicitar_visita: true,
};

export default function PropertyFormModal({ show, onHide, onSave, initial = null, loading = false }) {
  const [form, setForm] = useState(EMPTY);

  // Cargar datos iniciales al abrir en modo edición
  useEffect(() => {
    if (initial) {
      setForm({ ...EMPTY, ...initial });
    } else {
      setForm(EMPTY);
    }
  }, [initial, show]);

  const comunas = form.provincia ? UBICACIONES[form.provincia] || [] : [];

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value, ...(field === 'provincia' ? { comuna: '' } : {}) }));

  const handleCheck = (field) =>
    setForm(prev => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const labelStyle = { fontWeight: 600, fontSize: 'var(--text-sm)' };
  const inputStyle = { borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
        <Modal.Title style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
          {initial ? '✏️ Editar propiedad' : '➕ Nueva propiedad'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: '1.5rem' }}>
        <Form id="propertyForm" onSubmit={handleSubmit}>

          {/* Tipo y descripción */}
          <Row className="g-3 mb-3">
            <Col xs={12} sm={4}>
              <Form.Group controlId="pTipo">
                <Form.Label style={labelStyle}>Tipo *</Form.Label>
                <Form.Select value={form.tipo} onChange={e => handleChange('tipo', e.target.value)} required style={inputStyle}>
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="terreno">Terreno</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} sm={8}>
              <Form.Group controlId="pDesc">
                <Form.Label style={labelStyle}>Descripción *</Form.Label>
                <Form.Control
                  as="textarea" rows={2}
                  value={form.descripcion}
                  onChange={e => handleChange('descripcion', e.target.value)}
                  required placeholder="Describe brevemente la propiedad..."
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Precios */}
          <Row className="g-3 mb-3">
            <Col xs={12} sm={6}>
              <Form.Group controlId="pCLP">
                <Form.Label style={labelStyle}>Precio CLP *</Form.Label>
                <Form.Control
                  type="number" min="0"
                  value={form.precio_clp}
                  onChange={e => handleChange('precio_clp', e.target.value)}
                  required placeholder="Ej: 95000000"
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group controlId="pUF">
                <Form.Label style={labelStyle}>Precio UF</Form.Label>
                <Form.Control
                  type="number" min="0" step="0.01"
                  value={form.precio_uf}
                  onChange={e => handleChange('precio_uf', e.target.value)}
                  placeholder="Ej: 2650"
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Características numéricas */}
          <Row className="g-3 mb-3">
            {[
              { id: 'pDorm',  field: 'dormitorios',     label: 'Dormitorios', hide: form.tipo === 'terreno' },
              { id: 'pBanos', field: 'banos',            label: 'Baños',       hide: form.tipo === 'terreno' },
              { id: 'pAC',    field: 'area_construida',  label: 'Área construida (m²)' },
              { id: 'pAT',    field: 'area_terreno',     label: 'Área terreno (m²)' },
            ].filter(f => !f.hide).map(({ id, field, label }) => (
              <Col xs={6} sm={3} key={field}>
                <Form.Group controlId={id}>
                  <Form.Label style={labelStyle}>{label}</Form.Label>
                  <Form.Control
                    type="number" min="0"
                    value={form[field]}
                    onChange={e => handleChange(field, e.target.value)}
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>

          {/* Ubicación */}
          <Row className="g-3 mb-3">
            <Col xs={12} sm={4}>
              <Form.Group controlId="pProvincia">
                <Form.Label style={labelStyle}>Provincia *</Form.Label>
                <Form.Select value={form.provincia} onChange={e => handleChange('provincia', e.target.value)} required style={inputStyle}>
                  <option value="">Seleccionar</option>
                  {Object.keys(UBICACIONES).map(p => <option key={p} value={p}>{p}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} sm={4}>
              <Form.Group controlId="pComuna">
                <Form.Label style={labelStyle}>Comuna *</Form.Label>
                <Form.Select value={form.comuna} onChange={e => handleChange('comuna', e.target.value)} required disabled={!comunas.length} style={inputStyle}>
                  <option value="">Seleccionar</option>
                  {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} sm={4}>
              <Form.Group controlId="pSector">
                <Form.Label style={labelStyle}>Sector</Form.Label>
                <Form.Control value={form.sector} onChange={e => handleChange('sector', e.target.value)} placeholder="Ej: El Milagro" style={inputStyle} />
              </Form.Group>
            </Col>
          </Row>

          {/* Amenidades */}
          {form.tipo !== 'terreno' && (
            <div className="mb-3">
              <Form.Label style={labelStyle}>Amenidades</Form.Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  { field: 'bodega',          label: '🏪 Bodega' },
                  { field: 'estacionamiento', label: '🚗 Estacionamiento' },
                  { field: 'logia',           label: '🧺 Logia' },
                  { field: 'cocina_amoblada', label: '🍳 Cocina amoblada' },
                  { field: 'antejardin',      label: '🌿 Antejardín' },
                  { field: 'patio_trasero',   label: '🌳 Patio trasero' },
                  { field: 'piscina',         label: '🏊 Piscina' },
                ].map(({ field, label }) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => handleCheck(field)}
                    style={{
                      padding:       '0.4rem 0.9rem',
                      borderRadius:  'var(--radius-full)',
                      border:        `1px solid ${form[field] ? 'var(--color-primary)' : 'var(--color-gray-300)'}`,
                      background:    form[field] ? 'var(--color-primary-alpha)' : 'var(--color-white)',
                      color:         form[field] ? 'var(--color-primary)' : 'var(--color-gray-600)',
                      fontSize:      'var(--text-sm)',
                      fontWeight:    form[field] ? 600 : 400,
                      cursor:        'pointer',
                      transition:    'all var(--transition-fast)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Solicitar visita */}
          <Form.Check
            type="switch"
            id="pVisita"
            label="Permitir solicitudes de visita"
            checked={form.solicitar_visita}
            onChange={() => handleCheck('solicitar_visita')}
            style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer style={{ border: 'none', gap: '0.5rem' }}>
        <Button variant="outline-secondary" onClick={onHide} style={{ borderRadius: 'var(--radius-md)' }}>
          Cancelar
        </Button>
        <PrimaryButton type="submit" form="propertyForm" loading={loading}>
          {initial ? 'Guardar cambios' : 'Publicar propiedad'}
        </PrimaryButton>
      </Modal.Footer>
    </Modal>
  );
}
