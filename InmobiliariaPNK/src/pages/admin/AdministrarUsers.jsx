/**
 * AdministrarUsers.jsx — CRUD de usuarios (admin)
 * Lista todos los propietarios con opciones de activar/desactivar y eliminar.
 * TODO Fase 5: reemplazar MOCK_USERS con userService.getAll()
 */

import { useState } from 'react';
import { Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { PageHeader, StatusBadge, EmptyState, PrimaryButton } from '../../components/ui';
import { alertConfirm, alertSuccess, alertError } from '../../components/ui/Alerts';

// Datos mock — reemplazar con userService.getAll()
const MOCK_USERS_INIT = [
  { id: 1, nombre_completo: 'María González', correo: 'maria@demo.cl',   telefono: '+56912345678', rol: 'propietario', estado: 'activo' },
  { id: 2, nombre_completo: 'Carlos Pérez',   correo: 'carlos@demo.cl',  telefono: '+56987654321', rol: 'propietario', estado: 'pendiente' },
  { id: 3, nombre_completo: 'Ana López',       correo: 'ana@demo.cl',     telefono: '+56911223344', rol: 'propietario', estado: 'activo' },
  { id: 4, nombre_completo: 'Pedro Soto',      correo: 'pedro@demo.cl',   telefono: '+56955443322', rol: 'propietario', estado: 'inactivo' },
];

const EMPTY_FORM = { nombre_completo: '', correo: '', telefono: '', password: '' };

export default function AdministrarUsers() {
  const [users,       setUsers]       = useState(MOCK_USERS_INIT);
  const [showModal,   setShowModal]   = useState(false);
  const [editUser,    setEditUser]    = useState(null);   // null = crear, objeto = editar
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [loading,     setLoading]     = useState(false);

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const openCreate = () => {
    setEditUser(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ nombre_completo: user.nombre_completo, correo: user.correo, telefono: user.telefono, password: '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO Fase 5: reemplazar con userService.createUser / userService.updateUser
      await new Promise(r => setTimeout(r, 600)); // simula delay de red
      if (editUser) {
        setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...form } : u));
        await alertSuccess('Usuario actualizado', `${form.nombre_completo} fue editado correctamente.`);
      } else {
        const newUser = { id: Date.now(), ...form, rol: 'propietario', estado: 'activo' };
        setUsers(prev => [...prev, newUser]);
        await alertSuccess('Usuario creado', `${form.nombre_completo} fue agregado correctamente.`);
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
    const accion      = nuevoEstado === 'activo' ? 'activar' : 'desactivar';
    const ok = await alertConfirm(`¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`, `Se ${accion}á la cuenta de ${user.nombre_completo}.`);
    if (!ok) return;
    // TODO Fase 5: reemplazar con userService.changeEstado(user.id, nuevoEstado)
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, estado: nuevoEstado } : u));
    await alertSuccess('Listo', `Usuario ${nuevoEstado} correctamente.`);
  };

  const handleDelete = async (user) => {
    const ok = await alertConfirm('¿Eliminar usuario?', `Se eliminará permanentemente la cuenta de ${user.nombre_completo}.`, 'Sí, eliminar');
    if (!ok) return;
    // TODO Fase 5: reemplazar con userService.deleteUser(user.id)
    setUsers(prev => prev.filter(u => u.id !== user.id));
    await alertSuccess('Eliminado', 'El usuario fue eliminado.');
  };

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
        <EmptyState icon="👥" title="Sin usuarios" message="No hay propietarios registrados aún." />
      ) : (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <Table hover responsive style={{ margin: 0 }}>
            <thead style={{ background: 'var(--color-gray-100)' }}>
              <tr>
                {['#', 'Nombre', 'Correo', 'Teléfono', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-600)', padding: '1rem', border: 'none' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ verticalAlign: 'middle', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', padding: '1rem' }}>{u.id}</td>
                  <td style={{ verticalAlign: 'middle', fontWeight: 600, fontSize: 'var(--text-sm)', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'var(--color-primary)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 'var(--text-xs)', fontWeight: 700, flexShrink: 0,
                      }}>
                        {u.nombre_completo[0]}
                      </span>
                      {u.nombre_completo}
                    </div>
                  </td>
                  <td style={{ verticalAlign: 'middle', fontSize: 'var(--text-sm)', padding: '1rem' }}>{u.correo}</td>
                  <td style={{ verticalAlign: 'middle', fontSize: 'var(--text-sm)', padding: '1rem' }}>{u.telefono}</td>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}><StatusBadge status={u.estado} /></td>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline-primary" onClick={() => openEdit(u)} style={{ borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                        ✏️ Editar
                      </Button>
                      <Button
                        size="sm"
                        variant={u.estado === 'activo' ? 'outline-warning' : 'outline-success'}
                        onClick={() => handleToggleEstado(u)}
                        style={{ borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
                      >
                        {u.estado === 'activo' ? '⏸ Desactivar' : '▶ Activar'}
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(u)} style={{ borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                        🗑 Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal crear/editar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            {editUser ? '✏️ Editar usuario' : '➕ Nuevo usuario'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '1.5rem' }}>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3" controlId="uNombre">
              <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Nombre completo</Form.Label>
              <Form.Control
                value={form.nombre_completo}
                onChange={e => handleChange('nombre_completo', e.target.value)}
                required
                placeholder="Juan Pérez González"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="uCorreo">
              <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Correo</Form.Label>
              <Form.Control
                type="email"
                value={form.correo}
                onChange={e => handleChange('correo', e.target.value)}
                required
                placeholder="correo@ejemplo.cl"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="uTelefono">
              <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Teléfono</Form.Label>
              <Form.Control
                value={form.telefono}
                onChange={e => handleChange('telefono', e.target.value)}
                placeholder="+56 9 0000 0000"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </Form.Group>
            {!editUser && (
              <Form.Group className="mb-4" controlId="uPassword">
                <Form.Label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  required
                  placeholder="Mínimo 8 caracteres"
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
              </Form.Group>
            )}
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ borderRadius: 'var(--radius-md)' }}>
                Cancelar
              </Button>
              <PrimaryButton type="submit" loading={loading}>
                {editUser ? 'Guardar cambios' : 'Crear usuario'}
              </PrimaryButton>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
