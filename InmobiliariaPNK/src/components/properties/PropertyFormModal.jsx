/**
 * PropertyFormModal.jsx — Modal para crear/editar propiedades
 * Reutilizado por MisPropiedades, PublicarPropiedad, EditarPropiedades y admin.
 *
 * Campos:
 *  - Rol de Avaluó (SII), Tipo, Descripción, Precios CLP/UF
 *  - Dormitorios, Baños, Área construida/terreno
 *  - Provincia → Comuna → Sector
 *  - Amenidades (toggle pills), Solicitar visita (switch)
 *  - Fotografías (1-10) con previsualización y X para eliminar
 */

import { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { PrimaryButton, PhotoUploader } from '../ui';
import { UBICACIONES } from '../../data/mockData';

/**
 * Formatea el Rol de Avaluó del SII: solo números y un guión separador.
 * Formato: MANZANA-PREDIAL  →  ej: "1234-56"
 * - Solo admite dígitos (0-9) y el guión como separador.
 * - El guión solo puede aparecer una vez y no al inicio.
 * - Todo lo demás es rechazado.
 */
const formatRol = (raw) => {
  // Eliminar cualquier carácter que no sea dígito o guión
  const clean = raw.replace(/[^0-9-]/g, '');
  // Asegurar solo un guión, no al inicio
  const parts = clean.split('-');
  if (parts.length === 1) return parts[0];              // sin guión aun
  return `${parts[0]}-${parts.slice(1).join('')}`;      // guión único
};

/** Valida el formato completo del Rol: MANZANA-PREDIAL (ambas partes numéricas) */
const validarRol = (rol) => {
  if (!rol) return false;
  return /^\d+-\d+$/.test(rol.trim());
};

const EMPTY = {
  propietario_id:   '',
  numero_bien_raiz: '',
  tipo:             'casa',
  descripcion:      '',
  precio_clp:       '',
  precio_uf:        '',
  banos:            '',
  dormitorios:      '',
  area_construida:  '',
  area_terreno:     '',
  provincia:        '',
  comuna:           '',
  sector:           '',
  bodega:           false,
  estacionamiento:  false,
  logia:            false,
  cocina_amoblada:  false,
  antejardin:       false,
  patio_trasero:    false,
  piscina:          false,
  solicitar_visita: true,
  fotos:            [],
};

export default function PropertyFormModal({ show, onHide, onSave, initial = null, loading = false, isAdmin = false, propietarios = [] }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (initial) {
      const fotosIniciales = initial.foto_url
        ? [{ preview: initial.foto_url, url: initial.foto_url }]
        : (initial.fotos || []);
      setForm({ ...EMPTY, ...initial, fotos: fotosIniciales });
    } else {
      setForm(EMPTY);
    }
  }, [initial, show]);

  const comunas = form.provincia ? UBICACIONES[form.provincia] || [] : [];

  const handleChange = (field, value) => {
    // Aplicar formateo especial al Rol de Avaluó
    if (field === 'numero_bien_raiz') value = formatRol(value);
    setForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'provincia' ? { comuna: '' } : {}),
    }));
  };

  const handleCheck = (field) =>
    setForm(prev => ({ ...prev, [field]: !prev[field] }));

  const [rolError, setRolError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarRol(form.numero_bien_raiz)) {
      setRolError('Formato inválido. Ejemplo: 1234-56 (manzana-predial, solo números).');
      return;
    }
    setRolError('');
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

          {/* ── Identificación ───────────────────────────── */}
          <div style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', border: '1px solid var(--color-gray-200)' }}>
            <p style={{ fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-600)', margin: '0 0 0.75rem' }}>
              📋 Identificación
            </p>

            {isAdmin && (
              <Row className="mb-3">
                <Col xs={12}>
                  <Form.Group controlId="pPropietario">
                    <Form.Label style={labelStyle}>Propietario asignado *</Form.Label>
                    <Form.Select
                      value={form.propietario_id}
                      onChange={e => handleChange('propietario_id', e.target.value)}
                      required
                      style={inputStyle}
                    >
                      <option value="">Selecciona un propietario...</option>
                      {propietarios.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nombre_completo} ({p.rut})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row className="g-3">
              <Col xs={12} sm={6}>
                <Form.Group controlId="pRolAvaluo">
                  <Form.Label style={labelStyle}>Rol de Avaluó (SII) *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: 1234-56"
                    value={form.numero_bien_raiz}
                    onChange={e => handleChange('numero_bien_raiz', e.target.value)}
                    required
                    maxLength={12}
                    inputMode="numeric"
                    isInvalid={!!rolError}
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: 'var(--text-xs)' }}>
                    {rolError}
                  </Form.Control.Feedback>
                  {!rolError && (
                    <Form.Text style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>
                      Número de Manzana - Número Predial (solo dígitos)
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group controlId="pTipo">
                  <Form.Label style={labelStyle}>Tipo *</Form.Label>
                  <Form.Select value={form.tipo} onChange={e => handleChange('tipo', e.target.value)} required style={inputStyle}>
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="terreno">Terreno</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* ── Descripción ───────────────────────────────── */}
          <Form.Group className="mb-3" controlId="pDesc">
            <Form.Label style={labelStyle}>Descripción *</Form.Label>
            <Form.Control
              as="textarea" rows={3}
              value={form.descripcion}
              onChange={e => handleChange('descripcion', e.target.value)}
              required
              placeholder="Describe brevemente la propiedad..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Form.Group>

          {/* ── Precios ──────────────────────────────────── */}
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

          {/* ── Características numéricas ─────────────────── */}
          {form.tipo !== 'terreno' ? (
            <Row className="g-3 mb-3">
              <Col xs={6} sm={3}>
                <Form.Group controlId="pDorm">
                  <Form.Label style={labelStyle}>Dormitorios</Form.Label>
                  <Form.Control type="number" min="0" value={form.dormitorios} onChange={e => handleChange('dormitorios', e.target.value)} style={inputStyle} />
                </Form.Group>
              </Col>
              <Col xs={6} sm={3}>
                <Form.Group controlId="pBanos">
                  <Form.Label style={labelStyle}>Baños</Form.Label>
                  <Form.Control type="number" min="0" value={form.banos} onChange={e => handleChange('banos', e.target.value)} style={inputStyle} />
                </Form.Group>
              </Col>
              <Col xs={6} sm={3}>
                <Form.Group controlId="pAC">
                  <Form.Label style={labelStyle}>Construido (m²)</Form.Label>
                  <Form.Control type="number" min="0" value={form.area_construida} onChange={e => handleChange('area_construida', e.target.value)} style={inputStyle} />
                </Form.Group>
              </Col>
              <Col xs={6} sm={3}>
                <Form.Group controlId="pAT">
                  <Form.Label style={labelStyle}>Terreno (m²)</Form.Label>
                  <Form.Control type="number" min="0" value={form.area_terreno} onChange={e => handleChange('area_terreno', e.target.value)} style={inputStyle} />
                </Form.Group>
              </Col>
            </Row>
          ) : (
            <Form.Group className="mb-3" controlId="pATTerreno">
              <Form.Label style={labelStyle}>Superficie total (m²)</Form.Label>
              <Form.Control type="number" min="0" value={form.area_terreno} onChange={e => handleChange('area_terreno', e.target.value)} style={inputStyle} />
            </Form.Group>
          )}

          {/* ── Ubicación ─────────────────────────────────── */}
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

          {/* ── Amenidades ────────────────────────────────── */}
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
                      padding:      '0.4rem 0.9rem',
                      borderRadius: 'var(--radius-full)',
                      border:       `1px solid ${form[field] ? 'var(--color-primary)' : 'var(--color-gray-300)'}`,
                      background:   form[field] ? 'var(--color-primary-alpha)' : 'var(--color-white)',
                      color:        form[field] ? 'var(--color-primary)' : 'var(--color-gray-600)',
                      fontSize:     'var(--text-sm)',
                      fontWeight:   form[field] ? 600 : 400,
                      cursor:       'pointer',
                      transition:   'all var(--transition-fast)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Solicitar visita ──────────────────────────── */}
          <div className="mb-4">
            <Form.Check
              type="switch"
              id="pVisita"
              label="Permitir solicitudes de visita"
              checked={form.solicitar_visita}
              onChange={() => handleCheck('solicitar_visita')}
              style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}
            />
          </div>

          {/* ── Fotografías (1-10) ────────────────────────── */}
          <div
            style={{
              background:   'var(--color-gray-50)',
              borderRadius: 'var(--radius-md)',
              padding:      '1rem',
              border:       '1px solid var(--color-gray-200)',
            }}
          >
            <PhotoUploader
              photos={form.fotos}
              onChange={fotos => setForm(prev => ({ ...prev, fotos }))}
              maxPhotos={10}
              label="Fotografías de la propiedad"
            />
          </div>

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
