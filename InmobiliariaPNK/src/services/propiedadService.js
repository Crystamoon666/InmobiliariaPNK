/**
 * propiedadService.js — PNK Inmobiliaria
 * Servicio CRUD de propiedades usando Axios + JWT automático (vía axiosConfig).
 *
 * Endpoints esperados del backend:
 *  GET    /propiedades          → lista pública (sin auth)
 *  GET    /propiedades/:id      → detalle público
 *  GET    /propiedades/mias     → mis propiedades (propietario autenticado)
 *  POST   /propiedades          → crear propiedad (propietario)
 *  PUT    /propiedades/:id      → editar propiedad (propietario)
 *  DELETE /propiedades/:id      → eliminar propiedad (propietario o admin)
 *  PATCH  /propiedades/:id/estado → cambiar estado (admin)
 */

import api from '../API/axiosConfig';

// ── Públicas ────────────────────────────────────────────────
export const getPublicas = (params = {}) =>
  api.get('/propiedades', { params }).then(r => r.data);

export const getById = (id) =>
  api.get(`/propiedades/detalle/${id}`).then(r => r.data);

// ── Propietario autenticado ─────────────────────────────────
export const getMias = () =>
  api.get('/propiedades/mis-propiedades').then(r => r.data);

export const createPropiedad = (formObj) => {
  const formData = new FormData();
  const fotosExistentes = [];
  const formToSend = { ...formObj };

  if (Array.isArray(formObj.fotos)) {
    formObj.fotos.forEach(foto => {
      if (foto.file instanceof File) {
        formData.append('fotos', foto.file);
      } else if (foto.url) {
        fotosExistentes.push(foto.url.replace(import.meta.env.VITE_BACKEND_URL, '')); // Extraer solo la ruta relativa si viene absoluta
      } else if (typeof foto === 'string') {
        fotosExistentes.push(foto.replace(import.meta.env.VITE_BACKEND_URL, ''));
      }
    });
  }

  formToSend.fotosExistentes = fotosExistentes;
  delete formToSend.fotos;
  delete formToSend.fotos_preview;

  formData.append('data', JSON.stringify(formToSend));

  return api.post('/propiedades', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export const updatePropiedad = (id, formObj) => {
  const formData = new FormData();
  const fotosExistentes = [];
  const formToSend = { ...formObj };

  if (Array.isArray(formObj.fotos)) {
    formObj.fotos.forEach(foto => {
      if (foto.file instanceof File) {
        formData.append('fotos', foto.file);
      } else if (foto.url) {
        let relative = foto.url.replace(import.meta.env.VITE_BACKEND_URL, '');
        // Ojo, url externa no deberia pasar aca pero removemos base si es local
        if (!relative.startsWith('/')) relative = '/' + relative;
        fotosExistentes.push(relative);
      } else if (typeof foto === 'string') {
        let relative = foto.replace(import.meta.env.VITE_BACKEND_URL, '');
        if (!relative.startsWith('/')) relative = '/' + relative;
        fotosExistentes.push(relative);
      }
    });
  }

  formToSend.fotosExistentes = fotosExistentes;
  delete formToSend.fotos;
  delete formToSend.fotos_preview;

  formData.append('data', JSON.stringify(formToSend));

  return api.put(`/propiedades/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export const deletePropiedad = (id) =>
  api.delete(`/propiedades/${id}`).then(r => r.data);

// ── Admin ───────────────────────────────────────────────────
export const getAllAdmin = () =>
  api.get('/propiedades/admin').then(r => r.data);

export const changeEstado = (id, estado) =>
  api.put(`/propiedades/${id}`, { estado }).then(r => r.data);
