
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
  Monitor,
  Camera,
  ShieldCheck,
  KeyRound,
  BriefcaseBusiness,
  MessageCircle,
  Check,
  Cog,
  Zap,
  BatteryCharging,
  Route,
  Clock,
  Plug,
  Ruler,
  FileCheck,
  Wrench,
  MapPin,
  Palette,
} from "lucide-react"

import { supabase } from "../lib/supabase"
import "./VehicleDetails.css"

type VehicleImage = {
  image_url: string
  is_cover: boolean
  display_order: number
}

type Vehicle = {
  id: string
  brand: string
  model: string
  version: string | null
  year: number
  price_usd: number
  mileage: number | null
  mileage_unit: string | null
  fuel_type: string | null
  transmission: string | null
  body_type: string | null
  color: string | null
  exterior_color: string | null
  interior_color: string | null
  province: string | null
  municipality: string | null
  description: string | null
  contact_phone: string | null

  engine_displacement_cc: number | null
  power_hp: number | null
  torque_nm: number | null
  drive_type: string | null
  fuel_consumption: number | null
  fuel_consumption_unit: string | null

  battery_capacity_kwh: number | null
  electric_range_km: number | null
  charging_power_kw: number | null
  charging_time_minutes: number | null
  plug_type: string | null

  doors: number | null
  seats: number | null
  trunk_capacity_liters: number | null

  vehicle_condition: string | null
  warranty: string | null
  ownership_count: number | null
  registration_status: string | null

  features: unknown

  vehicle_images: VehicleImage[] | null
}

