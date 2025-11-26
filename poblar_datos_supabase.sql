-- =====================================================================
-- SCRIPT PARA POBLAR DATOS EN SUPABASE - SISTEMA ENAPU
-- =====================================================================
-- Ejecuta este script en Supabase SQL Editor para insertar datos de prueba
-- =====================================================================

-- PRIMERO: Limpiar datos existentes (opcional)
TRUNCATE TABLE pago CASCADE;
TRUNCATE TABLE factura CASCADE;
TRUNCATE TABLE ticket CASCADE;
TRUNCATE TABLE contenedor CASCADE;
TRUNCATE TABLE cita_recojo CASCADE;
TRUNCATE TABLE buque CASCADE;
TRUNCATE TABLE ubicacion_slot CASCADE;
TRUNCATE TABLE zona CASCADE;
TRUNCATE TABLE usuario CASCADE;
TRUNCATE TABLE nivel_acceso CASCADE;
TRUNCATE TABLE rol CASCADE;
TRUNCATE TABLE reporte CASCADE;

-- =====================================================================
-- PASO 1: INSERTAR ROLES
-- =====================================================================
INSERT INTO rol (id, rol, descripcion) VALUES 
(1, 'Administrador', 'Usuario con acceso completo al sistema'),
(2, 'Operario', 'Usuario operativo con permisos limitados'),
(3, 'Cliente', 'Cliente con acceso de consulta');

-- =====================================================================
-- PASO 2: INSERTAR NIVELES DE ACCESO
-- =====================================================================
INSERT INTO nivel_acceso (id, nivel, descripcion) VALUES 
(1, 'Administracion', 'Acceso total al sistema'),
(2, 'Operacion', 'Acceso a operaciones del puerto'),
(3, 'Consulta', 'Acceso de solo lectura');

-- =====================================================================
-- PASO 3: INSERTAR USUARIOS
-- =====================================================================
-- IMPORTANTE: Contraseñas en texto plano solo para desarrollo
-- En producción usa bcrypt o Supabase Auth

-- ADMINISTRADORES (id_rol = 1)
INSERT INTO usuario (nombre, email, password, telefono, empresa, id_rol, id_nivel_acceso) VALUES 
('Andrea Torres', 'andrea.torres@enapu.com', 'admin123', '+51 999 888 777', 'ENAPU', 1, 1),
('Ricardo Soto', 'ricardo.soto@enapu.com', 'admin123', '+51 999 888 778', 'ENAPU', 1, 1);

-- OPERARIOS (id_rol = 2)
INSERT INTO usuario (nombre, email, password, telefono, empresa, id_rol, id_nivel_acceso) VALUES 
('Juan Perez', 'juan.perez@enapu.com', 'oper123', '+51 999 777 666', 'ENAPU', 2, 2),
('Maria Lopez', 'maria.lopez@enapu.com', 'oper123', '+51 999 777 667', 'ENAPU', 2, 2),
('Carlos Ruiz', 'carlos.ruiz@enapu.com', 'oper123', '+51 999 777 668', 'ENAPU', 2, 2),
('Ana Gomez', 'ana.gomez@enapu.com', 'oper123', '+51 999 777 669', 'ENAPU', 2, 2);

-- CLIENTES (id_rol = 3) ⭐ IMPORTANTE
INSERT INTO usuario (nombre, email, password, telefono, empresa, id_rol, id_nivel_acceso) VALUES 
('Contenedores Sur S.A.', 'contacto@contenedoressur.com', 'cliente123', '+51 999 666 555', 'Contenedores Sur S.A.', 3, 3),
('Logistica Global Peru', 'info@logisticaglobal.com', 'cliente123', '+51 999 666 556', 'Logistica Global Peru', 3, 3),
('Importadora del Norte', 'ventas@importadoranorte.com', 'cliente123', '+51 999 666 557', 'Importadora del Norte', 3, 3),
('Transporte Maritimo EIRL', 'contacto@transportemaritimo.com', 'cliente123', '+51 999 666 558', 'Transporte Maritimo EIRL', 3, 3),
('Naviera Pacifico', 'info@navierapacifico.com', 'cliente123', '+51 999 666 559', 'Naviera Pacifico', 3, 3);

-- =====================================================================
-- PASO 4: INSERTAR ZONAS
-- =====================================================================
INSERT INTO zona (nombre, capacidad, descripcion) VALUES 
('Estandar Seco', 500, 'Zona principal para contenedores secos estándar'),
('Especializada Reefer', 50, 'Zona especializada para contenedores refrigerados'),
('Inspeccion Vaciado', 10, 'Zona temporal para inspección y vaciado');

