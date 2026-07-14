/**
 * PropertyCard.jsx — Tarjeta de propiedad para listados y carrusel
 * Diseño inspirado en UX de referencia: imagen + badges + precio + características.
 *
 * Props:
 *  - property: { id, tipo, descripcion, precio_clp, precio_uf, banos,
 *                dormitorios, area_construida, provincia, comuna, foto_url, estado }
 */

import { useNavigate } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { getImageUrl } from '../../utils/imageUtils';

const TIPO_LABEL = {
  casa:         'Casa',
  departamento: 'Departamento',
  terreno:      'Terreno',
};

// Imagen por defecto si la propiedad no tiene foto
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80';

export default function PropertyCard({ property }) {
  const navigate = useNavigate();

  const {
    id,
    tipo        = 'casa',
    descripcion = '',
    precio_clp  = 0,
    precio_uf   = 0,
    banos       = 0,
    dormitorios = 0,
    area_construida = 0,
    provincia   = '',
    comuna      = '',
    foto_url    = DEFAULT_IMG,
  } = property || {};

  const formatCLP = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  // Derivar URL de imagen: primero de fotos[], luego de foto_url, luego default
  const rawFoto = (Array.isArray(property?.fotos) && property.fotos.length > 0)
    ? (typeof property.fotos[0] === 'string' ? property.fotos[0] : property.fotos[0]?.url)
    : (property?.foto_url || null);
  const imageSrc = getImageUrl(rawFoto) || DEFAULT_IMG;

  return (
    <div
      className="property-card"
      onClick={() => navigate(`/propiedades/${id}`)}
      style={{ cursor: 'pointer' }}
    >
      {/* Imagen */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
        <img
          src={imageSrc}
          alt={`Propiedad en ${comuna}`}
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            transition: 'transform var(--transition-slow)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onError={e => { e.currentTarget.src = DEFAULT_IMG; }}
        />
        {/* Badge tipo */}
        <span className="badge-tipo">
          {TIPO_LABEL[tipo] || tipo}
        </span>
      </div>

      {/* Contenido */}
      <div style={{ padding: '1rem' }}>
        {/* Ubicación */}
        <p style={{
          fontSize: 'var(--text-xs)',
          color:    'var(--color-gray-600)',
          margin:   '0 0 0.25rem',
          fontWeight: 500,
        }}>
          📍 {comuna}{provincia ? `, ${provincia}` : ''}
        </p>

        {/* Descripción corta */}
        <p style={{
          fontSize:    'var(--text-sm)',
          color:       'var(--color-dark)',
          fontWeight:  600,
          margin:      '0 0 0.75rem',
          display:     '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow:    'hidden',
        }}>
          {descripcion || `${TIPO_LABEL[tipo]} en ${comuna}`}
        </p>

        {/* Características */}
        <div style={{
          display:    'flex',
          gap:        '1rem',
          fontSize:   'var(--text-xs)',
          color:      'var(--color-gray-600)',
          marginBottom: '0.75rem',
        }}>
          {dormitorios > 0 && <span>🛏 {dormitorios} hab.</span>}
          {banos       > 0 && <span>🚿 {banos} baño{banos > 1 ? 's' : ''}</span>}
          {area_construida > 0 && <span>📐 {area_construida} m²</span>}
        </div>

        {/* Divisor */}
        <hr style={{ margin: '0.75rem 0', borderColor: 'var(--color-gray-300)' }} />

        {/* Precio */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p className="price" style={{ margin: 0 }}>{formatCLP(precio_clp)}</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)', margin: 0 }}>
              {precio_uf ? `UF ${Number(precio_uf).toLocaleString('es-CL')}` : ''}
            </p>
          </div>
          <button
            style={{
              background:   'var(--color-primary-alpha)',
              color:        'var(--color-primary)',
              border:       '1px solid var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              padding:      '0.3rem 0.75rem',
              fontSize:     'var(--text-xs)',
              fontWeight:   600,
              cursor:       'pointer',
              transition:   'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.color      = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--color-primary-alpha)';
              e.currentTarget.style.color      = 'var(--color-primary)';
            }}
            onClick={e => { e.stopPropagation(); navigate(`/propiedades/${id}`); }}
          >
            Ver más →
          </button>
        </div>
      </div>
    </div>
  );
}
