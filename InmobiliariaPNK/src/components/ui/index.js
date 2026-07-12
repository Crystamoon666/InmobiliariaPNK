/**
 * components/ui/index.js
 * Exporta todos los componentes UI reutilizables desde un solo punto.
 * Uso: import { PrimaryButton, ConfirmModal } from '../components/ui';
 */
// ── Componentes UI reutilizables PNK Inmobiliaria ──────────────────────────
// Uso: import { PrimaryButton, StatusBadge } from '../components/ui';
//
// NOTA: Para botones secundarios usar directamente React-Bootstrap:
//   <Button variant="outline-primary"> — no necesita wrapper propio.

export { default as PrimaryButton }  from './PrimaryButton';   // Útil: encapsula el patrón loading+spinner
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as StatusBadge }    from './StatusBadge';
export { default as PageHeader }     from './PageHeader';
export { default as EmptyState }     from './EmptyState';
export { default as Alerts }         from './Alerts';
export { default as PhotoUploader }  from './PhotoUploader';
