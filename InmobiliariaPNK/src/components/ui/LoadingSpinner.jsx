/**
 * LoadingSpinner.jsx — Indicador de carga reutilizable
 *
 * Props:
 *  - text      : texto debajo del spinner (default: 'Cargando...')
 *  - fullPage  : si es true, ocupa toda la pantalla centrado
 *  - size      : tamaño del spinner ('sm' | 'md' | 'lg', default: 'md')
 *
 * Uso:
 *  <LoadingSpinner text="Cargando propiedades..." />
 *  <LoadingSpinner fullPage />
 */

import { Spinner } from 'react-bootstrap';

export default function LoadingSpinner({
  text = 'Cargando...',
  fullPage = false,
  size = 'md',
}) {
  const spinnerSize = size === 'md' ? undefined : size; // Bootstrap solo acepta 'sm'

  const content = (
    <div className="d-flex flex-column align-items-center gap-3">
      <Spinner
        animation="border"
        size={spinnerSize}
        style={{ color: 'var(--color-primary)', width: size === 'lg' ? '3rem' : undefined, height: size === 'lg' ? '3rem' : undefined }}
      />
      {text && (
        <p style={{ color: 'var(--color-gray-600)', margin: 0, fontSize: 'var(--text-sm)' }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      {content}
    </div>
  );
}
