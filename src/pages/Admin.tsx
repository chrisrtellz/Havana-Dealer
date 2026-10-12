
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  LayoutDashboard,
  Car,
  Clock3,
  CheckCircle2,
  CircleDollarSign,
  Settings,
  Search,
  Bell,
  RefreshCw,
  Trash2,
  X,
  AlertTriangle,
  LogOut,
} from "lucide-react"

import { supabase } from "../lib/supabase"
import "./Admin.css"

type Vehicle = {
  id: string
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

function Admin() {
  const navigate = useNavigate()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [search, setSearch] = useState("")

  const [vehicleToDelete, setVehicleToDelete] =
    useState<Vehicle | null>(null)
  const [deleteError, setDeleteError] = useState("")
  const [deleting, setDeleting] = useState(false)

  const [logoutMenuOpen, setLogoutMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState("")

  async function loadVehicles() {
    setLoading(true)
    setErrorMessage("")

    try {
      const { data: vehicleData, error: vehicleError } =
        await supabase
          .from("vehicles")
          .select(
            "id, brand, model, version, year, price_usd, mileage, mileage_unit, province, status, created_at"
          )
          .order("created_at", { ascending: false })

      if (vehicleError) {
        throw vehicleError
      }

      const loadedVehicles = vehicleData ?? []

      if (loadedVehicles.length === 0) {
        setVehicles([])
        return
      }

      const vehicleIds = loadedVehicles.map(
        (vehicle) => vehicle.id
      )

      const { data: imageData, error: imageError } =
        await supabase
          .from("vehicle_images")
          .select(
            "vehicle_id, image_url, display_order, is_cover"
          )
          .in("vehicle_id", vehicleIds)
          .order("display_order", { ascending: true })

      if (imageError) {
        throw imageError
      }

      const images = (imageData ?? []) as VehicleImage[]

      const vehiclesWithImages: Vehicle[] =
        loadedVehicles.map((vehicle) => {
          const vehicleImages = images.filter(
            (image) => image.vehicle_id === vehicle.id
          )

          const selectedImage =
            vehicleImages.find(
              (image) => image.is_cover === true
            ) ?? vehicleImages[0]

          let imageUrl: string | null = null

          if (selectedImage?.image_url) {
            const path = selectedImage.image_url.trim()

            if (
              path.startsWith("http://") ||
              path.startsWith("https://")
            ) {
              imageUrl = path
            } else {
              imageUrl = `/${path.replace(/^\/+/, "")}`
            }
          }

          return {
            ...vehicle,
            image_url: imageUrl,
          } as Vehicle
        })

      setVehicles(vehiclesWithImages)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error desconocido al cargar los vehículos."

      console.error("Error cargando vehículos:", message)
      setErrorMessage(message)
      setVehicles([])
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
    setLogoutError("")

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      setLogoutMenuOpen(false)
      navigate("/", { replace: true })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo cerrar la sesión."

      console.error("Error cerrando sesión:", message)
      setLogoutError(message)
    } finally {
      setLoggingOut(false)
    }
  }

  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return vehicles

    return vehicles.filter((vehicle) =>
      [
        vehicle.brand,
        vehicle.model,
        vehicle.version,
        vehicle.province,
        vehicle.year,
        vehicle.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    )
  }, [vehicles, search])

  const pendingCount = vehicles.filter(
    (vehicle) => vehicle.status === "pending"
  ).length

  const publishedCount = vehicles.filter(
    (vehicle) => vehicle.status === "published"
  ).length

  const soldCount = vehicles.filter(
    (vehicle) => vehicle.status === "sold"
  ).length

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

  function openDeleteConfirmation(vehicle: Vehicle) {
    setVehicleToDelete(vehicle)
    setDeleteError("")
  }

  function closeDeleteConfirmation() {
    if (deleting) return

    setVehicleToDelete(null)
    setDeleteError("")
  }

  async function confirmDeleteVehicle() {
    if (!vehicleToDelete || deleting) return

    setDeleting(true)
    setDeleteError("")

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error(
          "Tu sesión no está activa. Inicia sesión nuevamente."
        )
      }

      const { error: imagesError } = await supabase
        .from("vehicle_images")
        .delete()
        .eq("vehicle_id", vehicleToDelete.id)

      if (imagesError) {
        throw new Error(
          `No se pudieron eliminar las imágenes: ${imagesError.message}`
        )
      }

      const { data: deletedVehicle, error: deleteError } =
        await supabase
          .from("vehicles")
          .delete()
          .eq("id", vehicleToDelete.id)
          .select("id")

      if (deleteError) {
        throw new Error(
          `No se pudo eliminar el anuncio: ${deleteError.message}`
        )
      }

      if (!deletedVehicle || deletedVehicle.length === 0) {
        throw new Error(
          "Supabase no confirmó el borrado. Comprueba tus permisos de administrador."
        )
      }

      setVehicles((currentVehicles) =>
        currentVehicles.filter(
          (vehicle) => vehicle.id !== vehicleToDelete.id
        )
      )

      setVehicleToDelete(null)
      setDeleteError("")
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar el anuncio."

      console.error("Error eliminando anuncio:", message)
      setDeleteError(message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Car size={28} strokeWidth={2} />

          <span>
            <span className="logo-havana">Havana</span>
            <span className="logo-dealer">Dealer</span>
          </span>
        </div>

        <p className="admin-menu-label">ADMINISTRACIÓN</p>

        <nav className="admin-menu">
          <a href="#dashboard" className="active">
            <LayoutDashboard size={19} />
            Panel principal
          </a>

          <a href="#vehicles">
            <Car size={19} />
            Vehículos
          </a>

          <a href="#pending">
            <Clock3 size={19} />
            Pendientes de revisión
          </a>

          <a href="#published">
            <CheckCircle2 size={19} />
            Publicados
          </a>

          <a href="#sold">
            <CircleDollarSign size={19} />
            Vendidos
          </a>

          <a href="#settings">
            <Settings size={19} />
            Configuración
          </a>
        </nav>

        <div className="admin-sidebar-footer">
          <span className="admin-status-dot" />
          Panel de administración
        </div>
      </aside>

      <section className="admin-main" id="dashboard">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">
              HAVANADEALER / ADMIN
            </span>

            <h1>Panel de administración</h1>

            <p>
              Gestiona los anuncios y el inventario de vehículos.
            </p>
          </div>

          <div className="admin-topbar-actions">
            <button
              type="button"
              className="admin-icon-button"
              aria-label="Actualizar inventario"
              onClick={() => void loadVehicles()}
              disabled={loading}
            >
              <RefreshCw size={19} />
            </button>

            <button
              type="button"
              className="admin-icon-button"
              aria-label="Notificaciones"
            >
              <Bell size={20} />
            </button>

            <div className="admin-user-menu">
              <button
                type="button"
                className="admin-avatar"
                aria-label="Abrir menú de usuario"
                aria-expanded={logoutMenuOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setLogoutMenuOpen((open) => !open)
                  setLogoutError("")
                }}
              >
                A
              </button>

              {logoutMenuOpen && (
                <div
                  className="admin-logout-dropdown"
                  role="menu"
                >
                  {logoutError && (
                    <p
                      className="admin-logout-error"
                      role="alert"
                    >
                      {logoutError}
                    </p>
                  )}

                  <button
                    type="button"
                    className="admin-logout-option"
                    role="menuitem"
                    onClick={() => void handleLogout()}
                    disabled={loggingOut}
                  >
                    <LogOut size={17} />
                    <span>
                      {loggingOut
                        ? "Cerrando sesión..."
                        : "Cerrar sesión"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="admin-stats">
          <article className="admin-stat-card">
            <span className="admin-stat-icon blue">
              <Car size={21} />
            </span>

            <p>Total de vehículos</p>
            <strong>{loading ? "…" : vehicles.length}</strong>
            <small>Anuncios registrados</small>
          </article>

          <article className="admin-stat-card" id="pending">
            <span className="admin-stat-icon orange">
              <Clock3 size={21} />
            </span>

            <p>Pendientes de revisión</p>
            <strong>{loading ? "…" : pendingCount}</strong>
            <small>Anuncios por revisar</small>
          </article>

          <article className="admin-stat-card" id="published">
            <span className="admin-stat-icon green">
              <CheckCircle2 size={21} />
            </span>

            <p>Publicados</p>
            <strong>{loading ? "…" : publishedCount}</strong>
            <small>Vehículos publicados</small>
          </article>

          <article className="admin-stat-card" id="sold">
            <span className="admin-stat-icon purple">
              <CircleDollarSign size={21} />
            </span>

            <p>Vendidos</p>
            <strong>{loading ? "…" : soldCount}</strong>
            <small>Vehículos vendidos</small>
          </article>
        </section>

        <section className="admin-panel" id="vehicles">
          <div className="admin-panel-header">
            <div>
              <h2>Inventario de vehículos</h2>
              <p>Anuncios encontrados en la base de datos.</p>
            </div>

            <div className="admin-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Buscar vehículo..."
                aria-label="Buscar vehículo"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>

          {loading ? (
            <div className="admin-empty">
              <RefreshCw size={30} />
              <h3>Cargando vehículos...</h3>
              <p>Consultando Supabase.</p>
            </div>
          ) : errorMessage ? (
            <div className="admin-empty">
              <h3>No se pudieron cargar los vehículos</h3>
              <p>{errorMessage}</p>

              <button
                type="button"
                onClick={() => void loadVehicles()}
              >
                Intentar de nuevo
              </button>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="admin-empty">
              <Car size={36} />

              <h3>
                {vehicles.length === 0
                  ? "No hay vehículos visibles"
                  : "No se encontraron resultados"}
              </h3>

              <p>
                {vehicles.length === 0
                  ? "Comprueba los permisos de lectura de Supabase."
                  : "Prueba con otra marca, modelo o provincia."}
              </p>
            </div>
          ) : (
            <div className="admin-vehicle-list">
              {filteredVehicles.map((vehicle) => (
                <article
                  className="admin-vehicle-card"
                  key={vehicle.id}
                >
                  <div className="admin-vehicle-image">
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

                  <div className="admin-vehicle-info">
                    <div className="admin-vehicle-title">
                      <h3>
                        {vehicle.brand} {vehicle.model}
                      </h3>

                      <span
                        className={`admin-vehicle-status status-${vehicle.status}`}
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

                    <strong className="admin-vehicle-price">
                      {formatPrice(vehicle.price_usd)}
                    </strong>

                    <small>
                      {vehicle.mileage != null
                        ? `${vehicle.mileage.toLocaleString("es-ES")} ${vehicle.mileage_unit ?? "km"}`
                        : "Kilometraje no indicado"}
                    </small>
                  </div>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() =>
                      openDeleteConfirmation(vehicle)
                    }
                    aria-label={`Eliminar anuncio de ${vehicle.brand} ${vehicle.model}`}
                  >
                    <Trash2 size={15} />
                    Eliminar anuncio
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="admin-footer">
          HavanaDealer · Administración de vehículos
        </footer>
      </section>

      {vehicleToDelete && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteConfirmation()
            }
          }}
        >
          <section
            className="admin-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <button
              type="button"
              className="admin-modal-close"
              aria-label="Cerrar"
              onClick={closeDeleteConfirmation}
              disabled={deleting}
            >
              <X size={20} />
            </button>

            <div className="admin-delete-icon">
              <AlertTriangle size={27} />
            </div>

            <h2 id="delete-modal-title">
              ¿Eliminar este anuncio?
            </h2>

            <p>
              Vas a eliminar permanentemente el anuncio de{" "}
              <strong>
                {vehicleToDelete.brand}{" "}
                {vehicleToDelete.model}{" "}
                {vehicleToDelete.year}
              </strong>
              . Esta acción no se puede deshacer fácilmente.
            </p>

            {deleteError && (
              <p className="admin-delete-error" role="alert">
                {deleteError}
              </p>
            )}

            <div className="admin-delete-actions">
              <button
                type="button"
                className="admin-cancel-delete"
                onClick={closeDeleteConfirmation}
                disabled={deleting}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="admin-confirm-delete"
                onClick={() => void confirmDeleteVehicle()}
                disabled={deleting}
              >
                <Trash2 size={16} />
                {deleting
                  ? "Eliminando..."
                  : "Sí, eliminar anuncio"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default Admin
