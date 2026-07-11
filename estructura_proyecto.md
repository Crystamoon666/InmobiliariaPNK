# Estructura del Proyecto: ProyectoInmobiliarioPNK

```text
ProyectoInmobiliarioPNK/
├── Esqueleto_Faltante_Inmobiliaria.md
├── Guia_Fase1_Inmobiliaria.md
└── InmobiliariaPNK/    # (Carpeta principal del proyecto React/Vite)
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── vite.config.js
    ├── node_modules/   # (Dependencias reales del proyecto)
    │   └── (Múltiples subcarpetas con las librerías instaladas)
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    └── src/
        ├── API/
        │   └── axiosConfig.js
        ├── assets/
        │   ├── hero.png
        │   ├── react.svg
        │   ├── vite.svg
        │   ├── Propiedades/
        │   │   ├── Casas/
        │   │   ├── Departamentos/
        │   │   └── Terrenos/
        │   └── Users/
        ├── components/
        ├── context/
        │   └── AuthContext.jsx
        ├── hooks/
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
        │   └── AppRoutes.jsx
        ├── services/
        │   ├── authService.js
        │   ├── propiedadService.js
        │   └── userService.js
        ├── App.css
        ├── App.jsx
        ├── index.css
        └── main.jsx
```

---

### Contexto de Dependencias: `node_modules` y `package*.json`

Es fundamental entender la diferencia entre estos tres elementos que trabajan en conjunto para gestionar las librerías de tu proyecto:

- **`package.json`**: Es el **"plano" o receta** de tu proyecto. Aquí se listan las dependencias (librerías) que tu proyecto necesita para funcionar (como React o Axios) y las dependencias de desarrollo (herramientas como Vite o ESLint). **No** guarda el código de las librerías, solo sus nombres y las versiones requeridas. Este archivo *sí* debe subirse a tu repositorio (GitHub).

- **`package-lock.json`**: Es un archivo generado automáticamente que funciona como una **"fotografía exacta"** de tu instalación. Mientras que `package.json` puede decir *"necesito la librería X en su versión 1.0 o superior"*, el `package-lock.json` anota *"instalé exactamente la versión 1.0.5 y estas son todas las sub-dependencias que requirió"*. Garantiza que cualquier otra persona (o servidor) que instale el proyecto obtenga exactamente las mismas versiones que tú tienes, evitando el clásico problema de *"en mi máquina sí funciona"*. Este archivo *también* debe subirse al repositorio.

- **`node_modules/`**: Es la **carpeta física** donde se descarga y almacena todo el código real de las librerías listadas en tu `package.json` y `package-lock.json`. Como este código puede llegar a pesar cientos de megabytes y se puede descargar fácilmente usando el comando `npm install` (que lee el `package.json`), **nunca** debe subirse al repositorio. Para evitar que se suba, su nombre siempre está incluido en el archivo `.gitignore`.

*(Nota sobre el diagrama: Notarás que hay un `node_modules` y `package.json` fuera de la carpeta `InmobiliariaPNK`. Esto generalmente ocurre cuando se ejecuta `npm install` en la carpeta equivocada. Los archivos válidos para tu proyecto son los que están **dentro** de la carpeta `InmobiliariaPNK/`)*.
