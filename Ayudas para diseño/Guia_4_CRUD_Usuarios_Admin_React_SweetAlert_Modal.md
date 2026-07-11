**GUÍA DE LABORATORIO  
CRUD Módulo Usuario - Rol Administrador  
**React + React-Bootstrap Modal + SweetAlert2

|     |     |
| --- | --- |
| **Asignatura** | Programación Front End |
| **Unidad** | Unidad 3 - Framework basado en JavaScript |
| **Proyecto** | SportClub |
| **Tema** | CRUD Usuarios en rol Administrador |
| **Modalidad** | Laboratorio práctico |
| **Tipo de trabajo** | Individual / avance guiado |

# 1\. Contexto de la actividad

En esta actividad se implementará el módulo de administración de usuarios del sistema SportClub. El objetivo es que el estudiante comprenda cómo construir un CRUD en React conectado al backend, utilizando una estructura ordenada, servicios separados, formularios dentro de modales y mensajes de confirmación con SweetAlert2.

Este módulo será utilizado por el rol Administrador, por lo tanto debe estar dentro del layout administrativo y protegido por las rutas trabajadas en clases anteriores.

# 2\. Objetivo de aprendizaje

- Crear una página de administración de usuarios en React.
- Consumir un backend mediante un archivo de servicio.
- Listar usuarios en una tabla.
- Crear y editar usuarios utilizando un Modal de React-Bootstrap.
- Eliminar usuarios utilizando confirmación con SweetAlert2.
- Actualizar la tabla sin recargar el navegador.
- Mantener una estructura profesional de carpetas y nombres.

# 3\. Requisitos previos

- Proyecto React creado con Vite.
- React Router configurado.
- Login y registro funcionando.
- Rutas protegidas y validación por rol implementadas.
- Layout de administrador creado.
- Backend SportClub ejecutándose correctamente.

**Importante:** Antes de comenzar este laboratorio, el estudiante debe verificar que puede iniciar sesión como administrador y entrar al dashboard correspondiente.

# 4\. Instalación de librerías

Ejecutar en la terminal del proyecto:

npm install react-bootstrap bootstrap sweetalert2  
<br/>\# Alternativa con pnpm:  
pnpm install react-bootstrap bootstrap sweetalert2

En el archivo src/main.jsx debe existir el import de Bootstrap:

|     |
| --- |
| import "bootstrap/dist/css/bootstrap.min.css" |
| **Nota docente:** Para esta guía se utilizará SweetAlert2 básico. No es obligatorio utilizar sweetalert2-react-content. |

# 5\. Estructura de carpetas y archivos a trabajar

src/  
├── components/  
│ └── users/  
│ └── UserFormModal.jsx  
├── pages/  
│ └── admin/  
│ └── UsersPage.jsx  
├── services/  
│ └── userService.js  
├── routes/  
│ └── AppRoutes.jsx  
└── layouts/  
└── AdminLayout.jsx

# 6\. Endpoints esperados del backend

La guía asume que el backend posee endpoints similares a los siguientes:

|     |     |     |
| --- | --- | --- |
| **Acción** | **Método** | **Endpoint** |
| Listar usuarios | GET | /api/users |
| Crear usuario | POST | /api/users |
| Editar usuario | PUT | /api/users/:id |
| Eliminar usuario | DELETE | /api/users/:id |
| **Importante:** Si el backend del curso utiliza otra ruta, se debe modificar la constante API_URL en userService.js. |     |     |

# 7\. Crear el servicio userService.js

Crear el archivo src/services/userService.js. Este archivo será responsable de conversar con el backend.

const API_URL = "http://localhost:3000/api/users"

function getToken() {

return localStorage.getItem("token")

}

