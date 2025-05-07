const { Connect } = require('../db');

// Crear un nuevo acceso
exports.createAcceso = async (req, res) => {
    const { vehiculo_id, usuario_id, entrada, salida, minutos, total_pago } = req.body;
  
    if (!usuario_id) {
      return res.status(400).json({ error: 'El campo usuario_id es obligatorio' });
    }
  
    const connection = await Connect();
    const [userRows] = await connection.query(
      'SELECT id FROM usuarios WHERE id = ?',
      [usuario_id]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
  
    try {
      const [result] = await connection.query(
        `INSERT INTO accesos 
          (vehiculo_id, usuario_id, entrada, salida, minutos, total_pago) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [vehiculo_id, usuario_id, entrada, salida, minutos, total_pago]
      );
      res.status(201).json({ message: 'Acceso creado' });
    } catch (error) {
      console.error('Error al crear el acceso:', error);
      res.status(500).json({ error: 'Error al crear el acceso' });
    }
};
  

// Obtener todos los accesos
exports.getAccesos = async (req, res) => {
    try {
        const connection = await Connect();
        const [rows] = await connection.query(` SELECT * FROM accesos `);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener los accesos:', error);
        res.status(500).json({ error: 'Error al obtener los accesos' });
    }
};

// Obtener un acceso por ID
exports.getAccesoById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const connection = await Connect();
        const [rows] = await connection.query(` SELECT * FROM accesos WHERE id = ? `, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Acceso no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el acceso:', error);
        res.status(500).json({ error: 'Error al obtener el acceso' });
    }
};

// Actualizar un acceso
exports.updateAcceso = async (req, res) => {
    const { id } = req.params;
    const { vehiculo_id, usuario_id, entrada, salida, minutos, total_pago } = req.body;

    try {
        const connection = await Connect();

        // Actualizar el acceso
        const [result] = await connection.query(
            ` UPDATE accesos 
            SET vehiculo_id = ?, usuario_id = ?, entrada = ?, salida = ?, minutos = ?, total_pago = ? 
            WHERE id = ? `, 
            [
                vehiculo_id, 
                usuario_id, 
                entrada,
                salida,
                minutos,
                total_pago,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Acceso no encontrado' });
        }

        res.status(200).json({ message: 'Acceso actualizado' });
    } catch (error) {
        console.error('Error al actualizar el acceso:', error);
        res.status(500).json({ error: 'Error al actualizar el acceso' });
    }
};

// Eliminar un acceso
exports.deleteAcceso = async (req, res) => {
    const { id } = req.params;
    
    try {
        const connection = await Connect();
        const [result] = await connection.query(` DELETE FROM accesos WHERE id = ? `, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Acceso no encontrado' });
        }

        res.status(200).json({ message: 'Acceso eliminado' });        
    } catch (error) {
        console.error('Error al eliminar el acceso:', error);
        res.status(500).json({ error: 'Error al eliminar el acceso' });
    }
};

