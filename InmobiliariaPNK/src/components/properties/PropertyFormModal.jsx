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
import { alertError } from '../ui/Alerts';
import { UBICACIONES } from '../../data/mockData';
import { getImageUrl } from '../../utils/imageUtils';

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
  const [validated, setValidated] = useState(false);
  const [ufValue, setUfValue] = useState(38000); // Valor referencial de fallback

  // Obtener valor actual de la UF desde mindicador.cl
  useEffect(() => {
    if (show) {
      fetch('https://mindicador.cl/api/uf')
        .then(res => res.json())
        .then(data => {
          if (data && data.serie && data.serie.length > 0 && data.serie[0].valor) {
            setUfValue(data.serie[0].valor);
          }
        })
        .catch(err => console.error('Error obteniendo UF:', err));
    }
  }, [show]);

  useEffect(() => {
    if (initial) {
      // Normalizar fotos: pueden venir como strings ["/uploads/..."] o como objetos {url, preview}
      let fotosIniciales = [];
      if (initial.fotos && Array.isArray(initial.fotos)) {
        fotosIniciales = initial.fotos.map(f => {
          if (typeof f === 'string') {
            const fullUrl = getImageUrl(f);
            return { url: f, preview: fullUrl };
          }
          // ya es objeto { url, preview }
          return { ...f, preview: getImageUrl(f.url || f.preview) || f.preview };
        });
      } else if (initial.foto_url) {
        const fullUrl = getImageUrl(initial.foto_url);
        fotosIniciales = [{ url: initial.foto_url, preview: fullUrl }];
      }
      setForm({ ...EMPTY, ...initial, fotos: fotosIniciales, propietario_id: String(initial.propietario_id || '') });
    } else {
      setForm(EMPTY);
    }
    setValidated(false);
  }, [initial, show]);

  const comunas = form.provincia ? UBICACIONES[form.provincia] || [] : [];

  const handleChange = (field, value) => {
    // Aplicar formateo especial al Rol de Avaluó
    if (field === 'numero_bien_raiz') value = formatRol(value);
    
    // Forzar que precio_clp, dormitorios y banos sean solo enteros positivos
    if (['precio_clp', 'dormitorios', 'banos'].includes(field)) {
      value = value.replace(/[^0-9]/g, '');
    }

    setForm(prev => {
      const nextForm = {
        ...prev,
        [field]: value,
        ...(field === 'provincia' ? { comuna: '' } : {}),
      };

      // Cálculo automático de UF
      if (field === 'precio_clp') {
        if (value && ufValue > 0) {
          nextForm.precio_uf = (Number(value) / ufValue).toFixed(2);
        } else {
          nextForm.precio_uf = '';
        }
      }

      return nextForm;
    });
  };

  const handleCheck = (field) =>
    setForm(prev => ({ ...prev, [field]: !prev[field] }));

  const [rolError, setRolError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    if (formEl.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      alertError('Campos incompletos o inválidos', 'Por favor, completa correctamente todos los campos obligatorios antes de continuar.');
      return;
    }
    setValidated(true);

    const erroresValidacion = [];

    if (!validarRol(form.numero_bien_raiz)) {
      erroresValidacion.push('Formato de Rol inválido. Ejemplo: 1234-56 (manzana-predial, solo números).');
      setRolError('Formato inválido.');
    } else {
      setRolError('');
    }

    if (Number(form.precio_clp) <= 0) {
      erroresValidacion.push('El precio en CLP debe ser mayor a 0.');
    }

    if (form.tipo !== 'terreno') {
      if (Number(form.dormitorios) <= 0) erroresValidacion.push('Debe tener al menos 1 dormitorio.');
      if (Number(form.banos) <= 0) erroresValidacion.push('Debe tener al menos 1 baño.');
      
      const ac = Number(form.area_construida);
      const at = Number(form.area_terreno);
      if (ac <= 0) erroresValidacion.push('El área construida debe ser mayor a 0.');
      if (at <= 0) erroresValidacion.push('El área de terreno debe ser mayor a 0.');
      if (ac > at) erroresValidacion.push('Los metros construidos no pueden ser mayores a los metros del terreno.');
    } else {
      if (Number(form.area_terreno) <= 0) erroresValidacion.push('El área de terreno debe ser mayor a 0.');
    }

    if (!form.fotos || form.fotos.length === 0) {
      erroresValidacion.push('Debe adjuntar al menos 1 fotografía.');
    }

    if (erroresValidacion.length > 0) {
      alertError('Errores de validación', erroresValidacion.join('\n'));
      return;
    }

    onSave(form);
  };

  const labelStyle = { fontWeight: 600, fontSize: 'var(--text-sm)' };
  const inputStyle = { borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' };

  const ac = Number(form.area_construida);
  const at = Number(form.area_terreno);

  // Evaluar en tiempo real si son inválidos
  const showRolError = (validated || form.numero_bien_raiz.length > 0) && !validarRol(form.numero_bien_raiz);
  const showPrecioError = (validated || form.precio_clp.toString().length > 0) && Number(form.precio_clp) <= 0;
  const showDormError = form.tipo !== 'terreno' && (validated || form.dormitorios.toString().length > 0) && Number(form.dormitorios) <= 0;
  const showBanosError = form.tipo !== 'terreno' && (validated || form.banos.toString().length > 0) && Number(form.banos) <= 0;
  const showACError = form.tipo !== 'terreno' && (validated || form.area_construida.toString().length > 0) && (ac <= 0 || ac > at);
  const showATError = (validated || form.area_terreno.toString().length > 0) && (at <= 0 || (form.tipo !== 'terreno' && ac > at));

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
        <Modal.Title style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
          {initial ? '✏️ Editar propiedad' : '➕ Nueva propiedad'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: '1.5rem' }}>
        <Form id="propertyForm" noValidate validated={validated} onSubmit={handleSubmit}>

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
                    <Form.Control.Feedback type="invalid">Debe asignar un propietario.</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row className="g-3">
              <Col xs={12} sm={6}>
                <Form.Group controlId="pRolAvaluo">
                  <Form.Label style={labelStyle}>Rol de Avalúo (SII) *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: 1234-56"
                    value={form.numero_bien_raiz}
                    onChange={e => handleChange('numero_bien_raiz', e.target.value)}
                    required
                    maxLength={12}
                    inputMode="numeric"
                    isInvalid={showRolError || !!rolError}
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid" style={{ fontSize: 'var(--text-xs)' }}>
                    {rolError || 'Requerido y debe tener formato válido (Ej: 1234-56).'}
                  </Form.Control.Feedback>
                  {!rolError && !validated && (
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
              maxLength={1000}
              placeholder="Describe brevemente la propiedad..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <Form.Control.Feedback type="invalid">La descripción es obligatoria.</Form.Control.Feedback>
          </Form.Group>

          {/* ── Precios ──────────────────────────────────── */}
          <Row className="g-3 mb-3">
            <Col xs={12} sm={6}>
              <Form.Group controlId="pCLP">
                <Form.Label style={labelStyle}>Precio CLP *</Form.Label>
                <Form.Control
                  type="text" inputMode="numeric"
                  value={form.precio_clp}
                  onChange={e => handleChange('precio_clp', e.target.value)}
                  required placeholder="Ej: 95000000"
                  style={inputStyle}
                  isInvalid={showPrecioError}
                />
                <Form.Control.Feedback type="invalid">Precio requerido y debe ser mayor a 0.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Group controlId="pUF">
                <Form.Label style={labelStyle}>Precio UF</Form.Label>
                <Form.Control
                  type="text"
                  value={form.precio_uf}
                  readOnly
                  placeholder="Auto calculado"
                  style={{ ...inputStyle, backgroundColor: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }}
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
                  <Form.Control type="text" inputMode="numeric" maxLength={2} value={form.dormitorios} onChange={e => handleChange('dormitorios', e.target.value)} style={inputStyle} required isInvalid={showDormError} />
                  <Form.Control.Feedback type="invalid">Requerido, &gt; 0.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={6} sm={3}>
                <Form.Group controlId="pBanos">
                  <Form.Label style={labelStyle}>Baños</Form.Label>
                  <Form.Control type="text" inputMode="numeric" maxLength={2} value={form.banos} onChange={e => handleChange('banos', e.target.value)} style={inputStyle} required isInvalid={showBanosError} />
                  <Form.Control.Feedback type="invalid">Requerido, &gt; 0.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={6} sm={3}>
                <Form.Group controlId="pAC">
                  <Form.Label style={labelStyle}>Construido (m²)</Form.Label>
                  <Form.Control type="number" min="0" step="0.01" value={form.area_construida} onChange={e => handleChange('area_construida', e.target.value)} style={inputStyle} required isInvalid={showACError} />
                  <Form.Control.Feedback type="invalid">Debe ser &gt; 0 y ≤ Terreno.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={6} sm={3}>
                <Form.Group controlId="pAT">
                  <Form.Label style={labelStyle}>Terreno (m²)</Form.Label>
                  <Form.Control type="number" min="0" step="0.01" value={form.area_terreno} onChange={e => handleChange('area_terreno', e.target.value)} style={inputStyle} required isInvalid={showATError} />
                  <Form.Control.Feedback type="invalid">Debe ser &gt; 0 y ≥ Construido.</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          ) : (
            <Form.Group className="mb-3" controlId="pATTerreno">
              <Form.Label style={labelStyle}>Superficie total (m²)</Form.Label>
              <Form.Control type="number" min="0" step="0.01" value={form.area_terreno} onChange={e => handleChange('area_terreno', e.target.value)} style={inputStyle} required isInvalid={showATError} />
              <Form.Control.Feedback type="invalid">Debe ser mayor a 0.</Form.Control.Feedback>
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
                <Form.Control.Feedback type="invalid">Provincia requerida.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} sm={4}>
              <Form.Group controlId="pComuna">
                <Form.Label style={labelStyle}>Comuna *</Form.Label>
                <Form.Select value={form.comuna} onChange={e => handleChange('comuna', e.target.value)} required disabled={!comunas.length} style={inputStyle}>
                  <option value="">Seleccionar</option>
                  {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                </Form.Select>
                <Form.Control.Feedback type="invalid">Comuna requerida.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} sm={4}>
              <Form.Group controlId="pSector">
                <Form.Label style={labelStyle}>Sector</Form.Label>
                <Form.Control value={form.sector} onChange={e => handleChange('sector', e.target.value)} maxLength={100} placeholder="Ej: El Milagro" style={inputStyle} />
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
              border:       (validated && form.fotos.length === 0) ? '1px solid var(--color-danger)' : '1px solid var(--color-gray-200)',
            }}
          >
            {validated && form.fotos.length === 0 && (
              <p style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Debe adjuntar al menos 1 fotografía.</p>
            )}
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
