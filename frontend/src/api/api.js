import axios from 'axios';

// URL para pruebas locales 
const URLLOCAL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: URLLOCAL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (correo, contrasena) => {
    try {
        const response = await api.post('/usuarios/login', { correo, contrasena });
        localStorage.setItem('token', response.data.token); // Save token
        console.log('Token saved to localStorage:', response.data.token);
        return response.data;
    } catch (error) {
        console.error('Error en el login:', error);
        throw error;
    }
};

// Crear un nuevo usuario
export const createUser = async (usuarioData) => {
    try {
        const response = await api.post('/usuarios', usuarioData);
        return response.data;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
};

// Obtener todos los usuarios
export const getUsers = async () => {
    try {
        const response = await api.get('/usuarios');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        throw error;
    }
};

// Obtener un usuario por ID
export const getUserById = async (id) => {
    try {
        const response = await api.get(`/usuarios/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};

// Actualizar un usuario
export const updateUser = async (id, usuarioData) => {
    try {
        const response = await api.put(`/usuarios/${id}`, usuarioData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
};

// Eliminar un usuario
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/usuarios/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
    }
};

// Crear un nuevo acceso
export const createAcceso = async (accesoData) => {
    try {
        const response = await api.post('/accesos', accesoData);
        return response.data;
    } catch (error) {
        console.error('Error al crear el acceso:', error);
        throw error;
    }
};

// Obtener todos los accesos
export const getAccesos = async () => {
    try {
        const response = await api.get('/accesos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los accesos:', error);
        throw error;
    }
};

// Obtener un acceso por ID
export const getAccesoById = async (id) => {
    try {
        const response = await api.get(`/accesos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el acceso:', error);
        throw error;
    }
};

// Actualizar un acceso
export const updateAcceso = async (id, accesoData) => {
    try {
        const response = await api.put(`/accesos/${id}`, accesoData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el acceso:', error);
        throw error;
    }
};

// Eliminar un acceso
export const deleteAcceso = async (id) => {
    try {
        const response = await api.delete(`/accesos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el acceso:', error);
        throw error;
    }
};

// Crear un nuevo vehiculo
export const createVehiculo = async (vehiculoData) => {
    try {
        const response = await api.post('/vehiculos', vehiculoData);
        return response.data;
    } catch (error) {
        console.error('Error al crear el vehiculo:', error);
        throw error;
    }
};

// Obtener todos los vehiculos
export const getVehiculos = async () => {
    try {
        const response = await api.get('/vehiculos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los vehiculos:', error);
        throw error;
    }
};

// Obtener un vehiculo por ID
export const getVehiculoById = async (id) => {
    try {
        const response = await api.get(`/vehiculos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el vehiculo:', error);
        throw error;
    }
};

// Actualizar un vehiculo
export const updateVehiculo = async (id, vehiculoData) => {
    try {
        const response = await api.put(`/vehiculos/${id}`, vehiculoData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el vehiculo:', error);
        throw error;
    }
};

// Eliminar un vehiculo
export const deleteVehiculo = async (id) => {
    try {
        const response = await api.delete(`/vehiculos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el vehiculo:', error);
        throw error;
    }
};
