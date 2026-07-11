**GUÍA DE LABORATORIO  
Unidad 3 - React SPA  
Clase 2: Navegación, rutas y templates del sistema SportClub**

|     |     |
| --- | --- |
| **Asignatura** | Programación Front End |
| **Unidad** | Unidad 3 - Framework basado en JavaScript |
| **Tema** | React Router, layouts y estructura SPA |
| **Modalidad** | Laboratorio práctico |
| **Tipo de trabajo** | Equipos |

# 1\. Objetivo de la actividad

- Instalar y configurar React Router en un proyecto Vite + React.
- Crear una estructura base profesional para el sistema SportClub.
- Implementar navegación entre pantallas sin recargar el navegador.
- Crear templates o layouts genéricos para Usuario, Coach y Administrador.
- Separar rutas, páginas, componentes y layouts para facilitar el trabajo en equipo.

# 2\. Contexto de trabajo

En esta clase no se trabajará todavía con backend ni CRUD. El objetivo es dejar preparado el esqueleto navegable del sistema SportClub. Esta base permitirá que en las siguientes clases cada integrante del equipo pueda desarrollar su módulo sin desordenar la estructura principal del proyecto.

# 3\. ¿Por qué separar el proyecto en carpetas?

React permite crear interfaces a partir de piezas pequeñas. Separar el proyecto ayuda a que el código sea más fácil de mantener, revisar y escalar. En un proyecto en equipo, esta separación evita que todos trabajen sobre el mismo archivo y reduce conflictos al integrar cambios.

|     |     |
| --- | --- |
| **Carpeta** | **Propósito** |
| **components** | Componentes reutilizables como Navbar, Button, Card o Sidebar. |
| **layouts** | Templates base para cada tipo de usuario. Mantienen estructura común como menú y área principal. |
| **pages** | Vistas principales del sistema, por ejemplo Login o Dashboard. |
| **routes** | Archivo central para definir todas las rutas del sistema. |
| **services** | Lugar reservado para conectarse al backend en las siguientes clases. |

# 4\. Instalar React Router

Dentro del proyecto React, abrir la terminal y ejecutar:

npm install react-router-dom

Ó dependiendo de tu gestores de paquetes

pnpm install react-router-dom

React Router permite navegar entre páginas dentro de una SPA. En vez de cargar un archivo HTML distinto por cada página, React cambia el componente que se muestra según la URL.

# 5\. Conceptos clave de React Router

|     |     |     |
| --- | --- | --- |
| **Elemento** | **¿Qué hace?** | **Ejemplo de uso** |
| **BrowserRouter** | Activa el sistema de rutas en la aplicación. Debe envolver las rutas principales. | &lt;BrowserRouter&gt; |
| **Routes** | Agrupa todas las rutas disponibles dentro del sistema. | &lt;Routes&gt; |
| **Route** | Define una ruta específica y el componente que se mostrará. | &lt;Route path="/login" element={<Login /&gt;} /> |
| **Outlet** | Reserva un espacio dentro de un layout para mostrar páginas hijas. | &lt;Outlet /&gt; |

# 6\. Explicación de los elementos

## BrowserRouter

Es el contenedor principal que permite que React Router funcione. Normalmente se utiliza una sola vez, envolviendo todas las rutas de la aplicación.

&lt;BrowserRouter&gt;  
&lt;Routes&gt;  
...  
&lt;/Routes&gt;  
&lt;/BrowserRouter&gt;

## Routes

Agrupa las rutas del sistema. Dentro de Routes se declara cada Route que tendrá la aplicación.

&lt;Routes&gt;  
&lt;Route path="/" element={<Home /&gt;} />  
&lt;/Routes&gt;

## Route

Indica qué componente debe mostrarse cuando el usuario entra a una URL específica.

&lt;Route path="/login" element={<Login /&gt;} />

## Outlet

Se utiliza dentro de un layout para mostrar las páginas hijas. Por ejemplo, UserLayout mantiene el menú del usuario y Outlet muestra el dashboard u otras páginas internas.

&lt;main&gt;  
&lt;Outlet /&gt;  
&lt;/main&gt;

# 7\. Crear estructura del proyecto

Dentro de la carpeta src, crear la siguiente estructura:

src/  
├── components/  
│ └── Navbar.jsx  
│  
├── layouts/  
│ ├── UserLayout.jsx  
│ ├── CoachLayout.jsx  
│ └── AdminLayout.jsx  
│  
├── pages/  
│ ├── Home.jsx  
│ ├── Login.jsx  
│ ├── user/  
│ │ └── UserDashboard.jsx  
│ ├── coach/  
│ │ └── CoachDashboard.jsx  
│ └── admin/  
│ └── AdminDashboard.jsx  
│  
├── routes/  
│ └── AppRoutes.jsx  
│  
├── services/  
├── App.jsx  
└── main.jsx

# 8\. Crear páginas base

## src/pages/Home.jsx

function Home() {  
return (  
&lt;div&gt;  
&lt;h1&gt;Bienvenido a SportClub&lt;/h1&gt;  
&lt;p&gt;Sistema SPA desarrollado con React.&lt;/p&gt;  
&lt;/div&gt;  
)  
}  
<br/>export default Home

## src/pages/Login.jsx

function Login() {  
return (  
&lt;div&gt;  
&lt;h1&gt;Login SportClub&lt;/h1&gt;  
&lt;p&gt;Pantalla de acceso al sistema.&lt;/p&gt;  
&lt;/div&gt;  
)  
}  
<br/>export default Login

## src/pages/user/UserDashboard.jsx

function UserDashboard() {  
return (  
&lt;div&gt;  
&lt;h1&gt;Dashboard Usuario&lt;/h1&gt;  
&lt;p&gt;Mis reservas, clases disponibles y perfil.&lt;/p&gt;  
&lt;/div&gt;  
)  
}  
<br/>export default UserDashboard

