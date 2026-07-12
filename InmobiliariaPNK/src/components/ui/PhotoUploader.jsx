/**
 * PhotoUploader.jsx — Componente reutilizable de carga de fotos
 * Permite subir entre 1 y maxPhotos imágenes con previsualización y X para eliminar.
 *
 * Props:
 *  - photos      : array de { file, preview } — estado controlado desde el padre
 *  - onChange(photos) : callback cuando cambia el array
 *  - maxPhotos   : número máximo de fotos (default: 10)
 *  - label       : etiqueta del campo (default: 'Fotografías')
 */

import { useRef } from 'react';

export default function PhotoUploader({ photos = [], onChange, maxPhotos = 10, label = 'Fotografías' }) {
  const inputRef = useRef(null);

  const handleAdd = (e) => {
    const files = Array.from(e.target.files);
    const remaining = maxPhotos - photos.length;
    const toAdd = files.slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    onChange([...photos, ...toAdd]);
    // Limpiar input para poder seleccionar la misma imagen luego
    e.target.value = '';
  };

  const handleRemove = (index) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  };

  const canAdd = photos.length < maxPhotos;

  return (
    <div>
      <label style={{ fontWeight: 600, fontSize: 'var(--text-sm)', display: 'block', marginBottom: '0.5rem' }}>
        {label}
        <span style={{ fontWeight: 400, color: 'var(--color-gray-600)', marginLeft: '0.4rem' }}>
          ({photos.length}/{maxPhotos})
        </span>
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'flex-start' }}>
        {/* Previsualización de fotos cargadas */}
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
              }}
            />
            {/* Botón X para eliminar */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              title="Eliminar foto"
              style={{
                position:        'absolute',
                top:             '-6px',
                right:           '-6px',
                width:           '20px',
                height:          '20px',
                borderRadius:    '50%',
                background:      'var(--color-primary)',
                color:           'white',
                border:          'none',
                cursor:          'pointer',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                fontSize:        '10px',
                fontWeight:      700,
                lineHeight:      1,
                boxShadow:       'var(--shadow-sm)',
                zIndex:          1,
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
              width:        '80px',
              height:       '80px',
              borderRadius: 'var(--radius-md)',
              border:       '2px dashed var(--color-gray-400)',
              background:   'var(--color-gray-50)',
              color:        'var(--color-gray-500)',
              cursor:       'pointer',
              display:      'flex',
              flexDirection:'column',
              alignItems:   'center',
              justifyContent: 'center',
              gap:          '0.25rem',
              fontSize:     'var(--text-xs)',
              fontWeight:   600,
              transition:   'all var(--transition-fast)',
              flexShrink:   0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-gray-400)'; e.currentTarget.style.color = 'var(--color-gray-500)'; }}
          >
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>＋</span>
            <span>Añadir</span>
          </button>
        )}
      </div>

      {/* Info */}
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', margin: '0.4rem 0 0' }}>
        Formatos: JPG, PNG, WEBP · Máximo {maxPhotos} fotos
      </p>

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleAdd}
        style={{ display: 'none' }}
      />
    </div>
  );
}
