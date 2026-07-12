const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // 1. Buscar usuario
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    // 2. Verificar estado
    if (usuario.estado !== 'activo') {
      return res.status(403).json({ mensaje: 'La cuenta no está activa. Contacta al administrador.' });
    }

    // 3. Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    // 4. Generar token
    const token = jwt.sign(
      { 
        id: usuario.id, 
        rol: usuario.rol, 
        correo: usuario.correo, 
        nombre_completo: usuario.nombre_completo 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // No enviar el password de vuelta
    const { password: _, ...usuarioSinPassword } = usuario.toJSON();

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

const registro = async (req, res) => {
  try {
    const { rut, nombre_completo, fecha_nacimiento, correo, password, sexo, telefono } = req.body;

    // 1. Validar si el rut o correo ya existen
    const existeUsuario = await Usuario.findOne({
      where: {
        correo
      }
    });

    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // 3. Crear usuario (por defecto será propietario y activo)
    const nuevoUsuario = await Usuario.create({
      rut,
      nombre_completo,
      fecha_nacimiento,
      correo,
      password: passwordEncriptada,
      sexo,
      telefono,
      rol: 'propietario',
      estado: 'activo'
    });

    // Ocultar password en la respuesta
    const { password: _, ...usuarioCreado } = nuevoUsuario.toJSON();

    res.status(201).json({
      mensaje: 'Registro exitoso.',
      usuario: usuarioCreado
    });

  } catch (error) {
    console.error('Error en registro:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'El RUT o Correo ya están en uso.' });
    }
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = {
  login,
  registro
};
