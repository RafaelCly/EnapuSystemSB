-- =====================================================================
-- SCRIPT DE MIGRACIÓN COMPLETA PARA SUPABASE - SISTEMA ENAPU
-- =====================================================================
-- Este script crea todo el esquema de base de datos para el sistema 
-- de gestión portuaria ENAPU en Supabase (PostgreSQL en la nube)
--
-- Incluye:
-- 1. Tablas de catálogo (Rol, Nivel_acceso)
-- 2. Tabla de Usuarios (con autenticación)
-- 3. Tablas de ubicación (Zona, Ubicacion_slot)
-- 4. Tablas de operaciones (Buque, Contenedor, Cita_recojo)
-- 5. Tablas de tickets y facturación (Ticket, Factura, Pago)
-- 6. Tabla de reportes
-- 7. Funciones y triggers
-- 8. Índices para optimización
-- 9. Row Level Security (RLS) para Supabase
-- 10. Datos iniciales (seed data)
-- =====================================================================

-- =====================================================================
-- PASO 1: LIMPIAR BASE DE DATOS (OPCIONAL - COMENTAR SI NO DESEAS BORRAR)
-- =====================================================================

-- Eliminar todas las tablas si existen
DROP TABLE IF EXISTS Pago CASCADE;
DROP TABLE IF EXISTS Factura CASCADE;
DROP TABLE IF EXISTS Ticket CASCADE;
DROP TABLE IF EXISTS Contenedor CASCADE;
DROP TABLE IF EXISTS Cita_recojo CASCADE;
DROP TABLE IF EXISTS Buque CASCADE;
DROP TABLE IF EXISTS Ubicacion_slot CASCADE;
DROP TABLE IF EXISTS Zona CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;
DROP TABLE IF EXISTS Nivel_acceso CASCADE;
DROP TABLE IF EXISTS Rol CASCADE;
DROP TABLE IF EXISTS Reporte CASCADE;

-- Eliminar funciones si existen
DROP FUNCTION IF EXISTS actualizar_fecha_modificacion() CASCADE;

-- =====================================================================
-- PASO 2: CREAR TABLAS DE CATÁLOGO
-- =====================================================================

-- Tabla de roles de usuario
CREATE TABLE Rol (
  id INT NOT NULL,
  rol VARCHAR(50) NOT NULL,
  descripcion TEXT,
  PRIMARY KEY (id)
);

-- Tabla de niveles de acceso
CREATE TABLE Nivel_acceso (
  id INT NOT NULL,
  nivel VARCHAR(50) NOT NULL,
  descripcion TEXT,
  PRIMARY KEY (id)
);

-- =====================================================================
-- PASO 3: CREAR TABLA DE USUARIOS (CON CAMPOS DE AUTENTICACIÓN)
-- =====================================================================

CREATE TABLE Usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  empresa VARCHAR(100),
  id_rol INT NOT NULL,
  id_nivel_acceso INT NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_modificacion TIMESTAMP WITH TIME ZONE,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (id_rol) REFERENCES Rol(id) ON DELETE RESTRICT,
  FOREIGN KEY (id_nivel_acceso) REFERENCES Nivel_acceso(id) ON DELETE RESTRICT
);

-- =====================================================================
-- PASO 4: CREAR TABLAS DE UBICACIÓN
-- =====================================================================

