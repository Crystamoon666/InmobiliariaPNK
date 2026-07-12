/**
 * StatusBadge.jsx — Badge de estado reutilizable
 * Muestra el estado de un usuario o propiedad con color correspondiente.
 *
 * Props:
 *  - status : 'activo' | 'pendiente' | 'inactivo' | 'publicada' | 'pausada' | 'eliminada'
 *
 * Uso:
 *  <StatusBadge status={usuario.estado} />
 *  <StatusBadge status={propiedad.estado} />
 */

const STATUS_CONFIG = {
  // Estados de usuario
  activo:    { label: 'Activo',    bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
  pendiente: { label: 'Pendiente', bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
  inactivo:  { label: 'Inactivo', bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
  // Estados de propiedad
  publicada: { label: 'Publicada', bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
  pausada:   { label: 'Pausada',   bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
  eliminada: { label: 'Eliminada', bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: '#f3f4f6',
    color: '#374151',
    border: '#d1d5db',
  };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.2rem 0.65rem',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        letterSpacing: '0.02em',
        textTransform: 'capitalize',
      }}
    >
      {config.label}
    </span>
  );
}
