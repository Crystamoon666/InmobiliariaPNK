**GUÍA DE LABORATORIO  
Clase 3: Login, sesión, rutas protegidas y roles  
**Proyecto SportClub - React SPA

|     |     |
| --- | --- |
| **Asignatura** | Programación Front End |
| **Unidad** | Unidad 3 - Framework basado en JavaScript |
| **Tema** | React-Bootstrap, autenticación, sesión y control de acceso |
| **Modalidad** | Laboratorio práctico |
| **Tipo de trabajo** | Equipos con evaluación individual |

# 1\. Objetivo de la actividad

- Implementar un login funcional en React utilizando React-Bootstrap.
- Guardar token y datos del usuario en localStorage.
- Proteger páginas privadas mediante ProtectedRoute.
- Validar acceso según rol mediante RoleRoute.
- Separar responsabilidades usando servicios, rutas, layouts y páginas.

**Nota docente:** Esta clase no busca construir todo el sistema. Busca dejar una base segura y ordenada para que después cada equipo pueda conectar sus CRUD al backend.

# 2\. Requisitos previos

- Proyecto React creado con Vite.
- React Router configurado.
- Login y registro migrados desde el proyecto HTML/CSS/JS anterior.
- Backend SportClub disponible o endpoints simulados temporalmente.

# 3\. Instalación de React-Bootstrap

Ejecutar dentro del proyecto React:

npm install react-bootstrap bootstrap  
<br/>\# o si el equipo utiliza pnpm:  
pnpm install react-bootstrap bootstrap

Luego importar los estilos de Bootstrap en src/main.jsx:

|     |
| --- |
| import React from "react"  <br>import ReactDOM from "react-dom/client"  <br>import App from "./App.jsx"  <br><br/>import "bootstrap/dist/css/bootstrap.min.css"  <br><br/>ReactDOM.createRoot(document.getElementById("root")).render(  <br>&lt;React.StrictMode&gt;  <br>&lt;App /&gt;  <br>&lt;/React.StrictMode&gt;  <br>) |
| **Nota docente:** React-Bootstrap entrega componentes React, pero los estilos visuales siguen viniendo desde bootstrap/dist/css/bootstrap.min.css. |

# 4\. Diferencia entre Bootstrap tradicional y React-Bootstrap

|     |     |
| --- | --- |
| **Bootstrap tradicional** | **React-Bootstrap** |
| Usa className="btn btn-primary" | Usa &lt;Button variant="primary"&gt; |
| Depende de clases CSS | Depende de componentes React |
| Para interacción puede usar JS de Bootstrap | Usa estado, props y eventos de React |
| Más cercano a HTML/CSS | Más integrado al flujo React |

# 5\. Estructura recomendada del proyecto

src/  
├── components/  
├── layouts/  
│ ├── UserLayout.jsx  
│ ├── CoachLayout.jsx  
│ └── AdminLayout.jsx  
├── pages/  
│ ├── Login.jsx  
│ ├── Unauthorized.jsx  
│ ├── user/  
│ │ └── UserDashboard.jsx  
│ ├── coach/  
│ │ └── CoachDashboard.jsx  
│ └── admin/  
│ └── AdminDashboard.jsx  
├── routes/  
│ ├── AppRoutes.jsx  
│ ├── ProtectedRoute.jsx  
│ └── RoleRoute.jsx  
├── services/  
│ └── authService.js  
├── App.jsx  
└── main.jsx

La separación de carpetas permite que cada archivo tenga una responsabilidad clara:

- pages: contiene las pantallas principales.
- layouts: contiene plantillas por rol o zona del sistema.
- routes: centraliza la navegación y protección de páginas.
- services: centraliza comunicación con el backend.
- components: contiene piezas reutilizables de interfaz.

# 6\. Crear el servicio de autenticación: authService.js

Crear el archivo:

src/services/authService.js

Este archivo separa la lógica de autenticación del diseño del Login. Así evitamos mezclar formularios con llamadas al backend.

**Nota docente:** La URL del backend debe ajustarse al endpoint real usado por el curso. El backend debe responder idealmente con token y user.

# 7\. Formato esperado de respuesta del backend

Para que la validación funcione, se espera una respuesta:

{

&nbsp;   "ok": true,

&nbsp;   "message": "Login exitoso.",

&nbsp;   "data": {

&nbsp;       "token": "jwt_generado_por_backend",

&nbsp;       "user": {

&nbsp;           "id": 5,

&nbsp;           "full_name": "Demo Admin 1",

&nbsp;           "email": "admin1@demo.cl",

&nbsp;           "role": "admin"

&nbsp;       }

&nbsp;   }

}  

