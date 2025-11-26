-- =====================================================================
-- RELLENAR TABLAS RESTANTES - SISTEMA ENAPU
-- =====================================================================
-- Ejecuta este script después de tener usuarios, roles y niveles
-- =====================================================================

-- =====================================================================
-- PASO 1: INSERTAR ZONAS
-- =====================================================================
INSERT INTO zona (nombre, capacidad, descripcion) VALUES 
('Zona Seca Estándar', 500, 'Zona principal para contenedores secos'),
('Zona Refrigerada', 50, 'Zona especializada para contenedores refrigerados'),
('Zona de Inspección', 10, 'Zona temporal para inspección y vaciado')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- PASO 2: INSERTAR UBICACIONES SLOT
-- =====================================================================
-- Zona 1: Seca (20 slots)
INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona) VALUES 
(1, 1, 1, 'Vacio', 1), (1, 2, 1, 'Vacio', 1), (1, 3, 1, 'Vacio', 1), (1, 4, 1, 'Vacio', 1), (1, 5, 1, 'Vacio', 1),
(2, 1, 1, 'Vacio', 1), (2, 2, 1, 'Vacio', 1), (2, 3, 1, 'Vacio', 1), (2, 4, 1, 'Vacio', 1), (2, 5, 1, 'Vacio', 1),
(3, 1, 1, 'Vacio', 1), (3, 2, 1, 'Vacio', 1), (3, 3, 1, 'Vacio', 1), (3, 4, 1, 'Vacio', 1), (3, 5, 1, 'Vacio', 1),
(4, 1, 1, 'Vacio', 1), (4, 2, 1, 'Vacio', 1), (4, 3, 1, 'Vacio', 1), (4, 4, 1, 'Vacio', 1), (4, 5, 1, 'Vacio', 1)
ON CONFLICT DO NOTHING;

-- Zona 2: Refrigerada (10 slots)
INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona) VALUES 
(5, 1, 1, 'Vacio', 2), (5, 2, 1, 'Vacio', 2), (5, 3, 1, 'Vacio', 2), (5, 4, 1, 'Vacio', 2), (5, 5, 1, 'Vacio', 2),
(6, 1, 1, 'Vacio', 2), (6, 2, 1, 'Vacio', 2), (6, 3, 1, 'Vacio', 2), (6, 4, 1, 'Vacio', 2), (6, 5, 1, 'Vacio', 2)
ON CONFLICT DO NOTHING;

-- Zona 3: Inspección (5 slots)
INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona) VALUES 
(7, 1, 1, 'Vacio', 3), (7, 2, 1, 'Vacio', 3), (7, 3, 1, 'Vacio', 3),
(8, 1, 1, 'Vacio', 3), (8, 2, 1, 'Vacio', 3)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- PASO 3: INSERTAR BUQUES
-- =====================================================================
INSERT INTO buque (nombre, linea_naviera, capacidad_contenedores) VALUES 
('MSC Águila', 'Mediterranean Shipping Co.', 8000),
('Maersk Lima', 'Maersk Line', 10000),
('CMA CGM Titan', 'CMA CGM Group', 12000),
('Hapag-Lloyd Atlántico', 'Hapag-Lloyd', 9000),
('COSCO Pacífico', 'COSCO Shipping', 15000),
('Ever Given', 'Evergreen Marine', 20000),
('NYK Antares', 'Nippon Yusen Kaisha', 8500),
('ZIM Caribe', 'ZIM Integrated Shipping', 7000),
('Hamburg Süd América', 'Hamburg Süd', 9500),
('ONE Commitment', 'Ocean Network Express', 11000);

-- =====================================================================
-- PASO 4: INSERTAR CITAS DE RECOJO
-- =====================================================================
INSERT INTO cita_recojo (fecha_inicio_horario, fecha_salida_horario, estado, observaciones) VALUES 
-- Programadas (futuras)
('2025-12-01 08:00:00', '2025-12-01 18:00:00', 'Programada', 'Cita pendiente'),
('2025-12-02 08:00:00', '2025-12-02 18:00:00', 'Programada', 'Cita pendiente'),
('2025-12-03 08:00:00', '2025-12-03 18:00:00', 'Programada', 'Cita pendiente'),
('2025-12-04 08:00:00', '2025-12-04 18:00:00', 'Programada', 'Cita pendiente'),
('2025-12-05 08:00:00', '2025-12-05 18:00:00', 'Programada', 'Cita pendiente'),
('2025-12-06 08:00:00', '2025-12-06 18:00:00', 'Programada', 'Cita pendiente'),
('2025-12-07 08:00:00', '2025-12-07 18:00:00', 'Programada', 'Cita pendiente'),

