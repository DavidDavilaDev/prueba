import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    getVehiculos,
    deleteVehiculo,
    createVehiculo,
    updateVehiculo
} from "../api/api";
import "../styles/vehiculos.css";

const Vehiculos = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [currentVehiculo, setCurrentVehiculo] = useState(null);

    const [formData, setFormData] = useState({
        placa: "",
        tipo: "No Residente",
        propietario: "",
        tarifa: 3.0,
    });

    // Formateador de moneda MXN
    const currencyFormatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    // Función para derivar tarifa según tipo
    const getTarifaPorTipo = (tipo) => {
        switch (tipo) {
        case 'Oficial': return 0;
        case 'Residente': return 1;
        default: return 3;
        }
    };

    // Recarga todos los vehículos
    const fetchVehiculos = async () => {
        setLoading(true);
        try {
        const data = await getVehiculos();
        setVehiculos(data);
        setError("");
        } catch (err) {
        console.error(err);
        setError("Error al cargar los vehículos");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehiculos();
    }, []);

    // Sincronizar formulario al editar o crear
    useEffect(() => {
        if (currentVehiculo) {
        setFormData(currentVehiculo);
        } else {
        setFormData({
            placa: "",
            tipo: "No Residente",
            propietario: "",
            tarifa: 3.0,
        });
        }
    }, [currentVehiculo]);

    // Eliminar y recargar
    const handleDelete = async (id) => {
        try {
        await deleteVehiculo(id);
        await fetchVehiculos();
        } catch (err) {
        console.error(err);
        setError("Error al eliminar el vehículo");
        }
    };

    // Abrir modal
    const handleEdit = (v) => {
        setCurrentVehiculo(v);
        setModalOpen(true);
    };
    const handleCreate = () => {
        setCurrentVehiculo(null);
        setModalOpen(true);
    };
    const handleModalClose = () => {
        setModalOpen(false);
        setCurrentVehiculo(null);
        setError("");
    };

    // Manejar cambios en formulario
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        if (name === "tipo") {
            newData.tarifa = getTarifaPorTipo(value);
        }
        return newData;
        });
    };

    // Crear o actualizar y recargar
    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setError("");
        try {
        if (currentVehiculo) {
            await updateVehiculo(currentVehiculo.id, formData);
        } else {
            await createVehiculo(formData);
        }
        handleModalClose();
        await fetchVehiculos();
        } catch (err) {
        console.error(err);
        setError(err.message || "Error al guardar el vehículo");
        } finally {
        setModalLoading(false);
        }
    };

    if (loading)
        return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando vehículos...</p>
        </div>
        );

    return (
        <div className="vehiculos-container">
        <header className="vehiculos-header">
            <h1>Registro de Vehículos</h1>
            <Link to="/dashboard" className="back-button">← Volver al Dashboard</Link>
        </header>

        <div className="actions-bar">
            <button className="action-button create" onClick={handleCreate}>+ Nuevo Vehículo</button>
        </div>

        {error && !modalOpen && <div className="error-alert">⚠ {error}</div>}

        <div className="table-container">
            <table className="data-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Tipo</th>
                <th>Propietario</th>
                <th>Tarifa/min</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {vehiculos.map((vehiculo) => {
                const tarifa = getTarifaPorTipo(vehiculo.tipo);
                return (
                    <tr key={vehiculo.id}>
                    <td>{vehiculo.id}</td>
                    <td>{vehiculo.placa}</td>
                    <td>
                        <span className={
                        `vehicle-type ${vehiculo.tipo?.toLowerCase().replace(/\s+/g, "-") || "unknown"}`
                        }>
                        {vehiculo.tipo || "N/A"}
                        </span>
                    </td>
                    <td>{vehiculo.propietario || "N/A"}</td>
                    <td className="amount">
                        {currencyFormatter.format(tarifa)}
                    </td>
                    <td className="actions-cell">
                        <button className="table-action edit" onClick={() => handleEdit(vehiculo)}>Editar</button>
                        <button className="table-action delete" onClick={() => handleDelete(vehiculo.id)}>Eliminar</button>
                    </td>
                    </tr>
                );
                })}
                {vehiculos.length === 0 && (
                <tr><td colSpan="6" className="no-records">No hay vehículos registrados</td></tr>
                )}
            </tbody>
            </table>
        </div>

        {/* Modal de Vehículo */}
        {modalOpen && (
            <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                <h2>{currentVehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}</h2>
                <button className="modal-close" onClick={handleModalClose}>
                    ×
                </button>
                </div>
                <div className="modal-body">
                {error && <div className="error-alert">{error}</div>}
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                    <label className="form-label">Placa:</label>
                    <input
                        type="text"
                        className="form-input"
                        name="placa"
                        value={formData.placa}
                        onChange={handleFormChange}
                        required
                    />
                    </div>

                    <div className="form-group">
                    <label className="form-label">Tipo:</label>
                    <select
                        className="form-select"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleFormChange}
                        required
                    >
                        <option value="Oficial">Oficial</option>
                        <option value="Residente">Residente</option>
                        <option value="No Residente">No Residente</option>
                    </select>
                    </div>

                    <div className="form-group">
                    <label className="form-label">Propietario:</label>
                    <input
                        type="text"
                        className="form-input"
                        name="propietario"
                        value={formData.propietario}
                        onChange={handleFormChange}
                    />
                    </div>

                    <div className="form-group">
                    <label className="form-label">Tarifa por minuto:</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-input readonly"
                        name="tarifa"
                        value={formData.tarifa}
                        onChange={handleFormChange}
                        disabled
                    />
                    </div>

                    <div className="modal-footer">
                    <button
                        type="button"
                        className="modal-button cancel"
                        onClick={handleModalClose}
                        disabled={modalLoading}
                    >
                        Cancelar
                    </button>
                    <button type="submit" className="modal-button save" disabled={modalLoading}>
                        {modalLoading ? "Guardando..." : "Guardar"}
                    </button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        )}
        </div>
    )
}

export default Vehiculos
