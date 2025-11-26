// Mock data para el sistema ENAPU
// Todos los datos están en memoria local

export const users = [
  { id: 1, name: "Juan Pérez", email: "juan@cliente.com", role: "CLIENTE", phone: "+51 999 888 777" },
  { id: 2, name: "María García", email: "maria@cliente.com", role: "CLIENTE", phone: "+51 999 888 778" },
  { id: 3, name: "Carlos López", email: "carlos@enapu.com", role: "OPERARIO", phone: "+51 999 888 779" },
  { id: 4, name: "Ana Torres", email: "ana@enapu.com", role: "OPERARIO", phone: "+51 999 888 780" },
  { id: 5, name: "Roberto Admin", email: "admin@enapu.com", role: "ADMIN", phone: "+51 999 888 781" },
];

export const tickets = [
  { 
    id: 1, 
    contenedorId: "CONT-2024-001", 
    transportista: "Transportes Rápidos SAC", 
    placa: "ABC-123", 
    conductor: "Pedro Ruiz",
    estado: "Pendiente", 
    turno: "08:00 - 08:30", 
    fecha: "2024-01-15", 
    qrCode: "ENAPU-TKT-001",
    clienteId: 1,
    slot: "A-01",
    prioridad: "Normal"
  },
  { 
    id: 2, 
    contenedorId: "CONT-2024-002", 
    transportista: "Logística Express EIRL", 
    placa: "DEF-456", 
    conductor: "Luis Martínez",
    estado: "En Proceso", 
    turno: "09:00 - 09:30", 
    fecha: "2024-01-15", 
    qrCode: "ENAPU-TKT-002",
    clienteId: 1,
    slot: "A-02",
    prioridad: "Alta"
  },
  { 
    id: 3, 
    contenedorId: "CONT-2024-003", 
    transportista: "Transportes del Norte SA", 
    placa: "GHI-789", 
    conductor: "Jorge Silva",
    estado: "Completado", 
    turno: "10:00 - 10:30", 
    fecha: "2024-01-14", 
    qrCode: "ENAPU-TKT-003",
    clienteId: 2,
    slot: "B-01",
    prioridad: "Normal"
  },
  { 
    id: 4, 
    contenedorId: "CONT-2024-004", 
    transportista: "Cargo Solutions Peru", 
    placa: "JKL-012", 
    conductor: "Miguel Ángeles",
    estado: "Completado", 
    turno: "11:00 - 11:30", 
    fecha: "2024-01-14", 
    qrCode: "ENAPU-TKT-004",
    clienteId: 2,
    slot: "B-02",
    prioridad: "Normal"
  },
  { 
    id: 5, 
    contenedorId: "CONT-2024-005", 
    transportista: "Transportes Rápidos SAC", 
    placa: "MNO-345", 
    conductor: "Ricardo Vega",
    estado: "Validado", 
    turno: "14:00 - 14:30", 
    fecha: "2024-01-15", 
    qrCode: "ENAPU-TKT-005",
    clienteId: 1,
    slot: "A-03",
    prioridad: "Alta"
  },
  { 
    id: 6, 
    contenedorId: "CONT-2024-006", 
    transportista: "Logística Express EIRL", 
    placa: "PQR-678", 
    conductor: "Fernando Castro",
    estado: "Pendiente", 
    turno: "15:00 - 15:30", 
    fecha: "2024-01-15", 
    qrCode: "ENAPU-TKT-006",
    clienteId: 2,
    slot: "C-01",
    prioridad: "Normal"
  },
  { 
    id: 7, 
    contenedorId: "CONT-2024-007", 
    transportista: "Transportes del Norte SA", 
    placa: "STU-901", 
    conductor: "Daniel Rojas",
    estado: "En Cola", 
    turno: "16:00 - 16:30", 
    fecha: "2024-01-15", 
    qrCode: "ENAPU-TKT-007",
    clienteId: 1,
    slot: "C-02",
    prioridad: "Normal"
  },
  { 
    id: 8, 
    contenedorId: "CONT-2024-008", 
    transportista: "Cargo Solutions Peru", 
    placa: "VWX-234", 
    conductor: "Alberto Sánchez",
    estado: "Retirado", 
    turno: "12:00 - 12:30", 
    fecha: "2024-01-13", 
    qrCode: "ENAPU-TKT-008",
    clienteId: 2,
    slot: "A-04",
    prioridad: "Normal"
  },
  { 
    id: 9, 
    contenedorId: "CONT-2024-009", 
    transportista: "Transportes Rápidos SAC", 
    placa: "YZA-567", 
    conductor: "Óscar Mendoza",
    estado: "Retirado", 
    turno: "13:00 - 13:30", 
    fecha: "2024-01-13", 
    qrCode: "ENAPU-TKT-009",
    clienteId: 1,
    slot: "B-03",
    prioridad: "Alta"
  },
  { 
    id: 10, 
    contenedorId: "CONT-2024-010", 
    transportista: "Logística Express EIRL", 
    placa: "BCD-890", 
    conductor: "Héctor Campos",
    estado: "Cancelado", 
    turno: "07:00 - 07:30", 
    fecha: "2024-01-12", 
    qrCode: "ENAPU-TKT-010",
    clienteId: 2,
    slot: null,
    prioridad: "Normal"
  },
];

