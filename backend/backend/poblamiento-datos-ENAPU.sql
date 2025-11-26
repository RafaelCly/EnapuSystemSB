DO $$ 
DECLARE
    row RECORD;
    seq RECORD;
BEGIN
    FOR row IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(row.tablename) || ' CASCADE';
    END LOOP;

    FOR seq IN
        SELECT c.oid::regclass::text AS sequence_name
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'S'
          AND n.nspname = 'public'
    LOOP
        EXECUTE 'ALTER SEQUENCE ' || quote_ident(seq.sequence_name) || ' RESTART WITH 1';
    END LOOP;
END $$;


INSERT INTO Rol (id, rol) VALUES 
(1, 'Administrador'),
(2, 'Operario'),
(3, 'Cliente');


INSERT INTO Nivel_acceso (id, nivel) VALUES 
(1, 'Administracion'),
(2, 'Operacion'),
(3, 'Consulta');


INSERT INTO Usuario (id, nombre, id_rol, id_nivel_acceso) VALUES 
-- Administradores
(1, 'Andrea Torres', 1, 1),
(2, 'Ricardo Soto', 1, 1),

-- Operarios
(3, 'Juan Perez', 2, 2),
(4, 'Maria Lopez', 2, 2),
(5, 'Carlos Ruiz', 2, 2),
(6, 'Ana Gomez', 2, 2),
(7, 'Javier Diaz', 2, 2),
(8, 'Laura Vega', 2, 2),
(9, 'Pedro Salas', 2, 2),
(10, 'Elena Ramos', 2, 2),

-- Clientes
(11, 'Contenedores Sur S.A.', 3, 3),
(12, 'Logistica Global Peru', 3, 3),
(13, 'Importadora del Norte', 3, 3),
(14, 'Transporte Maritimo E.I.R.L.', 3, 3),
(15, 'Naviera Pacifico', 3, 3),
(16, 'Distribuciones Costa', 3, 3),
(17, 'Grupo Fenix Logistics', 3, 3),
(18, 'Almacenes Centrales', 3, 3),
(19, 'Comercio Exterior L&P', 3, 3),
(20, 'Servicios Aduaneros A1', 3, 3),
(21, 'Empresa Carga Total', 3, 3),
(22, 'Inversiones Portuarias R&G', 3, 3),
(23, 'Terminales del Atlantico S.A.C.', 3, 3),
(24, 'LogiTrans Andina', 3, 3),
(25, 'Agencia de Carga Express', 3, 3),
(26, 'Especialistas en Refrigerados', 3, 3),
(27, 'Mineria y Exportaciones Andinas', 3, 3),
(28, 'Textiles La Montana', 3, 3),
(29, 'Pesquera Humboldt', 3, 3),
(30, 'Tecnologia y Suministros S.R.L.', 3, 3);


INSERT INTO Zona (id, nombre, capacidad) VALUES 
(1, 'Estandar Seco', 500),    -- Gran capacidad para contenedores secos estandar
(2, 'Especializada Reefer', 50), -- Capacidad limitada para contenedores refrigerados
(3, 'Inspeccion Vaciado', 10);  -- Capacidad muy reducida para manejo temporal


INSERT INTO Ubicacion_slot (id, fila, columna, nivel, estado, id_zona) VALUES 
-- ZONA 1: Estandar Seco (ID=1) - 15 Slots
(1, 1, 1, 1, 'Vacio', 1),
(2, 1, 2, 1, 'Vacio', 1),
(3, 1, 3, 1, 'Vacio', 1),
(4, 2, 1, 1, 'Vacio', 1),
(5, 2, 2, 1, 'Vacio', 1),
(6, 2, 3, 1, 'Vacio', 1),
(7, 3, 1, 1, 'Vacio', 1),
(8, 3, 2, 1, 'Vacio', 1),
(9, 3, 3, 1, 'Vacio', 1),
(10, 4, 1, 1, 'Vacio', 1),
(11, 4, 2, 1, 'Vacio', 1),
(12, 4, 3, 1, 'Vacio', 1),
(13, 5, 1, 1, 'Vacio', 1),
(14, 5, 2, 1, 'Vacio', 1),
(15, 5, 3, 1, 'Vacio', 1),

