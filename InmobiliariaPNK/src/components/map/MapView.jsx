/**
 * MapView.jsx — Mapa interactivo con Leaflet + OpenStreetMap (sin API key)
 * Si lat/lng están disponibles muestra el marcador exacto.
 * Si no, intenta geocodificar la dirección con Nominatim (OSM gratuito).
 *
 * Props:
 *  - lat      : número, latitud
 *  - lng      : número, longitud
 *  - address  : string, dirección para geocodificar si no hay coordenadas
 *  - label    : string, texto del popup del marcador
 */

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix del ícono roto de Leaflet con Vite/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
});

// Ícono personalizado rojo PNK
const pnkIcon = new L.Icon({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
  iconSize:      [25, 41],
  iconAnchor:    [12, 41],
  popupAnchor:   [1, -34],
  shadowSize:    [41, 41],
  className:     'pnk-marker',
});

// Subcomponente para recentrar el mapa cuando cambian las coordenadas
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Coordenadas por defecto: La Serena, Chile
const DEFAULT_LAT = -29.9027;
const DEFAULT_LNG = -71.2519;
const DEFAULT_ZOOM = 14;

export default function MapView({ lat, lng, address = '', label = 'Propiedad' }) {
  const [coords,   setCoords]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    // Si ya tenemos coordenadas válidas, úsalas directamente
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      setCoords([lat, lng]);
      setLoading(false);
      return;
    }

    // Geocodificar con Nominatim (gratuito, sin key)
    if (!address) {
      setCoords([DEFAULT_LAT, DEFAULT_LNG]);
      setLoading(false);
      return;
    }

    const query = encodeURIComponent(`${address}, Región de Coquimbo, Chile`);
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setCoords([DEFAULT_LAT, DEFAULT_LNG]);
        }
      })
      .catch(() => {
        setError(true);
        setCoords([DEFAULT_LAT, DEFAULT_LNG]);
      })
      .finally(() => setLoading(false));
  }, [lat, lng, address]);

  if (loading) {
    return (
      <div
        style={{
          height:         '100%',
          minHeight:      '300px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'var(--color-gray-100)',
          borderRadius:   'var(--radius-lg)',
          flexDirection:  'column',
          gap:            '0.75rem',
          color:          'var(--color-gray-600)',
        }}
      >
        <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>🗺</div>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Cargando mapa...</span>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '100%', minHeight: '300px' }}>
      <MapContainer
        center={coords}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', minHeight: '300px', width: '100%' }}
        scrollWheelZoom={false}
        attributionControl={true}
      >
        <ChangeView center={coords} zoom={DEFAULT_ZOOM} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords} icon={pnkIcon}>
          <Popup>
            <div style={{ textAlign: 'center', fontWeight: 600 }}>
              📍 {label}
              {error && (
                <p style={{ fontSize: '11px', color: '#999', marginTop: '4px', fontWeight: 400 }}>
                  Ubicación aproximada
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