-- Completadas
('2025-11-20 08:00:00', '2025-11-20 18:00:00', 'Completada', 'Recojo exitoso'),
('2025-11-21 08:00:00', '2025-11-21 18:00:00', 'Completada', 'Recojo exitoso'),
('2025-11-22 08:00:00', '2025-11-22 18:00:00', 'Completada', 'Recojo exitoso'),

-- Vencidas
('2025-11-10 08:00:00', '2025-11-10 18:00:00', 'Vencida', 'No recogido a tiempo'),
('2025-11-11 08:00:00', '2025-11-11 18:00:00', 'Vencida', 'No recogido a tiempo'),
('2025-11-12 08:00:00', '2025-11-12 18:00:00', 'Vencida', 'No recogido a tiempo');

-- =====================================================================
-- PASO 5: INSERTAR CONTENEDORES
-- =====================================================================
INSERT INTO contenedor (codigo_contenedor, dimensiones, tipo, peso, id_buque, id_cita_recojo, descripcion_carga, temperatura_requerida) VALUES 
-- Contenedores programados (citas 1-7)
('MSCU1234567', '12.19x2.44x2.59', 'Seco', 28500.50, 1, 1, 'Maquinaria industrial', NULL),
('MAEU7654321', '6.06x2.44x2.59', 'Seco', 18000.00, 2, 2, 'Textiles y telas', NULL),
('CMAU9876543', '12.19x2.44x2.89', 'Refrigerado', 30100.25, 3, 3, 'Productos perecederos', -18.00),
('HLCU5551234', '6.06x2.44x2.59', 'Seco', 15500.75, 4, 4, 'Electrodomésticos', NULL),
('OOLU3334567', '12.19x2.44x2.59', 'Seco', 25000.00, 5, 5, 'Autopartes y repuestos', NULL),
('EISU2221111', '6.06x2.44x2.59', 'Refrigerado', 22000.00, 6, 6, 'Frutas frescas', 5.00),
('COSU3332222', '12.19x2.44x2.59', 'Seco', 27500.00, 7, 7, 'Muebles', NULL),

-- Contenedores completados (citas 8-10)
('MSCU2223456', '6.06x2.44x2.59', 'Refrigerado', 20500.00, 1, 8, 'Alimentos congelados', -20.00),
('MAEU8887654', '12.19x2.44x2.59', 'Seco', 27000.90, 2, 9, 'Materiales construcción', NULL),
('CMAU4445678', '6.06x2.44x2.59', 'Seco', 19200.50, 3, 10, 'Productos químicos', NULL),

-- Contenedores vencidos (citas 11-13 - aún en puerto)
('HLCU6667890', '12.19x2.44x2.59', 'Seco', 26000.00, 4, 11, 'Muebles de oficina', NULL),
('OOLU1112345', '6.06x2.44x2.59', 'Seco', 17500.00, 5, 12, 'Ropa y calzado', NULL),
('NYKU5554433', '12.19x2.44x2.59', 'Seco', 29000.75, 8, 13, 'Equipos electrónicos', NULL);

-- =====================================================================
-- PASO 6: INSERTAR TICKETS
-- =====================================================================
-- NOTA: id_usuario debe ser un operario (id_rol = 2) o el usuario que creó el ticket
-- Usamos id_usuario = 3 (primer operario: Juan Perez)
INSERT INTO ticket (fecha_hora_entrada, fecha_hora_salida, estado, id_ubicacion, id_usuario, id_contenedor, observaciones) VALUES 
-- Tickets finalizados (de citas completadas)
('2025-11-20 09:00:00', '2025-11-20 17:00:00', 'Finalizado', 1, 3, 8, 'Procesado correctamente'),
('2025-11-21 10:00:00', '2025-11-21 16:00:00', 'Finalizado', 2, 4, 9, 'Sin novedad'),
('2025-11-22 08:30:00', '2025-11-22 15:30:00', 'Finalizado', 21, 5, 10, 'Contenedor refrigerado OK'),