-- ZONA 2: Especializada Reefer (ID=2) - 6 Slots
(16, 6, 1, 1, 'Vacio', 2),
(17, 6, 2, 1, 'Vacio', 2),
(18, 6, 3, 1, 'Vacio', 2),
(19, 7, 1, 1, 'Vacio', 2),
(20, 7, 2, 1, 'Vacio', 2),
(21, 7, 3, 1, 'Vacio', 2),

-- ZONA 3: Inspeccion Vaciado (ID=3) - 4 Slots
(22, 8, 1, 1, 'Vacio', 3),
(23, 8, 2, 1, 'Vacio', 3),
(24, 9, 1, 1, 'Vacio', 3),
(25, 9, 2, 1, 'Vacio', 3);


INSERT INTO Buque (id, nombre, linea_naviera) VALUES 
(1, 'MSC Águila', 'Mediterranean Shipping Co.'),
(2, 'Maersk Lima', 'Maersk Line'),
(3, 'CMA CGM Titan', 'CMA CGM Group'),
(4, 'Hapag-Lloyd Atlántico', 'Hapag-Lloyd'),
(5, 'ONE Commitment', 'Ocean Network Express'),
(6, 'Ever Given', 'Evergreen Marine'),
(7, 'COSCO Pacífico', 'COSCO Shipping'),
(8, 'NYK Antares', 'Nippon Yusen Kaisha'),
(9, 'ZIM Caribe', 'ZIM Integrated Shipping'),
(10, 'Hamburg Süd América', 'Hamburg Süd');


INSERT INTO Cita_recojo (id, fecha_inicio_horario, fecha_salida_horario, estado) VALUES 
-- Citas Completadas (Retiradas)
(1, '2025-11-08', '2025-11-08', 'Completada'),
(2, '2025-11-09', '2025-11-09', 'Completada'),
(3, '2025-11-09', '2025-11-09', 'Completada'),
(4, '2025-11-10', '2025-11-10', 'Completada'),
(5, '2025-11-10', '2025-11-10', 'Completada'),

-- Citas Vencidas (Pasadas y no retiradas)
(6, '2025-11-05', '2025-11-05', 'Vencida'),
(7, '2025-11-06', '2025-11-06', 'Vencida'),
(8, '2025-11-07', '2025-11-07', 'Vencida'),
(9, '2025-11-08', '2025-11-08', 'Vencida'),
(10, '2025-11-09', '2025-11-09', 'Vencida'),

-- Citas Programadas (Futuras)
(11, '2025-11-11', '2025-11-11', 'Programada'),
(12, '2025-11-12', '2025-11-12', 'Programada'),
(13, '2025-11-12', '2025-11-12', 'Programada'),
(14, '2025-11-13', '2025-11-13', 'Programada'),
(15, '2025-11-14', '2025-11-14', 'Programada'),
(16, '2025-11-15', '2025-11-15', 'Programada'),
(17, '2025-11-16', '2025-11-16', 'Programada'),
(18, '2025-11-17', '2025-11-17', 'Programada'),
(19, '2025-11-18', '2025-11-18', 'Programada'),
(20, '2025-11-19', '2025-11-19', 'Programada');


INSERT INTO Contenedor (id, dimensiones, tipo, peso, id_buque, id_cita_recojo) VALUES 
-- Contenedores asociados a Citas Completadas (1-5)
(1, '12.19x2.44x2.59', 'Seco', 28500.50, 1, 1),      -- 40 pies
(2, '6.06x2.44x2.59', 'Seco', 18000.00, 2, 2),       -- 20 pies
(3, '12.19x2.44x2.89', 'Refrigerado', 30100.25, 3, 3), -- 40 pies High Cube
(4, '6.06x2.44x2.59', 'Seco', 15500.75, 4, 4),       -- 20 pies
(5, '12.19x2.44x2.59', 'Seco', 25000.00, 5, 5),      -- 40 pies

