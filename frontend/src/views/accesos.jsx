import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAccesos,
  deleteAcceso,
  createAcceso,
  updateAcceso,
  getVehiculos,
  getUsers
} from "../api/api";
import "../styles/accesos.css";

const PRICE_PER_HOUR = 20; // Precio por hora

// Función para calcular minutos y total a pagar
const calculateCharges = (entrada, salida) => {
    if (!entrada || !salida) return { minutes: "", total: "" };
    const start = new Date(entrada);
    const end = new Date(salida);
    const diffMs = end - start;
    if (diffMs < 0) return { minutes: 0, total: "0.00" };
    const minutes = Math.floor(diffMs / (1000 * 60));
    const total = ((minutes / 60) * PRICE_PER_HOUR).toFixed(2);
    return { minutes, total };
};

const Accesos = () => {
    const [accesos, setAccesos] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [currentAcceso, setCurrentAcceso] = useState(null);

    const [formData, setFormData] = useState({
        vehiculo_id: "",
        usuario_id: "",
        entrada: new Date().toISOString().slice(0, 16),
        salida: "",
        minutos: "",
        total_pago: "",
    });

    // Función central para cargar todos los datos
    const fetchData = async () => {
        setLoading(true);
        try {
        const [accesosData, vehiculosData, usuariosData] = await Promise.all([
            getAccesos(),
            getVehiculos(),
            getUsers()
        ]);
        setAccesos(accesosData);
        setVehiculos(vehiculosData);
        setUsuarios(usuariosData);
        setError("");
        } catch (err) {
        console.error(err);
        setError("Error al cargar datos");
        } finally {
        setLoading(false);
        }
    };

    // Inicializar datos
    useEffect(() => {
        fetchData();
    }, []);

    // Sincronizar formulario al editar o crear
    useEffect(() => {
        if (currentAcceso) {
        const base = {
            ...currentAcceso,
            entrada: currentAcceso.entrada.slice(0, 16),
            salida: currentAcceso.salida ? currentAcceso.salida.slice(0, 16) : "",
        };
        const charges = calculateCharges(base.entrada, base.salida);
        setFormData({ ...base, minutos: charges.minutes, total_pago: charges.total });
        } else {
        setFormData({
            vehiculo_id: "",
            usuario_id: "",
            entrada: new Date().toISOString().slice(0, 16),
            salida: "",
            minutos: "",
            total_pago: "",
        });
        }
    }, [currentAcceso]);

    // Eliminar acceso y recargar
    const handleDelete = async (id) => {
        try {
        await deleteAcceso(id);
        await fetchData();
        } catch {
        setError("Error al eliminar el acceso");
        }
    };

    // Abrir modal para editar
    const handleEdit = (acceso) => {
        setCurrentAcceso(acceso);
        setModalOpen(true);
    };

    // Abrir modal para crear
    const handleCreate = () => {
        setCurrentAcceso(null);
        setModalOpen(true);
    };

    // Cerrar modal
    const handleModalClose = () => {
        setModalOpen(false);
        setCurrentAcceso(null);
        setError("");
    };

    // Manejar cambios en el formulario
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        if (name === "salida" || name === "entrada") {
            const { minutes, total } = calculateCharges(
            updated.entrada,
            updated.salida
            );
            updated.minutos = minutes;
            updated.total_pago = total;
        }
        return updated;
        });
    };

    // Guardar acceso (crear o actualizar) y recargar
    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setError("");
        try {
        if (currentAcceso) {
            await updateAcceso(currentAcceso.id, formData);
        } else {
            await createAcceso(formData);
        }
        handleModalClose();
        await fetchData();
        } catch (err) {
        console.error(err);
        setError(err.message || "Error al guardar el acceso");
        } finally {
        setModalLoading(false);
        }
    };

    if (loading)
        return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando accesos...</p>
        </div>
        );

    return (
        <div className="accesos-container">
        <header className="accesos-header">
            <h1>Registro de Accesos</h1>
            <Link to="/dashboard" className="back-button">
            ← Volver al Dashboard
            </Link>
        </header>

        <div className="actions-bar">
            <button className="action-button create" onClick={handleCreate}>
            + Nuevo Acceso
            </button>
        </div>

        {error && !modalOpen && (
            <div className="error-alert">⚠ {error}</div>
        )}

        <div className="table-container">
            <table className="data-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Vehículo</th>
                <th>Usuario</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Minutos</th>
                <th>Total Pagado</th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {accesos.map((acceso) => (
                <tr key={acceso.id}>
                    <td>{acceso.id}</td>
                    <td>{vehiculos.find((v) => v.id === acceso.vehiculo_id)?.placa || acceso.vehiculo_id}</td>
                    <td>{usuarios.find((u) => u.id === acceso.usuario_id)?.nombre || acceso.usuario_id}</td>
                    <td>{new Date(acceso.entrada).toLocaleString()}</td>
                    <td>{acceso.salida ? new Date(acceso.salida).toLocaleString() : 'En estacionamiento'}</td>
                    <td>{acceso.minutos || '-'}</td>
                    <td>${acceso.total_pago || '0.00'}</td>
                    <td>
                    <button className="table-action edit" onClick={() => handleEdit(acceso)}>Editar</button>
                    <button className="table-action delete" onClick={() => handleDelete(acceso.id)}>Eliminar</button>
                    </td>
                </tr>
                ))}
                {accesos.length === 0 && (
                <tr>
                    <td colSpan="8" className="no-records">No hay registros de accesos</td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {modalOpen && (
            <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                <h2>{currentAcceso ? 'Editar Acceso' : 'Nuevo Acceso'}</h2>
                <button className="modal-close" onClick={handleModalClose}>×</button>
                </div>
                <div className="modal-body">
                {error && <div className="error-alert">⚠ {error}</div>}
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                    <label>Vehículo:</label>
                    <select name="vehiculo_id" value={formData.vehiculo_id} onChange={handleFormChange} required>
                        <option value="">Seleccione vehículo</option>
                        {vehiculos.map((v) => (
                        <option key={v.id} value={v.id}>{v.placa} - {v.tipo}</option>
                        ))}
                    </select>
                    </div>

                    <div className="form-group">
                    <label>Usuario:</label>
                    <select name="usuario_id" value={formData.usuario_id} onChange={handleFormChange} required>
                        <option value="">Seleccione usuario</option>
                        {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>{u.nombre}</option>
                        ))}
                    </select>
                    </div>

                    <div className="form-group">
                    <label>Fecha y Hora de Entrada:</label>
                    <input type="datetime-local" name="entrada" value={formData.entrada} onChange={handleFormChange} required />
                    </div>

                    <div className="form-group">
                    <label>Fecha y Hora de Salida:</label>
                    <input type="datetime-local" name="salida" value={formData.salida} onChange={handleFormChange} />
                    </div>

                    <div className="form-row">
                    <div className="form-group">
                        <label>Minutos Estacionado:</label>
                        <input type="number" name="minutos" value={formData.minutos} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Total a Pagar:</label>
                        <input type="number" name="total_pago" step="0.01" value={formData.total_pago} readOnly />
                    </div>
                    </div>

                    <div className="modal-footer">
                    <button type="button" className="modal-button cancel" onClick={handleModalClose} disabled={modalLoading}>Cancelar</button>
                    <button type="submit" className="modal-button save" disabled={modalLoading}>{modalLoading ? 'Guardando...' : 'Guardar'}</button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default Accesos;