-- =====================================================================
-- PASO 5: INSERTAR UBICACIONES SLOT
-- =====================================================================
-- ZONA 1: Estandar Seco (20 slots)
INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona) VALUES 
(1, 1, 1, 'Vacio', 1), (1, 2, 1, 'Vacio', 1), (1, 3, 1, 'Vacio', 1), (1, 4, 1, 'Vacio', 1), (1, 5, 1, 'Vacio', 1),
(2, 1, 1, 'Vacio', 1), (2, 2, 1, 'Vacio', 1), (2, 3, 1, 'Vacio', 1), (2, 4, 1, 'Vacio', 1), (2, 5, 1, 'Vacio', 1),
(3, 1, 1, 'Vacio', 1), (3, 2, 1, 'Vacio', 1), (3, 3, 1, 'Vacio', 1), (3, 4, 1, 'Vacio', 1), (3, 5, 1, 'Vacio', 1),
(4, 1, 1, 'Vacio', 1), (4, 2, 1, 'Vacio', 1), (4, 3, 1, 'Vacio', 1), (4, 4, 1, 'Vacio', 1), (4, 5, 1, 'Vacio', 1);

-- ZONA 2: Especializada Reefer (10 slots)
INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona) VALUES 
(5, 1, 1, 'Vacio', 2), (5, 2, 1, 'Vacio', 2), (5, 3, 1, 'Vacio', 2), (5, 4, 1, 'Vacio', 2), (5, 5, 1, 'Vacio', 2),
(6, 1, 1, 'Vacio', 2), (6, 2, 1, 'Vacio', 2), (6, 3, 1, 'Vacio', 2), (6, 4, 1, 'Vacio', 2), (6, 5, 1, 'Vacio', 2);

-- ZONA 3: Inspeccion (5 slots)
INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona) VALUES 
(7, 1, 1, 'Vacio', 3), (7, 2, 1, 'Vacio', 3), (7, 3, 1, 'Vacio', 3),
(8, 1, 1, 'Vacio', 3), (8, 2, 1, 'Vacio', 3);

-- =====================================================================
-- PASO 6: INSERTAR BUQUES
-- =====================================================================
INSERT INTO buque (nombre, linea_naviera, capacidad_contenedores) VALUES 
('MSC Águila', 'Mediterranean Shipping Co.', 8000),
('Maersk Lima', 'Maersk Line', 10000),
('CMA CGM Titan', 'CMA CGM Group', 12000),
('Hapag-Lloyd Atlántico', 'Hapag-Lloyd', 9000),
('COSCO Pacífico', 'COSCO Shipping', 15000);

-- =====================================================================
-- PASO 7: INSERTAR CITAS DE RECOJO
-- =====================================================================
INSERT INTO cita_recojo (fecha_inicio_horario, fecha_salida_horario, estado) VALUES 
-- Programadas
('2025-12-01 08:00:00', '2025-12-01 18:00:00', 'Programada'),
('2025-12-02 08:00:00', '2025-12-02 18:00:00', 'Programada'),
('2025-12-03 08:00:00', '2025-12-03 18:00:00', 'Programada'),
('2025-12-04 08:00:00', '2025-12-04 18:00:00', 'Programada'),
('2025-12-05 08:00:00', '2025-12-05 18:00:00', 'Programada'),
-- Completadas
('2025-11-20 08:00:00', '2025-11-20 18:00:00', 'Completada'),
('2025-11-21 08:00:00', '2025-11-21 18:00:00', 'Completada'),
('2025-11-22 08:00:00', '2025-11-22 18:00:00', 'Completada'),
-- Vencidas
('2025-11-10 08:00:00', '2025-11-10 18:00:00', 'Vencida'),
('2025-11-11 08:00:00', '2025-11-11 18:00:00', 'Vencida');

-- =====================================================================
-- PASO 8: INSERTAR CONTENEDORES
-- =====================================================================
INSERT INTO contenedor (codigo_contenedor, dimensiones, tipo, peso, id_buque, id_cita_recojo, descripcion_carga, temperatura_requerida) VALUES 
-- Contenedores programados
('MSCU1234567', '12.19x2.44x2.59', 'Seco', 28500.50, 1, 1, 'Maquinaria industrial', NULL),
('MAEU7654321', '6.06x2.44x2.59', 'Seco', 18000.00, 2, 2, 'Textiles', NULL),
('CMAU9876543', '12.19x2.44x2.89', 'Refrigerado', 30100.25, 3, 3, 'Productos perecederos', -18.00),
('HLCU5551234', '6.06x2.44x2.59', 'Seco', 15500.75, 4, 4, 'Electrodomésticos', NULL),
('OOLU3334567', '12.19x2.44x2.59', 'Seco', 25000.00, 5, 5, 'Autopartes', NULL),
-- Contenedores completados
('MSCU2223456', '6.06x2.44x2.59', 'Refrigerado', 20500.00, 1, 6, 'Alimentos congelados', -20.00),
('MAEU8887654', '12.19x2.44x2.59', 'Seco', 27000.90, 2, 7, 'Materiales construcción', NULL),
('CMAU4445678', '6.06x2.44x2.59', 'Seco', 19200.50, 3, 8, 'Productos químicos', NULL),
-- Contenedores vencidos (en puerto)
('HLCU6667890', '12.19x2.44x2.59', 'Seco', 26000.00, 4, 9, 'Muebles', NULL),
('OOLU1112345', '6.06x2.44x2.59', 'Seco', 17500.00, 5, 10, 'Ropa', NULL);

