import { supabase } from "./supabase"

export async function testSupabaseConnection() {
  const { error } = await supabase
    .from("vehicles")
    .select("id")
    .limit(1)

  if (error) {
    console.error("Error de conexión con Supabase:", error.message)
    return false
  }

  console.log("Conexión con Supabase correcta")
  return true
}