-- Tabla de zonas del puerto
CREATE TABLE Zona (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  capacidad INT NOT NULL CHECK (capacidad > 0),
  descripcion TEXT,
  activa BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de slots de ubicación
CREATE TABLE Ubicacion_slot (
  id SERIAL PRIMARY KEY,
  fila INT NOT NULL CHECK (fila > 0),
  columna INT NOT NULL CHECK (columna > 0),
  nivel INT NOT NULL CHECK (nivel > 0),
  estado VARCHAR(20) NOT NULL DEFAULT 'Vacio' CHECK (estado IN ('Vacio', 'Ocupado', 'Reservado', 'Mantenimiento')),
  id_zona INT NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_modificacion TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (id_zona) REFERENCES Zona(id) ON DELETE CASCADE,
  UNIQUE (fila, columna, nivel, id_zona)
);

-- =====================================================================
-- PASO 5: CREAR TABLAS DE BUQUES Y CONTENEDORES
-- =====================================================================

-- Tabla de buques
CREATE TABLE Buque (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  linea_naviera VARCHAR(100) NOT NULL,
  capacidad_contenedores INT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla de citas de recojo
CREATE TABLE Cita_recojo (
  id SERIAL PRIMARY KEY,
  fecha_inicio_horario TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_salida_horario TIMESTAMP WITH TIME ZONE NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'Programada' CHECK (estado IN ('Programada', 'Completada', 'Vencida', 'Cancelada')),
  observaciones TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (fecha_salida_horario >= fecha_inicio_horario)
);

-- Tabla de contenedores
CREATE TABLE Contenedor (
  id SERIAL PRIMARY KEY,
  codigo_contenedor VARCHAR(20) UNIQUE,
  dimensiones VARCHAR(50) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Seco', 'Refrigerado', 'Open Top', 'Flat Rack', 'Tanque')),
  peso DECIMAL(10, 2) NOT NULL CHECK (peso > 0),
  id_buque INT NOT NULL,
  id_cita_recojo INT NOT NULL,
  descripcion_carga TEXT,
  temperatura_requerida DECIMAL(5, 2),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (id_buque) REFERENCES Buque(id) ON DELETE RESTRICT,
  FOREIGN KEY (id_cita_recojo) REFERENCES Cita_recojo(id) ON DELETE RESTRICT
);

-- =====================================================================
-- PASO 6: CREAR TABLAS DE OPERACIÓN (TICKETS Y FACTURACIÓN)
-- =====================================================================

-- Tabla de tickets
CREATE TABLE Ticket (
  id SERIAL PRIMARY KEY,
  numero_ticket VARCHAR(50) UNIQUE,
  fecha_hora_entrada TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_hora_salida TIMESTAMP WITH TIME ZONE,
  estado VARCHAR(50) NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Finalizado', 'Cancelado')),
  id_ubicacion INT NOT NULL,
  id_usuario INT NOT NULL,
  id_contenedor INT NOT NULL,
  observaciones TEXT,
  fecha_modificacion TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (id_ubicacion) REFERENCES Ubicacion_slot(id) ON DELETE RESTRICT,
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id) ON DELETE RESTRICT,
  FOREIGN KEY (id_contenedor) REFERENCES Contenedor(id) ON DELETE RESTRICT,
  CHECK (fecha_hora_salida IS NULL OR fecha_hora_salida >= fecha_hora_entrada)
);

-- Tabla de facturas
CREATE TABLE Factura (
  id SERIAL PRIMARY KEY,
  numero_factura VARCHAR(50) UNIQUE,
  fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
  monto DECIMAL(10, 2) NOT NULL CHECK (monto >= 0),
  estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Pagada', 'Vencida', 'Anulada')),
  id_ticket INT NOT NULL,
  fecha_vencimiento DATE,
  observaciones TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (id_ticket) REFERENCES Ticket(id) ON DELETE RESTRICT
);

-- Tabla de pagos
CREATE TABLE Pago (
  id SERIAL PRIMARY KEY,
  numero_operacion VARCHAR(50) UNIQUE,
  fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
  medio_pago VARCHAR(50) NOT NULL CHECK (medio_pago IN ('Efectivo', 'Transferencia', 'Tarjeta', 'Cheque', 'Deposito')),
  monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
  id_factura INT NOT NULL,
  comprobante_url TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (id_factura) REFERENCES Factura(id) ON DELETE RESTRICT
);

-- =====================================================================
-- PASO 7: CREAR TABLA DE REPORTES
-- =====================================================================

CREATE TABLE Reporte (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parametros JSONB,
  resultado JSONB,
  generado_por INT,
  FOREIGN KEY (generado_por) REFERENCES Usuario(id) ON DELETE SET NULL
);

-- =====================================================================
-- PASO 8: CREAR FUNCIONES Y TRIGGERS
-- =====================================================================

-- Función para actualizar automáticamente la fecha de modificación
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para Usuario
CREATE TRIGGER trigger_usuario_modificacion
BEFORE UPDATE ON Usuario
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Trigger para Ticket
CREATE TRIGGER trigger_ticket_modificacion
BEFORE UPDATE ON Ticket
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Trigger para Ubicacion_slot
CREATE TRIGGER trigger_ubicacion_modificacion
BEFORE UPDATE ON Ubicacion_slot
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Función para generar número de ticket automático
CREATE OR REPLACE FUNCTION generar_numero_ticket()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_ticket IS NULL THEN
        NEW.numero_ticket = 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar número de ticket
CREATE TRIGGER trigger_generar_numero_ticket
BEFORE INSERT ON Ticket
FOR EACH ROW
EXECUTE FUNCTION generar_numero_ticket();

-- Función para generar número de factura automático
CREATE OR REPLACE FUNCTION generar_numero_factura()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_factura IS NULL THEN
        NEW.numero_factura = 'FAC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar número de factura
CREATE TRIGGER trigger_generar_numero_factura
BEFORE INSERT ON Factura
FOR EACH ROW
EXECUTE FUNCTION generar_numero_factura();

-- Función para actualizar el estado de la ubicación cuando se crea/modifica un ticket
CREATE OR REPLACE FUNCTION actualizar_estado_ubicacion()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.estado = 'Activo') THEN
        UPDATE Ubicacion_slot SET estado = 'Ocupado' WHERE id = NEW.id_ubicacion;
    ELSIF TG_OP = 'UPDATE' AND NEW.estado IN ('Finalizado', 'Cancelado') THEN
        UPDATE Ubicacion_slot SET estado = 'Vacio' WHERE id = NEW.id_ubicacion;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE Ubicacion_slot SET estado = 'Vacio' WHERE id = OLD.id_ubicacion;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estado de ubicación
