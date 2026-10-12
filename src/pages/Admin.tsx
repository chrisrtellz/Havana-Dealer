
import {
  LayoutDashboard,
  Car,
  Clock3,
  CheckCircle2,
  CircleDollarSign,
  Settings,
  Search,
  Bell,
} from "lucide-react"

import "./Admin.css"

function Admin() {
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
              aria-label="Notificaciones"
            >
              <Bell size={20} />
            </button>

            <div className="admin-avatar">A</div>
          </div>
        </header>

        <div className="admin-notice">
          <div>
            <strong>Bienvenido a HavanaDealer</strong>

            <p>
              Revisa las publicaciones antes de que aparezcan
              en el inventario público.
            </p>
          </div>

          <Car size={34} />
        </div>

        <section className="admin-stats">
          <article className="admin-stat-card">
            <span className="admin-stat-icon blue">
              <Car size={21} />
            </span>

            <p>Total de vehículos</p>
            <strong>—</strong>
            <small>Se conectará con Supabase</small>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon orange">
              <Clock3 size={21} />
            </span>

            <p>Pendientes de revisión</p>
            <strong>—</strong>
            <small>Anuncios por revisar</small>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon green">
              <CheckCircle2 size={21} />
            </span>

            <p>Publicados</p>
            <strong>—</strong>
            <small>Vehículos visibles en la web</small>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon purple">
              <CircleDollarSign size={21} />
            </span>

            <p>Vendidos</p>
            <strong>—</strong>
            <small>Vehículos marcados como vendidos</small>
          </article>
        </section>

        <section className="admin-panel" id="vehicles">
          <div className="admin-panel-header">
            <div>
              <h2>Inventario de vehículos</h2>

              <p>
                Consulta y administra los anuncios recibidos.
              </p>
            </div>

            <div className="admin-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Buscar vehículo..."
                aria-label="Buscar vehículo"
              />
            </div>
          </div>

          <div className="admin-empty">
            <Car size={36} />

            <h3>Inventario pendiente de conexión</h3>

            <p>
              Aquí mostraremos los vehículos reales de Supabase.
            </p>
          </div>
        </section>

        <footer className="admin-footer">
          HavanaDealer · Administración de vehículos
        </footer>
      </section>
    </main>
  )
}

export default Admin
