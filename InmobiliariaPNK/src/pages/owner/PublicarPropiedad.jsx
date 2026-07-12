/**
 * PublicarPropiedad.jsx — Página dedicada para publicar una nueva propiedad
 * Abre el PropertyFormModal directamente al cargar.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { alertSuccess, alertError } from '../../components/ui/Alerts';
import PropertyFormModal from '../../components/properties/PropertyFormModal';

export default function PublicarPropiedad() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      // TODO Fase 5: await propiedadService.createPropiedad(form)
      await new Promise(r => setTimeout(r, 800));
      await alertSuccess('¡Propiedad publicada!', 'Tu propiedad ya es visible en el sitio.');
      navigate('/propietario/mis-propiedades');
    } catch {
      await alertError('Error', 'No se pudo publicar la propiedad. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Publicar Propiedad"
        subtitle="Completa el formulario para publicar tu inmueble"
      />
      <PropertyFormModal
        show={true}
        onHide={() => navigate('/propietario/mis-propiedades')}
        onSave={handleSave}
        initial={null}
        loading={saving}
      />
    </div>
  );
}
