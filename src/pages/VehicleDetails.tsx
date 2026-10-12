import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Gauge,
  CalendarDays,
  Users,
  Fuel,
  Armchair,
  Sun,
  Lightbulb,
  Monitor,
  Camera,
  ShieldCheck,
  KeyRound,
  BriefcaseBusiness,
  MessageCircle,
  Check,
} from "lucide-react"

import "./VehicleDetails.css"

function VehicleDetails() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Armchair,
      title: "Asientos de cuero premium",
      description: "Interior elegante y confortable",
    },
    {
      icon: Sun,
      title: "Techo panorámico",
      description: "Mayor luminosidad en el interior",
    },
    {
      icon: Lightbulb,
      title: "Luces LED",
      description: "Iluminación moderna",
    },
    {
      icon: Monitor,
      title: "Pantalla multimedia",
      description: "Bluetooth, Apple CarPlay y Android Auto",
    },
    {
      icon: Camera,
      title: "Cámara y sensores",
      description: "Asistencia durante el estacionamiento",
    },
    {
      icon: ShieldCheck,
      title: "Seguridad avanzada",
      description: "Sistemas de asistencia al conductor",
    },
    {
      icon: KeyRound,
      title: "Acceso inteligente",
      description: "Encendido por botón",
    },
    {
      icon: BriefcaseBusiness,
      title: "Maletero amplio",
      description: "Asientos traseros abatibles",
    },
  ]

  return (
    <main className="vehicle-details-page">
      <div className="vehicle-details-container">
        <button
          className="vehicle-back-button"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft size={18} />
          Volver a los vehículos
        </button>

        <div className="vehicle-details-layout">
          <section className="vehicle-gallery">
            <div className="vehicle-main-image">
              <img
                src="/hyundai-santa-fe-negro.jpg"
                alt="Hyundai Santa Fe Calligraphy Hybrid 2022 negro"
              />

              <span className="vehicle-hybrid-badge">
                <Check size={15} />
                Híbrido
              </span>
            </div>

            <p className="vehicle-image-caption">
              Hyundai Santa Fe Calligraphy · Exterior negro
            </p>
          </section>

          <aside className="vehicle-summary">
            <span className="vehicle-summary-brand">
              HYUNDAI
            </span>

            <h1>Santa Fe Calligraphy</h1>

            <p className="vehicle-summary-subtitle">
              Híbrido · Edición Calligraphy
            </p>

            <div className="vehicle-summary-price">
              <span>Precio de venta</span>
              <strong>34.000 USD</strong>
            </div>

            <div className="vehicle-specifications">
              <div>
                <CalendarDays size={19} />
                <span>
                  <small>Año</small>
                  <strong>2022</strong>
                </span>
              </div>

              <div>
                <Gauge size={19} />
                <span>
                  <small>Recorrido</small>
                  <strong>62.000 millas</strong>
                </span>
              </div>

              <div>
                <Fuel size={19} />
                <span>
                  <small>Motor indicado</small>
                  <strong>2.0 híbrido</strong>
                </span>
              </div>

              <div>
                <Users size={19} />
                <span>
                  <small>Capacidad</small>
                  <strong>5 pasajeros</strong>
                </span>
              </div>
            </div>

            <a
              className="vehicle-contact-button"
              href="https://wa.me/528335053883"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={19} />
              Consultar por WhatsApp
            </a>

            <p className="vehicle-contact-note">
              Contacta para consultar disponibilidad y más información.
            </p>
          </aside>
        </div>

        <section className="vehicle-features-section">
          <div className="vehicle-section-heading">
            <span>DETALLES DEL VEHÍCULO</span>
            <h2>Equipamiento y características</h2>
            <p>
              Comodidad, tecnología y funcionalidad para cada viaje.
            </p>
          </div>

          <div className="vehicle-features-grid">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  className="vehicle-feature"
                  key={feature.title}
                >
                  <div className="vehicle-feature-icon">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </article>
              )
            })}
          </div>

          <p className="vehicle-disclaimer">
            Confirma las especificaciones exactas del motor y el
            equipamiento con el vendedor antes de la compra.
          </p>
        </section>
      </div>
    </main>
  )
}

export default VehicleDetails