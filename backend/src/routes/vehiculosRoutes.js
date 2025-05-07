const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculosController');

// Rutas para los vehículos
router.post('/', vehiculoController.createVehiculo); // Crear un nuevo vehículo
router.get('/',  vehiculoController.getVehiculos); // Obtener todos los vehículos
router.get('/:id', vehiculoController.getVehiculoById); // Obtener un vehículo por ID
router.put('/:id',  vehiculoController.updateVehiculo); // Actualizar un vehículo
router.delete('/:id',  vehiculoController.deleteVehiculo); // Eliminar un vehículo

module.exports = router;