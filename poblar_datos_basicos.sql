-- =====================================================================
-- SCRIPT SIMPLIFICADO PARA POBLAR DATOS BÁSICOS
-- =====================================================================
-- EJECUTA ESTE SCRIPT EN SUPABASE SQL EDITOR
-- =====================================================================

-- =====================================================================
-- 1. ROLES (si no existen)
-- =====================================================================
INSERT INTO rol (id, rol, descripcion) VALUES 
(1, 'Administrador', 'Usuario con acceso completo al sistema'),
(2, 'Operario', 'Usuario operativo con permisos limitados'),
(3, 'Cliente', 'Cliente con acceso de consulta')
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 2. NIVELES DE ACCESO (si no existen)
-- =====================================================================
INSERT INTO nivel_acceso (id, nivel, descripcion) VALUES 
(1, 'Administracion', 'Acceso total al sistema'),
(2, 'Operacion', 'Acceso a operaciones del puerto'),
(3, 'Consulta', 'Acceso de solo lectura')
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 3. ZONAS
-- =====================================================================
INSERT INTO zona (nombre, capacidad, descripcion, activa) VALUES 
('Zona A - Seco Estándar', 200, 'Zona principal para contenedores secos', true),
('Zona B - Refrigerados', 50, 'Zona para contenedores refrigerados', true),
('Zona C - Peligrosos', 30, 'Zona para mercancías peligrosas', true),
('Zona D - Inspección', 20, 'Zona temporal para inspección', true)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 4. UBICACIONES (SLOTS)
-- =====================================================================
-- Insertar slots para cada zona
DO $$
DECLARE
    zona_a_id INT;
    zona_b_id INT;
    zona_c_id INT;
    zona_d_id INT;
BEGIN
    SELECT id INTO zona_a_id FROM zona WHERE nombre LIKE 'Zona A%' LIMIT 1;
    SELECT id INTO zona_b_id FROM zona WHERE nombre LIKE 'Zona B%' LIMIT 1;
    SELECT id INTO zona_c_id FROM zona WHERE nombre LIKE 'Zona C%' LIMIT 1;
    SELECT id INTO zona_d_id FROM zona WHERE nombre LIKE 'Zona D%' LIMIT 1;

    -- Slots para Zona A (20 slots)
    IF zona_a_id IS NOT NULL THEN
        INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona) VALUES
        (1, 1, 1, 'Vacio', zona_a_id), (1, 2, 1, 'Vacio', zona_a_id), (1, 3, 1, 'Vacio', zona_a_id), (1, 4, 1, 'Vacio', zona_a_id), (1, 5, 1, 'Vacio', zona_a_id),
        (2, 1, 1, 'Vacio', zona_a_id), (2, 2, 1, 'Vacio', zona_a_id), (2, 3, 1, 'Vacio', zona_a_id), (2, 4, 1, 'Vacio', zona_a_id), (2, 5, 1, 'Vacio', zona_a_id),
        (3, 1, 1, 'Vacio', zona_a_id), (3, 2, 1, 'Vacio', zona_a_id), (3, 3, 1, 'Vacio', zona_a_id), (3, 4, 1, 'Vacio', zona_a_id), (3, 5, 1, 'Vacio', zona_a_id),
        (4, 1, 1, 'Vacio', zona_a_id), (4, 2, 1, 'Vacio', zona_a_id), (4, 3, 1, 'Vacio', zona_a_id), (4, 4, 1, 'Vacio', zona_a_id), (4, 5, 1, 'Vacio', zona_a_id)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Slots para Zona B (10 slots)
    IF zona_b_id IS NOT NULL THEN
        INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona) VALUES
        (1, 1, 1, 'Vacio', zona_b_id), (1, 2, 1, 'Vacio', zona_b_id), (1, 3, 1, 'Vacio', zona_b_id), (1, 4, 1, 'Vacio', zona_b_id), (1, 5, 1, 'Vacio', zona_b_id),
        (2, 1, 1, 'Vacio', zona_b_id), (2, 2, 1, 'Vacio', zona_b_id), (2, 3, 1, 'Vacio', zona_b_id), (2, 4, 1, 'Vacio', zona_b_id), (2, 5, 1, 'Vacio', zona_b_id)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Slots para Zona C (6 slots)
    IF zona_c_id IS NOT NULL THEN
        INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona) VALUES
        (1, 1, 1, 'Vacio', zona_c_id), (1, 2, 1, 'Vacio', zona_c_id), (1, 3, 1, 'Vacio', zona_c_id),
        (2, 1, 1, 'Vacio', zona_c_id), (2, 2, 1, 'Vacio', zona_c_id), (2, 3, 1, 'Vacio', zona_c_id)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Slots para Zona D (4 slots)
    IF zona_d_id IS NOT NULL THEN
        INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona) VALUES
        (1, 1, 1, 'Vacio', zona_d_id), (1, 2, 1, 'Vacio', zona_d_id),
        (2, 1, 1, 'Vacio', zona_d_id), (2, 2, 1, 'Vacio', zona_d_id)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- =====================================================================