export const turns = [
  { id: 1, ticketId: 1, hora: "08:00", slot: "A-01", estado: "Pendiente" },
  { id: 2, ticketId: 2, hora: "09:00", slot: "A-02", estado: "En Proceso" },
  { id: 3, ticketId: 3, hora: "10:00", slot: "B-01", estado: "Completado" },
  { id: 4, ticketId: 4, hora: "11:00", slot: "B-02", estado: "Completado" },
  { id: 5, ticketId: 5, hora: "14:00", slot: "A-03", estado: "Validado" },
  { id: 6, ticketId: 6, hora: "15:00", slot: "C-01", estado: "Pendiente" },
  { id: 7, ticketId: 7, hora: "16:00", slot: "C-02", estado: "En Cola" },
];

export const containers = [
  { 
    id: "CONT-2024-001", 
    ubicacion: "Zona A - Patio 1", 
    estado: "En Espera", 
    tipo: "20ft Standard",
    peso: "15,000 kg",
    naviera: "Maersk Line",
    historial: [
      { fecha: "2024-01-15 08:00", evento: "Ticket generado", usuario: "Juan Pérez" },
      { fecha: "2024-01-15 08:15", evento: "Asignado a slot A-01", usuario: "Sistema" }
    ]
  },
  { 
    id: "CONT-2024-002", 
    ubicacion: "Zona A - En Proceso", 
    estado: "Carga/Descarga", 
    tipo: "40ft High Cube",
    peso: "22,500 kg",
    naviera: "MSC",
    historial: [
      { fecha: "2024-01-15 09:00", evento: "Ticket generado", usuario: "Juan Pérez" },
      { fecha: "2024-01-15 09:10", evento: "Ingreso al puerto", usuario: "Carlos López" },
      { fecha: "2024-01-15 09:20", evento: "Inicio de descarga", usuario: "Carlos López" }
    ]
  },
  { 
    id: "CONT-2024-003", 
    ubicacion: "Zona B - Salida", 
    estado: "Retirado", 
    tipo: "20ft Standard",
    peso: "12,800 kg",
    naviera: "CMA CGM",
    historial: [
      { fecha: "2024-01-14 10:00", evento: "Ticket generado", usuario: "María García" },
      { fecha: "2024-01-14 10:15", evento: "Ingreso al puerto", usuario: "Ana Torres" },
      { fecha: "2024-01-14 10:30", evento: "Descarga completada", usuario: "Ana Torres" },
      { fecha: "2024-01-14 11:00", evento: "Contenedor retirado", usuario: "Ana Torres" }
    ]
  },
  { 
    id: "CONT-2024-004", 
    ubicacion: "Zona B - Archivo", 
    estado: "Retirado", 
    tipo: "40ft Standard",
    peso: "20,100 kg",
    naviera: "Evergreen",
    historial: [
      { fecha: "2024-01-14 11:00", evento: "Ticket generado", usuario: "María García" },
      { fecha: "2024-01-14 11:20", evento: "Ingreso al puerto", usuario: "Carlos López" },
      { fecha: "2024-01-14 11:45", evento: "Carga completada", usuario: "Carlos López" },
      { fecha: "2024-01-14 12:15", evento: "Contenedor retirado", usuario: "Carlos López" }
    ]
  },
  { 
    id: "CONT-2024-005", 
    ubicacion: "Zona A - Patio 3", 
    estado: "Validado", 
    tipo: "20ft Refrigerado",
    peso: "18,300 kg",
    naviera: "Hapag-Lloyd",
    historial: [
      { fecha: "2024-01-15 14:00", evento: "Ticket generado", usuario: "Juan Pérez" },
      { fecha: "2024-01-15 14:10", evento: "Ticket validado", usuario: "Ana Torres" }
    ]
  },
  { 
    id: "CONT-2024-006", 
    ubicacion: "Zona C - Patio 1", 
    estado: "En Espera", 
    tipo: "40ft High Cube",
    peso: "24,000 kg",
    naviera: "COSCO",
    historial: [
      { fecha: "2024-01-15 15:00", evento: "Ticket generado", usuario: "María García" }
    ]
  },
];

