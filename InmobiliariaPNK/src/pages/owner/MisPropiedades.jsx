/**
 * MisPropiedades.jsx — Lista de propiedades del propietario autenticado
 * CRUD: listar, publicar (modal), editar (modal) y eliminar.
 * TODO Fase 5: reemplazar mockProperties con propiedadService.getMias()
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { PageHeader, StatusBadge, EmptyState } from '../../components/ui';
import { alertConfirm, alertSuccess, alertError } from '../../components/ui/Alerts';
import PropertyFormModal from '../../components/properties/PropertyFormModal';
import { mockProperties } from '../../data/mockData';

export default function MisPropiedades() {
  const navigate = useNavigate();
  // Simula solo las primeras 3 como "mías"
  const [propiedades, setPropiedades] = useState(mockProperties.slice(0, 3));
  const [showModal,   setShowModal]   = useState(false);
  const [editData,    setEditData]    = useState(null);
  const [saving,      setSaving]      = useState(false);

  const formatCLP = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  const openCreate = () => { setEditData(null); setShowModal(true); };
  const openEdit   = (p)  => { setEditData(p);   setShowModal(true); };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 700)); // simula delay
      if (editData) {
        // TODO Fase 5: propiedadService.updatePropiedad(editData.id, form)
        setPropiedades(prev => prev.map(p => p.id === editData.id ? { ...p, ...form } : p));
        await alertSuccess('¡Actualizada!', 'Los cambios fueron guardados correctamente.');
      } else {
        // TODO Fase 5: propiedadService.createPropiedad(form)
        const newProp = { id: Date.now(), ...form, estado: 'publicada', fecha_publicacion: new Date().toISOString().split('T')[0] };
        setPropiedades(prev => [...prev, newProp]);
        await alertSuccess('¡Publicada!', 'Tu propiedad ya está visible en el sitio.');
      }
      setShowModal(false);
    } catch {
      await alertError('Error', 'No se pudo guardar la propiedad.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (prop) => {
    const ok = await alertConfirm('¿Eliminar propiedad?', 'No podrás deshacer esta acción.', 'Sí, eliminar');
    if (!ok) return;
    // TODO Fase 5: propiedadService.deletePropiedad(prop.id)
    setPropiedades(prev => prev.filter(p => p.id !== prop.id));
    await alertSuccess('Eliminada', 'Tu propiedad fue eliminada.');
  };

  return (
    <div>
      <PageHeader
        title="Mis Propiedades"
        subtitle={`${propiedades.length} propiedad${propiedades.length !== 1 ? 'es' : ''} registrada${propiedades.length !== 1 ? 's' : ''}`}
        action={
          <Button variant="primary" onClick={openCreate} style={{ borderRadius: 'var(--radius-md)', fontWeight: 700, boxShadow: 'var(--shadow-primary)' }}>
            + Publicar propiedad
          </Button>
        }
      />

      {propiedades.length === 0 ? (
        <EmptyState
          icon="🏠"
          title="Sin propiedades"
          message="Aún no tienes propiedades publicadas. ¡Publica tu primera propiedad!"
          action={<Button variant="primary" onClick={openCreate} style={{ borderRadius: 'var(--radius-md)', fontWeight: 700 }}>Publicar ahora</Button>}
        />
      ) : (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <Table hover responsive style={{ margin: 0 }}>
            <thead style={{ background: 'var(--color-gray-100)' }}>
              <tr>
                {['Propiedad', 'Ubicación', 'Precio', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-600)', padding: '1rem', border: 'none' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {propiedades.map(p => (
                <tr key={p.id}>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                    <div className="d-flex gap-3 align-items-center">
                      <img src={p.foto_url} alt={p.tipo}
                        style={{ width: '60px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
                        onError={e => e.currentTarget.style.display = 'none'}
                      />
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}>{p.tipo}</p>
                        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>{p.descripcion?.slice(0, 50)}...</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ verticalAlign: 'middle', fontSize: 'var(--text-sm)', padding: '1rem' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{p.comuna}</p>
                    <p style={{ margin: 0, color: 'var(--color-gray-600)', fontSize: 'var(--text-xs)' }}>{p.sector}</p>
                  </td>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{formatCLP(p.precio_clp)}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>UF {p.precio_uf}</p>
                  </td>
                  <td style={{ verticalAlign: 'middle', padding: '1rem' }}>
                    <StatusBadge status={p.estado} />
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
      />
    </div>
  );
}
