
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Car,
  UserRound,
} from "lucide-react"
import { supabase } from "../lib/supabase"
import "./Register.css"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      if (data.session) {
        navigate("/sell")
        return
      }

      setSuccessMessage(
        "Cuenta creada. Revisa tu correo para confirmar el registro y después inicia sesión."
      )
    } catch {
      setErrorMessage("No se pudo conectar. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <Link to="/" className="register-brand">
          <Car size={28} strokeWidth={2} />

          <span>
            Havana<span className="register-brand-dark">Dealer</span>
          </span>
        </Link>

        <div className="register-heading">
          <span className="register-eyebrow">Únete a HavanaDealer</span>
          <h1>Crear cuenta</h1>
          <p>
            Regístrate para publicar tu auto, ver ofertas y gestionar tus anuncios.
          </p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <label htmlFor="register-name">Nombre completo</label>

          <div className="register-input-wrapper">
            <UserRound size={19} />

            <input
              id="register-name"
              type="text"
              placeholder="Tu nombre completo"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <label htmlFor="register-email">Correo electrónico</label>

          <div className="register-input-wrapper">
            <Mail size={19} />

            <input
              id="register-email"
              type="email"
              placeholder="tu@correo.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <label htmlFor="register-password">Contraseña</label>

          <div className="register-input-wrapper">
            <LockKeyhole size={19} />

            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="button"
              className="register-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          <label htmlFor="register-confirm-password">
            Confirmar contraseña
          </label>

          <div className="register-input-wrapper">
            <LockKeyhole size={19} />

            <input
              id="register-confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <p className="register-error" role="alert">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="register-success" role="status">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="register-login">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>

        <p className="register-back">
          <Link to="/">← Volver al inicio</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
