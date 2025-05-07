import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
    
        setTimeout(() => {
            if (user) {
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        }, 3000); // 3 seconds delay
    }, [navigate]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            zIndex: 1000
        }}>
            <div style={{ textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        </div>
    );
}

export default Splash;