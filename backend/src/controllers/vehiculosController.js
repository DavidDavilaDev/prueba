const { Connect } = require('../db');

// Crea un nuevo vehiculo
exports.createVehiculo = async (req, res) => {
    const { id, placa, tipo, propietario } = req.body;

    try {
        const connection = await Connect();

        // Insertar el nuevo vehiculo
        const [result] = await connection.query(
            ` INSERT INTO vehiculos 
            (id, placa, tipo, propietario) 
            VALUES (?, ?, ?, ?) `, 
            [
                id, 
                placa, 
                tipo, 
                propietario
            ]
        );

        res.status(201).json({ message: 'Vehiculo creado' });
    } catch (error) {
        console.error('Error al crear el vehiculo:', error);
        res.status(500).json({ error: 'Error al crear el vehiculo' });
    }  
};

// Obtiene todos los vehiculos
exports.getVehiculos = async (req, res) => {
    try {
        const connection = await Connect();
        const [rows] = await connection.query(` SELECT * FROM vehiculos `);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener los vehiculos:', error);
        res.status(500).json({ error: 'Error al obtener los vehiculos' });
    }
};

// Obtiene un vehiculo por ID
exports.getVehiculoById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const connection = await Connect();
        const [rows] = await connection.query(` SELECT * FROM vehiculos WHERE id = ? `, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Vehiculo no encontrado' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el vehiculo:', error);
        res.status(500).json({ error: 'Error al obtener el vehiculo' });
    }
};

// Actualiza un vehiculo
exports.updateVehiculo = async (req, res) => {
    const { id } = req.params;
    const { placa, tipo, propietario } = req.body;

    try {
        const connection = await Connect();
        const [result] = await connection.query(` UPDATE vehiculos SET placa = ?, tipo = ?, propietario = ? WHERE id = ? `, [placa, tipo, propietario, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Vehiculo no encontrado' });
        }

        res.status(200).json({ message: 'Vehiculo actualizado' });        
    } catch (error) {
        console.error('Error al actualizar el vehiculo:', error);
        res.status(500).json({ error: 'Error al actualizar el vehiculo' });
    }
};

// Elimina un vehiculo
exports.deleteVehiculo = async (req, res) => {
    const { id } = req.params;
    
    try {
        const connection = await Connect();
        const [result] = await connection.query(` DELETE FROM vehiculos WHERE id = ? `, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Vehiculo no encontrado' });
        }

        res.status(200).json({ message: 'Vehiculo eliminado' });        
    } catch (error) {
        console.error('Error al eliminar el vehiculo:', error);
        res.status(500).json({ error: 'Error al eliminar el vehiculo' });
    }
};