-- Contenedores asociados a Citas Vencidas (6-10)
(6, '6.06x2.44x2.59', 'Refrigerado', 20500.00, 6, 6),
(7, '12.19x2.44x2.59', 'Seco', 27000.90, 7, 7),
(8, '6.06x2.44x2.59', 'Seco', 19200.50, 8, 8),
(9, '12.19x2.44x2.59', 'Seco', 24500.00, 9, 9),
(10, '6.06x2.44x2.89', 'Refrigerado', 16800.30, 10, 10), -- 20 pies High Cube

-- Contenedores asociados a Citas Programadas (11-20)
(11, '12.19x2.44x2.59', 'Seco', 26000.00, 1, 11),
(12, '6.06x2.44x2.59', 'Seco', 17500.00, 2, 12),
(13, '12.19x2.44x2.89', 'Refrigerado', 31000.50, 3, 13),
(14, '6.06x2.44x2.59', 'Seco', 14900.20, 4, 14),
(15, '12.19x2.44x2.59', 'Seco', 29000.75, 5, 15),
(16, '6.06x2.44x2.59', 'Refrigerado', 19800.00, 6, 16),
(17, '12.19x2.44x2.59', 'Seco', 23500.00, 7, 17),
(18, '6.06x2.44x2.59', 'Seco', 18700.50, 8, 18),
(19, '12.19x2.44x2.59', 'Seco', 27500.00, 9, 19),
(20, '6.06x2.44x2.89', 'Refrigerado', 15900.10, 10, 20),

-- Contenedores adicionales
(21, '12.19x2.44x2.59', 'Seco', 26500.00, 1, 1), 
(22, '6.06x2.44x2.59', 'Seco', 18800.00, 2, 2), 
(23, '12.19x2.44x2.59', 'Seco', 29900.00, 3, 11),
(24, '6.06x2.44x2.59', 'Seco', 16200.00, 4, 12),
(25, '12.19x2.44x2.89', 'Refrigerado', 32000.00, 5, 13),
(26, '6.06x2.44x2.59', 'Seco', 14500.00, 6, 14),
(27, '12.19x2.44x2.59', 'Seco', 28000.00, 7, 15),
(28, '6.06x2.44x2.59', 'Seco', 19000.00, 8, 16),
(29, '12.19x2.44x2.59', 'Seco', 25500.00, 9, 17),
(30, '6.06x2.44x2.89', 'Refrigerado', 17000.00, 10, 18);


INSERT INTO Ticket (id, fecha_hora_entrada, fecha_hora_salida, estado, id_ubicacion, id_usuario, id_contenedor) VALUES 
-- TICKETS COMPLETADOS (Contenedores 1-5, 21-22)
-- Contenedores retirados (Estado: Finalizado)
(1, '2025-11-08 08:30:00', '2025-11-08 17:45:00', 'Finalizado', 1, 3, 1),
(2, '2025-11-09 09:00:00', '2025-11-09 16:20:00', 'Finalizado', 2, 4, 2),
(3, '2025-11-09 10:15:00', '2025-11-10 11:00:00', 'Finalizado', 16, 5, 3), -- Reefer, Ubicacion 16 (Zona 2)
(4, '2025-11-10 07:40:00', '2025-11-10 14:00:00', 'Finalizado', 3, 6, 4),
(5, '2025-11-10 09:30:00', '2025-11-10 18:30:00', 'Finalizado', 4, 7, 5),
(6, '2025-11-08 11:00:00', '2025-11-09 09:45:00', 'Finalizado', 5, 3, 21),
(7, '2025-11-09 13:00:00', '2025-11-10 13:30:00', 'Finalizado', 6, 4, 22),

