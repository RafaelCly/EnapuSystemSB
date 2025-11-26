import { createClient } from '@supabase/supabase-js'

// Obtener las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las variables de entorno VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. ' +
    'Por favor, verifica que el archivo .env exista en la raíz del proyecto.'
  )
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Helper para logs en desarrollo
const isDev = import.meta.env.VITE_APP_ENV === 'development'
export const logDev = (message: string, ...args: unknown[]) => {
  if (isDev) {
    console.log(`[Supabase] ${message}`, ...args)
  }
}

export default supabase
