import { useEffect } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"

import Home from "./pages/Home"
import Inventory from "./pages/Inventory"
import VehicleDetails from "./pages/VehicleDetails"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Admin from "./pages/Admin"
import UserPanel from "./pages/UserPanel"
import Verification from "./pages/Verification"
import Navbar from "./components/Navbar"

import { supabase } from "./lib/supabase"

function AppContent() {
  const location = useLocation()

  const isAdminPage = location.pathname === "/admin"
  const isUserPanelPage = location.pathname === "/user-panel"
  const isVerificationPage = location.pathname === "/verification"

  return (
    <>
      {!isAdminPage &&
        !isUserPanelPage &&
        !isVerificationPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/inventory" element={<Inventory />} />

        <Route
          path="/vehicle/:slug"
          element={<VehicleDetails />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="/user-panel" element={<UserPanel />} />

        <Route
          path="/verification"
          element={<Verification />}
        />
      </Routes>
    </>
  )
}

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

    void testConnection()
  }, [])

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App