const express = require('express');
const router = express.Router();
const accesoController = require('../controllers/accesosController');

// Rutas para los accesos
router.post('/', accesoController.createAcceso); // Crear un nuevo acceso
router.get('/',  accesoController.getAccesos); // Obtener todos los accesos
router.get('/:id',  accesoController.getAccesoById); // Obtener un acceso por ID
router.put('/:id',  accesoController.updateAcceso); // Actualizar un acceso
router.delete('/:id',  accesoController.deleteAcceso); // Eliminar un acceso

module.exports = router;