import { useState } from "react"
import { login } from "../api/api"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import "../styles/login.css"

const Login = () => {
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { login: loginUsuario } = useUser()

    // Maneja el evento de inicio de sesión
    // Se encarga de autenticar al usuario y redirigirlo a la página de inicio
    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")

        if (!correo || !contrasena) {
        setError("Por favor, completa todos los campos.")
        return
        }

        setLoading(true)

        try {
        const response = await login(correo, contrasena)

        loginUsuario({
            id: response.id,
            nombre: response.nombre,
            correo: response.correo,
            rol: response.rol,
            token: response.token,
        })

        navigate("/dashboard")
        } catch (err) {
        setError(err.message || "Credenciales incorrectas")
        } finally {
        setLoading(false)
        }
    }

    return (
        <div className="login-container">
        <div className="login-card">
            <div className="login-header">
            <h1>Sistema de Estacionamiento</h1>
            <div className="login-logo">
                <span className="logo-icon">🅿️</span>
            </div>
            </div>

            <div className="login-form-container">
            <h2>Iniciar Sesión</h2>
            <p className="login-subtitle">Ingrese sus credenciales para acceder al sistema</p>

            {error && (
                <div className="login-error">
                <span className="error-icon">!</span>
                {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                <label htmlFor="correo" className="form-label">
                    Correo electrónico
                </label>
                <div className="input-with-icon">
                    <input
                    id="correo"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="form-input"
                    required
                    />
                </div>
                </div>

                <div className="form-group">
                <label htmlFor="contrasena" className="form-label">
                    Contraseña
                </label>
                <div className="input-with-icon">
                    <input
                    id="contrasena"
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    className="form-input"
                    required
                    />
                </div>
                </div>

                <button type="submit" className="login-button" disabled={!correo || !contrasena || loading}>
                {loading ? (
                    <>
                    <span className="button-spinner"></span>
                    <span>Iniciando sesión...</span>
                    </>
                ) : (
                    "Iniciar Sesión"
                )}
                </button>
            </form>
            </div>
        </div>
        </div>
    )
}

export default Login
