import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, LockKeyhole, Eye, EyeOff, Car } from "lucide-react"
import { supabase } from "../lib/supabase"
import "./Login.css"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setErrorMessage("Correo o contraseña incorrectos.")
        return
      }

      if (!data.user) {
        setErrorMessage("No se pudo verificar tu cuenta.")
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle()

      if (profileError) {
        setErrorMessage(
          "No se pudo verificar tu perfil. Comprueba la configuración de Supabase."
        )
        return
      }

      if (profile?.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/user-panel")
      }
    } catch {
      setErrorMessage("No se pudo conectar. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Link to="/" className="login-brand">
          <Car size={28} strokeWidth={2} />

          <span>
            Havana<span className="login-brand-dark">Dealer</span>
          </span>
        </Link>

        <div className="login-heading">
          <span className="login-eyebrow">Bienvenido de nuevo</span>
          <h1>Iniciar sesión</h1>
          <p>Accede a tu cuenta de HavanaDealer.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="login-email">Correo electrónico</label>

          <div className="login-input-wrapper">
            <Mail size={19} />

            <input
              id="login-email"
              type="email"
              placeholder="tu@correo.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <label htmlFor="login-password">Contraseña</label>

          <div className="login-input-wrapper">
            <LockKeyhole size={19} />

            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="button"
              className="login-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {errorMessage && (
            <p className="login-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <p className="login-back">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>

        <p className="login-back">
          <Link to="/">← Volver al inicio</Link>
        </p>
      </section>
    </main>
  )
}

export default Login