CREATE TRIGGER trigger_actualizar_ubicacion
AFTER INSERT OR UPDATE OR DELETE ON Ticket
FOR EACH ROW
EXECUTE FUNCTION actualizar_estado_ubicacion();

-- =====================================================================
-- PASO 9: CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================================

-- Índices para búsquedas frecuentes
CREATE INDEX idx_usuario_rol ON Usuario(id_rol);
CREATE INDEX idx_usuario_email ON Usuario(email);
CREATE INDEX idx_usuario_activo ON Usuario(activo);

CREATE INDEX idx_ticket_estado ON Ticket(estado);
CREATE INDEX idx_ticket_usuario ON Ticket(id_usuario);
CREATE INDEX idx_ticket_contenedor ON Ticket(id_contenedor);
CREATE INDEX idx_ticket_fecha_entrada ON Ticket(fecha_hora_entrada);

CREATE INDEX idx_contenedor_buque ON Contenedor(id_buque);
CREATE INDEX idx_contenedor_tipo ON Contenedor(tipo);
CREATE INDEX idx_contenedor_cita ON Contenedor(id_cita_recojo);

CREATE INDEX idx_slot_zona ON Ubicacion_slot(id_zona);
CREATE INDEX idx_slot_estado ON Ubicacion_slot(estado);

CREATE INDEX idx_factura_estado ON Factura(estado);
CREATE INDEX idx_factura_ticket ON Factura(id_ticket);
CREATE INDEX idx_factura_fecha ON Factura(fecha_emision);

CREATE INDEX idx_pago_factura ON Pago(id_factura);
CREATE INDEX idx_pago_fecha ON Pago(fecha_pago);

CREATE INDEX idx_cita_estado ON Cita_recojo(estado);
CREATE INDEX idx_cita_fecha ON Cita_recojo(fecha_inicio_horario);

CREATE INDEX idx_reporte_tipo ON Reporte(tipo);
CREATE INDEX idx_reporte_fecha ON Reporte(fecha_generacion);

-- =====================================================================
-- PASO 10: POBLAR DATOS INICIALES (SEED DATA)
-- =====================================================================

