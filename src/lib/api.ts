import { supabase, logDev } from './supabase'
import type { PostgrestError } from '@supabase/supabase-js'

// =====================================================================
// TIPOS DE DATOS
// =====================================================================

export interface Usuario {
  id: number
  nombre: string
  email: string
  password?: string
  telefono?: string
  empresa?: string
  id_rol: number
  id_nivel_acceso: number
  fecha_creacion?: string
  fecha_modificacion?: string
  activo: boolean
}

export interface Ticket {
  id: number
  numero_ticket?: string
  fecha_hora_entrada: string
  fecha_hora_salida?: string
  estado: 'Activo' | 'Finalizado' | 'Cancelado'
  id_ubicacion: number
  id_usuario: number
  id_contenedor: number
  observaciones?: string
  fecha_modificacion?: string
}

export interface Contenedor {
  id: number
  codigo_contenedor?: string
  dimensiones: string
  tipo: 'Seco' | 'Refrigerado' | 'Open Top' | 'Flat Rack' | 'Tanque'
  peso: number
  id_buque: number
  id_cita_recojo: number
  descripcion_carga?: string
  temperatura_requerida?: number
  fecha_registro?: string
}

export interface Zona {
  id: number
  nombre: string
  capacidad: number
  descripcion?: string
  activa: boolean
  fecha_creacion?: string
}

export interface UbicacionSlot {
  id: number
  fila: number
  columna: number
  nivel: number
  estado: 'Vacio' | 'Ocupado' | 'Reservado' | 'Mantenimiento'
  id_zona: number
  fecha_creacion?: string
  fecha_modificacion?: string
}

export interface Buque {
  id: number
  nombre: string
  linea_naviera: string
  capacidad_contenedores?: number
  fecha_registro?: string
  activo: boolean
}

export interface Rol {
  id: number
  rol: string
  descripcion?: string
}

export interface NivelAcceso {
  id: number
  nivel: string
  descripcion?: string
}

export interface Factura {
  id: number
  numero_factura?: string
  fecha_emision: string
  monto: number
  estado: 'Pendiente' | 'Pagada' | 'Vencida' | 'Anulada'
  id_ticket: number
  fecha_vencimiento?: string
  observaciones?: string
  fecha_creacion?: string
}

export interface Pago {
  id: number
  numero_operacion?: string
  fecha_pago: string
  medio_pago: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Cheque' | 'Deposito'
  monto: number
  id_factura: number
  comprobante_url?: string
  fecha_registro?: string
}

export interface CitaRecojo {
  id: number
  fecha_inicio_horario: string
  fecha_salida_horario: string
  estado: 'Programada' | 'Completada' | 'Vencida' | 'Cancelada'
  observaciones?: string
  fecha_creacion?: string
}

// Tipo para respuestas de Supabase
export interface SupabaseResponse<T> {
  data: T | null
  error: PostgrestError | null
}

// =====================================================================
// HELPER FUNCTIONS
// =====================================================================

function handleError(error: PostgrestError | null, operation: string) {
  if (error) {
    logDev(`Error en ${operation}:`, error)
    throw new Error(`${operation} falló: ${error.message}`)
  }
}

// =====================================================================
// API: USUARIOS
// =====================================================================

