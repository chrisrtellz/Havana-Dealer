
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./VehicleCards.css"

type VehicleCardsProps = {
  brand: string
  model: string
  showViewAll?: boolean
}

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
  municipality: string | null
  description: string | null

  // Motor y rendimiento
  engine_displacement_cc: number | null
  power_hp: number | null
  torque_nm: number | null
  drive_type: string | null
  fuel_consumption: number | null
  fuel_consumption_unit: string | null

  // Batería y carga
  battery_capacity_kwh: number | null
  electric_range_km: number | null
  charging_power_kw: number | null
  charging_time_minutes: number | null
  plug_type: string | null

  // Dimensiones y capacidad
  doors: number | null
  seats: number | null
  trunk_capacity_liters: number | null

  // Estado y documentación
  exterior_color: string | null
  interior_color: string | null
  vehicle_condition: string | null
  warranty: string | null
  ownership_count: number | null
  registration_status: string | null

  // Equipamiento
  features: string[] | null

  vehicle_images: {
    image_url: string
    is_cover: boolean
    display_order: number
  }[]
}

function createSlug(vehicle: Vehicle) {
  return `${vehicle.brand}-${vehicle.model}-${vehicle.version ?? ""}-${vehicle.id}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function VehicleCards({
  brand,
  model,
  showViewAll = true,
}: VehicleCardsProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function loadVehicles() {
      setLoading(true)
      setError("")

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
          municipality,
          description,
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
          exterior_color,
          interior_color,
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
        .eq("status", "published")
        .order("created_at", { ascending: false })

      if (!active) return

      if (error) {
        console.error("Error cargando vehículos:", error.message)
        setError("No pudimos cargar los vehículos. Inténtalo de nuevo.")
        setVehicles([])
      } else {
        setVehicles((data ?? []) as unknown as Vehicle[])
      }

      setLoading(false)
    }

    loadVehicles()

    return () => {
      active = false
    }
  }, [])

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesBrand =
      !brand ||
      vehicle.brand.toLowerCase() === brand.toLowerCase()

    const searchText = model.trim().toLowerCase()

    const matchesModel =
      !searchText ||
      vehicle.model.toLowerCase().includes(searchText) ||
      vehicle.brand.toLowerCase().includes(searchText) ||
      (vehicle.version ?? "").toLowerCase().includes(searchText)

    return matchesBrand && matchesModel
  })

  return (
    <section className="vehicles" id="vehiculos">
      <div className="vehicles-container">
        <div className="vehicles-header">
          <div>
            <span className="vehicles-label">INVENTARIO</span>

            <h2>
              {brand || model
                ? "Resultados de búsqueda"
                : "Vehículos destacados"}
            </h2>

            <p>
              {loading
                ? "Cargando vehículos..."
                : filteredVehicles.length === 1
                  ? "Se encontró 1 vehículo."
                  : `Se encontraron ${filteredVehicles.length} vehículos.`}
            </p>
          </div>

          {showViewAll && (
            <Link to="/inventory" className="vehicles-view-all">
              Ver inventario
            </Link>
          )}
        </div>

        {loading ? (
          <div className="vehicles-empty">
            <p>Cargando inventario...</p>
          </div>
        ) : error ? (
          <div className="vehicles-empty">
            <h3>No pudimos cargar el inventario</h3>
            <p>{error}</p>
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className="vehicles-grid">
            {filteredVehicles.map((vehicle) => {
              const images = [...(vehicle.vehicle_images ?? [])].sort(
                (a, b) =>
                  Number(b.is_cover) - Number(a.is_cover) ||
                  a.display_order - b.display_order
              )

              const image = images[0]?.image_url || "/preview.jpg"
              const title = `${vehicle.brand} ${vehicle.model}`

              return (
                <Link
                  to={`/vehicle/${createSlug(vehicle)}`}
                  className="vehicle-card"
                  key={vehicle.id}
                >
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    onError={(event) => {
                      const element = event.currentTarget

                      if (!element.src.endsWith("/preview.jpg")) {
                        element.src = "/preview.jpg"
                      }
                    }}
                  />

                  <div className="vehicle-info">
                    <span className="vehicle-brand">
                      {vehicle.brand}
                      {vehicle.fuel_type
                        ? ` · ${vehicle.fuel_type}`
                        : ""}
                    </span>

                    <h3>
                      {title}
                      {vehicle.version ? ` ${vehicle.version}` : ""}
                    </h3>

                    <div className="vehicle-details">
                      <span>{vehicle.year}</span>

                      {vehicle.mileage !== null && (
                        <span>
                          {vehicle.mileage.toLocaleString("es-ES")}{" "}
                          {vehicle.mileage_unit}
                        </span>
                      )}

                      {vehicle.body_type && (
                        <span>{vehicle.body_type}</span>
                      )}
                    </div>

                    <div className="vehicle-bottom">
                      <strong>
                        {vehicle.price_usd.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 2,
                        })}
                      </strong>

                      <span>{vehicle.province}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="vehicles-empty">
            <h3>No encontramos vehículos</h3>
            <p>
              {vehicles.length === 0
                ? "Todavía no hay vehículos publicados."
                : "Prueba con otra marca o modelo."}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default VehicleCards
