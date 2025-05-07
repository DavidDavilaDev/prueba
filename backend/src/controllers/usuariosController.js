require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Connect} = require('../db');
const saltRounds = 10;

const JWT_SECRET = process.env.JWT_SECRET;

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    const {nombre, correo, contrasena, rol} = req.body;
    
    try {
        const connection = await Connect();

        // Hashear la contrasena
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Insertar el nuevo usuario
        const [result] = await connection.query(
            ` INSERT INTO usuarios 
            (nombre, correo, contrasena, rol) 
            VALUES (?, ?, ?, ?) `, 
            [
                nombre, 
                correo, 
                hashedPassword, 
                rol
            ]
        );

        res.status(201).json({ message: 'Usuario creado' });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }  
};

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
    try {
        const connection = await Connect();

        // Obtener todos los usuarios
        const [rows] = await connection.query(` SELECT * FROM usuarios `);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
}

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const connection = await Connect();

        // Obtener el usuario por ID
        const [rows] = await connection.query( ` SELECT * FROM usuarios WHERE id = ? `, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, contrasena, rol } = req.body;
    
    try {
        const connection = await Connect();

        let hashedPassword = null;
        if (contrasena) {
            hashedPassword = await bcrypt.hash(contrasena, saltRounds);
        }

        // Actualizar el usuario
        const query = ` UPDATE usuarios 
        SET nombre = ?, correo = ?, contrasena = COALESCE(?, contrasena), rol = ? 
        WHERE id = ? `;

        const values = [
            nombre, 
            correo, 
            hashedPassword, 
            rol,
            id
        ];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado' });

    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
}

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        const connection = await Connect();

        // Eliminar el usuario
        const [result] = await connection.query(` DELETE FROM usuarios WHERE id = ? `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
}

// Iniciar sesión
exports.login = async (req, res) => {
    const { correo, contrasena } = req.body;
    
    try {
        const connection = await Connect();

        // Obtener el usuario por correo
        const [rows] = await connection.query(` SELECT * FROM usuarios WHERE correo = ? `, [correo]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = rows[0];

        // Verificar la contrasena
        const match = await bcrypt.compare(contrasena, user.contrasena);
        if (!match) {
            return res.status(401).json({ error: 'contrasena incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}
