/**
 * EditarPropiedades.jsx — Editar una propiedad existente del propietario
 * Carga la propiedad por :id y abre el formulario pre-rellenado.
 * TODO Fase 5: reemplazar mockProperties con propiedadService.getById(id)
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { alertSuccess, alertError } from '../../components/ui/Alerts';
import PropertyFormModal from '../../components/properties/PropertyFormModal';
import { mockProperties } from '../../data/mockData';

export default function EditarPropiedades() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [saving, setSaving] = useState(false);

  // TODO Fase 5: reemplazar con propiedadService.getById(id)
  const propiedad = mockProperties.find(p => p.id === Number(id));

  if (!propiedad) {
    return (
      <div className="text-center py-5">
        <p style={{ fontSize: '3rem' }}>🔍</p>
        <h3>Propiedad no encontrada</h3>
        <button onClick={() => navigate('/propietario/mis-propiedades')}>← Volver</button>
      </div>
    );
  }

  const handleSave = async (form) => {
    setSaving(true);
    try {
      // TODO Fase 5: await propiedadService.updatePropiedad(id, form)
      await new Promise(r => setTimeout(r, 800));
      await alertSuccess('¡Cambios guardados!', 'Tu propiedad fue actualizada correctamente.');
      navigate('/propietario/mis-propiedades');
    } catch {
      await alertError('Error', 'No se pudo actualizar la propiedad.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Editar Propiedad"
        subtitle={`${propiedad.tipo.charAt(0).toUpperCase() + propiedad.tipo.slice(1)} en ${propiedad.comuna}`}
      />
      <PropertyFormModal
        show={true}
        onHide={() => navigate('/propietario/mis-propiedades')}
        onSave={handleSave}
        initial={propiedad}
        loading={saving}
      />
    </div>
  );
}
