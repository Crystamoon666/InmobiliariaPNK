const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Obtener todos los usuarios (Solo Admin)
const getAllUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Solo el mismo usuario o un admin puede ver sus detalles completos
    if (req.usuario.rol !== 'admin' && req.usuario.id !== parseInt(id)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este usuario.' });
    }

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Crear usuario (Admin)
const createUser = async (req, res) => {
  try {
    const { rut, nombre_completo, fecha_nacimiento, correo, password, sexo, telefono, rol, estado } = req.body;
    let foto_url = null;

    if (req.file) {
      foto_url = `/uploads/${req.file.filename}`;
    }

    // Verificar si existe
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    // Encriptar password
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password || rut, salt); // Si no mandan pass, usa el RUT por defecto

    const nuevoUsuario = await Usuario.create({
      rut, nombre_completo, fecha_nacimiento, correo,
      password: passwordEncriptada, sexo, telefono,
      rol: rol || 'propietario',
      estado: estado || 'activo',
      foto_url
    });

    const { password: _, ...usuarioCreado } = nuevoUsuario.toJSON();
    res.status(201).json({ mensaje: 'Usuario creado exitosamente.', usuario: usuarioCreado });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Solo el mismo usuario o un admin puede actualizar
    if (req.usuario.rol !== 'admin' && req.usuario.id !== parseInt(id)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para actualizar este usuario.' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const { rut, nombre_completo, fecha_nacimiento, correo, password, sexo, telefono, rol, estado } = req.body;
    let updateData = { rut, nombre_completo, fecha_nacimiento, correo, sexo, telefono };

    // Si es admin, puede cambiar rol y estado
    if (req.usuario.rol === 'admin') {
      if (rol) updateData.rol = rol;
      if (estado) updateData.estado = estado;
    }

    // Si mandan password nuevo, se encripta
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Si mandan foto nueva, borrar la anterior (opcional pero buena práctica)
    if (req.file) {
      if (usuario.foto_url) {
        const oldPath = path.join(__dirname, '../..', usuario.foto_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.foto_url = `/uploads/${req.file.filename}`;
    }

    await usuario.update(updateData);
    
    const { password: _, ...usuarioActualizado } = usuario.toJSON();
    res.json({ mensaje: 'Usuario actualizado exitosamente.', usuario: usuarioActualizado });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    if (usuario.foto_url) {
      const oldPath = path.join(__dirname, '../..', usuario.foto_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado exitosamente.' });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
