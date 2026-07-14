/**
 * imageUtils.js — PNK Inmobiliaria
 * Helper centralizado para construir URLs de imágenes del backend.
 *
 * El backend guarda rutas relativas como "/uploads/foto.jpg".
 * Esta función las convierte a la URL completa del servidor.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

/**
 * Convierte una ruta relativa de imagen en URL absoluta del backend.
 * Maneja correctamente los casos:
 *  - null/undefined → devuelve null
 *  - ya es absoluta (http...) → la devuelve sin cambios
 *  - relativa "/uploads/..." → "http://localhost:4000/uploads/..."
 *  - relativa "uploads/..." (sin slash) → "http://localhost:4000/uploads/..."
 *
 * @param {string|null} path - Ruta de la imagen
 * @returns {string|null}
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Normalizar: asegurarse de que no haya doble slash
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${BACKEND_URL}${cleanPath}`;
};
