const express = require('express');
const router = express.Router();
const propiedadController = require('../controllers/propiedadController');
const { verificarToken, esAdmin, esPropietarioOAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Públicas
router.get('/', propiedadController.getPropiedadesPublicas);
router.get('/detalle/:id', propiedadController.getPropiedadById);

// Requieren Autenticación
router.use(verificarToken);

// Propietarios y Admin
router.get('/mis-propiedades', esPropietarioOAdmin, propiedadController.getMisPropiedades);
router.post('/', esPropietarioOAdmin, upload.array('fotos', 10), propiedadController.createPropiedad);
router.put('/:id', esPropietarioOAdmin, upload.array('fotos', 10), propiedadController.updatePropiedad);
router.delete('/:id', esPropietarioOAdmin, propiedadController.deletePropiedad);

// Solo Admin
router.get('/admin', esAdmin, propiedadController.getAllPropiedadesAdmin);

module.exports = router;
