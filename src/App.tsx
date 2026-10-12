
import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Inventory from "./pages/Inventory"
import VehicleDetails from "./pages/VehicleDetails"
import Login from "./pages/Login"
import Admin from "./pages/Admin"
import Navbar from "./components/Navbar"

import { supabase } from "./lib/supabase"

function App() {
  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from("vehicles")
        .select("id")
        .limit(1)

      if (error) {
        console.error("Error de Supabase:", error.message)
        return
      }

      console.log("HavanaDealer conectado a Supabase correctamente")
    }

    testConnection()
  }, [])

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/inventory" element={<Inventory />} />

        <Route
          path="/vehicle/:slug"
          element={<VehicleDetails />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
