# Guía de Desarrollo - Fase 1: Estructura y Enrutamiento (Portal Inmobiliario)

Bienvenido a la primera fase de desarrollo de tu Portal Inmobiliario. Esta guía define cómo organizaremos el trabajo para manejar correctamente los distintos roles (Público, Administrador, Propietario).

---

## 1. Evaluación de tu Estructura Actual

He revisado tu carpeta `src` y **el trabajo es excelente**. Tienes la base perfecta para una aplicación escalable. 

Tienes: `assets`, `components`, `context`, `hooks`, `layouts`, `pages`, `routes`, `services` y `API`.

**Recomendación sobre `API` vs `services`:**
Como tienes ambas carpetas, te sugiero esta convención para no duplicar responsabilidades:
*   **`API/`**: Úsala para la configuración "cruda" de conexión (por ejemplo, si usas Axios, aquí iría el archivo `axiosConfig.js` con la URL base de tu backend y los interceptores de tokens). Es decir, la *herramienta* de conexión.
*   **`services/`**: Úsala para la lógica de negocio. Aquí crearás archivos como `propertyService.js` o `authService.js`, los cuales usarán la herramienta de la carpeta `API` para pedir cosas específicas (ej. `obtenerTodasLasPropiedades()`).

---

## 2. Metodología de Trabajo ("Outside-In")

Para una aplicación con múltiples roles, no empezaremos diseñando botones bonitos ni formularios complejos. Usaremos una metodología de "Afuera hacia Adentro" (**Outside-In**).

Piensa que estamos construyendo un edificio:
1.  **Los Cimientos y Pasillos (Enrutamiento y Layouts):** Primero definimos qué páginas existirán (URLs) y cómo es la estructura visual base de cada zona (Pública vs Panel de Control).
2.  **Las Cerraduras y Llaves (Autenticación y Contexto):** Luego, creamos las reglas de quién puede entrar a qué pasillo (Rutas protegidas).
3.  **La Decoración de las Habitaciones (Páginas y Componentes):** Al final, construimos el diseño final, los formularios, las tarjetas de casas, etc.

---

## 3. Paso a Paso - Fase 1 (El Esqueleto)

Tu objetivo en esta fase no es que la app se vea bonita, sino **que la navegación fluya correctamente**.

### Paso 1.1: Configuración de Rutas Base
*   **Acción:** Instalar el gestor de rutas ejecutando en tu terminal: `npm install react-router-dom`
*   **Objetivo:** Centralizar toda la navegación.

### Paso 1.2: Construir los Layouts (Plantillas)
*   **Acción:** En la carpeta `src/layouts/`, crea tres archivos `.jsx`:
    1.  `PublicLayout.jsx`: Contendrá un Navbar (Público) arriba, y un Footer abajo. En el medio irá el contenido dinámico.
    2.  `AdminLayout.jsx`: Contendrá un menú lateral (Sidebar) con opciones como "Usuarios" y "Propiedades".
    3.  `OwnerLayout.jsx`: Contendrá un menú lateral con opciones como "Mis Propiedades" y "Subir Propiedad".
*   **Regla de Oro:** Recuerda que estos archivos llevan extensión `.jsx` porque renderizan HTML.

### Paso 1.3: Crear Páginas "Esqueleto"
*   **Acción:** Dentro de `src/pages/`, crea subcarpetas para organizar mejor: `public`, `admin`, `owner`.
*   **Objetivo:** Crea archivos muy básicos (ej. `src/pages/public/Home.jsx`) que por ahora solo retornen un `<h1 className="text-2xl">Página de Inicio</h1>`. 
*   **Archivos mínimos a crear:** `Home`, `Login`, `DashboardAdmin`, `DashboardOwner`.

### Paso 1.4: Conectar Todo en el Enrutador
*   **Acción:** En `src/routes/`, crea un archivo `AppRouter.jsx`.
*   **Objetivo:** Escribir la lógica para que, por ejemplo, si alguien visita `tusitio.com/admin`, React cargue el `AdminLayout` y dentro de él, el `DashboardAdmin`.

---

## 4. Próximos Pasos (Fase 2)

Una vez que tengas estas páginas conectadas y puedas navegar entre ellas cambiando la URL, entraremos a la **Fase 2**:
*   Crearemos el `AuthContext` en tu carpeta `context`.
*   Simularemos un Login.
*   Crearemos "Rutas Protegidas" para que, si intentas entrar a `/admin` sin haber iniciado sesión como Administrador, el sistema te redirija al Login automáticamente.

¡Avísame si quieres que procedamos con el Paso 1.1 y 1.2 instalando react-router y creando los Layouts!
