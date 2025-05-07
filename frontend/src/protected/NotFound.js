import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente de página no encontrada
const NotFound = () => {
    const navigate = useNavigate();

    // Redirigir a la página de inicio después de 2 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
        navigate('/');
        }, 2000);

        // Limpiar el temporizador al desmontar el componente
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div>
        <h2>Página no encontrada</h2>
        <p>Redirigiendo al inicio...</p>
        </div>
    );
};

export default NotFound;