-- Insertar Roles
INSERT INTO Rol (id, rol, descripcion) VALUES 
(1, 'Administrador', 'Usuario con acceso completo al sistema'),
(2, 'Operario', 'Usuario operativo con permisos limitados'),
(3, 'Cliente', 'Cliente con acceso de consulta');

-- Insertar Niveles de Acceso
INSERT INTO Nivel_acceso (id, nivel, descripcion) VALUES 
(1, 'Administracion', 'Acceso total al sistema'),
(2, 'Operacion', 'Acceso a operaciones del puerto'),
(3, 'Consulta', 'Acceso de solo lectura');

-- Insertar Usuarios
-- IMPORTANTE: Los passwords están en texto plano solo para demostración
-- En producción, debes usar bcrypt o similar para hashear las contraseñas
INSERT INTO Usuario (nombre, email, password, telefono, empresa, id_rol, id_nivel_acceso) VALUES 
-- Administradores
('Andrea Torres', 'andrea.torres@enapu.com', 'admin123', '+51 999 888 777', 'ENAPU', 1, 1),
('Ricardo Soto', 'ricardo.soto@enapu.com', 'admin123', '+51 999 888 778', 'ENAPU', 1, 1),

-- Operarios
('Juan Perez', 'juan.perez@enapu.com', 'oper123', '+51 999 777 666', 'ENAPU', 2, 2),
('Maria Lopez', 'maria.lopez@enapu.com', 'oper123', '+51 999 777 667', 'ENAPU', 2, 2),
('Carlos Ruiz', 'carlos.ruiz@enapu.com', 'oper123', '+51 999 777 668', 'ENAPU', 2, 2),
('Ana Gomez', 'ana.gomez@enapu.com', 'oper123', '+51 999 777 669', 'ENAPU', 2, 2),
('Javier Diaz', 'javier.diaz@enapu.com', 'oper123', '+51 999 777 670', 'ENAPU', 2, 2),
('Laura Vega', 'laura.vega@enapu.com', 'oper123', '+51 999 777 671', 'ENAPU', 2, 2),
('Pedro Salas', 'pedro.salas@enapu.com', 'oper123', '+51 999 777 672', 'ENAPU', 2, 2),
('Elena Ramos', 'elena.ramos@enapu.com', 'oper123', '+51 999 777 673', 'ENAPU', 2, 2),

-- Clientes
('Contenedores Sur S.A.', 'contacto@contenedoressur.com', 'cliente123', '+51 999 666 555', 'Contenedores Sur S.A.', 3, 3),
('Logistica Global Peru', 'info@logisticaglobal.com', 'cliente123', '+51 999 666 556', 'Logistica Global Peru', 3, 3),
('Importadora del Norte', 'ventas@importadoranorte.com', 'cliente123', '+51 999 666 557', 'Importadora del Norte', 3, 3),
('Transporte Maritimo E.I.R.L.', 'contacto@transportemaritimo.com', 'cliente123', '+51 999 666 558', 'Transporte Maritimo E.I.R.L.', 3, 3),
('Naviera Pacifico', 'info@navierapacifico.com', 'cliente123', '+51 999 666 559', 'Naviera Pacifico', 3, 3),
('Distribuciones Costa', 'ventas@distcosta.com', 'cliente123', '+51 999 666 560', 'Distribuciones Costa', 3, 3),
('Grupo Fenix Logistics', 'contacto@fenixlog.com', 'cliente123', '+51 999 666 561', 'Grupo Fenix Logistics', 3, 3),
('Almacenes Centrales', 'info@almacenescentrales.com', 'cliente123', '+51 999 666 562', 'Almacenes Centrales', 3, 3),
('Comercio Exterior L&P', 'contacto@lypcomercio.com', 'cliente123', '+51 999 666 563', 'Comercio Exterior L&P', 3, 3),
('Servicios Aduaneros A1', 'info@aduanerosa1.com', 'cliente123', '+51 999 666 564', 'Servicios Aduaneros A1', 3, 3);

