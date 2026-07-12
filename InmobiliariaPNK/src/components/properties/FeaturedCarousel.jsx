/**
 * FeaturedCarousel.jsx — Carrusel de propiedades destacadas
 * Usado en Home.jsx para mostrar las propiedades más recientes/destacadas.
 *
 * Props:
 *  - properties : array de propiedades { id, tipo, descripcion, precio_clp,
 *                  precio_uf, banos, dormitorios, area_construida,
 *                  provincia, comuna, foto_url }
 *
 * Uso:
 *  <FeaturedCarousel properties={mockProperties} />
 *
 * Nota: cuando el backend esté listo, reemplazar mock con llamada a propiedadService.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import PropertyCard from './PropertyCard';

export default function FeaturedCarousel({ properties = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!properties.length) return null;

  // Agrupamos en slides de 3 tarjetas (desktop) / 1 tarjeta (móvil)
  const chunkSize = 3;
  const slides = [];
  for (let i = 0; i < properties.length; i += chunkSize) {
    slides.push(properties.slice(i, i + chunkSize));
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Título de sección */}
      <div className="text-center mb-4">
        <div className="divider-primary mx-auto" />
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize:   'var(--text-3xl)',
            fontWeight: 800,
            color:      'var(--color-dark)',
            marginTop:  '0.5rem',
          }}
        >
          Propiedades Destacadas
        </h2>
        <p style={{ color: 'var(--color-gray-600)', marginTop: '0.5rem' }}>
          Descubre las mejores oportunidades de la Región de Coquimbo
        </p>
      </div>

      <Carousel
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        indicators={true}
        controls={true}
        interval={5000}
        pause="hover"
        style={{ paddingBottom: '2.5rem' }}
        prevIcon={
          <span
            style={{
              width:           '40px',
              height:          '40px',
              borderRadius:    '50%',
              backgroundColor: 'var(--color-primary)',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              fontSize:        '1.2rem',
              color:           'white',
              boxShadow:       'var(--shadow-md)',
            }}
          >
            ‹
          </span>
        }
        nextIcon={
          <span
            style={{
              width:           '40px',
              height:          '40px',
              borderRadius:    '50%',
              backgroundColor: 'var(--color-primary)',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              fontSize:        '1.2rem',
              color:           'white',
              boxShadow:       'var(--shadow-md)',
            }}
          >
            ›
          </span>
        }
      >
        {slides.map((slide, slideIndex) => (
          <Carousel.Item key={slideIndex}>
            <div
              style={{
                display:             'grid',
                gridTemplateColumns: `repeat(${Math.min(slide.length, 3)}, 1fr)`,
                gap:                 '1.5rem',
                padding:             '0.5rem 3rem 1rem',
              }}
            >
              {slide.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Indicadores de puntos estilizados */}
      <style>{`
        .carousel-indicators [data-bs-target] {
          background-color: var(--color-primary) !important;
          border-radius: 50%;
          width: 8px !important;
          height: 8px !important;
          opacity: 0.4;
        }
        .carousel-indicators .active {
          opacity: 1 !important;
        }
        .carousel-control-prev, .carousel-control-next {
          width: 5%;
        }
      `}</style>
    </div>
  );
}
