const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Importar rutas
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const accesosRoutes = require('./routes/accesosRoutes');

// Rutas de la API
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/accesos', accesosRoutes);

module.exports = app;