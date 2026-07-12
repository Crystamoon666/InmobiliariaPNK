const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rut: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true
  },
  nombre_completo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sexo: {
    type: DataTypes.ENUM('masculino', 'femenino', 'otro', 'prefiero_no_decirlo'),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('admin', 'propietario'),
    defaultValue: 'propietario'
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'pendiente'),
    defaultValue: 'activo'
  },
  foto_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true // crea createdAt y updatedAt
});

module.exports = Usuario;
