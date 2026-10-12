import "./Hero.css"

function Hero() {
  return (
    <section className="hero">
      <div className="hero-image">
        <img
          src="/hero.jpg"
          alt="Auto frente al Capitolio de La Habana"
        />
      </div>

      <div className="hero-container">
        <h1>
          Encuentra tu próximo auto
        </h1>

        <p>
          Explora vehículos disponibles y encuentra el que buscas.
        </p>

        <div className="hero-search">

          <select>
  <option value="">Cualquiera</option>
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
          />

          <button>
            Buscar
          </button>

        </div>
      </div>
    </section>
  )
}

export default Hero