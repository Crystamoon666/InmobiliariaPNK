# PROJECT_CONTEXT.md — Inmobiliaria PNK

> Copia y pega este archivo al inicio de cada sesión nueva con el agente para restaurar el contexto completo del proyecto.

---

## Descripción del Proyecto

**"Inmobiliaria PNK"** — Plataforma web inmobiliaria para la Región de Coquimbo (Chile).
Proyecto de evaluación universitaria (Tercera y Cuarta entrega).

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite, React Router DOM, React-Bootstrap, SweetAlert2, Axios, @react-google-maps/api |
| Backend | Node.js + Express + MySQL, JWT (Authorization: Bearer), bcrypt, multer |
| Despliegue | AWS EC2 (Linux + Apache), repositorio en GitHub |
| API externa | Google Maps API (para ubicación de propiedades) |

> **Nota EC2:** se usa **Apache** (no Nginx). El proxy inverso se configura con `mod_proxy` de Apache.

---

## Repositorio

```
https://github.com/Crystamoon666/InmobiliariaPNK.git
```

---

## Roles de usuario

| Rol | Descripción |
|---|---|
| `admin` | No se puede eliminar. Gestiona usuarios y propiedades de toda la plataforma. |
| `propietario` | Se autoregistra. Queda en estado **pendiente** hasta que el admin activa su cuenta. Solo gestiona sus propias propiedades. |

---

## Modelo de datos principal

### Tabla `usuarios`
| Campo | Tipo | Notas |
|---|---|---|
| id | INT PK | |
| rut | VARCHAR | Formato XX.XXX.XXX-X, único |
| nombre_completo | VARCHAR | |
| fecha_nacimiento | DATE | |
| correo | VARCHAR | único |
| password_hash | VARCHAR | bcrypt |
| sexo | VARCHAR | |
| telefono | VARCHAR | 9 dígitos |
| rol | ENUM | admin, propietario |
| estado | ENUM | pendiente, activo, inactivo |
| n_registro_bienes_raices | VARCHAR | |

### Tabla `propiedades`
| Campo | Tipo | Notas |
|---|---|---|
| id | INT PK | |
| propietario_id | INT FK | → usuarios |
| tipo | ENUM | casa, departamento, terreno |
| descripcion | TEXT | |
| banos | INT | |
| dormitorios | INT | |
| area_terreno | DECIMAL | |
| area_construida | DECIMAL | |
| precio_clp | DECIMAL | |
| precio_uf | DECIMAL | calculado automáticamente desde precio_clp |
| fecha_publicacion | DATE | |
| solicitar_visita | BOOLEAN | |
| bodega, estacionamiento, logia, cocina_amoblada, antejardin, patio_trasero, piscina | BOOLEAN | |
| provincia, comuna, sector | VARCHAR | Región de Coquimbo |
| lat, lng | DECIMAL | Google Maps |
| estado | ENUM | publicada, pausada, eliminada |

### Tabla `fotografias`
| Campo | Tipo | Notas |
|---|---|---|
| id | INT PK | |
| propiedad_id | INT FK | → propiedades |
| url | VARCHAR | |
| es_principal | BOOLEAN | |
| orden | INT | |

---

## Contrato de API (backend Node/Express)

```
POST   /api/auth/register          Registro público propietario (queda "pendiente")
POST   /api/auth/login             Retorna { token, user }
GET    /api/auth/me                Datos del usuario autenticado

GET    /api/users                  Listar usuarios (admin)
PUT    /api/users/:id              Editar usuario
PATCH  /api/users/:id/estado       Activar/desactivar cuenta
DELETE /api/users/:id              Admin no puede eliminarse a sí mismo

GET    /api/propiedades            Listado público (?provincia=&comuna=&sector=&tipo=)
GET    /api/propiedades/mias       Solo las del propietario autenticado
GET    /api/propiedades/:id        Detalle
POST   /api/propiedades            Crear
PUT    /api/propiedades/:id        Editar
DELETE /api/propiedades/:id        Eliminar / cambiar estado

POST   /api/propiedades/:id/fotos  Subir fotos (multipart, máx 10)
DELETE /api/fotos/:id              Eliminar foto
PATCH  /api/fotos/:id/principal    Marcar imagen principal
```

