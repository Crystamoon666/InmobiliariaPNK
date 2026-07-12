/**
 * Alerts.js — Funciones centralizadas de SweetAlert2 para PNK Inmobiliaria
 * Úsalas en cualquier componente para mostrar alertas consistentes.
 *
 * Funciones disponibles:
 *  - alertError(title, text)       : Error con ícono rojo
 *  - alertSuccess(title, text)     : Éxito con ícono verde
 *  - alertWarning(title, text)     : Advertencia con ícono amarillo
 *  - alertConfirm(title, text)     : Confirmación de dos botones → retorna true/false
 *  - alertInfo(title, text)        : Información con ícono azul
 *
 * Uso:
 *  import { alertSuccess, alertConfirm } from '../components/ui/Alerts';
 *
 *  const confirmed = await alertConfirm('¿Eliminar?', 'Esta acción no se puede deshacer.');
 *  if (confirmed) { ... }
 */

import Swal from 'sweetalert2';

// ── Colores del tema PNK ──
const PRIMARY = '#E8361A';
const PRIMARY_DARK = '#C42B13';

// ── Configuración base compartida ──
const BASE_CONFIG = {
  confirmButtonColor: PRIMARY,
  cancelButtonColor:  '#6b7280',
  buttonsStyling:     true,
  customClass: {
    confirmButton: 'rounded-2 fw-semibold',
    cancelButton:  'rounded-2 fw-semibold',
  },
};

/**
 * Error: campo faltante, validación fallida, error de servidor.
 */
export const alertError = (title = 'Error', text = 'Ocurrió un problema.') =>
  Swal.fire({ ...BASE_CONFIG, icon: 'error', title, text });

/**
 * Éxito: formulario enviado, registro guardado, acción completada.
 */
export const alertSuccess = (title = 'Éxito', text = 'Operación realizada correctamente.') =>
  Swal.fire({ ...BASE_CONFIG, icon: 'success', title, text, timer: 2500, showConfirmButton: false });

/**
 * Advertencia: campo vacío, precaución antes de continuar.
 */
export const alertWarning = (title = 'Atención', text = '') =>
  Swal.fire({ ...BASE_CONFIG, icon: 'warning', title, text });

/**
 * Información: mensajes informativos, pasos del proceso.
 */
export const alertInfo = (title = 'Información', text = '') =>
  Swal.fire({ ...BASE_CONFIG, icon: 'info', title, text });

/**
 * Confirmación: eliminar, cambiar estado, acciones irreversibles.
 * Retorna true si el usuario confirma, false si cancela.
 *
 * Uso:
 *  const ok = await alertConfirm('¿Eliminar usuario?', 'No podrás deshacer esta acción.');
 *  if (ok) eliminarUsuario(id);
 */
export const alertConfirm = async (
  title = '¿Estás seguro?',
  text  = 'Esta acción no se puede deshacer.',
  confirmText = 'Sí, confirmar',
) => {
  const result = await Swal.fire({
    ...BASE_CONFIG,
    icon:              'warning',
    title,
    text,
    showCancelButton:  true,
    confirmButtonText: confirmText,
    cancelButtonText:  'Cancelar',
  });
  return result.isConfirmed;
};

// Export default con todas las funciones para importación alternativa
const Alerts = { alertError, alertSuccess, alertWarning, alertInfo, alertConfirm };
export default Alerts;
