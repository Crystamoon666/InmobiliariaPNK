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
  api.get(`/propiedades/${id}`).then(r => r.data);

// ── Propietario autenticado ─────────────────────────────────
export const getMias = () =>
  api.get('/propiedades/mias').then(r => r.data);

export const createPropiedad = (formData) =>
  api.post('/propiedades', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, // para subir fotos
  }).then(r => r.data);

export const updatePropiedad = (id, formData) =>
  api.put(`/propiedades/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const deletePropiedad = (id) =>
  api.delete(`/propiedades/${id}`).then(r => r.data);

// ── Admin ───────────────────────────────────────────────────
export const getAllAdmin = () =>
  api.get('/propiedades/admin/todas').then(r => r.data);

export const changeEstado = (id, estado) =>
  api.patch(`/propiedades/${id}/estado`, { estado }).then(r => r.data);
