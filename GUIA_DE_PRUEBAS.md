# Guía de Pruebas - Proyecto Inmobiliario PNK

Esta guía paso a paso está diseñada para que puedas probar todas las funcionalidades de la aplicación. Puedes marcar las casillas `[ ]` reemplazando el espacio por una `x` (`[x]`) a medida que completas cada prueba. Si encuentras algún error o falta alguna característica, puedes anotarlo en la sección "Notas/Errores Encontrados" de cada bloque.

---

## 1. Preparación del Entorno
Antes de comenzar, asegúrate de que tanto el frontend como el backend estén corriendo sin errores.

- [X] XAMPP está encendido y el servicio de **MySQL** está en ejecución (para la base de datos).
- [X] El servidor backend de Node.js inicia correctamente (ej. `npm run dev` en la carpeta `backend`).
- [X] El servidor frontend inicia correctamente (ej. `npm run dev` en la carpeta `InmobiliariaPNK`).
- [X] La aplicación web carga en el navegador sin mostrar errores en la consola (presiona F12 para verificar).

**Notas/Errores Encontrados:**
> 

---

## 2. Autenticación y Autorización
Pruebas relacionadas con el registro, inicio y cierre de sesión (`authController`).

- [X] **Registro de usuario:** Puedo crear una cuenta nueva con datos válidos.
- [X] **Validación de registro:** El sistema muestra un error si intento registrarme con un correo ya existente o contraseñas que no coinciden.
- [X] **Inicio de sesión (Login):** Puedo iniciar sesión con las credenciales correctas.
- [X] **Login fallido:** El sistema muestra un mensaje de error claro si ingreso contraseñas o correos incorrectos.
- [X] **Cierre de sesión (Logout):** Al cerrar sesión, la aplicación me redirige correctamente y no puedo acceder a rutas protegidas usando el botón de "Atrás" del navegador.
- [x] **Persistencia de sesión:** Si recargo la página después de iniciar sesión, mi sesión se mantiene activa.

**Notas/Errores Encontrados:**
> 

---

## 3. Panel de Administración (Dashboard Admin)
Pruebas exclusivas para el panel de control de administradores.

- [x] **Acceso restringido:** Un usuario normal o no autenticado NO puede acceder a las rutas de `/admin`.
- [x] **Vista general (Dashboard):** El dashboard carga correctamente los widgets, estadísticas o listados principales.
- [x] **Navegación:** Los enlaces del menú lateral/superior del panel de administración funcionan y redirigen a las vistas correctas.

**Notas/Errores Encontrados:**
> 

---

## 4. Gestión de Propiedades (CRUD)
Creación, lectura, actualización y eliminación de propiedades inmobiliarias desde el panel.

- [ ] **Crear propiedad:** Puedo agregar una nueva propiedad llenando todos los campos requeridos (título, precio, ubicación, descripción, etc.).
- [ ] **Validación al crear:** El formulario muestra errores si intento guardar sin llenar los campos obligatorios.
- [ ] **Leer/Listar:** La propiedad recién creada aparece correctamente en la lista del panel de administración y en la vista pública.
- [ ] **Editar propiedad:** Puedo modificar los datos de una propiedad existente y los cambios se guardan y reflejan correctamente.
- [ ] **Eliminar/Ocultar:** Puedo eliminar o cambiar el estado (ej. de "Disponible" a "Vendida") de una propiedad, y esto se actualiza en el sistema.

**Notas/Errores Encontrados:**
> 

---

## 5. Subida y Manejo de Imágenes
Pruebas del módulo de imágenes (`imageUtils.js`).

- [ ] **Subida de imagen única:** Puedo subir una imagen principal para una propiedad sin errores.
- [ ] **Galería de imágenes:** Puedo subir múltiples imágenes para una misma propiedad de forma simultánea.
- [ ] **Validación de formato:** El sistema rechaza archivos que no sean imágenes (ej. PDFs, documentos) y muestra un mensaje de error.
- [ ] **Límite de tamaño:** El sistema advierte o rechaza imágenes demasiado pesadas (si aplica esta regla).
- [ ] **Visualización:** Las imágenes subidas se muestran correctamente tanto en el panel de admin como en la vista pública, sin verse rotas o deformadas.
- [ ] **Eliminación:** Al borrar una imagen de la galería de una propiedad, esta desaparece correctamente.

**Notas/Errores Encontrados:**
> 

---

## 6. Interfaz Pública (Catálogo y Detalles)
Lo que ve el cliente final.

- [ ] **Página de Inicio (Home):** Carga rápidamente y muestra las propiedades destacadas o recientes.
- [ ] **Listado de Propiedades:** Se muestran las tarjetas de las propiedades con la información básica correcta (imagen, precio, título, ubicación).
- [ ] **Filtros y Búsqueda:** Funciona la búsqueda por palabras clave o los filtros (por precio, tipo de propiedad, ubicación). Los resultados son precisos.
- [ ] **Detalle de Propiedad:** Al hacer clic en una propiedad, veo la página de detalles completos con toda la descripción, galería de imágenes y características (habitaciones, baños, etc.).

**Notas/Errores Encontrados:**
> 

---

## 7. Responsividad y UI/UX
Pruebas de diseño en diferentes tamaños de pantalla.

- [ ] **Móvil (Smartphones):** El menú de navegación se adapta (hamburguesa), los textos son legibles, y las tarjetas de propiedades se apilan en una sola columna.
- [ ] **Tablets:** El diseño se ajusta correctamente sin dejar espacios vacíos exagerados.
- [ ] **Escritorio:** La vista aprovecha el espacio disponible correctamente.
- [ ] **Estados interactivos:** Los botones tienen efectos visuales al pasar el mouse (hover) y al hacer clic.

**Notas/Errores Encontrados:**
> 

---

## 8. Formularios de Contacto
Pruebas para los canales de comunicación de los clientes.

- [ ] **Formulario de contacto general:** Si lleno y envío el formulario de la página de "Contacto", el mensaje se procesa (se guarda en BD o envía correo).
- [ ] **Formulario en propiedad específica:** Si envío un mensaje desde el detalle de una propiedad, el administrador recibe la información sobre QUÉ propiedad me interesa.
- [ ] **Validación:** No puedo enviar el formulario si dejo campos obligatorios vacíos o si ingreso un email con formato inválido.

**Notas/Errores Encontrados:**
> 

---

## Registro Adicional de Fallos Generales
Utiliza este espacio para documentar cualquier comportamiento extraño que no esté cubierto en los puntos anteriores.

- 
- 
- 

---
*Fin de la guía.*
