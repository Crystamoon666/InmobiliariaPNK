const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decodificado; // { id, rol, ... }
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
};

const esAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Requiere privilegios de administrador.' });
  }
  next();
};

const esPropietarioOAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin' && req.usuario?.rol !== 'propietario') {
    return res.status(403).json({ mensaje: 'Acceso denegado.' });
  }
  next();
};

module.exports = {
  verificarToken,
  esAdmin,
  esPropietarioOAdmin
};
