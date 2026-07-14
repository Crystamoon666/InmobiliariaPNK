/**
 * AdministrarpPropiedades.jsx — Gestión de propiedades (admin)
 * Tabla con todas las propiedades: crear, editar, cambiar estado, eliminar.
 * TODO Fase 5: reemplazar mockProperties con propiedadService.getAllAdmin()
 */

import { useState, useEffect } from 'react';
import { Table, Button, Form, Spinner } from 'react-bootstrap';
import { PageHeader, StatusBadge, EmptyState } from '../../components/ui';
import { alertConfirm, alertSuccess, alertError } from '../../components/ui/Alerts';
import PropertyFormModal from '../../components/properties/PropertyFormModal';
import * as propiedadService from '../../services/propiedadService';
import * as userService from '../../services/userService';

const ESTADOS = ['publicada', 'pausada', 'eliminada'];

export default function AdministrarpPropiedades() {
  const [propiedades, setPropiedades] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [showModal,   setShowModal]   = useState(false);
  const [editData,    setEditData]    = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [loading,     setLoading]     = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [propsData, usersData] = await Promise.all([
        propiedadService.getAllAdmin(),
        userService.getAll()
      ]);
      setPropiedades(propsData);
      setPropietarios(usersData.filter(u => u.rol === 'propietario'));
    } catch (error) {
      console.error(error);
      alertError('Error', 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCLP = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  const openCreate = () => { setEditData(null); setShowModal(true); };
  const openEdit   = (p)  => { setEditData(p);   setShowModal(true); };

  const handleSave = async (formObj) => {
    setSaving(true);
    try {
      if (editData) {
        await propiedadService.updatePropiedad(editData.id, formObj);
        await alertSuccess('¡Propiedad actualizada!', 'Los cambios fueron guardados.');
      } else {
        await propiedadService.createPropiedad(formObj);
        await alertSuccess('¡Propiedad creada!', 'La propiedad fue publicada.');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      await alertError('Error', err.response?.data?.message || 'No se pudo guardar la propiedad.');
    } finally {
      setSaving(false);
    }
  };

  const handleEstado = async (prop, nuevoEstado) => {
    const ok = await alertConfirm('¿Cambiar estado?', `Se cambiará el estado a "${nuevoEstado}".`);
    if (!ok) return;
    try {
      await propiedadService.changeEstado(prop.id, nuevoEstado);
      setPropiedades(prev => prev.map(p => p.id === prop.id ? { ...p, estado: nuevoEstado } : p));
      await alertSuccess('Estado actualizado', `La propiedad ahora está "${nuevoEstado}".`);
    } catch (err) {
      await alertError('Error', 'No se pudo actualizar el estado.');
    }
  };

  const handleDelete = async (prop) => {
    const ok = await alertConfirm('¿Eliminar propiedad?', 'Esta acción no se puede deshacer.', 'Sí, eliminar');
    if (!ok) return;
    try {
      await propiedadService.deletePropiedad(prop.id);
      setPropiedades(prev => prev.filter(p => p.id !== prop.id));
      await alertSuccess('Eliminada', 'La propiedad fue eliminada.');
    } catch (err) {
      await alertError('Error', 'No se pudo eliminar la propiedad.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Gestión de Propiedades"
        subtitle="Administra todas las propiedades publicadas en la plataforma"
        action={
          <Button variant="primary" onClick={openCreate} style={{ borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
            + Nueva propiedad
          </Button>
        }
      />

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando propiedades...</p>
        </div>
      ) : propiedades.length === 0 ? (
        <EmptyState icon="🏠" title="Sin propiedades" message="No hay propiedades registradas." />
      ) : (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <Table hover responsive style={{ margin: 0 }}>
            <thead style={{ background: 'var(--color-gray-100)' }}>
              <tr>
                {['#', 'Tipo', 'Ubicación', 'Precio', 'Características', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-600)', padding: '1rem', border: 'none' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {propiedades.map(p => (
                <tr key={p.id}>
                  <td style={{ verticalAlign: 'middle', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', padding: '1rem' }}>#{p.id}</td>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                    <span style={{ background: 'var(--color-primary-alpha)', color: 'var(--color-primary)', borderRadius: 'var(--radius-full)', padding: '0.2rem 0.65rem', fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'capitalize' }}>
                      {p.tipo}
                    </span>
                  </td>
                  <td style={{ verticalAlign: 'middle', fontSize: 'var(--text-sm)', padding: '1rem' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{p.comuna}</p>
                    <p style={{ margin: 0, color: 'var(--color-gray-600)', fontSize: 'var(--text-xs)' }}>{p.provincia}</p>
                  </td>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{formatCLP(p.precio_clp)}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>UF {p.precio_uf}</p>
                  </td>
                  <td style={{ verticalAlign: 'middle', fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)', padding: '1rem' }}>
                    {p.dormitorios > 0 && <span>🛏 {p.dormitorios}  </span>}
                    {p.banos > 0       && <span>🚿 {p.banos}  </span>}
                    {p.area_construida > 0 && <span>📐 {p.area_construida}m²</span>}
                  </td>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                    <Form.Select
                      size="sm"
                      value={p.estado}
                      onChange={e => handleEstado(p, e.target.value)}
                      style={{ borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', minWidth: '110px' }}
                    >
                      {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                    </Form.Select>
                  </td>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="outline-primary" onClick={() => openEdit(p)} style={{ borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                        ✏️ Editar
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(p)} style={{ borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                        🗑
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <PropertyFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        initial={editData}
        loading={saving}
        isAdmin={true}
        propietarios={propietarios}
      />
    </div>
  );
}
