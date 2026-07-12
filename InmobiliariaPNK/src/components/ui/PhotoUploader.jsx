/**
 * PhotoUploader.jsx — Componente reutilizable de carga de fotos
 * Permite subir entre 1 y maxPhotos imágenes con previsualización y X para eliminar.
 * Solo acepta formatos de imagen: JPG, JPEG, PNG, WEBP, GIF, AVIF.
 * Rechaza cualquier otro tipo de archivo con un mensaje de error.
 *
 * Props:
 *  - photos      : array de { file, preview } — estado controlado desde el padre
 *  - onChange(photos) : callback cuando cambia el array
 *  - maxPhotos   : número máximo de fotos (default: 10)
 *  - label       : etiqueta del campo
 */

import { useRef, useState } from 'react';

// Tipos MIME aceptados
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
];
const ACCEPTED_EXTENSIONS = 'JPG, JPEG, PNG, WEBP, GIF, AVIF';

export default function PhotoUploader({ photos = [], onChange, maxPhotos = 10, label = 'Fotografías' }) {
  const inputRef  = useRef(null);
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    setError('');
    const files = Array.from(e.target.files);

    // Validar tipos
    const invalidos = files.filter(f => !ACCEPTED_TYPES.includes(f.type));
    if (invalidos.length > 0) {
      setError(`❌ Archivo(s) no válido(s): ${invalidos.map(f => f.name).join(', ')}. Solo se admiten imágenes (${ACCEPTED_EXTENSIONS}).`);
      e.target.value = '';
      return;
    }

    // Respetar límite máximo
    const remaining = maxPhotos - photos.length;
    if (remaining <= 0) {
      setError(`❌ Ya alcanzaste el máximo de ${maxPhotos} fotos.`);
      e.target.value = '';
      return;
    }

    const toAdd = files.slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name:    file.name,
    }));

    if (files.length > remaining) {
      setError(`⚠️ Solo se agregaron ${remaining} foto(s) del total seleccionado (límite ${maxPhotos}).`);
    }

    onChange([...photos, ...toAdd]);
    e.target.value = '';
  };

  const handleRemove = (index) => {
    setError('');
    // Liberar ObjectURL para evitar memory leaks
    const photo = photos[index];
    if (photo?.preview && photo.preview.startsWith('blob:')) {
      URL.revokeObjectURL(photo.preview);
    }
    onChange(photos.filter((_, i) => i !== index));
  };

  const canAdd = photos.length < maxPhotos;

  return (
    <div>
      {/* Etiqueta */}
      <label style={{ fontWeight: 600, fontSize: 'var(--text-sm)', display: 'block', marginBottom: '0.5rem' }}>
        {label}
        <span style={{ fontWeight: 400, color: 'var(--color-gray-600)', marginLeft: '0.4rem' }}>
          ({photos.length}/{maxPhotos})
        </span>
      </label>

      {/* Grid de previsualizaciones */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'flex-start' }}>
        {/* Miniaturas de fotos cargadas */}
        {photos.map((photo, index) => (
          <div
            key={index}
            style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}
          >
            <img
              src={photo.preview || photo.url || photo}
              alt={`Foto ${index + 1}`}
              style={{
                width:        '100%',
                height:       '100%',
                objectFit:    'cover',
                borderRadius: 'var(--radius-md)',
                border:       '2px solid var(--color-gray-300)',
                display:      'block',
              }}
            />
            {/* Número de orden */}
            <span
              style={{
                position:        'absolute',
                bottom:          '2px',
                left:            '4px',
                fontSize:        '10px',
                fontWeight:      700,
                color:           'white',
                textShadow:      '0 1px 3px rgba(0,0,0,0.8)',
                lineHeight:      1,
              }}
            >
              {index + 1}
            </span>
            {/* Botón X para eliminar */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              title="Eliminar foto"
              style={{
                position:       'absolute',
                top:            '-6px',
                right:          '-6px',
                width:          '20px',
                height:         '20px',
                borderRadius:   '50%',
                background:     'var(--color-primary)',
                color:          'white',
                border:         'none',
                cursor:         'pointer',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontSize:       '10px',
                fontWeight:     700,
                boxShadow:      'var(--shadow-sm)',
                zIndex:         1,
                lineHeight:     1,
              }}
            >
              ✕
            </button>
          </div>
        ))}

        {/* Botón para agregar más fotos */}
        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              width:          '80px',
              height:         '80px',
              borderRadius:   'var(--radius-md)',
              border:         '2px dashed var(--color-gray-400)',
              background:     'var(--color-gray-50)',
              color:          'var(--color-gray-500)',
              cursor:         'pointer',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '0.2rem',
              fontSize:       'var(--text-xs)',
              fontWeight:     600,
              transition:     'all var(--transition-fast)',
              flexShrink:     0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color       = 'var(--color-primary)';
              e.currentTarget.style.background  = 'var(--color-primary-alpha)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-gray-400)';
              e.currentTarget.style.color       = 'var(--color-gray-500)';
              e.currentTarget.style.background  = 'var(--color-gray-50)';
            }}
          >
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>＋</span>
            <span>Añadir</span>
          </button>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', margin: '0.4rem 0 0', fontWeight: 500 }}>
          {error}
        </p>
      )}

      {/* Ayuda */}
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', margin: '0.3rem 0 0' }}>
        Formatos admitidos: {ACCEPTED_EXTENSIONS} · Máximo {maxPhotos} foto{maxPhotos !== 1 ? 's' : ''}
      </p>

      {/* Input oculto — solo acepta imágenes */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        onChange={handleAdd}
        style={{ display: 'none' }}
      />
    </div>
  );
}
