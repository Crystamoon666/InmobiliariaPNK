/**
 * AdministrarUsers.jsx — CRUD completo de usuarios (admin)
 * Campos: RUT, Nombre, Fecha Nacimiento, Correo, Sexo, Teléfono, Contraseña, Foto de perfil.
 * TODO Fase 5: reemplazar MOCK_USERS con userService.getAll()
 */

import { useState, useRef } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { PageHeader, StatusBadge, EmptyState, PrimaryButton } from '../../components/ui';
import { alertConfirm, alertSuccess, alertError } from '../../components/ui/Alerts';
import { MOCK_USERS } from '../../data/mockData';

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
  const c = rut.replace(/[^0-9kK]/g, '');
  if (c.length <= 1) return c;
  const body = c.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${body}-${c.slice(-1)}`;
};

// Fecha máxima permitida (18 años antes de hoy)
const maxFechaNac = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split('T')[0];
};

// Valida que la fecha no sea futura y que sea mayor de 18
const validarFecha = (fecha) => {
  if (!fecha) return 'La fecha de nacimiento es requerida.';
  const hoy    = new Date();
  const nacido = new Date(fecha);
  if (nacido > hoy) return 'La fecha no puede ser en el futuro.';
  const edad = hoy.getFullYear() - nacido.getFullYear()
    - (hoy < new Date(hoy.getFullYear(), nacido.getMonth(), nacido.getDate()) ? 1 : 0);
  if (edad < 18) return 'El propietario debe ser mayor de 18 años.';
  return null;
};


const EMPTY_FORM = {
  rut: '', nombre_completo: '', fecha_nacimiento: '', correo: '',
  sexo: '', telefono: '', password: '', foto_url: null, foto_preview: null,
};

export default function AdministrarUsers() {
  const [users,     setUsers]     = useState(MOCK_USERS);
  const [showModal, setShowModal] = useState(false);
  const [editUser,  setEditUser]  = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [loading,   setLoading]   = useState(false);
  const fileRef = useRef(null);

  const handleChange = (field, value) => {
    if (field === 'rut') value = formatRut(value);
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Tipos MIME aceptados para la foto de perfil
  const FOTO_TIPOS = ['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/avif'];

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validación de tipo por MIME (no solo por extensión)
    if (!FOTO_TIPOS.includes(file.type)) {
      await alertError(
        'Formato no permitido',
        `El archivo "${file.name}" no es una imagen válida.\nFormatos aceptados: JPG, PNG, WEBP, GIF, AVIF.`
      );
      e.target.value = '';
      return;
    }

    const preview = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, foto_url: file, foto_preview: preview }));
    e.target.value = '';
  };

  const handleRemoveFoto = () =>
    setForm(prev => ({ ...prev, foto_url: null, foto_preview: null }));

  const openCreate = () => {
    setEditUser(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({
      rut:             user.rut || '',
      nombre_completo: user.nombre_completo || '',
      fecha_nacimiento:user.fecha_nacimiento || '',
      correo:          user.correo || '',
      sexo:            user.sexo || '',
      telefono:        user.telefono || '',
      password:        '',
      foto_url:        user.foto_url || null,
      foto_preview:    user.foto_url || null,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validarRut(form.rut)) {
      await alertError('RUT inválido', 'Verifica el RUT ingresado.');
      return;
    }
    const errorFecha = validarFecha(form.fecha_nacimiento);
    if (errorFecha) {
      await alertError('Fecha inválida', errorFecha);
      return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      if (editUser) {
        setUsers(prev => prev.map(u => u.id === editUser.id
          ? { ...u, ...form, foto_url: form.foto_preview }
          : u
        ));
        await alertSuccess('Usuario actualizado', 'Los cambios fueron guardados.');
      } else {
        const newUser = {
          id: Date.now(), ...form, rol: 'propietario', estado: 'activo',
          foto_url: form.foto_preview,
        };
        setUsers(prev => [...prev, newUser]);
        await alertSuccess('Usuario creado', `${form.nombre_completo} fue agregado.`);
      }
      setShowModal(false);
    } catch {
      await alertError('Error', 'No se pudo guardar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEstado = async (user) => {
    const nuevoEstado = user.estado === 'activo' ? 'inactivo' : 'activo';
    const ok = await alertConfirm(
      `¿${nuevoEstado === 'activo' ? 'Activar' : 'Desactivar'} usuario?`,
      `Se ${nuevoEstado === 'activo' ? 'activará' : 'desactivará'} la cuenta de ${user.nombre_completo}.`
    );
    if (!ok) return;
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, estado: nuevoEstado } : u));
    await alertSuccess('Listo', `Usuario ${nuevoEstado} correctamente.`);
  };

  const handleDelete = async (user) => {
    const ok = await alertConfirm('¿Eliminar usuario?', `Se eliminará permanentemente la cuenta de ${user.nombre_completo}.`, 'Sí, eliminar');
    if (!ok) return;
    setUsers(prev => prev.filter(u => u.id !== user.id));
    await alertSuccess('Eliminado', 'El usuario fue eliminado.');
  };

  const labelStyle = { fontWeight: 600, fontSize: 'var(--text-sm)' };
  const inputStyle = { borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' };

  return (
    <div>
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administra las cuentas de propietarios"
        action={
          <Button variant="primary" onClick={openCreate} style={{ borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
            + Nuevo usuario
          </Button>
        }
      />

      {users.length === 0 ? (
        <EmptyState icon="👥" title="Sin usuarios" message="No hay propietarios registrados." />
      ) : (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <Table hover responsive style={{ margin: 0 }}>
            <thead style={{ background: 'var(--color-gray-100)' }}>
              <tr>
                {['', 'Nombre / RUT', 'Correo', 'Teléfono', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-600)', padding: '1rem', border: 'none' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  {/* Avatar */}
                  <td style={{ verticalAlign: 'middle', padding: '1rem', width: '52px' }}>
                    {u.foto_url ? (
                      <img src={u.foto_url} alt={u.nombre_completo}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-gray-300)' }}
                      />
                    ) : (
                      <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                        {u.nombre_completo[0]}
                      </span>
                    )}
                  </td>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-sm)' }}>{u.nombre_completo}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>{u.rut}</p>
                  </td>
                  <td style={{ verticalAlign: 'middle', fontSize: 'var(--text-sm)', padding: '1rem' }}>{u.correo}</td>
                  <td style={{ verticalAlign: 'middle', fontSize: 'var(--text-sm)', padding: '1rem' }}>{u.telefono}</td>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}><StatusBadge status={u.estado} /></td>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline-primary" onClick={() => openEdit(u)} style={{ borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>✏️ Editar</Button>
                      <Button size="sm" variant={u.estado === 'activo' ? 'outline-warning' : 'outline-success'} onClick={() => handleToggleEstado(u)} style={{ borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                        {u.estado === 'activo' ? '⏸ Desactivar' : '▶ Activar'}
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(u)} style={{ borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>🗑</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* ── Modal crear / editar ── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" scrollable>
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            {editUser ? '✏️ Editar usuario' : '➕ Nuevo usuario'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '1.5rem' }}>
          <Form id="userForm" onSubmit={handleSave}>

            {/* Foto de perfil */}
            <div className="mb-4 text-center">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {form.foto_preview ? (
                  <>
                    <img
                      src={form.foto_preview}
                      alt="Foto de perfil"
                      style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)', display: 'block' }}
                    />
                    {/* X para eliminar foto */}
                    <button
                      type="button"
                      onClick={handleRemoveFoto}
                      style={{
                        position: 'absolute', top: '-4px', right: '-4px',
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: 'var(--color-primary)', color: 'white',
                        border: 'none', cursor: 'pointer', fontSize: '10px',
                        fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >✕</button>
                  </>
                ) : (
                  <div
                    style={{
                      width: '96px', height: '96px', borderRadius: '50%',
                      background: 'var(--color-gray-200)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '2rem', color: 'var(--color-gray-400)',
                      border: '2px dashed var(--color-gray-400)',
                    }}
                  >👤</div>
                )}
              </div>
              <div className="mt-2">
                <Button size="sm" variant="outline-primary" onClick={() => fileRef.current?.click()} style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  {form.foto_preview ? '📷 Cambiar foto' : '📷 Agregar foto de perfil'}
                </Button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
                onChange={handleFotoChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* RUT */}
            <Form.Group className="mb-3" controlId="uRut">
              <Form.Label style={labelStyle}>RUT *</Form.Label>
              <Form.Control value={form.rut} onChange={e => handleChange('rut', e.target.value)} required placeholder="12.345.678-9" maxLength={12} style={inputStyle} />
            </Form.Group>

            {/* Nombre */}
            <Form.Group className="mb-3" controlId="uNombre">
              <Form.Label style={labelStyle}>Nombre completo *</Form.Label>
              <Form.Control value={form.nombre_completo} onChange={e => handleChange('nombre_completo', e.target.value)} required placeholder="Juan Pérez González" style={inputStyle} />
            </Form.Group>

            {/* Fecha nacimiento + Sexo */}
            <Row className="g-3 mb-3">
              <Col xs={12} sm={7}>
                <Form.Group controlId="uFecha">
                  <Form.Label style={labelStyle}>Fecha de nacimiento *</Form.Label>
                  <Form.Control
                    type="date"
                    value={form.fecha_nacimiento}
                    onChange={e => handleChange('fecha_nacimiento', e.target.value)}
                    required
                    max={maxFechaNac()}
                    min="1900-01-01"
                    style={inputStyle}
                  />
                  <Form.Text style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>
                    El propietario debe ser mayor de 18 años
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={12} sm={5}>
                <Form.Group controlId="uSexo">
                  <Form.Label style={labelStyle}>Sexo *</Form.Label>
                  <Form.Select value={form.sexo} onChange={e => handleChange('sexo', e.target.value)} required style={inputStyle}>
                    <option value="">Seleccionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Prefiero no decir</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Correo + Teléfono */}
            <Row className="g-3 mb-3">
              <Col xs={12} sm={7}>
                <Form.Group controlId="uCorreo">
                  <Form.Label style={labelStyle}>Correo electrónico *</Form.Label>
                  <Form.Control type="email" value={form.correo} onChange={e => handleChange('correo', e.target.value)} required placeholder="correo@ejemplo.cl" style={inputStyle} />
                </Form.Group>
              </Col>
              <Col xs={12} sm={5}>
                <Form.Group controlId="uTelefono">
                  <Form.Label style={labelStyle}>Teléfono móvil *</Form.Label>
                  <Form.Control value={form.telefono} onChange={e => handleChange('telefono', e.target.value)} required placeholder="+56 9 0000 0000" style={inputStyle} />
                </Form.Group>
              </Col>
            </Row>

            {/* Contraseña */}
            <Form.Group className="mb-1" controlId="uPassword">
              <Form.Label style={labelStyle}>
                {editUser ? 'Nueva contraseña' : 'Contraseña *'}
                {editUser && <span style={{ fontWeight: 400, color: 'var(--color-gray-500)', marginLeft: '0.4rem', fontSize: 'var(--text-xs)' }}>(dejar en blanco para no cambiar)</span>}
              </Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                required={!editUser}
                placeholder={editUser ? 'Dejar en blanco para no cambiar' : 'Mínimo 8 caracteres'}
                style={inputStyle}
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', gap: '0.5rem' }}>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ borderRadius: 'var(--radius-md)' }}>
            Cancelar
          </Button>
          <PrimaryButton type="submit" form="userForm" loading={loading}>
            {editUser ? 'Guardar cambios' : 'Crear usuario'}
          </PrimaryButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
