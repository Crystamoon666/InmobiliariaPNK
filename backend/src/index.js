require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

// Rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const propiedadRoutes = require('./routes/propiedadRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors()); // Permitir peticiones desde el frontend (Vite)
app.use(express.json()); // Parsear JSON del body
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Servir imágenes estáticas

// Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/propiedades', propiedadRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Algo salió mal en el servidor.' });
});

// Inicializar DB y Servidor
const iniciarServidor = async () => {
  try {
    // Sincronizar Sequelize con MySQL
    // { alter: true } actualiza las tablas sin borrar datos. En prod se usan migraciones.
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada correctamente.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
};

iniciarServidor();
