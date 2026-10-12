import "./VehicleCards.css"

function VehicleCards() {
  return (
    <section className="vehicles">
      <div className="vehicles-container">

        <div className="vehicles-header">
          <div>
            <span className="vehicles-label">
              INVENTARIO
            </span>

            <h2>
              Vehículos destacados
            </h2>

            <p>
              Algunos de los vehículos disponibles en Havana Dealer.
            </p>
          </div>

          <a href="/inventory" className="vehicles-view-all">
            Ver inventario
          </a>
        </div>

        <div className="vehicles-grid">

          <a href="/vehicle/toyota-corolla" className="vehicle-card">
            <img
              src="/preview.jpg"
              alt="Toyota Corolla"
            />

            <div className="vehicle-info">
              <span className="vehicle-brand">
                Toyota
              </span>

              <h3>
                Toyota Corolla
              </h3>

              <div className="vehicle-details">
                <span>2020</span>
                <span>65,000 km</span>
              </div>

              <div className="vehicle-bottom">
                <strong>
                  $18,500
                </strong>

                <span>
                  La Habana
                </span>
              </div>
            </div>
          </a>

          <a href="/vehicle/hyundai-tucson" className="vehicle-card">
            <img
              src="/preview.jpg"
              alt="Hyundai Tucson"
            />

            <div className="vehicle-info">
              <span className="vehicle-brand">
                Hyundai
              </span>

              <h3>
                Hyundai Tucson
              </h3>

              <div className="vehicle-details">
                <span>2021</span>
                <span>48,000 km</span>
              </div>

              <div className="vehicle-bottom">
                <strong>
                  $24,900
                </strong>

                <span>
                  La Habana
                </span>
              </div>
            </div>
          </a>

          <a href="/vehicle/kia-sportage" className="vehicle-card">
            <img
              src="/preview.jpg"
              alt="Kia Sportage"
            />

            <div className="vehicle-info">
              <span className="vehicle-brand">
                Kia
              </span>

              <h3>
                Kia Sportage
              </h3>

              <div className="vehicle-details">
                <span>2022</span>
                <span>32,000 km</span>
              </div>

              <div className="vehicle-bottom">
                <strong>
                  $27,500
                </strong>

                <span>
                  La Habana
                </span>
              </div>
            </div>
          </a>

        </div>

      </div>
    </section>
  )
}

export default VehicleCards