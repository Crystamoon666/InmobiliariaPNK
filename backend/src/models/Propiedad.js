const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Propiedad = sequelize.define('Propiedad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  propietario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numero_bien_raiz: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('casa', 'departamento', 'terreno'),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  precio_clp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_uf: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  banos: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  dormitorios: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  area_construida: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  area_terreno: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  provincia: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  comuna: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  sector: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  bodega: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  estacionamiento: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  logia: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  cocina_amoblada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  antejardin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  patio_trasero: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  piscina: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  solicitar_visita: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  estado: {
    type: DataTypes.ENUM('publicada', 'pausada', 'eliminada'),
    defaultValue: 'publicada'
  },
  fotos: {
    type: DataTypes.JSON, // Guardaremos un arreglo de strings (rutas)
    allowNull: true
  }
}, {
  tableName: 'propiedades',
  timestamps: true
});

module.exports = Propiedad;