type Specification = {
  label: string
  value: string | number | null | undefined
  icon: typeof Gauge
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
          exterior_color,
          interior_color,
          province,
          municipality,
          description,
          contact_phone,
          engine_displacement_cc,
          power_hp,
          torque_nm,
          drive_type,
          fuel_consumption,
          fuel_consumption_unit,
          battery_capacity_kwh,
          electric_range_km,
          charging_power_kw,
          charging_time_minutes,
          plug_type,
          doors,
          seats,
          trunk_capacity_liters,
          vehicle_condition,
          warranty,
          ownership_count,
          registration_status,
          features,
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
        setVehicle(data as unknown as Vehicle)
      }

      setLoading(false)
    }

    loadVehicle()

    return () => {
      active = false
    }
  }, [slug])

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

          <Link className="vehicle-back-button" to="/inventory">
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

  const price = Number(vehicle.price_usd).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  })

  const fuel = vehicle.fuel_type?.trim() || ""
  const normalizedFuel = fuel.toLowerCase()

  const isElectric =
    normalizedFuel.includes("eléctrico") ||
    normalizedFuel.includes("electrico") ||
    normalizedFuel.includes("electric")

  const isHybrid =
    normalizedFuel.includes("híbrido") ||
    normalizedFuel.includes("hibrido") ||
    normalizedFuel.includes("hybrid")

  const isPlugInHybrid =
    isHybrid &&
    (normalizedFuel.includes("enchufable") ||
      normalizedFuel.includes("plug-in") ||
      normalizedFuel.includes("plugin"))

  const showCombustionSpecs = !isElectric || isPlugInHybrid

  const whatsappMessage =
    `Hola, estoy interesado en el ${title}. ` +
    `Precio publicado: ${price}. ¿Podrías darme más información?`

  const phone = (vehicle.contact_phone || "").replace(/\D/g, "")

  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`

  const formatNumber = (
    value: number | null | undefined,
    suffix = ""
  ): string | null => {
    if (value === null || value === undefined || !Number.isFinite(Number(value))) {
      return null
    }

    return `${Number(value).toLocaleString("es-ES")}${suffix}`
  }

  const formatDisplacement = (
    value: number | null
  ): string | null => {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return null
    }

    if (value >= 100) {
      return `${(value / 1000).toLocaleString("es-ES", {
        maximumFractionDigits: 2,
      })} L`
    }

    return `${value.toLocaleString("es-ES")} cc`
  }

  const cleanValue = (
    value: string | number | null | undefined
  ): string | null => {
    if (value === null || value === undefined) return null

    const text = String(value).trim()
    return text.length > 0 ? text : null
  }

  const makeSpecifications = (
    items: Specification[]
  ): Specification[] =>
    items.filter((item) => cleanValue(item.value) !== null)

  const identification = makeSpecifications([
    { label: "Marca", value: vehicle.brand, icon: Cog },
    { label: "Modelo", value: vehicle.model, icon: BriefcaseBusiness },
    { label: "Versión", value: vehicle.version, icon: Wrench },
    { label: "Año", value: vehicle.year, icon: CalendarDays },
    { label: "Carrocería", value: vehicle.body_type, icon: BriefcaseBusiness },
    { label: "Kilometraje", value: vehicle.mileage !== null
      ? `${Number(vehicle.mileage).toLocaleString("es-ES")} ${vehicle.mileage_unit || "km"}`
      : null, icon: Gauge },
    { label: "Transmisión", value: vehicle.transmission, icon: Cog },
    { label: "Tracción", value: vehicle.drive_type, icon: Route },
  ])

  const engine = makeSpecifications([
    {
      label: "Cilindrada",
      value: formatDisplacement(vehicle.engine_displacement_cc),
      icon: Cog,
    },
    {
      label: "Potencia",
      value: formatNumber(vehicle.power_hp, " hp"),
      icon: Zap,
    },
    {
      label: "Par motor",
      value: formatNumber(vehicle.torque_nm, " Nm"),
      icon: Gauge,
    },
    {
      label: "Consumo",
      value: vehicle.fuel_consumption !== null
        ? `${Number(vehicle.fuel_consumption).toLocaleString("es-ES")}${
            vehicle.fuel_consumption_unit
              ? ` ${vehicle.fuel_consumption_unit}`
              : ""
          }`
        : null,
      icon: Fuel,
    },
  ])

  const battery = makeSpecifications([
    {
      label: "Capacidad de batería",
      value: formatNumber(vehicle.battery_capacity_kwh, " kWh"),
      icon: BatteryCharging,
    },
    {
      label: "Autonomía eléctrica",
      value: formatNumber(vehicle.electric_range_km, " km"),
      icon: Route,
    },
    {
      label: "Potencia de carga",
      value: formatNumber(vehicle.charging_power_kw, " kW"),
      icon: Zap,
    },
    {
      label: "Tiempo de carga",
      value: vehicle.charging_time_minutes !== null
        ? vehicle.charging_time_minutes >= 60
          ? `${Math.floor(vehicle.charging_time_minutes / 60)} h${
              vehicle.charging_time_minutes % 60
                ? ` ${vehicle.charging_time_minutes % 60} min`
                : ""
            }`
          : `${vehicle.charging_time_minutes} min`
        : null,
      icon: Clock,
    },
    { label: "Tipo de conector", value: vehicle.plug_type, icon: Plug },
  ])

  const dimensions = makeSpecifications([
    {
      label: "Puertas",
      value: formatNumber(vehicle.doors),
      icon: BriefcaseBusiness,
    },
    {
      label: "Plazas",
      value: formatNumber(vehicle.seats),
      icon: Users,
    },
    {
      label: "Capacidad del maletero",
      value: formatNumber(vehicle.trunk_capacity_liters, " L"),
      icon: BriefcaseBusiness,
    },
  ])

  const condition = makeSpecifications([
    { label: "Estado", value: vehicle.vehicle_condition, icon: Wrench },
    { label: "Garantía", value: vehicle.warranty, icon: ShieldCheck },
    {
      label: "Número de propietarios",
      value: formatNumber(vehicle.ownership_count),
      icon: Users,
    },
    {
      label: "Documentación",
      value: vehicle.registration_status,
      icon: FileCheck,
    },
  ])

  const colors = makeSpecifications([
    {
      label: "Color exterior",
      value: vehicle.exterior_color || vehicle.color,
      icon: Palette,
    },
    {
      label: "Color interior",
      value: vehicle.interior_color,
      icon: Armchair,
    },
  ])

  const location = [vehicle.municipality, vehicle.province]
    .map((item) => item?.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index)
    .join(", ")

  const rawFeatures = Array.isArray(vehicle.features)
    ? vehicle.features
    : []

  const listedFeatures = rawFeatures
    .map((feature) => {
      if (typeof feature === "string") return feature.trim()

      if (
        feature &&
        typeof feature === "object" &&
        "name" in feature &&
        typeof feature.name === "string"
      ) {
        return feature.name.trim()
      }

      return ""
    })
    .filter(Boolean)

  const renderSpecificationSection = (
    title: string,
    specifications: Specification[]
  ) => {
    if (specifications.length === 0) return null

    return (
      <section className="vehicle-technical-sheet">
        <h3>{title}</h3>

        <div className="vehicle-technical-grid">
          {specifications.map((item) => {
            const Icon = item.icon
            const value = cleanValue(item.value)

            if (!value) return null

            return (
              <div
                className="vehicle-technical-item"
                key={item.label}
              >
                <Icon size={18} />

                <span>
                  <small>{item.label}</small>
                  <strong>{value}</strong>
                </span>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <main className="vehicle-details-page">
      <div className="vehicle-details-container">
        <Link className="vehicle-back-button" to="/inventory">
          <ArrowLeft size={18} />
          Volver al inventario
        </Link>

        <div className="vehicle-details-layout">
          <section className="vehicle-gallery">
            <div className="vehicle-main-image">
              <img src={image} alt={title} />

              {isHybrid && (
                <span className="vehicle-hybrid-badge">
                  <Check size={15} />
                  Híbrido
                </span>
              )}

              {isElectric && (
                <span className="vehicle-electric-badge">
                  <Zap size={15} />
                  Eléctrico
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
                  <small>Kilometraje</small>
                  <strong>
                    {vehicle.mileage !== null
                      ? `${Number(vehicle.mileage).toLocaleString("es-ES")} ${
                          vehicle.mileage_unit || "km"
                        }`
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
                <MapPin size={19} />
                <span>
                  <small>Ubicación</small>
                  <strong>{location || "No indicada"}</strong>
                </span>
              </div>
            </div>

            {renderSpecificationSection("Ficha técnica", identification)}

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
            <span>INFORMACIÓN DEL VEHÍCULO</span>
            <h2>Especificaciones y características</h2>
          </div>

          {showCombustionSpecs &&
            renderSpecificationSection("Motor y rendimiento", engine)}

          {battery.length > 0 &&
            renderSpecificationSection("Batería y carga", battery)}

          {renderSpecificationSection("Dimensiones y capacidad", dimensions)}

          {renderSpecificationSection("Estado y documentación", condition)}

          {renderSpecificationSection("Colores y acabado", colors)}

          {listedFeatures.length > 0 && (
            <section className="vehicle-technical-sheet">
              <h3>Equipamiento</h3>

              <div className="vehicle-features-grid">
                {listedFeatures.map((feature, index) => (
                  <article className="vehicle-feature" key={`${feature}-${index}`}>
                    <div className="vehicle-feature-icon">
                      <Check size={19} />
                    </div>
                    <div>
                      <p>{feature}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {vehicle.description?.trim() && (
            <section className="vehicle-technical-sheet">
              <h3>Descripción del vendedor</h3>
              <p>{vehicle.description}</p>
            </section>
          )}

          <p className="vehicle-disclaimer">
            Confirma las especificaciones y la documentación con el vendedor antes de la compra.
          </p>
        </section>
      </div>
    </main>
  )
}

export default VehicleDetails