-- Tickets activos (contenedores en puerto de citas vencidas)
('2025-11-10 14:00:00', NULL, 'Activo', 3, 3, 11, 'Pendiente retiro - cliente notificado'),
('2025-11-11 11:00:00', NULL, 'Activo', 4, 4, 12, 'Pendiente retiro - en espera'),
('2025-11-12 09:00:00', NULL, 'Activo', 5, 5, 13, 'Pendiente retiro - contacto realizado');

-- =====================================================================
-- PASO 7: INSERTAR FACTURAS
-- =====================================================================
INSERT INTO factura (fecha_emision, monto, estado, id_ticket, fecha_vencimiento, observaciones) VALUES 
-- Facturas de tickets finalizados (pagadas)
('2025-11-20', 850.00, 'Pagada', 1, '2025-12-05', 'Pago recibido en tiempo'),
('2025-11-21', 750.00, 'Pagada', 2, '2025-12-06', 'Pago recibido'),
('2025-11-22', 1200.00, 'Pagada', 3, '2025-12-07', 'Cargo refrigerado incluido'),

-- Facturas de tickets activos
('2025-11-12', 900.00, 'Vencida', 4, '2025-11-22', 'Factura vencida - recordatorio enviado'),
('2025-11-13', 950.00, 'Pendiente', 5, '2025-11-28', 'Pendiente de pago'),
('2025-11-14', 1100.00, 'Pendiente', 6, '2025-11-29', 'Pendiente de pago');

-- =====================================================================
-- PASO 8: INSERTAR PAGOS
-- =====================================================================
INSERT INTO pago (numero_operacion, fecha_pago, medio_pago, monto, id_factura, comprobante_url) VALUES 
('OP-2025112001', '2025-11-20', 'Transferencia', 850.00, 1, NULL),
('OP-2025112101', '2025-11-21', 'Efectivo', 750.00, 2, NULL),
('OP-2025112201', '2025-11-22', 'Tarjeta', 1200.00, 3, NULL);

-- =====================================================================
-- PASO 9: INSERTAR REPORTES
-- =====================================================================
INSERT INTO reporte (tipo, parametros, generado_por) VALUES 
('Movimientos Diarios', '{"fecha": "2025-11-25", "tipo": "resumen"}', 1),
('Ocupación de Zonas', '{"zona": "todas", "incluir_reservados": true}', 1),
('Tickets Activos', '{"estado": "Activo", "dias_pendientes": 5}', 2),
('Facturas Pendientes', '{"estado": "Pendiente", "monto_minimo": 500}', 1),
('Contenedores Refrigerados', '{"tipo": "Refrigerado", "temperatura": true}', 2),
('Análisis de Buques', '{"periodo": "mensual", "top": 5}', 1);

-- =====================================================================
-- VERIFICACIÓN FINAL
-- =====================================================================
SELECT 
  'Zonas' as tabla, COUNT(*) as cantidad FROM zona
UNION ALL SELECT 'Ubicaciones', COUNT(*) FROM ubicacion_slot
UNION ALL SELECT 'Buques', COUNT(*) FROM buque
UNION ALL SELECT 'Citas', COUNT(*) FROM cita_recojo
UNION ALL SELECT 'Contenedores', COUNT(*) FROM contenedor
UNION ALL SELECT 'Tickets', COUNT(*) FROM ticket
UNION ALL SELECT 'Facturas', COUNT(*) FROM factura
UNION ALL SELECT 'Pagos', COUNT(*) FROM pago
UNION ALL SELECT 'Reportes', COUNT(*) FROM reporte
ORDER BY tabla;

-- Ver resumen de tickets por estado
SELECT estado, COUNT(*) as cantidad 
FROM ticket 
GROUP BY estado;

-- Ver resumen de facturas por estado
SELECT estado, COUNT(*) as cantidad 
FROM factura 
GROUP BY estado;

-- =====================================================================
-- ✅ DATOS INSERTADOS CORRECTAMENTE
-- =====================================================================
-- Deberías ver:
-- - 3 Zonas
-- - 35 Ubicaciones (slots)
-- - 10 Buques
-- - 13 Citas de recojo
-- - 13 Contenedores
-- - 6 Tickets (3 finalizados, 3 activos)
-- - 6 Facturas (3 pagadas, 1 vencida, 2 pendientes)
-- - 3 Pagos
-- - 6 Reportes
-- =====================================================================
