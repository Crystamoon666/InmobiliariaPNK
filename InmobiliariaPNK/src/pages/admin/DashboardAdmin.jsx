/**
 * DashboardAdmin.jsx — Panel principal del administrador
 * Muestra tarjetas de estadísticas y accesos rápidos.
 * TODO Fase 5: reemplazar mocks con llamadas a userService y propiedadService.
 */

import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { PageHeader } from '../../components/ui';
import useAuth from '../../hooks/useAuth';
import { mockProperties } from '../../data/mockData';

const MOCK_USERS = [
  { id: 1, nombre_completo: 'María González', correo: 'maria@demo.cl', rol: 'propietario', estado: 'activo' },
  { id: 2, nombre_completo: 'Carlos Pérez',   correo: 'carlos@demo.cl', rol: 'propietario', estado: 'pendiente' },
  { id: 3, nombre_completo: 'Ana López',       correo: 'ana@demo.cl',   rol: 'propietario', estado: 'activo' },
];

const StatCard = ({ icon, value, label, color, onClick }) => (
  <Card
    onClick={onClick}
    style={{
      border:       'none',
      borderRadius: 'var(--radius-lg)',
      boxShadow:    'var(--shadow-sm)',
      cursor:       onClick ? 'pointer' : 'default',
      transition:   'box-shadow var(--transition-normal), transform var(--transition-normal)',
      overflow:     'hidden',
    }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
  >
    <div style={{ height: '4px', background: color }} />
    <Card.Body style={{ padding: '1.5rem' }}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{label}</p>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--color-dark)', margin: '0.25rem 0 0' }}>{value}</p>
        </div>
        <span style={{ fontSize: '2.5rem', opacity: 0.8 }}>{icon}</span>
      </div>
    </Card.Body>
  </Card>
);

export default function DashboardAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalPropiedades = mockProperties.length;
  const totalUsuarios    = MOCK_USERS.length;
  const pendientes       = MOCK_USERS.filter(u => u.estado === 'pendiente').length;
  const publicadas       = mockProperties.filter(p => p.estado === 'publicada').length;

  return (
    <div>
      <PageHeader
        title={`Bienvenido, ${user?.nombre_completo?.split(' ')[0] || 'Admin'} 👋`}
        subtitle="Panel de administración — PNK Inmobiliaria"
      />

      {/* Tarjetas de estadísticas */}
      <Row className="g-3 mb-4">
        <Col xs={6} lg={3}>
          <StatCard icon="👥" value={totalUsuarios}   label="Propietarios"    color="var(--color-primary)"  onClick={() => navigate('/admin/usuarios')} />
        </Col>
        <Col xs={6} lg={3}>
          <StatCard icon="⏳" value={pendientes}       label="Cuentas pendientes" color="#f59e0b"            onClick={() => navigate('/admin/usuarios')} />
        </Col>
        <Col xs={6} lg={3}>
          <StatCard icon="🏠" value={totalPropiedades} label="Propiedades"     color="var(--color-accent)"  onClick={() => navigate('/admin/propiedades')} />
        </Col>
        <Col xs={6} lg={3}>
          <StatCard icon="✅" value={publicadas}        label="Publicadas"      color="#10b981" />
        </Col>
      </Row>

      {/* Accesos rápidos */}
      <Row className="g-3">
        <Col md={6}>
          <Card style={{ border: 'none', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <Card.Body style={{ padding: '1.5rem' }}>
              <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1rem' }}>
                👥 Últimos propietarios
              </h5>
              {MOCK_USERS.slice(0, 3).map(u => (
                <div key={u.id} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-sm)' }}>{u.nombre_completo}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>{u.correo}</p>
                  </div>
                  <span style={{
                    fontSize: 'var(--text-xs)', fontWeight: 600, padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    background: u.estado === 'activo' ? '#d1fae5' : '#fef3c7',
                    color: u.estado === 'activo' ? '#065f46' : '#92400e',
                  }}>
                    {u.estado}
                  </span>
                </div>
              ))}
              <Button variant="outline-primary" size="sm" className="mt-3" onClick={() => navigate('/admin/usuarios')}>
                Ver todos →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card style={{ border: 'none', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <Card.Body style={{ padding: '1.5rem' }}>
              <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1rem' }}>
                🏠 Últimas propiedades
              </h5>
              {mockProperties.slice(0, 3).map(p => (
                <div key={p.id} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-sm)' }}>{p.tipo.charAt(0).toUpperCase() + p.tipo.slice(1)} en {p.comuna}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(p.precio_clp)}
                    </p>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: '#d1fae5', color: '#065f46' }}>
                    {p.estado}
                  </span>
                </div>
              ))}
              <Button variant="outline-primary" size="sm" className="mt-3" onClick={() => navigate('/admin/propiedades')}>
                Ver todas →
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
