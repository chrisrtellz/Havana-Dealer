import { useState } from "react"
import VehicleCards from "../components/VehicleCards"
import "./Inventory.css"

function Inventory() {
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")

  return (
    <main className="inventory-page">
      <section className="inventory-header">
        <div className="inventory-container">
          <span className="inventory-label">HavanaDealer</span>

          <h1>Inventario de vehículos</h1>

          <p>
            Explora los vehículos disponibles y encuentra el adecuado para ti.
          </p>

          <form
            className="inventory-search"
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              aria-label="Filtrar por marca"
            >
              <option value="">Todas las marcas</option>
              <option value="toyota">Toyota</option>
              <option value="hyundai">Hyundai</option>
              <option value="kia">Kia</option>
              <option value="chevrolet">Chevrolet</option>
              <option value="lada">Lada</option>
              <option value="geely">Geely</option>
              <option value="bmw">BMW</option>
              <option value="mercedes-benz">Mercedes-Benz</option>
            </select>

            <input
              type="text"
              placeholder="Buscar modelo..."
              value={model}
              onChange={(event) => setModel(event.target.value)}
              aria-label="Buscar modelo"
            />

            <button type="submit">Buscar</button>
          </form>
        </div>
      </section>

      <VehicleCards
        brand={brand}
        model={model}
        showViewAll={false}
      />
    </main>
  )
}

export default Inventory