export const portsSlots = [
  { id: "A-01", nombre: "Slot A-01", zona: "Zona A", disponible: false, capacidad: 1, ocupadoPor: "CONT-2024-001" },
  { id: "A-02", nombre: "Slot A-02", zona: "Zona A", disponible: false, capacidad: 1, ocupadoPor: "CONT-2024-002" },
  { id: "A-03", nombre: "Slot A-03", zona: "Zona A", disponible: false, capacidad: 1, ocupadoPor: "CONT-2024-005" },
  { id: "A-04", nombre: "Slot A-04", zona: "Zona A", disponible: true, capacidad: 1, ocupadoPor: null },
  { id: "B-01", nombre: "Slot B-01", zona: "Zona B", disponible: true, capacidad: 1, ocupadoPor: null },
  { id: "B-02", nombre: "Slot B-02", zona: "Zona B", disponible: true, capacidad: 1, ocupadoPor: null },
  { id: "B-03", nombre: "Slot B-03", zona: "Zona B", disponible: true, capacidad: 1, ocupadoPor: null },
  { id: "C-01", nombre: "Slot C-01", zona: "Zona C", disponible: false, capacidad: 1, ocupadoPor: "CONT-2024-006" },
  { id: "C-02", nombre: "Slot C-02", zona: "Zona C", disponible: false, capacidad: 1, ocupadoPor: "CONT-2024-007" },
  { id: "C-03", nombre: "Slot C-03", zona: "Zona C", disponible: true, capacidad: 1, ocupadoPor: null },
];

export const fleet = [
  { id: 1, placa: "ABC-123", conductor: "Pedro Ruiz", tipo: "Camión 20ft", estado: "Activo", clienteId: 1 },
  { id: 2, placa: "DEF-456", conductor: "Luis Martínez", tipo: "Camión 40ft", estado: "Activo", clienteId: 1 },
  { id: 3, placa: "GHI-789", conductor: "Jorge Silva", tipo: "Camión 20ft", estado: "Activo", clienteId: 2 },
  { id: 4, placa: "JKL-012", conductor: "Miguel Ángeles", tipo: "Camión 40ft", estado: "Activo", clienteId: 2 },
  { id: 5, placa: "MNO-345", conductor: "Ricardo Vega", tipo: "Camión Refrigerado", estado: "Activo", clienteId: 1 },
  { id: 6, placa: "PQR-678", conductor: "Fernando Castro", tipo: "Camión 40ft HC", estado: "Mantenimiento", clienteId: 2 },
  { id: 7, placa: "STU-901", conductor: "Daniel Rojas", tipo: "Camión 20ft", estado: "Activo", clienteId: 1 },
];

export const notifications = [
  { id: 1, userId: 1, titulo: "Ticket Aprobado", mensaje: "Su ticket ENAPU-TKT-001 ha sido aprobado", fecha: "2024-01-15 08:15", leido: false, tipo: "success" },
  { id: 2, userId: 1, titulo: "Turno Asignado", mensaje: "Turno asignado: 08:00 - 08:30, Slot A-01", fecha: "2024-01-15 08:16", leido: false, tipo: "info" },
  { id: 3, userId: 1, titulo: "Proceso Iniciado", mensaje: "El contenedor CONT-2024-002 está en proceso", fecha: "2024-01-15 09:20", leido: true, tipo: "info" },
  { id: 4, userId: 2, titulo: "Ticket Completado", mensaje: "Ticket ENAPU-TKT-003 completado exitosamente", fecha: "2024-01-14 11:00", leido: true, tipo: "success" },
  { id: 5, userId: 1, titulo: "Recordatorio", mensaje: "Su turno es en 30 minutos", fecha: "2024-01-15 07:30", leido: true, tipo: "warning" },
];