-- Insertar Zonas
INSERT INTO Zona (nombre, capacidad, descripcion) VALUES 
('Estandar Seco', 500, 'Zona principal para contenedores secos estándar'),
('Especializada Reefer', 50, 'Zona especializada para contenedores refrigerados con conexión eléctrica'),
('Inspeccion Vaciado', 10, 'Zona temporal para inspección y vaciado de contenedores');

-- Insertar Ubicaciones de Slots
-- NOTA: Insertamos solo algunos slots de ejemplo. Puedes agregar más según necesites.
INSERT INTO Ubicacion_slot (fila, columna, nivel, estado, id_zona) VALUES 
-- ZONA 1: Estandar Seco - 15 Slots
(1, 1, 1, 'Vacio', 1),
(1, 2, 1, 'Vacio', 1),
(1, 3, 1, 'Vacio', 1),
(2, 1, 1, 'Vacio', 1),
(2, 2, 1, 'Vacio', 1),
(2, 3, 1, 'Vacio', 1),
(3, 1, 1, 'Vacio', 1),
(3, 2, 1, 'Vacio', 1),
(3, 3, 1, 'Vacio', 1),
(4, 1, 1, 'Vacio', 1),
(4, 2, 1, 'Vacio', 1),
(4, 3, 1, 'Vacio', 1),
(5, 1, 1, 'Vacio', 1),
(5, 2, 1, 'Vacio', 1),
(5, 3, 1, 'Vacio', 1),

-- ZONA 2: Especializada Reefer - 6 Slots
(6, 1, 1, 'Vacio', 2),
(6, 2, 1, 'Vacio', 2),
(6, 3, 1, 'Vacio', 2),
(7, 1, 1, 'Vacio', 2),
(7, 2, 1, 'Vacio', 2),
(7, 3, 1, 'Vacio', 2),

-- ZONA 3: Inspeccion Vaciado - 4 Slots
(8, 1, 1, 'Vacio', 3),
(8, 2, 1, 'Vacio', 3),
(9, 1, 1, 'Vacio', 3),
(9, 2, 1, 'Vacio', 3);

-- Insertar Buques
INSERT INTO Buque (nombre, linea_naviera, capacidad_contenedores) VALUES 
('MSC Águila', 'Mediterranean Shipping Co.', 8000),
('Maersk Lima', 'Maersk Line', 10000),
('CMA CGM Titan', 'CMA CGM Group', 12000),
('Hapag-Lloyd Atlántico', 'Hapag-Lloyd', 9000),
('ONE Commitment', 'Ocean Network Express', 11000),
('Ever Given', 'Evergreen Marine', 20000),
('COSCO Pacífico', 'COSCO Shipping', 15000),
('NYK Antares', 'Nippon Yusen Kaisha', 8500),
('ZIM Caribe', 'ZIM Integrated Shipping', 7000),
('Hamburg Süd América', 'Hamburg Süd', 9500);

-- Insertar Citas de Recojo
INSERT INTO Cita_recojo (fecha_inicio_horario, fecha_salida_horario, estado) VALUES 
-- Completadas
('2025-11-08 08:00:00', '2025-11-08 18:00:00', 'Completada'),
('2025-11-09 08:00:00', '2025-11-09 18:00:00', 'Completada'),
('2025-11-09 10:00:00', '2025-11-09 20:00:00', 'Completada'),
('2025-11-10 07:00:00', '2025-11-10 17:00:00', 'Completada'),
('2025-11-10 09:00:00', '2025-11-10 19:00:00', 'Completada'),

-- Vencidas
('2025-11-05 08:00:00', '2025-11-05 18:00:00', 'Vencida'),
('2025-11-06 08:00:00', '2025-11-06 18:00:00', 'Vencida'),
('2025-11-07 08:00:00', '2025-11-07 18:00:00', 'Vencida'),

-- Programadas
('2025-12-01 08:00:00', '2025-12-01 18:00:00', 'Programada'),
('2025-12-02 08:00:00', '2025-12-02 18:00:00', 'Programada'),
('2025-12-03 08:00:00', '2025-12-03 18:00:00', 'Programada'),
('2025-12-04 08:00:00', '2025-12-04 18:00:00', 'Programada'),
('2025-12-05 08:00:00', '2025-12-05 18:00:00', 'Programada');