## src/pages/coach/CoachDashboard.jsx

function CoachDashboard() {  
return (  
&lt;div&gt;  
&lt;h1&gt;Dashboard Coach&lt;/h1&gt;  
&lt;p&gt;Mis clases, alumnos inscritos y horarios.&lt;/p&gt;  
&lt;/div&gt;  
)  
}  
<br/>export default CoachDashboard

## src/pages/admin/AdminDashboard.jsx

function AdminDashboard() {  
return (  
&lt;div&gt;  
&lt;h1&gt;Dashboard Administrador&lt;/h1&gt;  
&lt;p&gt;Gestión de usuarios, deportes, entrenadores y clases.&lt;/p&gt;  
&lt;/div&gt;  
)  
}  
<br/>export default AdminDashboard

# 9\. Crear layouts por rol

Los layouts permiten mantener una estructura común para cada perfil. Así, cada rol puede tener su propio menú, colores y opciones, sin repetir código en todas las páginas.

## src/layouts/UserLayout.jsx

import { Link, Outlet } from "react-router-dom"  
<br/>function UserLayout() {  
return (  
&lt;div&gt;  
&lt;nav&gt;  
&lt;Link to="/"&gt;Inicio&lt;/Link&gt; |  
&lt;Link to="/user/dashboard"&gt;Dashboard Usuario&lt;/Link&gt;  
&lt;/nav&gt;  
<br/>&lt;main&gt;  
&lt;Outlet /&gt;  
&lt;/main&gt;  
&lt;/div&gt;  
)  
}  
<br/>export default UserLayout

## src/layouts/CoachLayout.jsx

import { Link, Outlet } from "react-router-dom"  
<br/>function CoachLayout() {  
return (  
&lt;div&gt;  
&lt;nav&gt;  
&lt;Link to="/"&gt;Inicio&lt;/Link&gt; |  
&lt;Link to="/coach/dashboard"&gt;Dashboard Coach&lt;/Link&gt;  
&lt;/nav&gt;  
<br/>&lt;main&gt;  
&lt;Outlet /&gt;  
&lt;/main&gt;  
&lt;/div&gt;  
)  
}  
<br/>export default CoachLayout

## src/layouts/AdminLayout.jsx

import { Link, Outlet } from "react-router-dom"  
<br/>function AdminLayout() {  
return (  
&lt;div&gt;  
&lt;nav&gt;  
&lt;Link to="/"&gt;Inicio&lt;/Link&gt; |  
&lt;Link to="/admin/dashboard"&gt;Dashboard Admin&lt;/Link&gt;  
&lt;/nav&gt;  
<br/>&lt;main&gt;  
&lt;Outlet /&gt;  
&lt;/main&gt;  
&lt;/div&gt;  
)  
}  
<br/>export default AdminLayout

# 10\. Crear archivo AppRoutes.jsx

Este archivo centraliza todas las rutas de la aplicación. Separar las rutas en un archivo independiente permite que App.jsx se mantenga simple y que el proyecto sea más ordenado.

## src/routes/AppRoutes.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom"  
<br/>import Home from "../pages/Home"  
import Login from "../pages/Login"  
<br/>import UserDashboard from "../pages/user/UserDashboard"  
import CoachDashboard from "../pages/coach/CoachDashboard"  
import AdminDashboard from "../pages/admin/AdminDashboard"  
<br/>import UserLayout from "../layouts/UserLayout"  
import CoachLayout from "../layouts/CoachLayout"  
import AdminLayout from "../layouts/AdminLayout"  
<br/>function AppRoutes() {  
return (  
&lt;BrowserRouter&gt;  
&lt;Routes&gt;  
&lt;Route path="/" element={<Home /&gt;} />  
&lt;Route path="/login" element={<Login /&gt;} />  
<br/>&lt;Route path="/user" element={<UserLayout /&gt;}>  
&lt;Route path="dashboard" element={<UserDashboard /&gt;} />  
&lt;/Route&gt;  
<br/>&lt;Route path="/coach" element={<CoachLayout /&gt;}>  
&lt;Route path="dashboard" element={<CoachDashboard /&gt;} />  
&lt;/Route&gt;  
<br/>&lt;Route path="/admin" element={<AdminLayout /&gt;}>  
&lt;Route path="dashboard" element={<AdminDashboard /&gt;} />  
&lt;/Route&gt;  
&lt;/Routes&gt;  
&lt;/BrowserRouter&gt;  
)  
}  
<br/>export default AppRoutes

# 11\. Conectar rutas en App.jsx

import AppRoutes from "./routes/AppRoutes"  
<br/>function App() {  
return &lt;AppRoutes /&gt;  
}  
<br/>export default App

# 12\. URLs de prueba

- http://localhost:5173/
- http://localhost:5173/login
- http://localhost:5173/user/dashboard
- http://localhost:5173/coach/dashboard
- http://localhost:5173/admin/dashboard

# Preguntas de reflexión

1.  ¿Por qué es útil separar rutas, páginas y layouts?
2.  ¿Qué problema resuelve React Router?
3.  ¿Qué función cumple Outlet dentro de un layout?
4.  ¿Por qué esta estructura ayuda al trabajo en equipo?
5.  ¿Qué diferencia existe entre navegar en una SPA y en un sitio tradicional?

# 15\. Conclusión

En esta actividad aprendiste a construir el esqueleto navegable de una SPA con React Router. La separación entre rutas, páginas, componentes y layouts permite trabajar de forma ordenada y profesional. Esta estructura será la base para conectar el backend y desarrollar los CRUD del sistema SportClub en las próximas clases.