Roles para SportClub:

- user
- coach
- admin

# 8\. Crear ProtectedRoute.jsx

Crear el archivo:

src/routes/ProtectedRoute.jsx

Este componente evita que una persona sin sesión pueda ingresar a páginas privadas.

## Explicación de ProtectedRoute

- **children** representa el componente o layout que queremos proteger.
- **isAuthenticated** revisa si existe token guardado.
- **Navigate** redirige al login si el usuario no ha iniciado sesión.
- **replace** evita que el usuario vuelva con el botón atrás a la ruta bloqueada.

# 9\. Crear RoleRoute.jsx

Crear el archivo:

src/routes/RoleRoute.jsx

Este componente valida que el usuario tenga el rol correcto antes de permitir el acceso.

## Explicación de RoleRoute

- allowedRoles es una lista de roles permitidos.
- Si no existe sesión, redirige al login.
- Si el rol del usuario no está permitido, redirige a Unauthorized.
- Permite proteger rutas de admin, coach y user de forma independiente.

# 10\. Crear página Unauthorized.jsx

Crear el archivo:

|     |
| --- |
| src/pages/Unauthorized.jsx |
|     |

# 11\. Ejemplo de Login.jsx con React-Bootstrap

Este ejemplo usa Form, Button, Alert y Spinner. Además, guarda token y usuario al iniciar sesión.

|     |
| --- |
| import { useState } from "react"<br><br>import { useNavigate } from "react-router-dom"<br><br>import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap"<br><br>import { loginUser, saveSession } from "../services/authService"<br><br>function Login() {<br><br>&nbsp;   const navigate = useNavigate()<br><br>&nbsp;   const \[email, setEmail\] = useState("")<br><br>&nbsp;   const \[password, setPassword\] = useState("")<br><br>&nbsp;   const \[error, setError\] = useState("")<br><br>&nbsp;   const \[loading, setLoading\] = useState(false)<br><br>&nbsp;   const handleSubmit = async (event) => {<br><br>&nbsp;       event.preventDefault()<br><br>&nbsp;       setError("")<br><br>&nbsp;       setLoading(true)<br><br>&nbsp;       try {<br><br>&nbsp;           const data = await loginUser({ email, password })<br><br>&nbsp;           saveSession(data.data.token, data.data.user)<br><br>&nbsp;           if (data.data.user.role === "admin") {<br><br>&nbsp;               navigate("/admin/dashboard")<br><br>&nbsp;           } else if (data.data.user.role === "coach") {<br><br>&nbsp;               navigate("/coach/dashboard")<br><br>&nbsp;           } else {<br><br>&nbsp;               navigate("/user/dashboard")<br><br>&nbsp;           }<br><br>&nbsp;       } catch (error) {<br><br>&nbsp;           setError(error.message)<br><br>&nbsp;       } finally {<br><br>&nbsp;           setLoading(false)<br><br>&nbsp;       }<br><br>&nbsp;   }<br><br>&nbsp;   return (<br><br>&nbsp;       &lt;Container className="d-flex justify-content-center align-items-center vh-100"&gt;<br><br>&nbsp;           &lt;Card style={{ width: "24rem" }} className="shadow"&gt;<br><br>&nbsp;               &lt;Card.Body&gt;<br><br>&nbsp;                   &lt;Card.Title className="text-center mb-4"&gt;SportClub Login&lt;/Card.Title&gt;<br><br>&nbsp;                   {error && &lt;Alert variant="danger"&gt;{error}&lt;/Alert&gt;}<br><br>&nbsp;                   &lt;Form onSubmit={handleSubmit}&gt;<br><br>&nbsp;                       &lt;Form.Group className="mb-3"&gt;<br><br>&nbsp;                           &lt;Form.Label&gt;Correo&lt;/Form.Label&gt;<br><br>&nbsp;                           <Form.Control<br><br>&nbsp;                               type="email"<br><br>&nbsp;                               placeholder="Ingrese su correo"<br><br>&nbsp;                               value={email}<br><br>&nbsp;                               onChange={(e) => setEmail(e.target.value)}<br><br>&nbsp;                           /><br><br>&nbsp;                       &lt;/Form.Group&gt;<br><br>&nbsp;                       &lt;Form.Group className="mb-3"&gt;<br><br>&nbsp;                           &lt;Form.Label&gt;Contraseña&lt;/Form.Label&gt;<br><br>&nbsp;                           <Form.Control<br><br>&nbsp;                               type="password"<br><br>&nbsp;                               placeholder="Ingrese su contraseña"<br><br>&nbsp;                               value={password}<br><br>&nbsp;                               onChange={(e) => setPassword(e.target.value)}<br><br>&nbsp;                           /><br><br>&nbsp;                       &lt;/Form.Group&gt;<br><br>&nbsp;                       &lt;Button type="submit" variant="primary" className="w-100" disabled={loading}&gt;<br><br>&nbsp;                           {loading ? (<br><br>&nbsp;                               <><br><br>&nbsp;                                   &lt;Spinner size="sm" animation="border" /&gt; Ingresando...<br><br>&nbsp;                               &lt;/&gt;<br><br>&nbsp;                           ) : (<br><br>&nbsp;                               "Ingresar"<br><br>&nbsp;                           )}<br><br>&nbsp;                       &lt;/Button&gt;<br><br>&nbsp;                   &lt;/Form&gt;<br><br>&nbsp;               &lt;/Card.Body&gt;<br><br>&nbsp;           &lt;/Card&gt;<br><br>&nbsp;       &lt;/Container&gt;<br><br>&nbsp;   )<br><br>}<br><br>export default Login |
| **Nota docente:** Este login es una base pedagógica. Luego se puede mejorar con validaciones, modal de recuperación y mensajes más completos. |