-- =====================================================================
-- PASO 9: INSERTAR TICKETS
-- =====================================================================
INSERT INTO ticket (fecha_hora_entrada, fecha_hora_salida, estado, id_ubicacion, id_usuario, id_contenedor, observaciones) VALUES 
-- Tickets finalizados
('2025-11-20 09:00:00', '2025-11-20 17:00:00', 'Finalizado', 1, 3, 6, 'Procesado correctamente'),
('2025-11-21 10:00:00', '2025-11-21 16:00:00', 'Finalizado', 2, 4, 7, 'Sin novedad'),
('2025-11-22 08:30:00', '2025-11-22 15:30:00', 'Finalizado', 21, 5, 8, 'Contenedor reefer OK'),
-- Tickets activos (contenedores en puerto)
('2025-11-10 14:00:00', NULL, 'Activo', 3, 7, 9, 'Pendiente retiro'),
('2025-11-11 11:00:00', NULL, 'Activo', 4, 8, 10, 'Pendiente retiro');

-- =====================================================================
-- PASO 10: INSERTAR FACTURAS
-- =====================================================================
INSERT INTO factura (fecha_emision, monto, estado, id_ticket, fecha_vencimiento) VALUES 
('2025-11-20', 850.00, 'Pagada', 1, '2025-12-05'),
('2025-11-21', 750.00, 'Pagada', 2, '2025-12-06'),
('2025-11-22', 1200.00, 'Pagada', 3, '2025-12-07'),
('2025-11-12', 900.00, 'Vencida', 4, '2025-11-22'),
('2025-11-13', 950.00, 'Pendiente', 5, '2025-11-28');

-- =====================================================================
-- PASO 11: INSERTAR PAGOS
-- =====================================================================
INSERT INTO pago (numero_operacion, fecha_pago, medio_pago, monto, id_factura) VALUES 
('OP-2025112001', '2025-11-20', 'Transferencia', 850.00, 1),
('OP-2025112101', '2025-11-21', 'Efectivo', 750.00, 2),
('OP-2025112201', '2025-11-22', 'Tarjeta', 1200.00, 3);

-- =====================================================================
-- PASO 12: INSERTAR REPORTES
-- =====================================================================
INSERT INTO reporte (tipo, parametros, generado_por) VALUES 
('Movimientos Diarios', '{"fecha": "2025-11-25"}', 1),
('Ocupación Zonas', '{"zona": "todas"}', 1),
('Tickets Activos', '{"estado": "Activo"}', 2),
('Facturas Pendientes', '{"estado": "Pendiente"}', 1);

-- =====================================================================
-- VERIFICACIÓN
-- =====================================================================
SELECT 'Usuarios' as tabla, COUNT(*) as registros FROM usuario
UNION ALL SELECT 'Roles', COUNT(*) FROM rol
UNION ALL SELECT 'Zonas', COUNT(*) FROM zona
UNION ALL SELECT 'Ubicaciones', COUNT(*) FROM ubicacion_slot
UNION ALL SELECT 'Buques', COUNT(*) FROM buque
UNION ALL SELECT 'Citas', COUNT(*) FROM cita_recojo
UNION ALL SELECT 'Contenedores', COUNT(*) FROM contenedor
UNION ALL SELECT 'Tickets', COUNT(*) FROM ticket
UNION ALL SELECT 'Facturas', COUNT(*) FROM factura
UNION ALL SELECT 'Pagos', COUNT(*) FROM pago
UNION ALL SELECT 'Reportes', COUNT(*) FROM reporte
ORDER BY tabla;

-- Verificar usuarios por rol
SELECT r.rol, COUNT(u.id) as cantidad
FROM usuario u
JOIN rol r ON u.id_rol = r.id
GROUP BY r.rol
ORDER BY r.id;

-- =====================================================================
-- ✅ DATOS INSERTADOS CORRECTAMENTE
-- =====================================================================
-- Deberías ver:
-- - 2 Administradores
-- - 4 Operarios
-- - 5 Clientes ⭐
-- - 3 Zonas
-- - 35 Slots
-- - 5 Buques
-- - 10 Citas
-- - 10 Contenedores
-- - 5 Tickets
-- - 5 Facturas
-- - 3 Pagos
-- - 4 Reportes
-- =====================================================================
