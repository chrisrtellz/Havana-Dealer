import { useState } from "react"
import "./Hero.css"

type HeroProps = {
  brand: string
  model: string
  onBrandChange: (brand: string) => void
  onModelChange: (model: string) => void
}

function Hero({
  brand,
  model,
  onBrandChange,
  onModelChange,
}: HeroProps) {
  const [searchBrand, setSearchBrand] = useState(brand)
  const [searchModel, setSearchModel] = useState(model)

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onBrandChange(searchBrand)
    onModelChange(searchModel.trim())
    document.getElementById("vehiculos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <section className="hero">
      <div className="hero-image">
        <img
          src="/hero.jpg"
          alt="Auto frente al Capitolio de La Habana"
        />
      </div>

      <div className="hero-container">
        <h1>Encuentra tu próximo auto</h1>

        <p>
          Explora vehículos disponibles y encuentra el que buscas.
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <select
            value={searchBrand}
            onChange={(event) => setSearchBrand(event.target.value)}
            aria-label="Seleccionar marca"
          >
            <option value="">Cualquier marca</option>
            <option value="toyota">Toyota</option>
            <option value="hyundai">Hyundai</option>
            <option value="kia">Kia</option>
            <option value="chevrolet">Chevrolet</option>
            <option value="lada">Lada</option>
            <option value="moskvich">Moskvich</option>
            <option value="fiat">Fiat</option>
            <option value="peugeot">Peugeot</option>
            <option value="volkswagen">Volkswagen</option>
            <option value="ford">Ford</option>
            <option value="geely">Geely</option>
            <option value="suzuki">Suzuki</option>
            <option value="mercedes-benz">Mercedes-Benz</option>
            <option value="audi">Audi</option>
            <option value="bmw">BMW</option>
            <option value="nissan">Nissan</option>
            <option value="mitsubishi">Mitsubishi</option>
            <option value="honda">Honda</option>
            <option value="renault">Renault</option>
          </select>

          <input
            type="text"
            placeholder="Modelo"
            value={searchModel}
            onChange={(event) => setSearchModel(event.target.value)}
            aria-label="Buscar por modelo"
          />

          <button type="submit">
            Buscar
          </button>
        </form>
      </div>
    </section>
  )
}

export default Hero