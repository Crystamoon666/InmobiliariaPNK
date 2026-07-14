const { Propiedad, Usuario } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Normalizar campo fotos: viene como string JSON desde MySQL, convertir a array
const parseFotos = (propiedad) => {
  const obj = propiedad.toJSON ? propiedad.toJSON() : propiedad;
  if (typeof obj.fotos === 'string') {
    try { obj.fotos = JSON.parse(obj.fotos); } catch(e) { obj.fotos = []; }
  }
  if (!Array.isArray(obj.fotos)) obj.fotos = [];
  return obj;
};

// GET /api/propiedades - Todas las publicadas (Público)
const getPropiedadesPublicas = async (req, res) => {
  try {
    const { tipo, provincia, comuna, sector } = req.query;
    const where = { estado: 'publicada' };

    if (tipo) where.tipo = tipo;
    if (provincia) where.provincia = provincia;
    if (comuna) where.comuna = comuna;
    if (sector) {
      where.sector = {
        [Op.like]: `%${sector}%`
      };
    }

    const propiedades = await Propiedad.findAll({
      where,
      include: [{ model: Usuario, as: 'propietario', attributes: ['nombre_completo', 'correo', 'telefono', 'foto_url'] }]
    });
    res.json(propiedades.map(parseFotos));
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/propiedades/admin - Todas (Admin)
const getAllPropiedadesAdmin = async (req, res) => {
  try {
    const propiedades = await Propiedad.findAll({
      include: [{ model: Usuario, as: 'propietario', attributes: ['nombre_completo', 'correo'] }]
    });
    res.json(propiedades.map(parseFotos));
  } catch (error) {
    console.error('Error al obtener propiedades (admin):', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/propiedades/mis-propiedades - Propias del usuario logueado
const getMisPropiedades = async (req, res) => {
  try {
    const propiedades = await Propiedad.findAll({
      where: { propietario_id: req.usuario.id }
    });
    res.json(propiedades.map(parseFotos));
  } catch (error) {
    console.error('Error al obtener mis propiedades:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// GET /api/propiedades/:id
const getPropiedadById = async (req, res) => {
  try {
    const propiedad = await Propiedad.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'propietario', attributes: ['nombre_completo', 'correo', 'telefono', 'foto_url'] }]
    });
    
    if (!propiedad) return res.status(404).json({ mensaje: 'Propiedad no encontrada.' });

    res.json(parseFotos(propiedad));
  } catch (error) {
    console.error('Error al obtener propiedad:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// POST /api/propiedades
const createPropiedad = async (req, res) => {
  try {
    let data = req.body;
    
    // Si viene como multipart/form-data y tenemos un JSON string para datos
    if (data.data) {
      data = JSON.parse(data.data);
    }

    // Convertir booleanos o strings a booleanos
    const boolFields = ['bodega', 'estacionamiento', 'logia', 'cocina_amoblada', 'antejardin', 'patio_trasero', 'piscina', 'solicitar_visita'];
    boolFields.forEach(field => {
      if (data[field] === 'true' || data[field] === true) data[field] = true;
      else data[field] = false;
    });

    // Guardar rutas de fotos subidas
    const fotos = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    data.fotos = fotos;

    // Validaciones estrictas numéricas y lógicas
    if (Number(data.precio_clp) <= 0) return res.status(400).json({ mensaje: 'El precio debe ser mayor a 0.' });
    if (data.tipo !== 'terreno') {
      if (Number(data.dormitorios) <= 0) return res.status(400).json({ mensaje: 'Debe tener al menos 1 dormitorio.' });
      if (Number(data.banos) <= 0) return res.status(400).json({ mensaje: 'Debe tener al menos 1 baño.' });
      if (Number(data.area_construida) <= 0 || Number(data.area_terreno) <= 0) return res.status(400).json({ mensaje: 'Las áreas deben ser mayores a 0.' });
      if (Number(data.area_construida) > Number(data.area_terreno)) return res.status(400).json({ mensaje: 'Los metros construidos no pueden superar a los del terreno.' });
    } else {
      if (Number(data.area_terreno) <= 0) return res.status(400).json({ mensaje: 'El área del terreno debe ser mayor a 0.' });
    }

    if (fotos.length === 0) {
      return res.status(400).json({ mensaje: 'Debe adjuntar al menos una fotografía.' });
    }

    // Verificar Rol de Avaluó duplicado
    const existeRol = await Propiedad.findOne({ where: { numero_bien_raiz: data.numero_bien_raiz } });
    if (existeRol) {
      return res.status(400).json({ mensaje: 'Ya existe una propiedad con ese Rol de Avaluó.' });
    }

    // Asignar propietario
    // Si es admin, puede venir en req.body.propietario_id. Si no viene, es error.
    if (req.usuario.rol === 'admin' && data.propietario_id) {
       // usa el data.propietario_id
    } else {
      // Si es propietario, asignarlo a sí mismo
      data.propietario_id = req.usuario.id;
    }

    const nuevaPropiedad = await Propiedad.create(data);
    res.status(201).json({ mensaje: 'Propiedad creada exitosamente.', propiedad: parseFotos(nuevaPropiedad) });

  } catch (error) {
    console.error('Error al crear propiedad:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// PUT /api/propiedades/:id
const updatePropiedad = async (req, res) => {
  try {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) return res.status(404).json({ mensaje: 'Propiedad no encontrada.' });

    // Permisos
    if (req.usuario.rol !== 'admin' && propiedad.propietario_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permisos para editar esta propiedad.' });
    }

    let data = req.body;
    if (data.data) data = JSON.parse(data.data);

    // Booleans
    const boolFields = ['bodega', 'estacionamiento', 'logia', 'cocina_amoblada', 'antejardin', 'patio_trasero', 'piscina', 'solicitar_visita'];
    boolFields.forEach(field => {
      if (data[field] !== undefined) {
         data[field] = (data[field] === 'true' || data[field] === true);
      }
    });

    // Nuevas fotos
    let fotosActuales = propiedad.fotos || [];
    
    // Si el usuario borró fotos, aquí deberíamos recibir qué fotos quedan en "fotosExistentes"
    if (data.fotosExistentes) {
        // En una app real, aquí borraríamos físicamente las fotos descartadas
        fotosActuales = data.fotosExistentes; 
    }

    if (req.files && req.files.length > 0) {
      const nuevasFotos = req.files.map(file => `/uploads/${file.filename}`);
      fotosActuales = [...fotosActuales, ...nuevasFotos];
    }
    
    data.fotos = fotosActuales;

    // Validaciones estrictas numéricas y lógicas
    if (Number(data.precio_clp) <= 0) return res.status(400).json({ mensaje: 'El precio debe ser mayor a 0.' });
    if (data.tipo !== 'terreno') {
      if (Number(data.dormitorios) <= 0) return res.status(400).json({ mensaje: 'Debe tener al menos 1 dormitorio.' });
      if (Number(data.banos) <= 0) return res.status(400).json({ mensaje: 'Debe tener al menos 1 baño.' });
      if (Number(data.area_construida) <= 0 || Number(data.area_terreno) <= 0) return res.status(400).json({ mensaje: 'Las áreas deben ser mayores a 0.' });
      if (Number(data.area_construida) > Number(data.area_terreno)) return res.status(400).json({ mensaje: 'Los metros construidos no pueden superar a los del terreno.' });
    } else {
      if (Number(data.area_terreno) <= 0) return res.status(400).json({ mensaje: 'El área del terreno debe ser mayor a 0.' });
    }

    if (fotosActuales.length === 0) {
      return res.status(400).json({ mensaje: 'La propiedad debe tener al menos una fotografía.' });
    }

    // Verificar Rol de Avaluó duplicado
    if (data.numero_bien_raiz && data.numero_bien_raiz !== propiedad.numero_bien_raiz) {
      const existeRol = await Propiedad.findOne({ where: { numero_bien_raiz: data.numero_bien_raiz } });
      if (existeRol) {
        return res.status(400).json({ mensaje: 'Ya existe otra propiedad con ese Rol de Avaluó.' });
      }
    }

    // Admin puede reasignar propietario o cambiar estado.
    if (req.usuario.rol !== 'admin') {
      delete data.propietario_id;
    }

    await propiedad.update(data);
    res.json({ mensaje: 'Propiedad actualizada.', propiedad: parseFotos(propiedad) });

  } catch (error) {
    console.error('Error al actualizar propiedad:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// DELETE /api/propiedades/:id
const deletePropiedad = async (req, res) => {
  try {
    const propiedad = await Propiedad.findByPk(req.params.id);
    if (!propiedad) return res.status(404).json({ mensaje: 'Propiedad no encontrada.' });

    // Permisos
    if (req.usuario.rol !== 'admin' && propiedad.propietario_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permisos.' });
    }

    // Borrar fotos físicas (opcional pero bueno)
    if (propiedad.fotos && propiedad.fotos.length > 0) {
      propiedad.fotos.forEach(foto => {
        const fullPath = path.join(__dirname, '../..', foto);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    await propiedad.destroy();
    res.json({ mensaje: 'Propiedad eliminada.' });

  } catch (error) {
    console.error('Error al eliminar propiedad:', error);
    res.status(500).json({ mensaje: 'Error interno.' });
  }
};

module.exports = {
  getPropiedadesPublicas,
  getAllPropiedadesAdmin,
  getMisPropiedades,
  getPropiedadById,
  createPropiedad,
  updatePropiedad,
  deletePropiedad
};