-- Insertar Contenedores
INSERT INTO Contenedor (codigo_contenedor, dimensiones, tipo, peso, id_buque, id_cita_recojo, descripcion_carga, temperatura_requerida) VALUES 
-- Contenedores de citas completadas
('MSCU1234567', '12.19x2.44x2.59', 'Seco', 28500.50, 1, 1, 'Maquinaria industrial', NULL),
('MAEU7654321', '6.06x2.44x2.59', 'Seco', 18000.00, 2, 2, 'Textiles', NULL),
('CMAU9876543', '12.19x2.44x2.89', 'Refrigerado', 30100.25, 3, 3, 'Productos perecederos', -18.00),
('HLCU5551234', '6.06x2.44x2.59', 'Seco', 15500.75, 4, 4, 'Electrodomésticos', NULL),
('OOLU3334567', '12.19x2.44x2.59', 'Seco', 25000.00, 5, 5, 'Autopartes', NULL),

-- Contenedores de citas vencidas (aún en puerto)
('MSCU2223456', '6.06x2.44x2.59', 'Refrigerado', 20500.00, 1, 6, 'Alimentos congelados', -20.00),
('MAEU8887654', '12.19x2.44x2.59', 'Seco', 27000.90, 2, 7, 'Materiales de construcción', NULL),
('CMAU4445678', '6.06x2.44x2.59', 'Seco', 19200.50, 3, 8, 'Productos químicos', NULL),

-- Contenedores de citas programadas
('HLCU6667890', '12.19x2.44x2.59', 'Seco', 26000.00, 4, 9, 'Muebles', NULL),
('OOLU1112345', '6.06x2.44x2.59', 'Seco', 17500.00, 5, 10, 'Ropa', NULL),
('EISU9998877', '12.19x2.44x2.89', 'Refrigerado', 31000.50, 6, 11, 'Frutas', 5.00),
('COSU7776655', '6.06x2.44x2.59', 'Seco', 14900.20, 7, 12, 'Libros', NULL),
('NYKU5554433', '12.19x2.44x2.59', 'Seco', 29000.75, 8, 13, 'Electrónica', NULL);

-- Insertar algunos Tickets (solo los de citas completadas y vencidas)
-- Los tickets de las citas completadas ya fueron procesados
INSERT INTO Ticket (fecha_hora_entrada, fecha_hora_salida, estado, id_ubicacion, id_usuario, id_contenedor, observaciones) VALUES 
-- Tickets finalizados (citas completadas)
('2025-11-08 08:30:00', '2025-11-08 17:45:00', 'Finalizado', 1, 3, 1, 'Procesado sin novedad'),
('2025-11-09 09:00:00', '2025-11-09 16:20:00', 'Finalizado', 2, 4, 2, 'Procesado sin novedad'),
('2025-11-09 10:15:00', '2025-11-10 11:00:00', 'Finalizado', 16, 5, 3, 'Mantenimiento refrigeración OK'),
('2025-11-10 07:40:00', '2025-11-10 14:00:00', 'Finalizado', 3, 6, 4, 'Procesado sin novedad'),
('2025-11-10 09:30:00', '2025-11-10 18:30:00', 'Finalizado', 4, 7, 5, 'Procesado sin novedad'),

-- Tickets activos (citas vencidas - contenedores aún en puerto)
('2025-11-05 15:00:00', NULL, 'Activo', 17, 5, 6, 'Pendiente retiro'),
('2025-11-06 14:10:00', NULL, 'Activo', 7, 6, 7, 'Pendiente retiro'),
('2025-11-07 10:30:00', NULL, 'Activo', 8, 7, 8, 'Pendiente retiro');

