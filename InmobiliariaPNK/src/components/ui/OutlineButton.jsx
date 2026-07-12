/**
 * OutlineButton.jsx — Botón outline reutilizable PNK
 *
 * Props:
 *  - children    : contenido del botón
 *  - onClick     : función al hacer clic
 *  - variant     : variante Bootstrap (default: 'outline-primary')
 *  - type        : 'button' | 'submit'
 *  - disabled    : deshabilita el botón
 *  - className   : clases adicionales
 *  - fullWidth   : ocupa el 100% del ancho
 *
 * Uso:
 *  <OutlineButton onClick={handleCancel}>Cancelar</OutlineButton>
 */

import { Button } from 'react-bootstrap';

export default function OutlineButton({
  children,
  onClick,
  variant = 'outline-primary',
  type = 'button',
  disabled = false,
  className = '',
  fullWidth = false,
}) {
  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`${fullWidth ? 'w-100' : ''} ${className}`}
    >
      {children}
    </Button>
  );
}