-- 5. BUQUES
-- =====================================================================
INSERT INTO buque (nombre, linea_naviera, capacidad_contenedores, activo) VALUES 
('MSC Valparaíso', 'Mediterranean Shipping Co.', 8500, true),
('Maersk Callao', 'Maersk Line', 12000, true),
('CMA CGM Pacífico', 'CMA CGM Group', 14000, true),
('Hapag-Lloyd Perú', 'Hapag-Lloyd', 9500, true),
('COSCO Lima', 'COSCO Shipping', 16000, true),
('Evergreen Star', 'Evergreen Marine', 11000, true)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 6. CITAS DE RECOJO
-- =====================================================================
INSERT INTO cita_recojo (fecha_inicio_horario, fecha_salida_horario, estado, observaciones) VALUES 
(NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days' + INTERVAL '8 hours', 'Completada', 'Recojo completado'),
(NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '8 hours', 'Completada', 'Recojo completado'),
(NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '8 hours', 'Vencida', 'Cliente no se presentó'),
(NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '8 hours', 'Programada', 'Cita para mañana'),
(NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '8 hours', 'Programada', 'Cita programada'),
(NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '8 hours', 'Programada', 'Cita programada')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 7. CONTENEDORES (asociados a clientes)
-- =====================================================================
DO $$
DECLARE
    cliente_id INT;
    buque_id INT;
    cita_id INT;
BEGIN
    -- Obtener primer cliente
    SELECT id INTO cliente_id FROM usuario WHERE id_rol = 3 LIMIT 1;
    SELECT id INTO buque_id FROM buque LIMIT 1;
    SELECT id INTO cita_id FROM cita_recojo WHERE estado = 'Programada' LIMIT 1;

    IF cliente_id IS NOT NULL AND buque_id IS NOT NULL THEN
        INSERT INTO contenedor (codigo_contenedor, dimensiones, tipo, peso, id_buque, id_cita_recojo, id_cliente, descripcion_carga) VALUES
        ('CONT-001-2024', '12.19x2.44x2.59', 'Seco', 18500.00, buque_id, cita_id, cliente_id, 'Mercadería general'),
        ('CONT-002-2024', '6.06x2.44x2.59', 'Seco', 12000.00, buque_id, cita_id, cliente_id, 'Electrodomésticos'),
        ('CONT-003-2024', '12.19x2.44x2.59', 'Refrigerado', 22000.00, buque_id, cita_id, cliente_id, 'Productos perecibles'),
        ('CONT-004-2024', '12.19x2.44x2.59', 'Seco', 19500.00, buque_id, NULL, cliente_id, 'Maquinaria industrial'),
        ('CONT-005-2024', '6.06x2.44x2.59', 'Seco', 14500.00, buque_id, NULL, cliente_id, 'Textiles')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- =====================================================================
-- 8. TICKETS
-- =====================================================================
DO $$
DECLARE
    operario_id INT;
    contenedor_id INT;
    slot_id INT;
BEGIN
    SELECT id INTO operario_id FROM usuario WHERE id_rol = 2 LIMIT 1;
    SELECT id INTO contenedor_id FROM contenedor LIMIT 1;
    SELECT id INTO slot_id FROM ubicacion_slot WHERE estado = 'Vacio' LIMIT 1;

    IF operario_id IS NOT NULL AND contenedor_id IS NOT NULL AND slot_id IS NOT NULL THEN
        INSERT INTO ticket (fecha_hora_entrada, fecha_hora_salida, estado, id_ubicacion, id_usuario, id_contenedor, observaciones) VALUES
        (NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', 'Finalizado', slot_id, operario_id, contenedor_id, 'Procesado correctamente'),
        (NOW() - INTERVAL '2 days', NULL, 'Activo', slot_id, operario_id, contenedor_id, 'En almacén')
        ON CONFLICT DO NOTHING;
        
        -- Marcar slot como ocupado
        UPDATE ubicacion_slot SET estado = 'Ocupado' WHERE id = slot_id;
    END IF;
END $$;

-- =====================================================================
-- VERIFICACIÓN
-- =====================================================================
SELECT 'RESUMEN DE DATOS' as info;
SELECT 'Zonas: ' || COUNT(*) FROM zona;
SELECT 'Slots: ' || COUNT(*) FROM ubicacion_slot;
SELECT 'Buques: ' || COUNT(*) FROM buque;
SELECT 'Contenedores: ' || COUNT(*) FROM contenedor;
SELECT 'Tickets: ' || COUNT(*) FROM ticket;
SELECT 'Usuarios: ' || COUNT(*) FROM usuario;