-- TICKETS ACTIVOS (Contenedores 6-20, 23-30)
-- Contenedores en almacén (Estado: Activo)
(8, '2025-11-05 15:00:00', NULL, 'Activo', 17, 5, 6), -- Ubicacion 17 (Zona 2)
(9, '2025-11-06 14:10:00', NULL, 'Activo', 7, 6, 7),
(10, '2025-11-07 10:30:00', NULL, 'Activo', 8, 7, 8),
(11, '2025-11-08 12:45:00', NULL, 'Activo', 9, 8, 9),
(12, '2025-11-09 08:00:00', NULL, 'Activo', 10, 9, 10),
(13, '2025-11-10 07:00:00', NULL, 'Activo', 11, 10, 11),
(14, '2025-11-10 09:15:00', NULL, 'Activo', 12, 3, 12),
(15, '2025-11-10 11:30:00', NULL, 'Activo', 18, 4, 13), -- Ubicacion 18 (Zona 2)
(16, '2025-11-10 12:00:00', NULL, 'Activo', 13, 5, 14),
(17, '2025-11-10 13:45:00', NULL, 'Activo', 14, 6, 15),
(18, '2025-11-10 14:30:00', NULL, 'Activo', 19, 7, 16), -- Ubicacion 19 (Zona 2)
(19, '2025-11-10 15:10:00', NULL, 'Activo', 15, 8, 17),
(20, '2025-11-10 16:00:00', NULL, 'Activo', 20, 9, 18), -- Ubicacion 20 (Zona 2)
(21, '2025-11-10 17:20:00', NULL, 'Activo', 21, 10, 19), -- Ubicacion 21 (Zona 2)
(22, '2025-11-10 18:30:00', NULL, 'Activo', 22, 3, 20), -- Ubicacion 22 (Zona 3)
(23, '2025-11-10 19:00:00', NULL, 'Activo', 23, 4, 23), -- Ubicacion 23 (Zona 3)
(24, '2025-11-10 19:40:00', NULL, 'Activo', 24, 5, 24), -- Ubicacion 24 (Zona 3)
(25, '2025-11-10 20:00:00', NULL, 'Activo', 25, 6, 25), -- Ubicacion 25 (Zona 3)
(26, '2025-11-10 20:30:00', NULL, 'Activo', 1, 7, 26), -- Ubicacion 1 (Reutilizada)
(27, '2025-11-10 21:00:00', NULL, 'Activo', 2, 8, 27), -- Ubicacion 2 (Reutilizada)
(28, '2025-11-10 21:30:00', NULL, 'Activo', 3, 9, 28), -- Ubicacion 3 (Reutilizada)
(29, '2025-11-10 22:00:00', NULL, 'Activo', 4, 10, 29), -- Ubicacion 4 (Reutilizada)
(30, '2025-11-10 22:30:00', NULL, 'Activo', 5, 3, 30); -- Ubicacion 5 (Reutilizada)


INSERT INTO Factura (id, fecha_emision, monto, estado, id_ticket) VALUES 
(1, '2025-11-10', 500.00, 'Pagada', 1),        -- Pagada
(2, '2025-11-10', 650.00, 'Pagada', 2),        -- Pagada
(3, '2025-11-10', 980.50, 'Pagada', 3),        -- Pagada (Refrigerado)
(4, '2025-11-10', 720.00, 'Pendiente', 4),     -- Pendiente
(5, '2025-11-10', 810.00, 'Pagada', 5),        -- Pagada
(6, '2025-11-10', 950.00, 'Pagada', 6),        -- Pagada
(7, '2025-11-10', 550.00, 'Pendiente', 7);     -- Pendiente


INSERT INTO Pago (id, fecha_pago, medio_pago, monto, id_factura) VALUES 
(1, '2025-11-10', 'Transferencia', 500.00, 1),
(2, '2025-11-10', 'Efectivo', 650.00, 2),
(3, '2025-11-10', 'Transferencia', 980.50, 3),
(4, '2025-11-10', 'Efectivo', 810.00, 5),
(5, '2025-11-10', 'Tarjeta', 950.00, 6);


INSERT INTO Reporte (id, tipo, fecha_generacion, parametros) VALUES 
(1, 'Movimientos Diarios', '2025-11-10', 'Fecha=2025-11-10'),
(2, 'Ocupación de Zonas', '2025-11-10', 'Zona=Todas, Tipo=Seco'),
(3, 'Tickets Activos', '2025-11-10', 'Estado=Activo'),
(4, 'Facturas Pendientes', '2025-11-10', 'Estado=Pendiente'),
(5, 'Estadísticas de Buques', '2025-11-09', 'Periodo=Mensual, Buques=Todos');





