const { sequelize, Usuario, Propiedad } = require('./models');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    // 1. Sincronizar (alter: true asegura que existan las tablas sin borrar todo)
    // OJO: force: true borraría todas las tablas. Usaremos force: true solo si queremos resetear.
    await sequelize.sync({ force: true });
    console.log('✅ Base de datos sincronizada y limpiada.');

    // 2. Generar contraseñas
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Test2026!', salt);
    const userPassword = await bcrypt.hash('Test2026!', salt);

    // 3. Crear Usuarios
    console.log('Creando usuarios...');
    const usuarios = await Usuario.bulkCreate([
      {
        rut: '11.111.111-1',
        nombre_completo: 'Administrador Principal',
        fecha_nacimiento: '1980-01-01',
        correo: 'admin@pnk.cl',
        password: adminPassword,
        sexo: 'otro',
        telefono: '+56900000000',
        rol: 'admin',
        estado: 'activo'
      },
      {
        rut: '12.345.678-9',
        nombre_completo: 'María González',
        fecha_nacimiento: '1990-03-15',
        correo: 'maria@pnk.cl',
        password: userPassword,
        sexo: 'femenino',
        telefono: '+56912345678',
        rol: 'propietario',
        estado: 'activo'
      },
      {
        rut: '9.876.543-2',
        nombre_completo: 'Carlos Pérez',
        fecha_nacimiento: '1985-07-22',
        correo: 'carlos@pnk.cl',
        password: userPassword,
        sexo: 'masculino',
        telefono: '+56987654321',
        rol: 'propietario',
        estado: 'activo'
      },
      {
        rut: '15.432.100-K',
        nombre_completo: 'Ana López',
        fecha_nacimiento: '1995-11-08',
        correo: 'ana@pnk.cl',
        password: userPassword,
        sexo: 'femenino',
        telefono: '+56911223344',
        rol: 'propietario',
        estado: 'activo'
      },
      {
        rut: '7.654.321-0',
        nombre_completo: 'Pedro Soto',
        fecha_nacimiento: '1978-01-30',
        correo: 'pedro@pnk.cl',
        password: userPassword,
        sexo: 'masculino',
        telefono: '+56955443322',
        rol: 'propietario',
        estado: 'activo'
      }
    ]);

    // 4. Crear Propiedades
    console.log('Creando propiedades...');
    await Propiedad.bulkCreate([
      {
        propietario_id: usuarios[1].id, // María
        numero_bien_raiz: '1234-56',
        tipo: 'casa',
        descripcion: 'Hermosa casa mediterránea en condominio cerrado. Seguridad 24/7, amplios espacios luminosos y excelente conectividad.',
        precio_clp: 150000000,
        precio_uf: 5200.5,
        banos: 3,
        dormitorios: 4,
        area_construida: 140.5,
        area_terreno: 300,
        provincia: 'Elqui',
        comuna: 'La Serena',
        sector: 'El Milagro',
        bodega: true,
        estacionamiento: true,
        logia: true,
        cocina_amoblada: true,
        antejardin: true,
        patio_trasero: true,
        piscina: true,
        solicitar_visita: true,
        estado: 'publicada',
        fotos: JSON.stringify(['/uploads/casa1.jpg', '/uploads/casainterior1.webp'])
      },
      {
        propietario_id: usuarios[2].id, // Carlos
        numero_bien_raiz: '9876-54',
        tipo: 'departamento',
        descripcion: 'Moderno departamento a pasos de la Avenida del Mar. Ideal para vacacionar o como inversión.',
        precio_clp: 85000000,
        precio_uf: 2950.0,
        banos: 1,
        dormitorios: 2,
        area_construida: 55,
        area_terreno: 55,
        provincia: 'Elqui',
        comuna: 'La Serena',
        sector: 'Avenida del Mar',
        bodega: true,
        estacionamiento: true,
        logia: false,
        cocina_amoblada: true,
        antejardin: false,
        patio_trasero: false,
        piscina: true,
        solicitar_visita: true,
        estado: 'publicada',
        fotos: JSON.stringify(['/uploads/departamento1.png', '/uploads/deptointerior1.jpg'])
      },
      {
        propietario_id: usuarios[3].id, // Ana
        numero_bien_raiz: '4567-89',
        tipo: 'terreno',
        descripcion: 'Sitio eriazo con excelente plusvalía y factibilidad de luz y agua. Ideal para construir la casa de tus sueños en el valle.',
        precio_clp: 45000000,
        precio_uf: 1560.0,
        banos: 0,
        dormitorios: 0,
        area_construida: 0,
        area_terreno: 1000,
        provincia: 'Elqui',
        comuna: 'Vicuña',
        sector: 'Ruta 41',
        bodega: false,
        estacionamiento: false,
        logia: false,
        cocina_amoblada: false,
        antejardin: false,
        patio_trasero: false,
        piscina: false,
        solicitar_visita: true,
        estado: 'publicada',
        fotos: JSON.stringify(['/uploads/terreno1.jpg', '/uploads/terreno1-1.jpeg'])
      },
      {
        propietario_id: usuarios[1].id, // María
        numero_bien_raiz: '3333-11',
        tipo: 'casa',
        descripcion: 'Casa esquina comercial, excelente vitrina en avenida principal.',
        precio_clp: 220000000,
        precio_uf: 7600.0,
        banos: 2,
        dormitorios: 3,
        area_construida: 120,
        area_terreno: 250,
        provincia: 'Elqui',
        comuna: 'Coquimbo',
        sector: 'Sindempart',
        bodega: true,
        estacionamiento: true,
        logia: false,
        cocina_amoblada: false,
        antejardin: true,
        patio_trasero: true,
        piscina: false,
        solicitar_visita: true,
        estado: 'publicada',
        fotos: JSON.stringify(['/uploads/casa2.jpg', '/uploads/casainterior2.jpg'])
      },
      {
        propietario_id: usuarios[4].id, // Pedro
        numero_bien_raiz: '1122-33',
        tipo: 'departamento',
        descripcion: 'Penthouse con vista panorámica, terraza amplia y finas terminaciones frente al mar.',
        precio_clp: 350000000,
        precio_uf: 12000.0,
        banos: 3,
        dormitorios: 3,
        area_construida: 180,
        area_terreno: 180,
        provincia: 'Elqui',
        comuna: 'Coquimbo',
        sector: 'Peñuelas',
        bodega: true,
        estacionamiento: true,
        logia: true,
        cocina_amoblada: true,
        antejardin: false,
        patio_trasero: false,
        piscina: false,
        solicitar_visita: true,
        estado: 'publicada',
        fotos: JSON.stringify(['/uploads/depto2.webp', '/uploads/deptointerior2.webp'])
      },
      {
        propietario_id: usuarios[2].id, // Carlos
        numero_bien_raiz: '9988-77',
        tipo: 'terreno',
        descripcion: 'Parcela de agrado en sector tranquilo, con árboles frutales y pozo inscrito.',
        precio_clp: 80000000,
        precio_uf: 2770.0,
        banos: 0,
        dormitorios: 0,
        area_construida: 0,
        area_terreno: 5000,
        provincia: 'Limarí',
        comuna: 'Ovalle',
        sector: 'Huamalata',
        bodega: false,
        estacionamiento: false,
        logia: false,
        cocina_amoblada: false,
        antejardin: false,
        patio_trasero: false,
        piscina: false,
        solicitar_visita: true,
        estado: 'publicada',
        fotos: JSON.stringify(['/uploads/terreno2.jpg', '/uploads/terreno2-1.jpg'])
      },
      {
        propietario_id: usuarios[3].id, // Ana
        numero_bien_raiz: '5555-66',
        tipo: 'casa',
        descripcion: 'Casa de un piso, sólida, ideal para remodelar. Barrio consolidado.',
        precio_clp: 130000000,
        precio_uf: 4500.0,
        banos: 1,
        dormitorios: 3,
        area_construida: 90,
        area_terreno: 200,
        provincia: 'Limarí',
        comuna: 'Ovalle',
        sector: 'Sector Centro',
        bodega: false,
        estacionamiento: true,
        logia: true,
        cocina_amoblada: false,
        antejardin: true,
        patio_trasero: true,
        piscina: false,
        solicitar_visita: true,
        estado: 'publicada',
        fotos: JSON.stringify(['/uploads/casa3.jpg', '/uploads/casainterior3.jpg'])
      },
      {
        propietario_id: usuarios[4].id, // Pedro
        numero_bien_raiz: '2244-66',
        tipo: 'departamento',
        descripcion: 'Estudio ideal para estudiantes, a cuadras del campus universitario.',
        precio_clp: 55000000,
        precio_uf: 1900.0,
        banos: 1,
        dormitorios: 1,
        area_construida: 32,
        area_terreno: 32,
        provincia: 'Elqui',
        comuna: 'La Serena',
        sector: 'Cerro Grande',
        bodega: false,
        estacionamiento: false,
        logia: false,
        cocina_amoblada: true,
        antejardin: false,
        patio_trasero: false,
        piscina: false,
        solicitar_visita: false,
        estado: 'publicada',
        fotos: JSON.stringify(['/uploads/depto3.jpg', '/uploads/deptointerior3.webp'])
      },
      {
        propietario_id: usuarios[1].id, // María
        numero_bien_raiz: '7777-22',
        tipo: 'casa',
        descripcion: 'Parcela con casa sólida. Cuenta con agua potable rural y energía eléctrica.',
        precio_clp: 160000000,
        precio_uf: 5500.0,
        banos: 2,
        dormitorios: 4,
        area_construida: 150,
        area_terreno: 5000,
        provincia: 'Choapa',
        comuna: 'Illapel',
        sector: 'Valle Hermoso',
        bodega: true,
        estacionamiento: true,
        logia: true,
        cocina_amoblada: true,
        antejardin: true,
        patio_trasero: true,
        piscina: true,
        solicitar_visita: true,
        estado: 'publicada',
        fotos: JSON.stringify(['/uploads/casa4.jpg', '/uploads/casainterior4.jpg'])
      },
      {
        propietario_id: usuarios[3].id, // Ana
        numero_bien_raiz: '8811-22',
        tipo: 'terreno',
        descripcion: 'Amplio terreno con vista privilegiada al valle.',
        precio_clp: 110000000,
        precio_uf: 3800.0,
        banos: 0,
        dormitorios: 0,
        area_construida: 0,
        area_terreno: 6500,
        provincia: 'Choapa',
        comuna: 'Salamanca',
        sector: 'Chalinga',
        bodega: false,
        estacionamiento: false,
        logia: false,
        cocina_amoblada: false,
        antejardin: false,
        patio_trasero: false,
        piscina: false,
        solicitar_visita: true,
        estado: 'publicada',
        fotos: JSON.stringify(['/uploads/terreno3.jpg', '/uploads/terreno3-1.jpg'])
      }
    ]);

    console.log('✅ Base de datos poblada exitosamente.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();