# 12\. Usar ProtectedRoute y RoleRoute en AppRoutes.jsx

Ejemplo completo de configuración de rutas:

## Explicación del ejemplo

- RoleRoute se usa cuando además de estar logueado se debe validar un rol.
- ProtectedRoute se usa cuando cualquier usuario logueado puede acceder.
- Las rutas /user, /coach y /admin quedan protegidas según su rol.
- Las rutas hijas se muestran dentro del layout usando Outlet.

# 13\. Ejemplo de Layout con cierre de sesión

Ejemplo para AdminLayout.jsx:

import { Link, Outlet, useNavigate } from "react-router-dom"  
import { Button, Container, Nav, Navbar } from "react-bootstrap"  
import { logout, getUser } from "../services/authService"  
<br/>function AdminLayout() {  
const navigate = useNavigate()  
const user = getUser()  
<br/>const handleLogout = () => {  
logout()  
navigate("/login")  
}  
<br/>return (  
<>  
&lt;Navbar bg="dark" variant="dark" expand="lg"&gt;  
&lt;Container&gt;  
&lt;Navbar.Brand&gt;SportClub Admin&lt;/Navbar.Brand&gt;  
<br/>&lt;Nav className="me-auto"&gt;  
&lt;Link className="nav-link" to="/admin/dashboard"&gt;Dashboard&lt;/Link&gt;  
&lt;/Nav&gt;  
<br/>&lt;span className="text-white me-3"&gt;  
{user?.name}  
&lt;/span&gt;  
<br/>&lt;Button variant="outline-light" onClick={handleLogout}&gt;  
Cerrar sesión  
&lt;/Button&gt;  
&lt;/Container&gt;  
&lt;/Navbar&gt;  
<br/>&lt;Container className="mt-4"&gt;  
&lt;Outlet /&gt;  
&lt;/Container&gt;  
&lt;/&gt;  
)  
}  
<br/>export default AdminLayout

# 14\. Pruebas que debe realizar el equipo

|     |     |
| --- | --- |
| **Prueba** | **Resultado esperado** |
| Sin login | Ingresar a /admin/dashboard. Debe redirigir a /login. |
| Usuario con rol user | Intentar ingresar a /admin/dashboard. Debe redirigir a /unauthorized. |
| Usuario con rol admin | Ingresar a /admin/dashboard. Debe permitir acceso. |
| Refrescar navegador | La sesión debe mantenerse si existe token en localStorage. |
| Cerrar sesión | Debe eliminar token y usuario, y volver al login. |

# 15\. Actividad de la clase

- Instalar React-Bootstrap.
- Crear authService.js.
- Crear ProtectedRoute.jsx.
- Crear RoleRoute.jsx.
- Crear Unauthorized.jsx.
- Actualizar AppRoutes.jsx.
- Probar acceso con roles user, coach y admin.
- Agregar botón de cerrar sesión en el layout correspondiente.

# 16\. Trabajo para la próxima clase

- Login funcionando con backend o datos simulados temporalmente.
- Rutas protegidas funcionando.
- Roles user, coach y admin validados.
- Diseño mejorado con React-Bootstrap.
- Estructura limpia y separada por carpetas.

# 17\. Conclusión

En esta clase se implementó una base de autenticación para SportClub. El uso de servicios, rutas protegidas y validación por rol permite que la SPA se comporte como una aplicación real. En las próximas clases esta estructura se utilizará para integrar los CRUD del backend.