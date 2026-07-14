/**
 * EditarPropiedades.jsx — Editar una propiedad existente del propietario
 * Carga la propiedad por :id y abre el formulario pre-rellenado.
 * TODO Fase 5: reemplazar mockProperties con propiedadService.getById(id)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Container } from 'react-bootstrap';
import { PageHeader } from '../../components/ui';
import { alertSuccess, alertError } from '../../components/ui/Alerts';
import PropertyFormModal from '../../components/properties/PropertyFormModal';
import { getById, updatePropiedad } from '../../services/propiedadService';

export default function EditarPropiedades() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [saving, setSaving] = useState(false);
  const [propiedad, setPropiedad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getById(id)
      .then(data => setPropiedad(data))
      .catch(err => {
        console.error(err);
        setPropiedad(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando datos de la propiedad...</p>
      </Container>
    );
  }

  if (!propiedad) {
    return (
      <div className="text-center py-5">
        <p style={{ fontSize: '3rem' }}>🔍</p>
        <h3>Propiedad no encontrada</h3>
        <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/propietario/mis-propiedades')}>← Volver</button>
      </div>
    );
  }

  const handleSave = async (formObj) => {
    setSaving(true);
    try {
      await updatePropiedad(id, formObj);
      await alertSuccess('¡Cambios guardados!', 'Tu propiedad fue actualizada correctamente.');
      navigate('/propietario/mis-propiedades');
    } catch (err) {
      console.error(err);
      await alertError('Error', err.response?.data?.message || 'No se pudo actualizar la propiedad.');
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