export const systemLogs = [
  { id: 1, fecha: "2024-01-15 09:20:15", evento: "Ticket validado", nivel: "info", detalle: "Ticket ENAPU-TKT-002 validado por Carlos López", modulo: "Validación" },
  { id: 2, fecha: "2024-01-15 09:15:32", evento: "Usuario autenticado", nivel: "info", detalle: "Juan Pérez inició sesión", modulo: "Autenticación" },
  { id: 3, fecha: "2024-01-15 09:10:45", evento: "Ingreso registrado", nivel: "success", detalle: "Vehículo ABC-123 ingresó al puerto", modulo: "Control Acceso" },
  { id: 4, fecha: "2024-01-15 08:55:12", evento: "Error de validación", nivel: "error", detalle: "QR code inválido detectado", modulo: "Validación" },
  { id: 5, fecha: "2024-01-15 08:45:03", evento: "Slot asignado", nivel: "info", detalle: "Slot A-03 asignado a CONT-2024-005", modulo: "Asignación" },
  { id: 6, fecha: "2024-01-15 08:30:21", evento: "Ticket generado", nivel: "success", detalle: "Nuevo ticket ENAPU-TKT-006 creado", modulo: "Tickets" },
  { id: 7, fecha: "2024-01-15 08:20:44", evento: "Sincronización", nivel: "info", detalle: "Base de datos sincronizada", modulo: "Sistema" },
  { id: 8, fecha: "2024-01-15 08:15:18", evento: "Configuración actualizada", nivel: "warning", detalle: "Horario de operación modificado", modulo: "Configuración" },
  { id: 9, fecha: "2024-01-15 08:05:56", evento: "Respaldo completado", nivel: "success", detalle: "Respaldo automático ejecutado", modulo: "Sistema" },
  { id: 10, fecha: "2024-01-15 08:00:00", evento: "Sistema iniciado", nivel: "info", detalle: "Sistema ENAPU iniciado correctamente", modulo: "Sistema" },
];

export const reportData = {
  tiemposEspera: [
    { fecha: "2024-01-10", promedio: 25 },
    { fecha: "2024-01-11", promedio: 32 },
    { fecha: "2024-01-12", promedio: 28 },
    { fecha: "2024-01-13", promedio: 22 },
    { fecha: "2024-01-14", promedio: 30 },
    { fecha: "2024-01-15", promedio: 27 },
  ],
  volumenContenedores: [
    { fecha: "2024-01-10", cantidad: 45 },
    { fecha: "2024-01-11", cantidad: 52 },
    { fecha: "2024-01-12", cantidad: 38 },
    { fecha: "2024-01-13", cantidad: 48 },
    { fecha: "2024-01-14", cantidad: 55 },
    { fecha: "2024-01-15", cantidad: 42 },
  ],
  productividadTurno: [
    { turno: "Mañana (06:00-14:00)", procesados: 18, promedio: 25 },
    { turno: "Tarde (14:00-22:00)", procesados: 15, promedio: 28 },
    { turno: "Noche (22:00-06:00)", procesados: 9, promedio: 35 },
  ],
};

export const systemConfig = {
  horarioOperacion: {
    inicio: "06:00",
    fin: "22:00",
    diasLaborales: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  },
  capacidadSlots: {
    zonaA: 4,
    zonaB: 3,
    zonaC: 3,
    total: 10
  },
  reglasAsignacion: {
    prioridadAlta: "Asignación inmediata al primer slot disponible",
    prioridadNormal: "Asignación por orden de llegada",
    tiempoMaximoEspera: "45 minutos",
    tiempoProcesoPromedio: "30 minutos"
  },
  notificaciones: {
    recordatorioTurno: "30 minutos antes",
    alertaRetraso: "15 minutos después del turno",
    notificacionCompletado: "Inmediata"
  }
};
