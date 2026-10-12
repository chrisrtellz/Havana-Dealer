import { useState } from "react"
import { Car, Menu, UserRound, X } from "lucide-react"

import "./Navbar.css"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  return (
    <header className="navbar">
      <nav className="navbar-container">

        <a href="/" className="navbar-logo">
          <Car />
          <span>
            <span className="logo-havana">Havana</span>
            <span className="logo-dealer">Dealer</span>
          </span>
        </a>

        <div className="navbar-links">
          <a href="/">Inicio</a>
          <a href="/inventory">Inventario</a>
          <a href="/sell">Vende tu auto</a>
          <a href="/contact">Contacto</a>
        </div>

        <div className="navbar-actions">

          <div className="user-menu-container">

            <button
              className="navbar-login"
              onClick={() => setUserOpen(!userOpen)}
              aria-label="Cuenta"
            >
              <UserRound size={17} />
              <span>Iniciar sesión</span>
            </button>

            {userOpen && (
              <div className="user-menu">
                <a href="/login" onClick={() => setUserOpen(false)}>
                  Iniciar sesión
                </a>

                <a href="/register" onClick={() => setUserOpen(false)}>
                  Registrarse
                </a>
              </div>
            )}

          </div>

          <button
            className="navbar-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

        </div>

        {menuOpen && (
          <div className="mobile-menu">

            <a href="/" onClick={() => setMenuOpen(false)}>
              Inicio
            </a>

            <a href="/inventory" onClick={() => setMenuOpen(false)}>
              Inventario
            </a>

            <a href="/sell" onClick={() => setMenuOpen(false)}>
              Vende tu auto
            </a>

            <a href="/contact" onClick={() => setMenuOpen(false)}>
              Contacto
            </a>

          </div>
        )}

      </nav>
    </header>
  )
}

export default Navbar