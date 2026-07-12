const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verificarToken, esAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Todas las rutas requieren estar autenticado
router.use(verificarToken);

// GET /api/users - Obtener todos (Solo admin)
router.get('/', esAdmin, userController.getAllUsers);

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', userController.getUserById);

// POST /api/users - Crear usuario (Solo admin)
router.post('/', esAdmin, upload.single('foto'), userController.createUser);

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', upload.single('foto'), userController.updateUser);

// DELETE /api/users/:id - Eliminar usuario (Solo admin)
router.delete('/:id', esAdmin, userController.deleteUser);

module.exports = router;
