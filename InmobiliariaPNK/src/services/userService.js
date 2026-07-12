/**
 * userService.js — PNK Inmobiliaria
 * Servicio CRUD de usuarios (solo admin).
 */

import api from '../API/axiosConfig';

export const getAll = () =>
  api.get('/usuarios').then(r => r.data);

export const getById = (id) =>
  api.get(`/usuarios/${id}`).then(r => r.data);

export const createUser = (data) =>
  api.post('/usuarios', data).then(r => r.data);

export const updateUser = (id, data) =>
  api.put(`/usuarios/${id}`, data).then(r => r.data);

export const deleteUser = (id) =>
  api.delete(`/usuarios/${id}`).then(r => r.data);

export const changeEstado = (id, estado) =>
  api.patch(`/usuarios/${id}/estado`, { estado }).then(r => r.data);
