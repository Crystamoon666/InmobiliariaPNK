/**
 * Sidebar.jsx — Sidebar del dashboard (compartido entre Admin y Owner)
 * Recibe 'links' como prop para diferenciarse por rol.
 *
 * Props:
 *  - links: array de { to, label, icon }
 *
 * Uso interno por AdminLayout y OwnerLayout.
 */

import { NavLink } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';

export default function Sidebar({ links = [] }) {
  return (
    <aside
      style={{
        width:            '240px',
        minHeight:        '100vh',
        backgroundColor:  'var(--color-dark)',
        display:          'flex',
        flexDirection:    'column',
        position:         'sticky',
        top:              0,
        flexShrink:       0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding:       '1.5rem 1.25rem',
          borderBottom:  '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ filter: 'brightness(0) invert(1)' }}>
          <img src={logoSvg} alt="PNK Inmobiliaria" style={{ height: '32px', width: 'auto' }} />
        </div>
      </div>

      {/* Links de navegación */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {links.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to.endsWith('dashboard')}
                style={({ isActive }) => ({
                  display:         'flex',
                  alignItems:      'center',
                  gap:             '0.6rem',
                  padding:         '0.6rem 0.9rem',
                  borderRadius:    'var(--radius-md)',
                  textDecoration:  'none',
                  fontSize:        'var(--text-sm)',
                  fontWeight:      isActive ? 600 : 400,
                  color:           isActive ? 'var(--color-white)' : 'rgba(255,255,255,0.6)',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                  transition:      'all var(--transition-fast)',
                })}
              >
                <span style={{ fontSize: '1rem' }}>{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
