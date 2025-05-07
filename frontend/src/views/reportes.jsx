import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { getAccesos, getVehiculos } from "../api/api"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import "../styles/reportes.css"

const Reportes = () => {
    const [accesos, setAccesos] = useState([])
    const [filtro, setFiltro] = useState({
        fecha: new Date().toISOString().slice(0, 10),
        horaInicio: "00:00",
        horaFin: "23:59",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const tableRef = useRef(null)

    // Formateador de moneda MXN
    const currencyFormatter = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    })

    useEffect(() => {
        fetchData()
    }, [])

    // Función para obtener los accesos y vehículos
    const fetchData = async () => {
    setLoading(true)
        try {
        const [accesosData, vehiculosData] = await Promise.all([getAccesos(), getVehiculos()])

        const merged = accesosData.map((acc) => ({
            ...acc,
            vehiculo: vehiculosData.find((v) => v.id === acc.vehiculo_id) || {},
        }))

        setAccesos(merged)
        } catch (err) {
        console.error(err)
        setError("Error al cargar los datos")
        } finally {
        setLoading(false)
        }
    }

    // Función para manejar el cambio de filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFiltro((prev) => ({ ...prev, [name]: value }))
    }

    // Función para filtrar los accesos según la fecha y hora
    const filtrarAccesos = () => {
    return accesos.filter((acceso) => {
        const fechaAcceso = new Date(acceso.entrada).toISOString().slice(0, 10)
        const horaAcceso = new Date(acceso.entrada).toLocaleTimeString("en-US", { hour12: false }).slice(0, 5)
        return fechaAcceso === filtro.fecha && horaAcceso >= filtro.horaInicio && horaAcceso <= filtro.horaFin
    })
    }

    // Funciones para exportar a Excel y PDF
    const exportToExcel = () => {
    const reporte = filtrarAccesos().map((acceso) => ({
        Placa: acceso.vehiculo.placa || "N/A",
        Tipo: acceso.vehiculo.tipo || "N/A",
        Entrada: new Date(acceso.entrada).toLocaleString(),
        Salida: acceso.salida ? new Date(acceso.salida).toLocaleString() : "En estacionamiento",
        "Minutos Estacionado": acceso.minutos || 0,
        "Total a Pagar": Number(acceso.total_pago) || 0,
    }))

    const ws = XLSX.utils.json_to_sheet(reporte)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Reporte")
    XLSX.writeFile(wb, `Reporte_${filtro.fecha}.xlsx`)
    }

    const exportToPDF = () => {
    const input = tableRef.current
    html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF("p", "pt", "a4")
        const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
        pdf.save(`Reporte_${filtro.fecha}.pdf`)
    })
    }

    // Renderizado del componente
    if (loading)
    return (
        <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando reportes...</p>
        </div>
    )

    if (error)
    return (
        <div className="error-container">
        <div className="error-icon">!</div>
        <p>{error}</p>
        </div>
    )

    const accesosFiltrados = filtrarAccesos()

    return (
        <div className="reportes-container">
        <header className="reportes-header">
            <div className="header-left">
            <h1>Reportes de Accesos</h1>
            </div>
            <div className="header-right">
            <Link to="/" className="back-button">
                <span className="icon">←</span>
                Volver al Dashboard
            </Link>
            </div>
        </header>

        <div className="filter-section">
            <div className="filter-group">
            <label className="filter-label">
                Fecha:
                <input
                type="date"
                name="fecha"
                value={filtro.fecha}
                onChange={handleFilterChange}
                className="filter-input"
                />
            </label>
            <label className="filter-label">
                Desde:
                <input
                type="time"
                name="horaInicio"
                value={filtro.horaInicio}
                onChange={handleFilterChange}
                className="filter-input"
                />
            </label>
            <label className="filter-label">
                Hasta:
                <input
                type="time"
                name="horaFin"
                value={filtro.horaFin}
                onChange={handleFilterChange}
                className="filter-input"
                />
            </label>
            </div>
        </div>

        <div className="export-section">
            <button onClick={exportToExcel} className="export-button excel">
            <span className="icon">📊</span>
            Exportar a Excel
            </button>
            <button onClick={exportToPDF} className="export-button pdf">
            <span className="icon">📄</span>
            Exportar a PDF
            </button>
        </div>

        <div className="report-header">
            <h2>
            Reporte para {filtro.fecha} ({filtro.horaInicio} - {filtro.horaFin})
            </h2>
        </div>

        <div className="table-container" ref={tableRef}>
            <table className="report-table">
            <thead>
                <tr>
                <th>Núm. Placa</th>
                <th>Tiempo Estacionado</th>
                <th>Tipo</th>
                <th>Cantidad a Pagar</th>
                </tr>
            </thead>
            <tbody>
                {accesosFiltrados.map((acceso) => (
                <tr key={acceso.id}>
                    <td>{acceso.vehiculo.placa || "N/A"}</td>
                    <td>{acceso.minutos ? `${acceso.minutos} min` : "-"}</td>
                    <td>
                    <span
                        className={`vehicle-type ${acceso.vehiculo.tipo?.toLowerCase().replace(" ", "-") || "unknown"}`}
                    >
                        {acceso.vehiculo.tipo || "N/A"}
                    </span>
                    </td>
                    <td className="amount">{currencyFormatter.format(Number(acceso.total_pago) || 0)}</td>
                </tr>
                ))}
                {accesosFiltrados.length === 0 && (
                <tr>
                    <td colSpan="4" className="no-records">
                    No hay registros para este rango
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        <div className="summary-section">
            <div className="summary-card">
            <div className="summary-title">Resumen</div>
            <div className="summary-content">
                <div className="summary-item">
                <div className="summary-label">Total de registros:</div>
                <div className="summary-value">{accesosFiltrados.length}</div>
                </div>
                <div className="summary-item">
                <div className="summary-label">Total recaudado:</div>
                <div className="summary-value">
                    {currencyFormatter.format(
                    accesosFiltrados.reduce((sum, acceso) => sum + (Number(acceso.total_pago) || 0), 0),
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default Reportes