function getHeaders() {

return {

"Content-Type": "application/json",

Authorization: \`Bearer ${getToken()}\`,

}

}

export async function getUsers() {

const response = await fetch(API_URL, {

method: "GET",

headers: getHeaders(),

})

if (!response.ok) {

throw new Error("Error al obtener usuarios")

}

return response.json()

}

export async function createUser(userData) {

const response = await fetch(API_URL, {

method: "POST",

headers: getHeaders(),

body: JSON.stringify(userData),

})

const data = await response.json()

if (!response.ok) {

throw new Error(data.message || "Error al crear usuario")

}

return data

}

export async function updateUser(id, userData) {

const response = await fetch(\`${API_URL}/${id}\`, {

method: "PUT",

headers: getHeaders(),

body: JSON.stringify(userData),

})

const data = await response.json()

if (!response.ok) {

throw new Error(data.message || "Error al actualizar usuario")

}

return data

}

export async function deleteUser(id) {

const response = await fetch(\`${API_URL}/${id}\`, {

method: "DELETE",

headers: getHeaders(),

})

if (!response.ok) {

throw new Error("Error al eliminar usuario")

}

return true

}

## Explicación del servicio

- getUsers(): obtiene todos los usuarios desde el backend.
- createUser(): envía un nuevo usuario al backend.
- updateUser(): actualiza un usuario existente.
- deleteUser(): elimina un usuario por id.
- getHeaders(): agrega Content-Type y token de autorización.

# 8\. Crear el Modal UserFormModal.jsx

Crear el archivo src/components/users/UserFormModal.jsx. Este componente se utilizará tanto para crear como para editar usuarios.

import { useEffect, useState } from "react"

import { Button, Form, Modal } from "react-bootstrap"

const initialForm = {

full_name: "",

email: "",

role: "user",

password: "",

}

function UserFormModal({ show, handleClose, handleSave, selectedUser }) {

const \[formData, setFormData\] = useState(initialForm)

useEffect(() => {

if (selectedUser) {

setFormData({

full_name: selectedUser.full_name || "",

email: selectedUser.email || "",

role: selectedUser.role || "user",

password: "",

})

} else {

setFormData(initialForm)

}

}, \[selectedUser, show\])

const handleChange = (event) => {

const { name, value } = event.target

setFormData({

...formData,

\[name\]: value,

})

}

const onSubmit = (event) => {

event.preventDefault()

handleSave(formData)

}

return (

&lt;Modal show={show} onHide={handleClose} centered&gt;

&lt;Modal.Header closeButton&gt;

&lt;Modal.Title&gt;

{selectedUser ? "Editar Usuario" : "Nuevo Usuario"}

&lt;/Modal.Title&gt;

&lt;/Modal.Header&gt;

&lt;Form onSubmit={onSubmit}&gt;

&lt;Modal.Body&gt;

&lt;Form.Group className="mb-3"&gt;

&lt;Form.Label&gt;Nombre Completo&lt;/Form.Label&gt;

<Form.Control

type="text"

name="full_name"

value={formData.full_name}

onChange={handleChange}

required

/>

&lt;/Form.Group&gt;

&lt;Form.Group className="mb-3"&gt;

&lt;Form.Label&gt;Correo&lt;/Form.Label&gt;

<Form.Control

type="email"

name="email"

value={formData.email}

onChange={handleChange}

required

/>

&lt;/Form.Group&gt;

{!selectedUser && (

&lt;Form.Group className="mb-3"&gt;

&lt;Form.Label&gt;Contraseña&lt;/Form.Label&gt;

<Form.Control

type="password"

name="password"

value={formData.password}

onChange={handleChange}

required

/>

&lt;/Form.Group&gt;

)}

&lt;Form.Group className="mb-3"&gt;

&lt;Form.Label&gt;Rol&lt;/Form.Label&gt;

&lt;Form.Select name="role" value={formData.role} onChange={handleChange}&gt;

&lt;option value="user"&gt;Usuario&lt;/option&gt;

&lt;option value="coach"&gt;Coach&lt;/option&gt;

&lt;option value="admin"&gt;Administrador&lt;/option&gt;

&lt;/Form.Select&gt;

&lt;/Form.Group&gt;

&lt;/Modal.Body&gt;

&lt;Modal.Footer&gt;

&lt;Button variant="secondary" onClick={handleClose}&gt;

Cancelar

&lt;/Button&gt;

&lt;Button variant="primary" type="submit"&gt;

Guardar

&lt;/Button&gt;

&lt;/Modal.Footer&gt;

&lt;/Form&gt;

&lt;/Modal&gt;

)

}

export default UserFormModal

## Explicación del Modal

- show controla si el modal está visible.
- handleClose cierra el modal.
- handleSave envía los datos al componente padre.
- selectedUser permite saber si se está creando o editando.
- useEffect carga los datos cuando se selecciona un usuario para editar.

# 9\. Crear la página UsersPage.jsx

Crear el archivo src/pages/admin/UsersPage.jsx. Esta página administra la tabla, la carga de datos, el modal y las alertas.

import { useEffect, useState } from "react"

import { Badge, Button, Card, Spinner, Table } from "react-bootstrap"

import Swal from "sweetalert2"

import UserFormModal from "../../components/users/UserFormModal"

import {

createUser,

deleteUser,

getUsers,

updateUser,

} from "../../services/userService"

function UsersPage() {

const \[users, setUsers\] = useState(\[\])

const \[loading, setLoading\] = useState(true)

const \[showModal, setShowModal\] = useState(false)

const \[selectedUser, setSelectedUser\] = useState(null)

const loadUsers = async () => {

try {

setLoading(true)

const data = await getUsers()

setUsers(data.data)

} catch (error) {

Swal.fire("Error", error.message, "error")

} finally {

setLoading(false)

}

}

useEffect(() => {

loadUsers()

}, \[\])

const openCreateModal = () => {

setSelectedUser(null)

setShowModal(true)

}

const openEditModal = (user) => {

setSelectedUser(user)

setShowModal(true)

}

const closeModal = () => {

setShowModal(false)

setSelectedUser(null)

}

const handleSave = async (formData) => {

try {

if (selectedUser) {

await updateUser(selectedUser.id, formData)

Swal.fire("Actualizado", "Usuario actualizado correctamente", "success")

} else {

await createUser(formData)

Swal.fire("Creado", "Usuario creado correctamente", "success")

}

closeModal()

loadUsers()

} catch (error) {

Swal.fire("Error", error.message, "error")

}

}

const handleDelete = async (user) => {

const result = await Swal.fire({

title: "¿Eliminar usuario?",

text: \`Se eliminará a ${user.name}\`,

icon: "warning",

showCancelButton: true,

confirmButtonText: "Sí, eliminar",

cancelButtonText: "Cancelar",

confirmButtonColor: "#d33",

})

if (result.isConfirmed) {

try {

await deleteUser(user.id)

Swal.fire("Eliminado", "Usuario eliminado correctamente", "success")

loadUsers()

} catch (error) {

Swal.fire("Error", error.message, "error")

}

}

}

return (

&lt;Card className="shadow-sm"&gt;

&lt;Card.Header className="d-flex justify-content-between align-items-center"&gt;

&lt;h4 className="mb-0"&gt;Gestión de Usuarios&lt;/h4&gt;

&lt;Button variant="primary" onClick={openCreateModal}&gt;

Nuevo Usuario

&lt;/Button&gt;

&lt;/Card.Header&gt;

&lt;Card.Body&gt;

{loading ? (

&lt;div className="text-center p-4"&gt;

&lt;Spinner animation="border" /&gt;

&lt;p className="mt-2"&gt;Cargando usuarios...&lt;/p&gt;

&lt;/div&gt;

) : (

&lt;Table responsive striped bordered hover&gt;

&lt;thead&gt;

&lt;tr&gt;

&lt;th&gt;ID&lt;/th&gt;

&lt;th&gt;Nombre&lt;/th&gt;

&lt;th&gt;Correo&lt;/th&gt;

&lt;th&gt;Rol&lt;/th&gt;

&lt;th&gt;Acciones&lt;/th&gt;

&lt;/tr&gt;

&lt;/thead&gt;

&lt;tbody&gt;

{users.map((user) => (

&lt;tr key={user.id}&gt;

&lt;td&gt;{user.id}&lt;/td&gt;

&lt;td&gt;{user.full_name}&lt;/td&gt;

&lt;td&gt;{user.email}&lt;/td&gt;

&lt;td&gt;

&lt;Badge bg={user.role === "admin" ? "success" : user.role === "user" ? "info" : "secondary"}&gt;

{user.role === "admin" ? "Administrador" : user.role === "user" ? "Usuario" :"Entrenador"}

&lt;/Badge&gt;

&lt;/td&gt;

&lt;td&gt;

<Button

variant="warning"

size="sm"

className="me-2"

onClick={() => openEditModal(user)}

\>

Editar

&lt;/Button&gt;

<Button

variant="danger"

size="sm"

onClick={() => handleDelete(user)}

\>

Eliminar

&lt;/Button&gt;

&lt;/td&gt;

&lt;/tr&gt;

))}

&lt;/tbody&gt;

&lt;/Table&gt;

)}

&lt;/Card.Body&gt;

<UserFormModal

show={showModal}

handleClose={closeModal}

handleSave={handleSave}

selectedUser={selectedUser}

/>

&lt;/Card&gt;

)

}

export default UsersPage

# 10\. Explicación del flujo CRUD

|     |     |     |
| --- | --- | --- |
| **Operación** | **Función** | **Descripción** |
| Listar | loadUsers() | Carga usuarios desde el backend y actualiza la tabla. |
| Crear | handleSave() | Si no existe selectedUser, crea un nuevo usuario. |
| Editar | handleSave() | Si existe selectedUser, actualiza el usuario seleccionado. |
| Eliminar | handleDelete() | Muestra confirmación con SweetAlert2 y luego elimina. |

#   

# 11\. Registrar la ruta en AppRoutes.jsx

Agregar la página de usuarios dentro de la ruta administrativa protegida por rol.

import UsersPage from "../pages/admin/UsersPage"  
<br/><Route  
path="/admin"  
element={  
&lt;RoleRoute allowedRoles={\["admin"\]}&gt;  
&lt;AdminLayout /&gt;  
&lt;/RoleRoute&gt;  
}  
\>  
&lt;Route path="dashboard" element={<AdminDashboard /&gt;} />  
&lt;Route path="users" element={<UsersPage /&gt;} />  
&lt;/Route&gt;

# 12\. Agregar link en AdminLayout.jsx

Dentro del layout administrador, agregar un enlace visible hacia el módulo de usuarios.

&lt;Link className="nav-link" to="/admin/users"&gt;  
Usuarios  
&lt;/Link&gt;

# 13\. Flujo del Modal

1.  Click en Nuevo Usuario.
2.  Abrir Modal.
3.  Completar formulario.
4.  Guardar.
5.  Actualizar tabla.

**Nota docente:** El modal permite reutilizar el mismo formulario para crear y editar. La diferencia está en si existe o no selectedUser.

# 14\. Flujo de SweetAlert2 para eliminar

1.  Click en Eliminar.
2.  SweetAlert2 pregunta si desea eliminar.
3.  El usuario confirma.
4.  Se ejecuta DELETE en la API.
5.  Se actualiza la tabla.

# 15\. Pruebas obligatorias

|     |     |
| --- | --- |
| **Prueba** | **Resultado esperado** |
| Entrar como admin | Puede acceder a /admin/users. |
| Listar usuarios | La tabla muestra datos desde el backend. |
| Crear usuario | Se abre modal, guarda y actualiza la tabla. |
| Editar usuario | El modal carga los datos y actualiza el registro. |
| Eliminar usuario | SweetAlert2 confirma y la tabla se actualiza. |

# 16\. Checklist de entrega del laboratorio

- Existe archivo services/userService.js.
- Existe archivo components/users/UserFormModal.jsx.
- Existe archivo pages/admin/UsersPage.jsx.
- El módulo está protegido para rol administrador.
- La tabla lista usuarios desde backend.
- Crear usuario funciona desde modal.
- Editar usuario funciona desde modal.
- Eliminar usuario utiliza SweetAlert2.
- La tabla se actualiza sin refrescar el navegador.
- El código mantiene nombres en inglés y componentes en PascalCase.

# 17\. Buenas prácticas esperadas

- No colocar fetch directamente en varios componentes; usar services.
- No mezclar demasiada lógica dentro del JSX.
- Mantener nombres de carpetas en inglés y minúsculas.
- Mantener componentes en PascalCase.
- Usar textos visibles para el usuario en español.
- Validar respuestas del backend y mostrar errores claros.
- No eliminar registros sin confirmación previa.

# 18\. Actividad de cierre

Al finalizar, el estudiante deberá demostrar el flujo completo ante el docente:

1.  Ingresar como administrador.
2.  Entrar al módulo Usuarios.
3.  Crear un nuevo usuario.
4.  Editar el usuario creado.
5.  Eliminar el usuario creado.
6.  Explicar brevemente qué archivo conversa con el backend y qué archivo contiene el modal.

# 19\. Conclusión

En este laboratorio se construyó un CRUD completo para el módulo Usuarios en el rol Administrador. El patrón utilizado puede reutilizarse en otros módulos del sistema SportClub, como deportes, clases, entrenadores o reservas. La clave está en mantener una arquitectura clara: service para API, page para lógica de pantalla, modal para formulario y SweetAlert2 para retroalimentación del usuario.