import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './protected/NotFound';
import { UserProvider } from './context/UserContext';
import Splash from './views/splash';
import Login from './views/login';
import Dashboard from './views/dashboard';
import Accesos from './views/accesos';
import Vehiculos from './views/vehiculos';
import Reportes from './views/reportes';

function App() {
  return (
    <>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/accesos" element={<Accesos />} />
            <Route path="/vehiculos" element={<Vehiculos />}/>
            <Route path="/reportes" element={<Reportes />}/>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;