Todas las rutas privadas usan: `Authorization: Bearer <token>`

---

## Estructura de carpetas (Frontend)

```
InmobiliariaPNK/src/
├── API/axiosConfig.js              ← instancia axios con interceptor de token
├── components/
│   ├── map/MapView.jsx             ← Google Maps embebido
│   ├── properties/
│   │   ├── ImageGallery.jsx        ← galería 1-10 fotos
│   │   ├── PropertyCard.jsx        ← tarjeta en listado público
│   │   └── PropertyFormModal.jsx   ← CRUD propiedades (modal)
│   ├── search/SearchFilters.jsx    ← filtros provincia/comuna/sector
│   └── users/UserFormModal.jsx     ← CRUD usuarios (solo admin)
├── context/AuthContext.jsx         ← estado global de sesión
├── hooks/useAuth.js                ← consume AuthContext
├── layouts/
│   ├── AdminLayout.jsx
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── OwnerLayout.jsx
│   ├── PublicLayout.jsx
│   └── Sidebar.jsx
├── pages/
│   ├── admin/
│   │   ├── AdministrarpPropiedades.jsx
│   │   ├── AdministrarUsers.jsx
│   │   ├── DashboardAdmin.jsx
│   │   └── Settings.jsx
│   ├── owner/
│   │   ├── DashboardPropietario.jsx
│   │   ├── EditarPropiedades.jsx
│   │   ├── MisPropiedades.jsx
│   │   └── PublicarPropiedad.jsx
│   └── public/
│       ├── About.jsx
│       ├── Contact.jsx
│       ├── Home.jsx
│       ├── Login.jsx
│       ├── PropiedadesDetalle.jsx
│       ├── PropiedadesLista.jsx
│       └── Registro.jsx
├── routes/
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx          ← redirige a /login si no hay sesión
│   └── RoleRoute.jsx               ← redirige si el rol no coincide
└── services/
    ├── authService.js
    ├── fotoService.js
    ├── propiedadService.js
    └── userService.js
```

---

## Patrón de código (Guías de clase)

- **services/**: separan las llamadas a la API del componente (patrón Guía 4)
- **Formularios**: React-Bootstrap + Modal (patrón Guía 4)
- **Alertas y confirmaciones**: SweetAlert2 (patrón Guía 4)
- **Rutas protegidas**: ProtectedRoute + RoleRoute (patrón Guía 3)
- **Autenticación**: JWT con `Authorization: Bearer` (patrón Guía 3)

---

## Plan de fases

| Fase | Descripción | Estado |
|---|---|---|
| 0 | Repositorio Git + push a GitHub | ✅ Completa |
| 1 | Scaffolding frontend (archivos placeholder) | ✅ Completa |
| 2 | Identidad visual (logo, paleta, tipografía, theme.css) | ⏳ Siguiente |
| 3.1 | AuthContext, ProtectedRoute, RoleRoute, axiosConfig | 🔲 Pendiente |
| 3.2 | Layouts con React-Bootstrap | 🔲 Pendiente |
| 3.3 | Páginas públicas (Home, Login, Registro, Lista, Detalle) | 🔲 Pendiente |
| 3.4 | Dashboard Admin (CRUD usuarios + propiedades) | 🔲 Pendiente |
| 3.5 | Dashboard Propietario (mis propiedades) | 🔲 Pendiente |
| 4 | Backend Node.js + Express + MySQL | 🔲 Pendiente |
| 5 | Conexión frontend ↔ backend (reemplazar mocks) | 🔲 Pendiente |
| 6 | Despliegue en AWS EC2 + Apache | 🔲 Pendiente |

---

## Cómo usar este archivo con el agente

Al inicio de cada sesión nueva, escribe:

```
Lee PROJECT_CONTEXT.md antes de continuar.
Estamos en la Fase [N] del plan: [describe la tarea puntual].
```
