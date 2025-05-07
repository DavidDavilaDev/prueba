const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuariosController');

// Rutas para los usuarios
router.post('/', usuarioController.createUser); // Crear un nuevo usuario
router.get('/', usuarioController.getUsers); // Obtener todos los usuarios
router.get('/:id',  usuarioController.getUserById); // Obtener un usuario por ID
router.put('/:id',  usuarioController.updateUser); // Actualizar un usuario
router.delete('/:id',  usuarioController.deleteUser); // Eliminar un usuario
router.post('/login', usuarioController.login); // Iniciar sesión


module.exports = router;