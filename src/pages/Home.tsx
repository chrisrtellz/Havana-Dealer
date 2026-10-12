import Hero from "../components/Hero"
import VehicleCards from "../components/VehicleCards"
import Footer from "../components/Footer"

function Home() {
  return (
    <>
      <main>
        <Hero />
        <VehicleCards />
      </main>

      <Footer />
    </>
  )
}

export default Home