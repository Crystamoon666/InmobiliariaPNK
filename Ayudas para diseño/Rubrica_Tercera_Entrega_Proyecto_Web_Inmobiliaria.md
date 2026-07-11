**RÚBRICA DE TERCERA EVALUACIÓN** 

**FRONT-END** 

**Proyecto: Desarrollo de Página Web Inmobiliaria con Front-End y Back-End** 

**Objetivo de la evaluación:** Evaluar el desarrollo de una aplicación web inmobiliaria que permita la gestión de propiedades, usuarios  propietarios, fotografías, filtros de búsqueda y visualización detallada de inmuebles mediante una solución funcional con front-end y  back-end. 

**1\. Autenticación, roles y control de acceso — 10 puntos** 

| Criterio  | Puntaje  | Descripción |
| ----- | :---: | ----- |
| **Inicio de sesión con  credenciales**  | 3 pts  | El sistema permite ingresar mediante credenciales válidas para propietarios y administrador. |
| **Diferenciación de roles**  | 3 pts  | El sistema diferencia correctamente las funcionalidades entre propietario y administrador. |
| **Restricción de acceso  por propietario**  | 4 pts  | Cada propietario visualiza y administra únicamente sus propias propiedades. No puede acceder a  propiedades de otros usuarios. |

**2\. CRUD de propiedades — 20 puntos** 

| Criterio  | Puntaje  | Descripción |
| ----- | :---: | ----- |
| **Crear propiedades**  | 4 pts  | Permite registrar correctamente nuevas propiedades. |
| **Listar propiedades**  | 3 pts  | Muestra las propiedades registradas según el usuario autenticado. |
| **Editar propiedades**  | 4 pts  | Permite modificar la información de una propiedad existente. |
| **Eliminar o cambiar  estado de propiedades**  | 3 pts  | Permite eliminar, desactivar, publicar o cambiar el estado de una propiedad. |
| **Gestión por tipo de  propiedad**  | 3 pts  | Permite registrar propiedades según los tres tipos definidos: departamentos, casas y terrenos. |
| **Asociación correcta  propietario-propiedad**  | 3 pts  | El administrador puede crear propiedades seleccionando el propietario correspondiente. |

**3\. Validación de datos de propiedades — 10 puntos**

| Criterio  | Puntaje  | Descripción |
| ----- | :---: | ----- |
| **Validación de campos  obligatorios**  | 3 pts  | El sistema valida que los campos requeridos estén completos antes de guardar. |
| **Validación de tipos de  datos**  | 3 pts  | Valida correctamente campos numéricos, texto, valores monetarios, metros cuadrados, cantidad de  baños, dormitorios u otros. |
| **Validación según tipo  de propiedad**  | 3 pts  | Cada tipo de propiedad solicita y valida los datos correspondientes según corresponda: casa,  departamento o terreno. |
| **Mensajes de error  claros**  | 1 pt  | El sistema entrega mensajes comprensibles ante errores de validación. |

Rúbrica de Evaluación \- Proyecto Web Inmobiliaria   
**4\. Gestión de fotografías y galería de propiedades — 20 puntos** 

| Criterio  | Puntaje  | Descripción |
| ----- | :---: | ----- |
| **Carga de fotografías**  | 4 pts  | Permite subir fotografías asociadas a cada propiedad. |
| **Cantidad permitida de  imágenes**  | 3 pts  | Permite cargar entre 1 y 10 fotografías por propiedad. |
| **Validación de formato  de archivo**  | 4 pts  | Solo permite subir archivos de imagen válidos, por ejemplo JPG, JPEG, PNG o WEBP. |
| **Administración de  imágenes**  | 4 pts  | Permite eliminar fotografías, cambiar su estado o administrarlas desde el panel correspondiente. |
| **Imagen principal**  | 3 pts  | Permite seleccionar una fotografía como imagen principal de la propiedad. |
| **Visualización correcta  de la imagen principal**  | 2 pts  | La imagen principal seleccionada se muestra correctamente en la portada o listado de propiedades. |

**5\. Funcionalidades del administrador — 10 puntos** 

| Criterio  | Puntaje  | Descripción |
| ----- | :---: | ----- |
| **Registro de  propiedades por   administrador** | 3 pts  | El administrador puede crear propiedades desde su panel. |
| **Selección de   propietario**  | 3 pts  | El administrador debe seleccionar a qué propietario pertenece cada propiedad registrada. |
| **Gestión completa de  propiedades**  | 2 pts  | El administrador puede editar, eliminar o cambiar el estado de las propiedades. |
| **Gestión de fotografías  por administrador**  | 2 pts  | El administrador puede gestionar fotografías con las mismas funciones disponibles para propietarios. |

**6\. Front-end y visualización pública de propiedades — 10 puntos** 

| Criterio  | Puntaje  | Descripción |
| ----- | :---: | ----- |
| **Listado público de  propiedades**  | 3 pts  | El front-end muestra correctamente las propiedades disponibles. |
| **Diseño visual y   organización**  | 2 pts  | La interfaz es clara, ordenada, responsiva y coherente visualmente. |
| **Detalle de propiedad**  | 3 pts  | Al seleccionar una propiedad, se carga una vista detallada con toda la información relevante. |
| **Uso adecuado de   Bootstrap u otro   framework** | 2 pts  | Se utiliza correctamente Bootstrap u otro framework para mejorar la presentación y experiencia de  usuario. |

**7\. Filtros de búsqueda de propiedades — 10 puntos**

| Criterio  | Puntaje  | Descripción |
| ----- | :---: | ----- |
| **Filtro por tipo de   propiedad**  | 3 pts  | Permite filtrar por casa, departamento o terreno. |
| **Filtro por comuna**  | 3 pts  | Permite buscar propiedades según comuna. |
| **Filtro por sector**  | 2 pts  | Permite filtrar propiedades según sector o ubicación específica. |
| **Funcionamiento   combinado de filtros**  | 2 pts  | Los filtros pueden aplicarse en conjunto y muestran resultados coherentes. |

Rúbrica de Evaluación \- Proyecto Web Inmobiliaria   
**8\. Vista detalle, carrusel e iconografía de características — 10 puntos** 

| Criterio  | Puntaje  | Descripción |
| ----- | :---: | ----- |
| **Carrusel de imágenes**  | 3 pts  | La vista detalle muestra las fotografías de la propiedad en un carrusel funcional de Bootstrap. |
| **Características con  iconos**  | 3 pts  | Muestra características mediante iconos: baños, dormitorios, metros construidos, superficie,  estacionamientos u otros. |
| **Información completa  de la propiedad**  | 2 pts  | Presenta precio, descripción, ubicación, tipo de propiedad y demás datos relevantes. |
| **Experiencia de  navegación**  | 2 pts  | La navegación entre listado, filtros y detalle es clara y funcional. |

**Evidencias mínimas de entrega** 

• Debe estar en AWS. 

• Debe estar en Github. 

• Los menjsaes deben ser por medio de switchalert2 