export const usuarios = {
  // Obtener todos los usuarios
  async list() {
    logDev('Obteniendo lista de usuarios...')
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .order('id', { ascending: true })
    
    handleError(error, 'Listar usuarios')
    return data as Usuario[]
  },

  // Obtener un usuario por ID
  async get(id: number) {
    logDev(`Obteniendo usuario #${id}...`)
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('id', id)
      .single()
    
    handleError(error, 'Obtener usuario')
    return data as Usuario
  },

  // Crear un nuevo usuario
  async create(usuario: Omit<Usuario, 'id'>) {
    logDev('Creando nuevo usuario...', usuario)
    const { data, error } = await supabase
      .from('usuario')
      .insert([usuario])
      .select()
      .single()
    
    handleError(error, 'Crear usuario')
    return data as Usuario
  },

  // Actualizar un usuario
  async update(id: number, usuario: Partial<Usuario>) {
    logDev(`Actualizando usuario #${id}...`, usuario)
    const { data, error } = await supabase
      .from('usuario')
      .update(usuario)
      .eq('id', id)
      .select()
      .single()
    
    handleError(error, 'Actualizar usuario')
    return data as Usuario
  },

  // Eliminar un usuario (soft delete - marcar como inactivo)
  async delete(id: number) {
    logDev(`Desactivando usuario #${id}...`)
    const { data, error } = await supabase
      .from('usuario')
      .update({ activo: false })
      .eq('id', id)
      .select()
      .single()
    
    handleError(error, 'Eliminar usuario')
    return data as Usuario
  },

  // Login (verifica email y contraseña)
  async login(email: string, password: string) {
    logDev(`Intentando login para: ${email}`)
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('email', email)
      .eq('password', password) // ⚠️ NOTA: En producción, usa bcrypt
      .eq('activo', true)
      .single()
    
    if (error || !data) {
      throw new Error('Credenciales inválidas')
    }
    
    return data as Usuario
  },

  // Obtener usuarios por rol
  async byRole(idRol: number) {
    logDev(`Obteniendo usuarios con rol #${idRol}...`)
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('id_rol', idRol)
      .eq('activo', true)
    
    handleError(error, 'Obtener usuarios por rol')
    return data as Usuario[]
  },
}

// =====================================================================
// API: TICKETS
// =====================================================================

// Helper para enriquecer tickets con datos relacionados
async function enrichTickets(ticketsData: any[]) {
  if (!ticketsData || ticketsData.length === 0) return []
  
  // Obtener IDs únicos
  const contenedorIds = [...new Set(ticketsData.map(t => t.id_contenedor).filter(Boolean))]
  const ubicacionIds = [...new Set(ticketsData.map(t => t.id_ubicacion).filter(Boolean))]
  
  // Obtener contenedores
  let contenedoresMap: Record<number, any> = {}
  if (contenedorIds.length > 0) {
    const { data: contenedoresData } = await supabase
      .from('contenedor')
      .select('*')
      .in('id', contenedorIds)
    contenedoresData?.forEach(c => { contenedoresMap[c.id] = c })
  }
  
  // Obtener ubicaciones con zonas
  let ubicacionesMap: Record<number, any> = {}
  if (ubicacionIds.length > 0) {
    const { data: ubicacionesData } = await supabase
      .from('ubicacion_slot')
      .select('*')
      .in('id', ubicacionIds)
    
    // Obtener zonas para las ubicaciones
    const zonaIds = [...new Set(ubicacionesData?.map(u => u.id_zona).filter(Boolean) || [])]
    let zonasMap: Record<number, any> = {}
    if (zonaIds.length > 0) {
      const { data: zonasData } = await supabase
        .from('zona')
        .select('*')
        .in('id', zonaIds)
      zonasData?.forEach(z => { zonasMap[z.id] = z })
    }
    
    ubicacionesData?.forEach(u => {
      ubicacionesMap[u.id] = {
        ...u,
        zona_nombre: zonasMap[u.id_zona]?.nombre || 'N/A'
      }
    })
  }
  
  // Enriquecer tickets
  return ticketsData.map(ticket => ({
    ...ticket,
    contenedor_info: contenedoresMap[ticket.id_contenedor] || null,
    ubicacion_info: ubicacionesMap[ticket.id_ubicacion] || null
  }))
}

