/**
 * EmptyState.jsx — Estado vacío reutilizable
 * Se muestra cuando una tabla o lista no tiene datos.
 *
 * Props:
 *  - icon    : emoji o ícono (default: '📭')
 *  - title   : título del estado vacío
 *  - message : mensaje descriptivo
 *  - action  : elemento JSX opcional (ej: botón "Crear primero")
 *
 * Uso:
 *  <EmptyState
 *    icon="🏠"
 *    title="Sin propiedades"
 *    message="Aún no tienes propiedades publicadas."
 *    action={<PrimaryButton onClick={handleCreate}>Publicar propiedad</PrimaryButton>}
 *  />
 */

export default function EmptyState({
  icon = '📭',
  title = 'Sin resultados',
  message = 'No hay datos para mostrar.',
  action,
}) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center py-5"
      style={{ minHeight: '300px' }}
    >
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{icon}</div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          color: 'var(--color-dark)',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: 'var(--color-gray-600)',
          fontSize: 'var(--text-sm)',
          maxWidth: '360px',
          marginBottom: action ? '1.5rem' : 0,
        }}
      >
        {message}
      </p>
      {action}
    </div>
  );
}
