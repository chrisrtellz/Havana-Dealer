import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

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

import { supabase } from "../lib/supabase"
import "./VehicleDetails.css"

type Vehicle = {
  id: string
  brand: string
  model: string
  version: string | null
  year: number
  price_usd: number
  mileage: number | null
  mileage_unit: string
  fuel_type: string | null
  transmission: string | null
  body_type: string | null
  color: string | null
  province: string
  description: string | null
  contact_phone: string
  vehicle_images: {
    image_url: string
    is_cover: boolean
    display_order: number
  }[]
}

function VehicleDetails() {
  const { slug } = useParams()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function loadVehicle() {
      setLoading(true)
      setError("")

      // El identificador del vehículo es el último bloque de la URL.
      const vehicleId = slug?.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )?.[0]

      if (!vehicleId) {
        if (active) {
          setError("No encontramos este vehículo.")
          setLoading(false)
        }
        return
      }

      const { data, error } = await supabase
        .from("vehicles")
        .select(`
          id,
          brand,
          model,
          version,
          year,
          price_usd,
          mileage,
          mileage_unit,
          fuel_type,
          transmission,
          body_type,
          color,
          province,
          description,
          contact_phone,
          vehicle_images (
            image_url,
            is_cover,
            display_order
          )
        `)
        .eq("id", vehicleId)
        .eq("status", "published")
        .maybeSingle()

      if (!active) return

      if (error) {
        console.error("Error cargando el vehículo:", error.message)
        setError("No pudimos cargar los datos del vehículo.")
        setVehicle(null)
      } else if (!data) {
        setError("Este vehículo no existe o ya no está publicado.")
        setVehicle(null)
      } else {
        setVehicle(data as Vehicle)
      }

      setLoading(false)
    }

    loadVehicle()

    return () => {
      active = false
    }
  }, [slug])

  const features = [
    {
      icon: Armchair,
      title: "Interior",
      description: "Consulta el estado y el equipamiento con el vendedor.",
    },
    {
      icon: Sun,
      title: "Confort",
      description: "Confirma qué elementos de confort incluye.",
    },
    {
      icon: Lightbulb,
      title: "Iluminación",
      description: "Consulta el tipo de iluminación instalado.",
    },
    {
      icon: Monitor,
      title: "Multimedia",
      description: "Confirma las funciones multimedia disponibles.",
    },
    {
      icon: Camera,
      title: "Estacionamiento",
      description: "Pregunta si incluye cámara o sensores.",
    },
    {
      icon: ShieldCheck,
      title: "Seguridad",
      description: "Verifica los sistemas de seguridad del vehículo.",
    },
    {
      icon: KeyRound,
      title: "Acceso",
      description: "Consulta las características de acceso y encendido.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Espacio",
      description: "Comprueba la capacidad y el espacio de carga.",
    },
  ]

  if (loading) {
    return (
      <main className="vehicle-details-page">
        <div className="vehicle-details-container">
          <p>Cargando vehículo...</p>
        </div>
      </main>
    )
  }

  if (!vehicle || error) {
    return (
      <main className="vehicle-details-page">
        <div className="vehicle-details-container">
          <h1>Vehículo no encontrado</h1>
          <p>{error || "No encontramos este vehículo en el inventario."}</p>

          <Link
            className="vehicle-back-button"
            to="/inventory"
          >
            <ArrowLeft size={18} />
            Volver al inventario
          </Link>
        </div>
      </main>
    )
  }

  const images = [...(vehicle.vehicle_images ?? [])].sort(
    (a, b) =>
      Number(b.is_cover) - Number(a.is_cover) ||
      a.display_order - b.display_order
  )

  const image = images[0]?.image_url || "/preview.jpg"
  const title = `${vehicle.brand} ${vehicle.model}${
    vehicle.version ? ` ${vehicle.version}` : ""
  }`

  const price = vehicle.price_usd.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  })

  const whatsappMessage =
    `Hola, estoy interesado en el ${title}. ` +
    `Precio publicado: ${price}. ¿Podrías darme más información?`

  const phone = vehicle.contact_phone.replace(/\D/g, "")

  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`

  const specifications = [
    vehicle.fuel_type,
    vehicle.transmission,
    vehicle.color,
    vehicle.body_type,
  ].filter(Boolean)

  return (
    <main className="vehicle-details-page">
      <div className="vehicle-details-container">
        <Link
          className="vehicle-back-button"
          to="/inventory"
        >
          <ArrowLeft size={18} />
          Volver al inventario
        </Link>

        <div className="vehicle-details-layout">
          <section className="vehicle-gallery">
            <div className="vehicle-main-image">
              <img src={image} alt={title} />

              {vehicle.fuel_type?.toLowerCase().includes("híbrido") && (
                <span className="vehicle-hybrid-badge">
                  <Check size={15} />
                  Híbrido
                </span>
              )}
            </div>

            <p className="vehicle-image-caption">
              {title} · {vehicle.year}
            </p>
          </section>

          <aside className="vehicle-summary">
            <span className="vehicle-summary-brand">
              {vehicle.brand.toUpperCase()}
            </span>

            <h1>
              {vehicle.model}
              {vehicle.version ? ` ${vehicle.version}` : ""}
            </h1>

            <p className="vehicle-summary-subtitle">
              {vehicle.body_type || "Vehículo en venta"}
            </p>

            <div className="vehicle-summary-price">
              <span>Precio de venta</span>
              <strong>{price}</strong>
            </div>

            <div className="vehicle-specifications">
              <div>
                <CalendarDays size={19} />
                <span>
                  <small>Año</small>
                  <strong>{vehicle.year}</strong>
                </span>
              </div>

              <div>
                <Gauge size={19} />
                <span>
                  <small>Recorrido</small>
                  <strong>
                    {vehicle.mileage !== null
                      ? `${vehicle.mileage.toLocaleString("es-ES")} ${vehicle.mileage_unit}`
                      : "No indicado"}
                  </strong>
                </span>
              </div>

              <div>
                <Fuel size={19} />
                <span>
                  <small>Combustible</small>
                  <strong>{vehicle.fuel_type || "No indicado"}</strong>
                </span>
              </div>

              <div>
                <Users size={19} />
                <span>
                  <small>Ubicación</small>
                  <strong>{vehicle.province}</strong>
                </span>
              </div>
            </div>

            {specifications.length > 0 && (
              <p>{specifications.join(" · ")}</p>
            )}

            <a
              className="vehicle-contact-button"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={19} />
              Consultar por WhatsApp
            </a>

            <p className="vehicle-contact-note">
              Contacta al vendedor para consultar disponibilidad y más información.
            </p>
          </aside>
        </div>

        <section className="vehicle-features-section">
          <div className="vehicle-section-heading">
            <span>DETALLES DEL VEHÍCULO</span>
            <h2>Equipamiento y características</h2>
            <p>
              {vehicle.description ||
                "Contacta al vendedor para conocer más detalles de este vehículo."}
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
            Confirma las especificaciones exactas con el vendedor antes de la compra.
          </p>
        </section>
      </div>
    </main>
  )
}

export default VehicleDetails