export const tickets = {
  // Obtener todos los tickets (básico)
  async list() {
    logDev('Obteniendo lista de tickets...')
    const { data, error } = await supabase
      .from('ticket')
      .select('*')
      .order('fecha_hora_entrada', { ascending: false })
    
    handleError(error, 'Listar tickets')
    return data
  },

  // Obtener todos los tickets con datos enriquecidos
  async listWithDetails() {
    logDev('Obteniendo lista de tickets con detalles...')
    const { data, error } = await supabase
      .from('ticket')
      .select('*')
      .order('fecha_hora_entrada', { ascending: false })
    
    handleError(error, 'Listar tickets')
    return enrichTickets(data || [])
  },

  // Obtener un ticket por ID
  async get(id: number) {
    logDev(`Obteniendo ticket #${id}...`)
    const { data, error } = await supabase
      .from('ticket')
      .select('*')
      .eq('id', id)
      .single()
    
    handleError(error, 'Obtener ticket')
    return data
  },

  // Crear un nuevo ticket
  async create(ticket: Omit<Ticket, 'id' | 'numero_ticket'>) {
    logDev('Creando nuevo ticket...', ticket)
    const { data, error } = await supabase
      .from('ticket')
      .insert([ticket])
      .select()
      .single()
    
    handleError(error, 'Crear ticket')
    return data
  },

  // Actualizar un ticket
  async update(id: number, ticket: Partial<Ticket>) {
    logDev(`Actualizando ticket #${id}...`, ticket)
    const { data, error } = await supabase
      .from('ticket')
      .update(ticket)
      .eq('id', id)
      .select()
      .single()
    
    handleError(error, 'Actualizar ticket')
    return data
  },

  // Eliminar un ticket
  async delete(id: number) {
    logDev(`Eliminando ticket #${id}...`)
    const { error } = await supabase
      .from('ticket')
      .delete()
      .eq('id', id)
    
    handleError(error, 'Eliminar ticket')
    return { success: true }
  },

  // Obtener tickets por estado
  async byEstado(estado: string) {
    logDev(`Obteniendo tickets con estado: ${estado}`)
    const { data, error } = await supabase
      .from('ticket')
      .select('*')
      .eq('estado', estado)
      .order('fecha_hora_entrada', { ascending: false })
    
    handleError(error, 'Obtener tickets por estado')
    return data
  },

  // Obtener tickets por usuario (operario que procesó)
  async byUsuario(usuarioId: number) {
    logDev(`Obteniendo tickets del usuario #${usuarioId}`)
    const { data, error } = await supabase
      .from('ticket')
      .select('*')
      .eq('id_usuario', usuarioId)
      .order('fecha_hora_entrada', { ascending: false })
    
    handleError(error, 'Obtener tickets por usuario')
    return enrichTickets(data || [])
  },

  // Obtener tickets por cliente (a través de sus contenedores)
  async byCliente(clienteId: number) {
    logDev(`Obteniendo tickets del cliente #${clienteId}`)
    
    // Primero obtener los contenedores del cliente
    const { data: contenedoresCliente, error: contError } = await supabase
      .from('contenedor')
      .select('id')
      .eq('id_cliente', clienteId)
    
    if (contError) {
      handleError(contError, 'Obtener contenedores del cliente')
      return []
    }
    
    if (!contenedoresCliente || contenedoresCliente.length === 0) {
      logDev('El cliente no tiene contenedores asignados')
      return []
    }
    
    const contenedorIds = contenedoresCliente.map(c => c.id)
    
    // Luego obtener los tickets de esos contenedores
    const { data, error } = await supabase
      .from('ticket')
      .select('*')
      .in('id_contenedor', contenedorIds)
      .order('fecha_hora_entrada', { ascending: false })
    
    handleError(error, 'Obtener tickets del cliente')
    return enrichTickets(data || [])
  },

  // Cambiar estado de un ticket
  async cambiarEstado(id: number, estado: 'Activo' | 'Finalizado' | 'Cancelado') {
    logDev(`Cambiando estado del ticket #${id} a: ${estado}`)
    const updateData: Partial<Ticket> = { estado }
    
    // Si se finaliza, agregar fecha de salida
    if (estado === 'Finalizado') {
      updateData.fecha_hora_salida = new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('ticket')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    handleError(error, 'Cambiar estado de ticket')
    return data
  },
}

// =====================================================================
// API: CONTENEDORES
// =====================================================================

export const contenedores = {
  async list() {
    logDev('Obteniendo lista de contenedores...')
    const { data, error } = await supabase
      .from('contenedor')
      .select('*')
      .order('id', { ascending: false })
    
    handleError(error, 'Listar contenedores')
    return data
  },

  async get(id: number) {
    logDev(`Obteniendo contenedor #${id}...`)
    const { data, error } = await supabase
      .from('contenedor')
      .select('*')
      .eq('id', id)
      .single()
    
    handleError(error, 'Obtener contenedor')
    return data
  },

  // Obtener contenedores por cliente
  async byCliente(clienteId: number) {
    logDev(`Obteniendo contenedores del cliente #${clienteId}...`)
    const { data, error } = await supabase
      .from('contenedor')
      .select('*')
      .eq('id_cliente', clienteId)
      .order('id', { ascending: false })
    
    handleError(error, 'Obtener contenedores del cliente')
    return data || []
  },

  async create(contenedor: Omit<Contenedor, 'id'>) {
    logDev('Creando nuevo contenedor...', contenedor)
    const { data, error } = await supabase
      .from('contenedor')
      .insert([contenedor])
      .select()
      .single()
    
    handleError(error, 'Crear contenedor')
    return data
  },

  async update(id: number, contenedor: Partial<Contenedor>) {
    logDev(`Actualizando contenedor #${id}...`, contenedor)
    const { data, error } = await supabase
      .from('contenedor')
      .update(contenedor)
      .eq('id', id)
      .select()
      .single()
    
    handleError(error, 'Actualizar contenedor')
    return data
  },

  async delete(id: number) {
    logDev(`Eliminando contenedor #${id}...`)
    const { error } = await supabase
      .from('contenedor')
      .delete()
      .eq('id', id)
    
    handleError(error, 'Eliminar contenedor')
    return { success: true }
  },
}

// =====================================================================
// API: ZONAS
// =====================================================================

export const zonas = {
  async list() {
    logDev('Obteniendo lista de zonas...')
    const { data, error } = await supabase
      .from('zona')
      .select('*')
      .order('id', { ascending: true })
    
    handleError(error, 'Listar zonas')
    return data as Zona[]
  },

  async get(id: number) {
    logDev(`Obteniendo zona #${id}...`)
    const { data, error } = await supabase
      .from('zona')
      .select('*')
      .eq('id', id)
      .single()
    
    handleError(error, 'Obtener zona')
    return data as Zona
  },

  async create(zona: Omit<Zona, 'id'>) {
    logDev('Creando nueva zona...', zona)
    const { data, error } = await supabase
      .from('zona')
      .insert([zona])
      .select()
      .single()
    
    handleError(error, 'Crear zona')
    return data as Zona
  },

  async update(id: number, zona: Partial<Zona>) {
    logDev(`Actualizando zona #${id}...`, zona)
    const { data, error } = await supabase
      .from('zona')
      .update(zona)
      .eq('id', id)
      .select()
      .single()
    
    handleError(error, 'Actualizar zona')
    return data as Zona
  },

  async delete(id: number) {
    logDev(`Eliminando zona #${id}...`)
    const { error } = await supabase
      .from('zona')
      .delete()
      .eq('id', id)
    
    handleError(error, 'Eliminar zona')
    return { success: true }
  },
}

// =====================================================================
// API: UBICACION_SLOT
// =====================================================================

export const slots = {
  async list() {
    logDev('Obteniendo lista de slots...')
    const { data, error } = await supabase
      .from('ubicacion_slot')
      .select('*')
      .order('id', { ascending: true })
    
    handleError(error, 'Listar slots')
    return data
  },

  async get(id: number) {
    logDev(`Obteniendo slot #${id}...`)
    const { data, error } = await supabase
      .from('ubicacion_slot')
      .select('*')
      .eq('id', id)
      .single()
    
    handleError(error, 'Obtener slot')
    return data
  },

  async create(slot: Omit<UbicacionSlot, 'id'>) {
    logDev('Creando nuevo slot...', slot)
    const { data, error } = await supabase
      .from('ubicacion_slot')
      .insert([slot])
      .select()
      .single()
    
    handleError(error, 'Crear slot')
    return data
  },

  async update(id: number, slot: Partial<UbicacionSlot>) {
    logDev(`Actualizando slot #${id}...`, slot)
    const { data, error } = await supabase
      .from('ubicacion_slot')
      .update(slot)
      .eq('id', id)
      .select()
      .single()
    
    handleError(error, 'Actualizar slot')
    return data
  },

  async delete(id: number) {
    logDev(`Eliminando slot #${id}...`)
    const { error } = await supabase
      .from('ubicacion_slot')
      .delete()
      .eq('id', id)
    
    handleError(error, 'Eliminar slot')
    return { success: true }
  },

  // Obtener slots disponibles (vacíos)
  async disponibles() {
    logDev('Obteniendo slots disponibles...')
    const { data, error } = await supabase
      .from('ubicacion_slot')
      .select('*')
      .eq('estado', 'Vacio')
      .order('id', { ascending: true })
    
    handleError(error, 'Obtener slots disponibles')
    return data
  },
}

// =====================================================================
// API: BUQUES
// =====================================================================

export const buques = {
  async list() {
    logDev('Obteniendo lista de buques...')
    const { data, error } = await supabase
      .from('buque')
      .select('*')
      .order('nombre', { ascending: true })
    
    handleError(error, 'Listar buques')
    return data as Buque[]
  },

  async get(id: number) {
    logDev(`Obteniendo buque #${id}...`)
    const { data, error } = await supabase
      .from('buque')
      .select('*')
      .eq('id', id)
      .single()
    
    handleError(error, 'Obtener buque')
    return data as Buque
  },

  async create(buque: Omit<Buque, 'id'>) {
    logDev('Creando nuevo buque...', buque)
    const { data, error } = await supabase
      .from('buque')
      .insert([buque])
      .select()
      .single()
    
    handleError(error, 'Crear buque')
    return data as Buque
  },
}

// =====================================================================
// API: ROLES
// =====================================================================

export const roles = {
  async list() {
    logDev('Obteniendo lista de roles...')
    const { data, error } = await supabase
      .from('rol')
      .select('*')
      .order('id', { ascending: true })
    
    handleError(error, 'Listar roles')
    return data as Rol[]
  },
}

// =====================================================================
// API: NIVELES DE ACCESO
// =====================================================================

export const niveles = {
  async list() {
    logDev('Obteniendo lista de niveles de acceso...')
    const { data, error } = await supabase
      .from('nivel_acceso')
      .select('*')
      .order('id', { ascending: true })
    
    handleError(error, 'Listar niveles de acceso')
    return data as NivelAcceso[]
  },
}

// =====================================================================
// API: FACTURAS
// =====================================================================

export const facturas = {
  async list() {
    logDev('Obteniendo lista de facturas...')
    const { data, error } = await supabase
      .from('factura')
      .select('*')
      .order('fecha_emision', { ascending: false })
    
    handleError(error, 'Listar facturas')
    return data
  },

  async get(id: number) {
    logDev(`Obteniendo factura #${id}...`)
    const { data, error } = await supabase
      .from('factura')
      .select('*')
      .eq('id', id)
      .single()
    
    handleError(error, 'Obtener factura')
    return data
  },

  async create(factura: Omit<Factura, 'id' | 'numero_factura'>) {
    logDev('Creando nueva factura...', factura)
    const { data, error } = await supabase
      .from('factura')
      .insert([factura])
      .select()
      .single()
    
    handleError(error, 'Crear factura')
    return data
  },

  async byEstado(estado: string) {
    logDev(`Obteniendo facturas con estado: ${estado}`)
    const { data, error } = await supabase
      .from('factura')
      .select('*')
      .eq('estado', estado)
      .order('fecha_emision', { ascending: false })
    
    handleError(error, 'Obtener facturas por estado')
    return data
  },
}

// =====================================================================
// API: CITAS DE RECOJO
// =====================================================================

export const citas = {
  async list() {
    logDev('Obteniendo lista de citas de recojo...')
    const { data, error } = await supabase
      .from('cita_recojo')
      .select('*')
      .order('fecha_inicio_horario', { ascending: false })
    
    handleError(error, 'Listar citas de recojo')
    return data as CitaRecojo[]
  },

  async programadas() {
    logDev('Obteniendo citas programadas...')
    const { data, error } = await supabase
      .from('cita_recojo')
      .select('*')
      .eq('estado', 'Programada')
      .order('fecha_inicio_horario', { ascending: true })
    
    handleError(error, 'Obtener citas programadas')
    return data as CitaRecojo[]
  },

  async create(cita: Partial<CitaRecojo>) {
    logDev('Creando nueva cita de recojo...', cita)
    const { data, error } = await supabase
      .from('cita_recojo')
      .insert([cita])
      .select()
      .single()
    
    handleError(error, 'Crear cita de recojo')
    return data as CitaRecojo
  },

  async update(id: number, cita: Partial<CitaRecojo>) {
    logDev(`Actualizando cita #${id}...`, cita)
    const { data, error } = await supabase
      .from('cita_recojo')
      .update(cita)
      .eq('id', id)
      .select()
      .single()
    
    handleError(error, 'Actualizar cita de recojo')
    return data as CitaRecojo
  },
}

// =====================================================================
// EXPORTAR API COMPLETO
// =====================================================================

export const api = {
  usuarios,
  tickets,
  contenedores,
  zonas,
  slots,
  buques,
  roles,
  niveles,
  facturas,
  citas,
}

// =====================================================================
// FUNCIÓN DE COMPATIBILIDAD TEMPORAL apiFetch
// =====================================================================
// Nota: Esta función existe para mantener compatibilidad con componentes antiguos
// que aún usan apiFetch() en lugar de api.*
// Gradualmente deberías migrar todos los componentes a usar api.*
// 
// Ejemplo de migración:
//   Antes: await apiFetch('/tickets/')
//   Ahora: await api.tickets.list()
// =====================================================================

/**
 * @deprecated Usa `api.*` en lugar de apiFetch
 * Esta función solo existe para compatibilidad temporal
 */
export async function apiFetch(path: string, opts: RequestInit = {}) {
  console.warn(
    `⚠️  apiFetch() está deprecated. Usa api.* en su lugar.` +
    `\nPath llamado: ${path}` +
    `\nVer: GUIA_ACTUALIZACION_COMPONENTES.md`
  )

  try {
    // Mapeo básico de endpoints antiguos a nuevas funciones
    if (path === '/tickets/' && opts.method === 'GET' || !opts.method) {
      return await tickets.list()
    }
    if (path === '/usuarios/' && !opts.method) {
      return await usuarios.list()
    }
    if (path === '/ubicaciones-slot/' || path === '/slots/') {
      return await slots.list()
    }
    if (path === '/zonas/') {
      return await zonas.list()
    }
    if (path === '/contenedores/') {
      return await contenedores.list()
    }
    if (path === '/buquesbuques/' || path === '/buques/') {
      return await buques.list()
    }
    if (path === '/roles/') {
      return await roles.list()
    }
    if (path === '/niveles/') {
      return await niveles.list()
    }
    if (path === '/citas-recojo/') {
      return await citas.list()
    }

    // Operaciones UPDATE/DELETE/CREATE requieren más lógica
    throw new Error(
      `apiFetch no soporta este endpoint/método: ${path} ${opts.method || 'GET'}.\n` +
      `Por favor, migra este componente a usar api.* según GUIA_ACTUALIZACION_COMPONENTES.md`
    )
  } catch (error) {
    console.error('Error en apiFetch (deprecated):', error)
    throw error
  }
}

export default api

