import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const UserContext = createContext();

// Crear el proveedor de contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
        const userData = localStorage.getItem('user');
        if (userData) {
            console.log('Datos del usuario al cargar desde localStorage:', JSON.parse(userData));
            setUser(JSON.parse(userData));
        }
        } catch (error) {
        console.error('Error al parsear los datos del usuario:', error);
        setUser(null);
        }
    }, []);
    
    const login = (userData) => {
        const userWithToken = {
        id: userData.id,
        nombre: userData.nombre,
        correo: userData.correo,
        rol: userData.rol,
        token: userData.token, 
        };
    
        console.log('Datos guardados en el contexto:', userWithToken);
    
        setUser(userWithToken);
        localStorage.setItem('user', JSON.stringify(userWithToken));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
        {children}
        </UserContext.Provider>
    );
};

// Hook para usar el contexto
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }
    return context;
};
