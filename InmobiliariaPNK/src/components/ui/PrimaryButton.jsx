/**
 * PrimaryButton.jsx — Botón primario reutilizable PNK
 *
 * Props:
 *  - children    : contenido del botón
 *  - onClick     : función al hacer clic
 *  - type        : 'button' | 'submit' | 'reset'  (default: 'button')
 *  - loading     : muestra spinner si es true
 *  - disabled    : deshabilita el botón
 *  - className   : clases adicionales
 *  - fullWidth   : ocupa el 100% del ancho si es true
 *
 * Uso:
 *  <PrimaryButton onClick={handleSave} loading={isSaving}>
 *    Guardar
 *  </PrimaryButton>
 */

import { Button, Spinner } from 'react-bootstrap';

export default function PrimaryButton({
  children,
  onClick,
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  ...props
}) {
  return (
    <Button
      type={type}
      variant="primary"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${fullWidth ? 'w-100' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" animation="border" className="me-2" />
          Cargando...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
