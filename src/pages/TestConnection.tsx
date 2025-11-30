import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function TestConnection() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setStatus('loading')
      setMessage('Conectando a Supabase...')

      // Test 1: Verificar configuración
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!url || !key) {
        throw new Error('Faltan variables de entorno')
      }

      // Test 2: Consultar las tablas
      const { data: usuarios, error: errorUsuarios } = await supabase
        .from('usuario')
        .select('id', { count: 'exact', head: true })

      if (errorUsuarios) {
        throw new Error(`Error al conectar: ${errorUsuarios.message}`)
      }

      // Test 3: Obtener estadísticas
      const [
        { count: countUsuarios },
        { count: countTickets },
        { count: countContenedores },
        { count: countZonas },
      ] = await Promise.all([
        supabase.from('usuario').select('*', { count: 'exact', head: true }),
        supabase.from('ticket').select('*', { count: 'exact', head: true }),
        supabase.from('contenedor').select('*', { count: 'exact', head: true }),
        supabase.from('zona').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        usuarios: countUsuarios || 0,
        tickets: countTickets || 0,
        contenedores: countContenedores || 0,
        zonas: countZonas || 0,
      })

      setStatus('connected')
      setMessage('¡Conexión exitosa con Supabase!')
    } catch (error: any) {
      setStatus('error')
      setMessage(error.message || 'Error desconocido')
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin text-blue-500" />}
            {status === 'connected' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-red-500" />}
            Test de Conexión a Supabase
          </CardTitle>
          <CardDescription>
            Verificando la conexión con la base de datos en la nube
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estado de conexión */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Estado de conexión</p>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            <Badge
              variant={
                status === 'connected'
                  ? 'default'
                  : status === 'error'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {status === 'loading' && 'Conectando...'}
              {status === 'connected' && 'Conectado'}
              {status === 'error' && 'Error'}
            </Badge>
          </div>

          {/* Variables de entorno */}
          <div className="space-y-2">
            <h3 className="font-semibold">Variables de Entorno</h3>
            <div className="space-y-1 text-sm font-mono bg-muted p-3 rounded">
              <div className="flex items-center gap-2">
                <span className="font-bold">VITE_SUPABASE_URL:</span>
                {import.meta.env.VITE_SUPABASE_URL ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Configurada</span>
                    <span className="text-xs text-muted-foreground">
                      ({import.meta.env.VITE_SUPABASE_URL})
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">Falta configurar</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">VITE_SUPABASE_ANON_KEY:</span>
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Configurada</span>
                    <span className="text-xs text-muted-foreground">
                      ({import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...)
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">Falta configurar</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Estadísticas de la base de datos */}
          {status === 'connected' && stats && (
            <div className="space-y-2">
              <h3 className="font-semibold">Datos en Supabase</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">{stats.usuarios}</div>
                    <p className="text-sm text-muted-foreground">Usuarios</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.tickets}</div>
                    <p className="text-sm text-muted-foreground">Tickets</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-orange-600">{stats.contenedores}</div>
                    <p className="text-sm text-muted-foreground">Contenedores</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-purple-600">{stats.zonas}</div>
                    <p className="text-sm text-muted-foreground">Zonas</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Botón de reintento */}
          <button
            onClick={testConnection}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Probar Conexión Nuevamente
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
