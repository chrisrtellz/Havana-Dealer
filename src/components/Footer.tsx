import { Link } from "react-router-dom"
import { CarFront, MapPin, MessageCircle } from "lucide-react"
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span>Havana</span>Dealer
            </Link>

            <p>
              Encuentra tu próximo auto en Cuba.
              Un espacio para descubrir vehículos
              y conectar compradores con vendedores.
            </p>

            <div className="footer-location">
              <MapPin size={16} />
              <span>La Habana, Cuba</span>
            </div>
          </div>

          <div className="footer-column">
            <h3>HavanaDealer</h3>
            <Link to="/">Inicio</Link>
            <a href="#vehiculos">Vehículos</a>
            <a href="#quienes-somos">Quiénes somos</a>
            <a href="#contacto">Contacto</a>
          </div>

          <div className="footer-column">
            <h3>Información legal</h3>
            <Link to="/terminos">Términos y condiciones</Link>
            <Link to="/privacidad">Política de privacidad</Link>
            <Link to="/publicacion">Reglas de publicación</Link>
            <Link to="/cookies">Política de cookies</Link>
          </div>

          <div className="footer-column">
            <h3>¿Necesitas ayuda?</h3>

            <p>
              ¿Tienes alguna pregunta? Escríbenos
              directamente por WhatsApp.
            </p>

            <a
              href="https://wa.me/528335053883"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp"
            >
              <MessageCircle size={17} />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} HavanaDealer.
            Todos los derechos reservados.
          </span>

          <span className="footer-country">
            Hecho en Cuba <CarFront size={17} />
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer