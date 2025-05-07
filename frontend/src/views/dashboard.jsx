import React, { useState, useEffect } from "react";
import { getAccesos, getVehiculos } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        vehiculosEnEstacionamiento: 0,
        ingresosHoy: 0,
        totalRecaudadoHoy: 0,
        vehiculosPorTipo: {
        oficial: 0,
        residente: 0,
        noResidente: 0,
        },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
        try {
            const [accesos, vehiculos] = await Promise.all([
            getAccesos(),
            getVehiculos(),
            ]);

            // Filtrar accesos del día actual
            const hoy = new Date().toISOString().split("T")[0];
            const accesosHoy = accesos.filter(
            (acceso) =>
                new Date(acceso.entrada).toISOString().split("T")[0] === hoy
            );

            // Filtrar accesos que no tienen salida
            const vehiculosEnEstacionamiento = accesos.filter(
            (acceso) => !acceso.salida
            ).length;
            const totalRecaudadoHoy = accesosHoy.reduce((sum, acceso) => {
            const pago = acceso.total_pago ? parseFloat(acceso.total_pago) : 0;
            return sum + pago;
            }, 0);

            // Contar vehículos por tipo
            const vehiculosPorTipo = {
            oficial: vehiculos.filter((v) => v.tipo === "Oficial").length,
            residente: vehiculos.filter((v) => v.tipo === "Residente").length,
            noResidente: vehiculos.filter((v) => v.tipo === "No Residente").length,
            };

            setStats({
            vehiculosEnEstacionamiento,
            ingresosHoy: accesosHoy.length,
            totalRecaudadoHoy,
            vehiculosPorTipo,
            });
            setLoading(false);
        } catch (err) {
            setError("Error al cargar los datos del dashboard");
            setLoading(false);
        }
        };

        fetchData();
    }, []);
    
    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading)
        return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando dashboard...</p>
        </div>
        );

    if (error)
        return (
        <div className="error-container">
            <div className="error-icon">!</div>
            <p>{error}</p>
        </div>
        );

    return (
        <div className="dashboard-container">
        <header className="dashboard-header">
            <h1>Dashboard de Estacionamiento</h1>
            <div className="navigation-buttons">
            <Link to="/reportes" className="nav-button">
                <span className="icon">📊</span>
                Reportes
            </Link>
            <Link to="/accesos" className="nav-button">
                <span className="icon">🚪</span>
                Accesos
            </Link>
            <Link to="/vehiculos" className="nav-button">
                <span className="icon">🚗</span>
                Vehículos
            </Link>
            <button onClick={handleLogout} className="nav-button logout-button">
                <span className="icon">🔒</span>
                Cerrar Sesión
            </button>
            </div>
        </header>

        <div className="dashboard-content">
            <div className="stats-card">
            <h2>Resumen del Día</h2>
            <div className="stats-grid">
                <div className="stat-item">
                <div className="stat-label">Vehículos en estacionamiento</div>
                <div className="stat-value">
                    {stats.vehiculosEnEstacionamiento}
                </div>
                </div>
                <div className="stat-item">
                <div className="stat-label">Ingresos hoy</div>
                <div className="stat-value">{stats.ingresosHoy}</div>
                </div>
                <div className="stat-item">
                <div className="stat-label">Total recaudado hoy</div>
                <div className="stat-value money">
                    ${stats.totalRecaudadoHoy.toFixed(2)}
                </div>
                </div>
            </div>
            </div>

            <div className="stats-card">
            <h2>Distribución de Vehículos</h2>
            <div className="vehicle-distribution">
                <div className="vehicle-type oficial">
                <div className="vehicle-icon">🚓</div>
                <div className="vehicle-label">Oficiales</div>
                <div className="vehicle-count">
                    {stats.vehiculosPorTipo.oficial}
                </div>
                </div>
                <div className="vehicle-type residente">
                <div className="vehicle-icon">🏠</div>
                <div className="vehicle-label">Residentes</div>
                <div className="vehicle-count">
                    {stats.vehiculosPorTipo.residente}
                </div>
                </div>
                <div className="vehicle-type no-residente">
                <div className="vehicle-icon">🚙</div>
                <div className="vehicle-label">No Residentes</div>
                <div className="vehicle-count">
                    {stats.vehiculosPorTipo.noResidente}
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default Dashboard;
