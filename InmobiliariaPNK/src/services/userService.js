/**
 * userService.js — PNK Inmobiliaria
 * Servicio CRUD de usuarios (solo admin).
 */

import api from '../API/axiosConfig';

export const getAll = () =>
  api.get('/users').then(r => r.data);

export const getById = (id) =>
  api.get(`/users/${id}`).then(r => r.data);

export const createUser = (data) =>
  api.post('/users', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);

export const deleteUser = (id) =>
  api.delete(`/users/${id}`).then(r => r.data);

export const changeEstado = (id, estado) =>
  api.put(`/users/${id}`, { estado }).then(r => r.data);
