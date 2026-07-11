# Esqueleto de Archivos Faltantes - Portal Inmobiliario

Basado en la estructura que ya has creado (layouts base, páginas de inicio y dashboards, y enrutador), he elaborado una lista de los **archivos clave que faltan por crear** para tener el esqueleto completo de un portal inmobiliario funcional.

Por ahora, solo necesitas crear los archivos con un contenido mínimo (un `<h1>` o una exportación vacía), para luego ir rellenándolos según el contexto y las necesidades de tu proyecto.

---

## 1. Páginas (`src/pages/`)

Estas son las vistas principales a las que navegarán los diferentes tipos de usuarios.

### 🌐 Área Pública (`src/pages/public/`)
Ya tienes `Home.jsx` y `Login.jsx`. Te sugiero agregar:
- [ ] `PropertiesList.jsx`: Página de catálogo o resultados de búsqueda de propiedades.
- [ ] `PropertyDetails.jsx`: Página para ver toda la información de una propiedad específica (fotos, descripción, mapa).
- [ ] `Register.jsx`: Página de registro para nuevos usuarios (clientes o propietarios).
- [ ] `About.jsx`: (Opcional) Página de "Nosotros" o "Quiénes somos".
- [ ] `Contact.jsx`: (Opcional) Página de contacto general.

### 🛠️ Área de Administrador (`src/pages/admin/`)
Ya tienes `DashboardAdmin.jsx`. Te sugiero agregar:
- [ ] `ManageUsers.jsx`: Tabla o lista para ver, editar o suspender usuarios registrados.
- [ ] `ManageProperties.jsx`: Lista de todas las propiedades del portal para aprobarlas, destacarlas o eliminarlas.
- [ ] `Settings.jsx`: (Opcional) Configuraciones globales del portal.

### 🔑 Área de Propietario (`src/pages/owner/`)
Ya tienes `DashboardPropietario.jsx`. Te sugiero agregar:
- [ ] `MyProperties.jsx`: Lista de las propiedades que ha publicado el propietario.
- [ ] `AddProperty.jsx`: Formulario para publicar una nueva propiedad.
- [ ] `EditProperty.jsx`: Formulario para modificar una propiedad existente.

---

## 2. Componentes Reutilizables (`src/components/`)

Estos son bloques de construcción visuales que usarás dentro de tus layouts y páginas.

### 📐 Componentes de Layout
- [ ] `Navbar.jsx`: Barra de navegación superior (para el `PublicLayout`).
- [ ] `Footer.jsx`: Pie de página (para el `PublicLayout`).
- [ ] `Sidebar.jsx`: Menú de navegación lateral (para `AdminLayout` y `OwnerLayout`).

### 🧩 Componentes de Interfaz (UI)
- [ ] `PropertyCard.jsx`: La "tarjeta" que muestra la foto, precio y resumen de una propiedad en las listas.
- [ ] `SearchBar.jsx`: El componente del buscador (con filtros por precio, ubicación, etc.) que irá en el Home y PropertiesList.
- [ ] `ProtectedRoute.jsx`: (¡Muy importante!) Un componente "envoltorio" que verifica si el usuario tiene permiso para entrar a una ruta antes de mostrarla.

---

## 3. Contexto / Estado Global (`src/context/`)

Aquí guardaremos información que necesita ser accesible desde cualquier parte de la aplicación, principalmente la sesión.

- [ ] `AuthContext.jsx`: Guardará el estado del usuario logueado (ej. su token, su ID y su rol: public, admin o owner).

---

## 4. Conexión con Backend (`src/services/` y `src/API/`)

Para mantener el código ordenado, separaremos la configuración de la conexión (API) de las funciones específicas (servicios).

### ⚙️ Configuración (API)
- [ ] `src/API/axiosConfig.js` (o `apiClient.js`): Aquí configurarás la URL base de tu backend y los "interceptores" (por ejemplo, para enviar el token de seguridad en cada petición automáticamente).

### 📡 Lógica de Negocio (Servicios)
- [ ] `src/services/authService.js`: Funciones para `login()`, `register()`, `logout()`.
- [ ] `src/services/propertyService.js`: Funciones para `getProperties()`, `getPropertyById()`, `createProperty()`, etc.
- [ ] `src/services/userService.js`: Funciones para `getUserProfile()`, `updateUser()`, etc.

---

##  Próximo Paso Recomendado
Te sugiero empezar creando los **Componentes de Layout** (`Navbar`, `Footer`, `Sidebar`) y las **Páginas vacías**, para luego conectarlos en tu `AppRoutes.jsx` y tener toda la navegación lista antes de meterte con la lógica de base de datos o estilos complejos.
