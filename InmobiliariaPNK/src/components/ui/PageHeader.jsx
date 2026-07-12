/**
 * PageHeader.jsx — Encabezado de página del dashboard reutilizable
 *
 * Props:
 *  - title    : título de la página
 *  - subtitle : subtítulo opcional
 *  - action   : botón o elemento JSX a la derecha (ej: botón "Agregar")
 *
 * Uso:
 *  <PageHeader
 *    title="Gestión de Usuarios"
 *    subtitle="Administra los propietarios registrados"
 *    action={<PrimaryButton onClick={handleAdd}>+ Nuevo usuario</PrimaryButton>}
 *  />
 */

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div
      className="d-flex justify-content-between align-items-start mb-4"
      style={{ flexWrap: 'wrap', gap: '1rem' }}
    >
      <div>
        {/* Línea de acento */}
        <div className="divider-primary" />
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--color-dark)',
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              color: 'var(--color-gray-600)',
              fontSize: 'var(--text-sm)',
              marginTop: '0.25rem',
              marginBottom: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