-- Insertar Facturas
INSERT INTO Factura (fecha_emision, monto, estado, id_ticket, fecha_vencimiento, observaciones) VALUES 
('2025-11-10', 500.00, 'Pagada', 1, '2025-11-20', NULL),
('2025-11-10', 650.00, 'Pagada', 2, '2025-11-20', NULL),
('2025-11-10', 980.50, 'Pagada', 3, '2025-11-20', 'Tarifa refrigerado'),
('2025-11-10', 720.00, 'Pendiente', 4, '2025-11-20', NULL),
('2025-11-10', 810.00, 'Pagada', 5, '2025-11-20', NULL),
('2025-11-06', 1200.00, 'Vencida', 6, '2025-11-16', 'Cargo por almacenaje extra'),
('2025-11-07', 950.00, 'Pendiente', 7, '2025-11-17', NULL);

-- Insertar Pagos
INSERT INTO Pago (numero_operacion, fecha_pago, medio_pago, monto, id_factura) VALUES 
('OP-20251110-001', '2025-11-10', 'Transferencia', 500.00, 1),
('OP-20251110-002', '2025-11-10', 'Efectivo', 650.00, 2),
('OP-20251110-003', '2025-11-10', 'Transferencia', 980.50, 3),
('OP-20251110-004', '2025-11-10', 'Efectivo', 810.00, 5);

-- Insertar algunos Reportes de ejemplo
INSERT INTO Reporte (tipo, parametros, generado_por) VALUES 
('Movimientos Diarios', '{"fecha": "2025-11-10"}', 1),
('Ocupación de Zonas', '{"zona": "todas", "tipo": "Seco"}', 1),
('Tickets Activos', '{"estado": "Activo"}', 2),
('Facturas Pendientes', '{"estado": "Pendiente"}', 1);

-- =====================================================================
-- PASO 11: ROW LEVEL SECURITY (RLS) - DESHABILITADO POR AHORA
-- =====================================================================
-- NOTA: RLS está comentado porque requiere Supabase Auth configurado primero.
-- Para habilitar RLS en el futuro:
-- 1. Configura Supabase Authentication
-- 2. Decide si usarás auth.users.id (UUID) o tu propia tabla Usuario
-- 3. Crea políticas apropiadas según tu modelo de seguridad
--
-- Por ahora, la seguridad debe manejarse en tu backend/API
-- =====================================================================

-- =====================================================================
-- VERIFICACIÓN FINAL
-- =====================================================================

-- Consulta para verificar que todo se creó correctamente
SELECT 
  'Tablas creadas' as tipo, 
  COUNT(*) as cantidad 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'

UNION ALL

SELECT 
  'Funciones creadas' as tipo, 
  COUNT(*) as cantidad 
FROM information_schema.routines 
WHERE routine_schema = 'public'

UNION ALL

SELECT 
  'Triggers creados' as tipo, 
  COUNT(*) as cantidad 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Mostrar resumen de datos insertados
SELECT 'Usuarios' as tabla, COUNT(*) as registros FROM Usuario
UNION ALL SELECT 'Roles', COUNT(*) FROM Rol
UNION ALL SELECT 'Zonas', COUNT(*) FROM Zona
UNION ALL SELECT 'Ubicaciones', COUNT(*) FROM Ubicacion_slot
UNION ALL SELECT 'Buques', COUNT(*) FROM Buque
UNION ALL SELECT 'Citas', COUNT(*) FROM Cita_recojo
UNION ALL SELECT 'Contenedores', COUNT(*) FROM Contenedor
UNION ALL SELECT 'Tickets', COUNT(*) FROM Ticket
UNION ALL SELECT 'Facturas', COUNT(*) FROM Factura
UNION ALL SELECT 'Pagos', COUNT(*) FROM Pago
UNION ALL SELECT 'Reportes', COUNT(*) FROM Reporte
ORDER BY tabla;

-- =====================================================================
-- ¡MIGRACIÓN COMPLETA!
-- =====================================================================
-- Este script ha creado toda tu base de datos para Supabase.
-- Próximos pasos:
-- 1. Conecta tu aplicación frontend a Supabase
-- 2. Configura Supabase Auth para la autenticación de usuarios
-- 3. Ajusta las políticas RLS según tus necesidades de seguridad
-- 4. Implementa el sistema de hash de contraseñas (bcrypt)
-- =====================================================================
