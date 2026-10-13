
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Car,
  PlusCircle,
  RefreshCw,
  Search,
  LogOut,
  UserRound,
  SlidersHorizontal,
  X,
  ShieldCheck,
} from "lucide-react"

import { supabase } from "../lib/supabase"
import VehicleCards from "../components/VehicleCards"
import "./UserPanel.css"

type Vehicle = {
  id: string
  seller_id: string
  brand: string
  model: string
  version: string | null
  year: number
  price_usd: number | string
  mileage: number | null
  mileage_unit: string | null
  province: string | null
  status: string
  created_at: string
  image_url: string | null
}

type VehicleImage = {
  vehicle_id: string
  image_url: string
  display_order: number | null
  is_cover: boolean | null
}

function UserPanel() {
  const navigate = useNavigate()

  const [userEmail, setUserEmail] = useState("")
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([])
  const [activeSection, setActiveSection] = useState("available")

  const [search, setSearch] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [loggingOut, setLoggingOut] = useState(false)

  const [showVerificationModal, setShowVerificationModal] =
    useState(false)

  async function loadVehicles() {
    setLoading(true)
    setErrorMessage("")

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        navigate("/login", { replace: true })
        return
      }

      setUserEmail(user.email ?? "")

      const { data: availableData, error: availableError } =
        await supabase
          .from("vehicles")
          .select(
            "id, seller_id, brand, model, version, year, price_usd, mileage, mileage_unit, province, status, created_at"
          )
          .eq("status", "published")
          .order("created_at", { ascending: false })

      if (availableError) throw availableError

      const { data: ownData, error: ownError } =
        await supabase
          .from("vehicles")
          .select(
            "id, seller_id, brand, model, version, year, price_usd, mileage, mileage_unit, province, status, created_at"
          )
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false })

      if (ownError) throw ownError

      const allVehicles = [
        ...(availableData ?? []),
        ...(ownData ?? []),
      ]

      const uniqueVehicles = Array.from(
        new Map(
          allVehicles.map((vehicle) => [vehicle.id, vehicle])
        ).values()
      )

      let images: VehicleImage[] = []

      if (uniqueVehicles.length > 0) {
        const { data: imageData, error: imageError } =
          await supabase
            .from("vehicle_images")
            .select(
              "vehicle_id, image_url, display_order, is_cover"
            )
            .in(
              "vehicle_id",
              uniqueVehicles.map((vehicle) => vehicle.id)
            )
            .order("display_order", { ascending: true })

        if (imageError) throw imageError

        images = (imageData ?? []) as VehicleImage[]
      }

      function getImage(vehicleId: string) {
        const vehicleImages = images.filter(
          (image) => image.vehicle_id === vehicleId
        )

        const selected =
          vehicleImages.find((image) => image.is_cover === true) ??
          vehicleImages[0]

        if (!selected?.image_url) return null

        const path = selected.image_url.trim()

        return path.startsWith("http://") ||
          path.startsWith("https://")
          ? path
          : `/${path.replace(/^\/+/, "")}`
      }

      setMyVehicles(
        (ownData ?? []).map((vehicle) => ({
          ...vehicle,
          image_url: getImage(vehicle.id),
        })) as Vehicle[]
      )
    } catch (error) {
      const message =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "No se pudieron cargar los vehículos."

      console.error("Error en el panel de usuario:", error)
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadVehicles()
  }, [])

  async function handleLogout() {
    if (loggingOut) return

    setLoggingOut(true)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      navigate("/", { replace: true })
    } catch (error) {
      const message =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "No se pudo cerrar la sesión."

      setErrorMessage(message)
    } finally {
      setLoggingOut(false)
    }
  }

  function handlePublish() {
    setShowVerificationModal(true)
  }

  const visibleVehicles = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return myVehicles

    return myVehicles.filter((vehicle) =>
      [
        vehicle.brand,
        vehicle.model,
        vehicle.version,
        vehicle.province,
        vehicle.year,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    )
  }, [myVehicles, search])

  function formatPrice(price: number | string) {
    return `${Number(price).toLocaleString("en-US")} USD`
  }

  function statusLabel(status: string) {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      published: "Publicado",
      rejected: "Rechazado",
      sold: "Vendido",
    }

    return labels[status] ?? status
  }

  function showSection(section: string) {
    setActiveSection(section)
    setSearch("")
    setAppliedSearch("")
    setShowFilters(false)
    setErrorMessage("")
  }

  function handleAvailableSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setAppliedSearch(search.trim())
  }

  return (
    <main className="user-panel-page">
      <aside className="user-panel-sidebar">
        <div className="user-panel-logo">
          <Car size={28} />

          <span>
            <span className="user-logo-havana">Havana</span>
            <span className="user-logo-dealer">Dealer</span>
          </span>
        </div>

        <p className="user-panel-menu-label">MI CUENTA</p>

        <nav className="user-panel-menu">
          <button
            type="button"
            className={activeSection === "available" ? "active" : ""}
            onClick={() => showSection("available")}
          >
            <Car size={19} />
            Autos disponibles
          </button>

          <button
            type="button"
            className={activeSection === "my-vehicles" ? "active" : ""}
            onClick={() => showSection("my-vehicles")}
          >
            <UserRound size={19} />
            Mis anuncios
          </button>
        </nav>

        <button
          type="button"
          className="user-panel-publish"
          onClick={handlePublish}
        >
          <PlusCircle size={19} />
          Publicar un auto
        </button>

        <div className="user-panel-sidebar-footer">
          <span className="user-panel-status-dot" />
          Cuenta de usuario
        </div>
      </aside>

      <section className="user-panel-main">
        <header className="user-panel-topbar">
          <div>
            <span className="user-panel-eyebrow">
              HAVANADEALER / MI CUENTA
            </span>

            <h1>
              {activeSection === "available"
                ? "Autos disponibles"
                : "Mis anuncios"}
            </h1>

            <p>
              Gestiona tus anuncios y descubre vehículos en venta.
            </p>
          </div>

          <div className="user-panel-actions">
            <button
              type="button"
              className="user-panel-icon-button"
              onClick={() => void loadVehicles()}
              disabled={loading}
              aria-label="Actualizar vehículos"
            >
              <RefreshCw size={19} />
            </button>

            <button
              type="button"
              className="user-panel-logout"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
            >
              <LogOut size={17} />
              {loggingOut ? "Saliendo..." : "Cerrar sesión"}
            </button>
          </div>
        </header>

        <div className="user-panel-welcome">
          <div>
            <strong>¡Bienvenido a HavanaDealer!</strong>

            <p>
              {userEmail
                ? `Has iniciado sesión como ${userEmail}.`
                : "Administra tus anuncios desde un solo lugar."}
            </p>
          </div>

          <Car size={42} />
        </div>

        {errorMessage && (
          <div className="user-panel-empty">
            <p>{errorMessage}</p>

            <button
              type="button"
              onClick={() => void loadVehicles()}
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {activeSection === "available" ? (
          <section className="user-panel-available">
            <form
              className="user-panel-simple-search"
              onSubmit={handleAvailableSearch}
            >
              <Search size={20} />

              <input
                type="search"
                placeholder="Buscar por marca o modelo..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Buscar autos por marca o modelo"
              />

              {search && (
                <button
                  type="button"
                  className="user-panel-search-clear"
                  onClick={() => {
                    setSearch("")
                    setAppliedSearch("")
                  }}
                  aria-label="Limpiar búsqueda"
                >
                  <X size={18} />
                </button>
              )}

              <button
                type="button"
                className="user-panel-filter-button"
                onClick={() => setShowFilters((current) => !current)}
                aria-label="Mostrar filtros"
                aria-expanded={showFilters}
              >
                <SlidersHorizontal size={19} />
              </button>

              <button
                type="submit"
                className="user-panel-search-submit"
              >
                Buscar
              </button>
            </form>

            {showFilters && (
              <div className="user-panel-filter-panel">
                <p>
                  Escribe una marca o modelo en el campo de búsqueda.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("")
                    setAppliedSearch("")
                    setShowFilters(false)
                  }}
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}

            {appliedSearch && (
              <div className="user-panel-search-summary">
                <span>
                  Búsqueda: <strong>{appliedSearch}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("")
                    setAppliedSearch("")
                  }}
                >
                  Quitar
                </button>
              </div>
            )}

            <VehicleCards
              brand=""
              model={appliedSearch}
              showViewAll={false}
            />
          </section>
        ) : (
          <section className="user-panel-list">
            <div className="user-panel-list-header">
              <div>
                <h2>Mis anuncios</h2>
                <p>
                  Consulta los anuncios asociados a tu cuenta.
                </p>
              </div>

              <label className="user-panel-search">
                <Search size={17} />

                <input
                  type="search"
                  placeholder="Buscar auto..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Buscar vehículos"
                />
              </label>
            </div>

            {loading ? (
              <div className="user-panel-empty">
                <RefreshCw size={30} />
                <h3>Cargando vehículos...</h3>
                <p>Consultando tus anuncios.</p>
              </div>
            ) : visibleVehicles.length === 0 ? (
              <div className="user-panel-empty">
                <Car size={36} />
                <h3>Todavía no tienes anuncios</h3>
                <p>
                  Cuando publiques un auto, aparecerá aquí.
                </p>

                <button
                  type="button"
                  onClick={handlePublish}
                >
                  <PlusCircle size={17} />
                  Publicar mi primer auto
                </button>
              </div>
            ) : (
              <div className="user-panel-vehicle-list">
                {visibleVehicles.map((vehicle) => (
                  <article
                    className="user-panel-vehicle-card"
                    key={vehicle.id}
                  >
                    <div className="user-panel-vehicle-image">
                      <img
                        src={vehicle.image_url || "/preview.jpg"}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        loading="lazy"
                        onError={(event) => {
                          const image = event.currentTarget

                          if (!image.src.endsWith("/preview.jpg")) {
                            image.src = "/preview.jpg"
                          }
                        }}
                      />
                    </div>

                    <div className="user-panel-vehicle-info">
                      <div className="user-panel-vehicle-title">
                        <h3>
                          {vehicle.brand} {vehicle.model}
                        </h3>

                        <span
                          className={`user-panel-status status-${vehicle.status}`}
                        >
                          {statusLabel(vehicle.status)}
                        </span>
                      </div>

                      <p>
                        {vehicle.year}
                        {vehicle.version
                          ? ` · ${vehicle.version}`
                          : ""}
                        {vehicle.province
                          ? ` · ${vehicle.province}`
                          : ""}
                      </p>

                      <strong>
                        {formatPrice(vehicle.price_usd)}
                      </strong>

                      <small>
                        {vehicle.mileage != null
                          ? `${vehicle.mileage.toLocaleString("es-ES")} ${vehicle.mileage_unit ?? "km"}`
                          : "Kilometraje no indicado"}
                      </small>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <footer className="user-panel-footer">
          HavanaDealer · Tu espacio para comprar y vender autos
        </footer>
      </section>

      {showVerificationModal && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowVerificationModal(false)
            }
          }}
        >
          <section
            className="admin-delete-modal user-verification-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="verification-modal-title"
          >
            <button
              type="button"
              className="admin-modal-close"
              aria-label="Cerrar"
              onClick={() => setShowVerificationModal(false)}
            >
              <X size={20} />
            </button>

            <div className="user-verification-icon">
              <ShieldCheck size={27} />
            </div>

            <h2 id="verification-modal-title">
              Tu cuenta debe ser verificada
            </h2>

            <p>
              Para publicar un auto en HavanaDealer, primero debes
              verificar tu identidad. Este proceso ayuda a generar
              confianza y seguridad entre los compradores y vendedores.
            </p>

            <div className="user-verification-actions">
              <button
                type="button"
                className="user-verification-later"
                onClick={() => setShowVerificationModal(false)}
              >
                Más tarde
              </button>

              <button
                type="button"
                className="user-verification-confirm"
                onClick={() => {
                  setShowVerificationModal(false)
                  navigate("/verification")
                }}
              >
                <ShieldCheck size={16} />
                Verificar mi cuenta
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default UserPanel
