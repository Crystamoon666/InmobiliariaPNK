const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Propiedad = require('./Propiedad');

// Relaciones
Usuario.hasMany(Propiedad, { foreignKey: 'propietario_id', as: 'propiedades' });
Propiedad.belongsTo(Usuario, { foreignKey: 'propietario_id', as: 'propietario' });

module.exports = {
  sequelize,
  Usuario,
  Propiedad
};
