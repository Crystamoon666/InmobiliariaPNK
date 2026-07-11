**GUÍA DE LABORATORIO  
Unidad 3 - Introducción a React SPA**

|     |     |
| --- | --- |
| **Asignatura** | Programación Front End |
| **Unidad** | Unidad 3 - Framework basado en JavaScript |
| **Actividad** | Mi primer componente React consumiendo una API |
| **Modalidad** | Laboratorio práctico |
| **Tipo de trabajo** | Individual |
| **Duración sugerida** | 90 a 120 minutos |

# 1\. Objetivo de la actividad

- Crear un proyecto React utilizando Vite.
- Comprender la estructura inicial de un proyecto React.
- Crear y utilizar un componente reutilizable.
- Consumir datos desde una API usando fetch.
- Utilizar useState para almacenar información en el componente.
- Utilizar useEffect para ejecutar la carga de datos al iniciar la aplicación.
- Mostrar datos dinámicos en pantalla mediante map().

# 2\. Contexto de la actividad

En esta primera experiencia con React construiremos una pequeña aplicación que mostrará usuarios obtenidos desde una API pública. La finalidad es experimentar con React, comprender la estructura del proyecto y visualizar cómo una aplicación moderna obtiene datos externos y los transforma en componentes reutilizables.

**Nota de explicación:** En esta actividad no se exige repositorio GitHub. El foco es experimentar, ejecutar el proyecto localmente y comprender los conceptos base de React.

# 3\. API a utilizar

La aplicación consumirá datos desde la siguiente API pública:

https://fake-json-api.mock.beeceptor.com/users/

Ejemplo de dato recibido desde la API:

{  
"id": 1,  
"name": "Angie Nader",  
"company": "Bruen, Weissnat and Blanda",  
"username": "Toney.Kiehn5",  
"email": "Sabina50@gmail.com",  
"address": "59597 Esta Park",  
"zip": "85775",  
"state": "South Dakota",  
"country": "Norfolk Island",  
"phone": "963-751-4484 x6771",  
"photo": "https://json-server.dev/ai-profiles/27.png"  
}

# 4\. Parte 1 - Crear el proyecto React con Vite

Abrir una terminal en la carpeta donde se desea crear el proyecto y ejecutar:

npm create vite@latest

Seleccionar las siguientes opciones:

Framework: React  
Variant: JavaScript

Ingresar a la carpeta del proyecto:

cd nombre-del-proyecto

Instalar las dependencias:

npm install

Ejecutar el proyecto:

npm run dev

**Nota de explicación:** Al ejecutar npm run dev, Vite levanta un servidor de desarrollo local. La aplicación se abre en el navegador usando localhost y normalmente el puerto 5173: http://localhost:5173

# 5\. Parte 2 - Estructura inicial del proyecto

La estructura base creada por Vite se verá similar a la siguiente:

mi-proyecto-react/  
├── node_modules/  
├── public/  
├── src/  
│ ├── assets/  
│ ├── App.css  
│ ├── App.jsx  
│ ├── index.css  
│ └── main.jsx  
├── package.json  
└── vite.config.js

|     |     |
| --- | --- |
| **Archivo / Carpeta** | **Función** |
| node_modules | Dependencias instaladas por npm. No se modifica manualmente. |
| public | Archivos públicos del proyecto. |
| src | Carpeta principal donde se desarrolla la aplicación React. |
| main.jsx | Punto de entrada que conecta React con el HTML. |
| App.jsx | Componente principal de la aplicación. |
| App.css | Archivo de estilos del componente principal. |
| package.json | Contiene scripts, dependencias y configuración del proyecto. |
| vite.config.js | Configuración de Vite. |

# 6\. Parte 3 - Carpetas que crearemos

Dentro de la carpeta src crear la siguiente estructura:

src/  
├── components/  
├── pages/  
└── services/

|     |     |
| --- | --- |
| **Carpeta** | **Uso en el proyecto** |
| components | Componentes reutilizables, por ejemplo UserCard.jsx. |
| pages | Vistas principales de la aplicación. En esta actividad puede quedar vacía. |
| services | Funciones para conectarse con APIs o backend. En esta actividad lo usaremos como mejora opcional. |

# 7\. Parte 4 - Limpiar el proyecto inicial

Antes de comenzar, se recomienda limpiar el contenido de App.jsx y App.css para trabajar desde cero.

# 8\. Parte 5 - Crear el componente reutilizable

Crear el archivo:

src/components/UserCard.jsx

Agregar el siguiente código:

**Nota de explicación:** Este componente recibe un objeto llamado user mediante props. Cada vez que App.jsx le entregue un usuario, el componente mostrará sus datos en formato de tarjeta.

