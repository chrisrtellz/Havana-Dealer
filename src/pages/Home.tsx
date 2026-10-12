import { useState } from "react"
import Hero from "../components/Hero"
import VehicleCards from "../components/VehicleCards"
import Footer from "../components/Footer"

function Home() {
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")

  return (
    <>
      <main>
        <Hero
          brand={brand}
          model={model}
          onBrandChange={setBrand}
          onModelChange={setModel}
        />

        <VehicleCards
          brand={brand}
          model={model}
        />
      </main>

      <Footer />
    </>
  )
}

export default Home