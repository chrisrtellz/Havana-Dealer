import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import VehicleDetails from "./pages/VehicleDetails"
import Navbar from "./components/Navbar"

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/vehicle/hyundai-santa-fe-calligraphy"
          element={<VehicleDetails />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App