# 9\. Concepto clave - Props

Las props permiten enviar información desde un componente padre hacia un componente hijo.

&lt;UserCard user={user} /&gt;

En este caso, App.jsx enviará un usuario y UserCard.jsx lo recibirá para mostrarlo.

# 10\. Parte 6 - Consumir la API desde App.jsx

Abrir el archivo:

src/App.jsx

Reemplazar su contenido por el siguiente código:

# 11\. Concepto clave - useState

useState es un hook de React que permite guardar información dentro de un componente.

const \[users, setUsers\] = useState(\[\])

En este ejemplo:

- users almacena la lista de usuarios.
- setUsers permite actualizar esa lista.
- Cuando setUsers cambia la información, React vuelve a renderizar la interfaz automáticamente.

# 12\. Concepto clave - useEffect

useEffect permite ejecutar código automáticamente cuando ocurre un momento específico del ciclo de vida del componente.

useEffect(() => {  
// Código que se ejecuta al iniciar el componente  
}, \[\])

El arreglo vacío \[\] indica que el código se ejecutará una sola vez, cuando la aplicación cargue por primera vez.

# 13\. Concepto clave - fetch

fetch permite realizar solicitudes HTTP desde el navegador hacia una API.

fetch("https://fake-json-api.mock.beeceptor.com/users/")  
.then((response) => response.json())  
.then((data) => setUsers(data))

# 14\. Concepto clave - map()

map() permite recorrer un arreglo y transformar cada elemento en un componente React.

{users.map((user) => (  
&lt;UserCard key={user.id} user={user} /&gt;  
))}

**Nota de explicación:** La propiedad key ayuda a React a identificar cada elemento de la lista. En este caso usamos user.id porque cada usuario tiene un identificador único.

# 15\. Parte 7 - Agregar estilos en App.css

Abrir el archivo:

src/App.css

Reemplazar su contenido por:

body {  
margin: 0;  
background-color: #f4f6f8;  
font-family: Arial, sans-serif;  
}  
<br/>.container {  
max-width: 1100px;  
margin: 0 auto;  
padding: 32px;  
}  
<br/>h1 {  
text-align: center;  
color: #1f2937;  
}  
<br/>.subtitle {  
text-align: center;  
color: #4b5563;  
margin-bottom: 32px;  
}  
<br/>.user-grid {  
display: grid;  
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));  
gap: 24px;  
}  
<br/>.user-card {  
background-color: #ffffff;  
border: 1px solid #e5e7eb;  
border-radius: 16px;  
padding: 20px;  
text-align: center;  
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);  
}  
<br/>.user-photo {  
width: 90px;  
height: 90px;  
border-radius: 50%;  
object-fit: cover;  
margin-bottom: 12px;  
}  
<br/>.user-card h2 {  
font-size: 20px;  
color: #111827;  
}  
<br/>.user-card p {  
color: #374151;  
font-size: 14px;  
}  
<br/>.message {  
text-align: center;  
margin-top: 80px;  
font-size: 20px;  
}  
<br/>.error {  
color: #b91c1c;  
}

# 16\. Mejora opcional - Separar la llamada a la API en services

Cuando el proyecto crece, es recomendable separar la conexión con la API en archivos de servicio.

Crear el archivo:

src/services/userService.js

Código sugerido:

const API_URL = "https://fake-json-api.mock.beeceptor.com/users/"  
<br/>export async function getUsers() {  
const response = await fetch(API_URL)  
<br/>if (!response.ok) {  
throw new Error("No se pudo obtener la información")  
}  
<br/>return response.json()  
}

Luego App.jsx podría importar la función getUsers. Esta mejora ayuda a ordenar el código y prepara el proyecto para conectarse después con el backend propio.

# 17\. Estructura final esperada

src/  
├── components/  
│ └── UserCard.jsx  
├── pages/  
├── services/  
│ └── userService.js (opcional)  
├── App.css  
├── App.jsx  
└── main.jsx

# 18\. Resultado esperado

- El proyecto se ejecuta correctamente con npm run dev.
- La aplicación abre en http://localhost:5173.
- Se muestran usuarios obtenidos desde la API.
- Cada usuario aparece como una tarjeta visual.
- El componente UserCard se reutiliza para mostrar cada usuario.
- El estudiante puede explicar qué hacen useState, useEffect, fetch, props y map().

# Cierre

En esta actividad se construyó una primera aplicación React utilizando Vite. Se creó un componente reutilizable, se consumieron datos desde una API externa y se renderizó información dinámica en pantalla. Estos conceptos serán la base para conectar el frontend con el backend del proyecto y desarrollar módulos CRUD funcionales durante la Unidad 3.