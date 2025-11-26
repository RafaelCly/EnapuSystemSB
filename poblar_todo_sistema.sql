-- =====================================================================
-- SCRIPT MAESTRO PARA POBLAR TODO EL SISTEMA ENAPU
-- =====================================================================
-- EJECUTA ESTE SCRIPT EN SUPABASE SQL EDITOR
-- Este script garantiza que TODOS los usuarios vean datos en sus dashboards
-- =====================================================================

-- =====================================================================
-- PASO 0: PREPARACIÓN - Añadir columna id_cliente si no existe
-- =====================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'contenedor' AND column_name = 'id_cliente'
    ) THEN
        ALTER TABLE contenedor ADD COLUMN id_cliente INT REFERENCES usuario(id);
        CREATE INDEX IF NOT EXISTS idx_contenedor_cliente ON contenedor(id_cliente);
    END IF;
END $$;

-- =====================================================================
-- PASO 1: VERIFICAR Y CREAR ROLES SI NO EXISTEN
-- =====================================================================
INSERT INTO rol (id, rol, descripcion) VALUES 
(1, 'Administrador', 'Usuario con acceso completo al sistema'),
(2, 'Operario', 'Usuario operativo con permisos limitados'),
(3, 'Cliente', 'Cliente con acceso de consulta')
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- PASO 2: VERIFICAR Y CREAR NIVELES DE ACCESO
-- =====================================================================
INSERT INTO nivel_acceso (id, nivel, descripcion) VALUES 
(1, 'Administracion', 'Acceso total al sistema'),
(2, 'Operacion', 'Acceso a operaciones del puerto'),
(3, 'Consulta', 'Acceso de solo lectura')
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- PASO 3: CREAR ZONAS SI NO EXISTEN
-- =====================================================================
INSERT INTO zona (nombre, capacidad, descripcion) VALUES 
('Zona A - Seco Estándar', 200, 'Zona principal para contenedores secos de 20ft y 40ft'),
('Zona B - Refrigerados', 50, 'Zona especializada para contenedores refrigerados'),
('Zona C - Peligrosos', 30, 'Zona para mercancías peligrosas'),
('Zona D - Inspección', 20, 'Zona temporal para inspección aduanera')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- PASO 4: CREAR SLOTS DE UBICACIÓN
-- =====================================================================
-- Zona A: 20 slots
INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona)
SELECT f, c, 1, 'Vacio', 1
FROM generate_series(1, 4) f, generate_series(1, 5) c
ON CONFLICT DO NOTHING;

-- Zona B: 10 slots
INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona)
SELECT f, c, 1, 'Vacio', 2
FROM generate_series(5, 6) f, generate_series(1, 5) c
ON CONFLICT DO NOTHING;

-- Zona C: 6 slots
INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona)
SELECT f, c, 1, 'Vacio', 3
FROM generate_series(7, 8) f, generate_series(1, 3) c
ON CONFLICT DO NOTHING;

-- Zona D: 4 slots
INSERT INTO ubicacion_slot (fila, columna, nivel, estado, id_zona)
SELECT f, c, 1, 'Vacio', 4
FROM generate_series(9, 10) f, generate_series(1, 2) c
ON CONFLICT DO NOTHING;

-- =====================================================================
-- PASO 5: CREAR BUQUES
-- =====================================================================
INSERT INTO buque (nombre, linea_naviera, capacidad_contenedores) VALUES 
('MSC Valparaíso', 'Mediterranean Shipping Co.', 8500),
('Maersk Callao', 'Maersk Line', 12000),
('CMA CGM Pacífico', 'CMA CGM Group', 14000),
('Hapag-Lloyd Perú', 'Hapag-Lloyd', 9500),
('COSCO Lima', 'COSCO Shipping', 16000),
('Evergreen Star', 'Evergreen Marine', 11000),
('NYK Atlas', 'Nippon Yusen Kaisha', 8000),
('ONE Commitment', 'Ocean Network Express', 13000)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- PASO 6: CREAR CITAS DE RECOJO (variadas en estados)
-- =====================================================================
INSERT INTO cita_recojo (fecha_inicio_horario, fecha_salida_horario, estado, observaciones) VALUES 
-- Citas COMPLETADAS (pasadas)
(NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days' + INTERVAL '10 hours', 'Completada', 'Recojo completado sin novedad'),
(NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days' + INTERVAL '10 hours', 'Completada', 'Recojo completado'),
(NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days' + INTERVAL '10 hours', 'Completada', 'Recojo completado exitosamente'),
(NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days' + INTERVAL '10 hours', 'Completada', 'Recojo completado'),
(NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days' + INTERVAL '10 hours', 'Completada', 'Recojo completado'),
(NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days' + INTERVAL '10 hours', 'Completada', 'Recojo completado'),
(NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days' + INTERVAL '10 hours', 'Completada', 'Recojo completado'),
(NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days' + INTERVAL '10 hours', 'Completada', 'Recojo completado'),

-- Citas VENCIDAS (sin recoger)
(NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '10 hours', 'Vencida', 'Cliente no se presentó'),
(NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days' + INTERVAL '10 hours', 'Vencida', 'Documentación incompleta'),
(NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '10 hours', 'Vencida', 'Vehículo no autorizado'),

-- Citas PROGRAMADAS (futuras)
(NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '10 hours', 'Programada', 'Cita para mañana'),
(NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '10 hours', 'Programada', 'Cita programada'),
(NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '10 hours', 'Programada', 'Cita programada'),
(NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '10 hours', 'Programada', 'Cita programada'),
(NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '10 hours', 'Programada', 'Cita programada'),
(NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '10 hours', 'Programada', 'Cita programada'),
(NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '10 hours', 'Programada', 'Cita programada')
ON CONFLICT DO NOTHING;

-- =====================================================================
-- PASO 7: OBTENER IDS DINÁMICOS
-- =====================================================================
DO $$
DECLARE
    v_cliente_ids INT[];
    v_operario_ids INT[];
    v_buque_ids INT[];
    v_cita_completada_ids INT[];
    v_cita_vencida_ids INT[];
    v_cita_programada_ids INT[];
    v_slot_ids INT[];
    i INT;
    v_contenedor_id INT;
    v_ticket_id INT;
BEGIN
    -- Obtener IDs de clientes
    SELECT array_agg(id ORDER BY id) INTO v_cliente_ids
    FROM usuario WHERE id_rol = 3;
    
    -- Obtener IDs de operarios
    SELECT array_agg(id ORDER BY id) INTO v_operario_ids
    FROM usuario WHERE id_rol = 2;
    
    -- Obtener IDs de buques
    SELECT array_agg(id ORDER BY id) INTO v_buque_ids
    FROM buque WHERE activo = true;
    
    -- Obtener IDs de citas por estado
    SELECT array_agg(id ORDER BY id) INTO v_cita_completada_ids
    FROM cita_recojo WHERE estado = 'Completada';
    
    SELECT array_agg(id ORDER BY id) INTO v_cita_vencida_ids
    FROM cita_recojo WHERE estado = 'Vencida';
    
    SELECT array_agg(id ORDER BY id) INTO v_cita_programada_ids
    FROM cita_recojo WHERE estado = 'Programada';
    
    -- Obtener IDs de slots disponibles
    SELECT array_agg(id ORDER BY id) INTO v_slot_ids
    FROM ubicacion_slot WHERE estado = 'Vacio';

    -- Verificar que tenemos datos
    IF v_cliente_ids IS NULL OR array_length(v_cliente_ids, 1) = 0 THEN
        RAISE NOTICE 'No hay clientes en la base de datos';
        RETURN;
    END IF;
    
    IF v_operario_ids IS NULL OR array_length(v_operario_ids, 1) = 0 THEN
        RAISE NOTICE 'No hay operarios en la base de datos';
        RETURN;
    END IF;

    RAISE NOTICE 'Clientes encontrados: %', array_length(v_cliente_ids, 1);
    RAISE NOTICE 'Operarios encontrados: %', array_length(v_operario_ids, 1);
    RAISE NOTICE 'Buques encontrados: %', array_length(v_buque_ids, 1);

    -- =====================================================================
    -- CREAR CONTENEDORES PARA CADA CLIENTE
    -- =====================================================================
    FOR i IN 1..LEAST(array_length(v_cliente_ids, 1), 10) LOOP
        -- Contenedor con cita COMPLETADA (ticket finalizado)
        IF v_cita_completada_ids IS NOT NULL AND array_length(v_cita_completada_ids, 1) >= i THEN
            INSERT INTO contenedor (codigo_contenedor, dimensiones, tipo, peso, id_buque, id_cita_recojo, id_cliente, descripcion_carga)
            VALUES (
                'COMP-' || v_cliente_ids[i] || '-' || LPAD(i::text, 3, '0'),
                '12.19x2.44x2.59',
                'Seco',
                (15000 + random() * 10000)::numeric(10,2),
                v_buque_ids[((i-1) % array_length(v_buque_ids, 1)) + 1],
                v_cita_completada_ids[i],
                v_cliente_ids[i],
                'Mercadería general - Cliente ' || v_cliente_ids[i]
            )
            ON CONFLICT (codigo_contenedor) DO NOTHING
            RETURNING id INTO v_contenedor_id;
            
            -- Crear ticket FINALIZADO para este contenedor
            IF v_contenedor_id IS NOT NULL AND v_slot_ids IS NOT NULL AND array_length(v_slot_ids, 1) > 0 THEN
                INSERT INTO ticket (fecha_hora_entrada, fecha_hora_salida, estado, id_ubicacion, id_usuario, id_contenedor, observaciones)
                VALUES (
                    NOW() - INTERVAL '15 days' + (i || ' hours')::interval,
                    NOW() - INTERVAL '14 days' + (i || ' hours')::interval,
                    'Finalizado',
                    v_slot_ids[((i-1) % array_length(v_slot_ids, 1)) + 1],
                    v_operario_ids[((i-1) % array_length(v_operario_ids, 1)) + 1],
                    v_contenedor_id,
                    'Procesado correctamente por operario'
                )
                ON CONFLICT DO NOTHING
                RETURNING id INTO v_ticket_id;
                
                -- Crear factura PAGADA
                IF v_ticket_id IS NOT NULL THEN
                    INSERT INTO factura (fecha_emision, monto, estado, id_ticket, fecha_vencimiento, observaciones)
                    VALUES (
                        CURRENT_DATE - 14,
                        (500 + random() * 1000)::numeric(10,2),
                        'Pagada',
                        v_ticket_id,
                        CURRENT_DATE,
                        'Factura pagada'
                    )
                    ON CONFLICT DO NOTHING;
                END IF;
            END IF;
        END IF;

        -- Contenedor con cita VENCIDA (ticket activo - aún en puerto)
        IF v_cita_vencida_ids IS NOT NULL AND i <= array_length(v_cita_vencida_ids, 1) THEN
            INSERT INTO contenedor (codigo_contenedor, dimensiones, tipo, peso, id_buque, id_cita_recojo, id_cliente, descripcion_carga)
            VALUES (
                'VENC-' || v_cliente_ids[i] || '-' || LPAD(i::text, 3, '0'),
                CASE WHEN random() > 0.5 THEN '12.19x2.44x2.59' ELSE '6.06x2.44x2.59' END,
                CASE WHEN random() > 0.7 THEN 'Refrigerado' ELSE 'Seco' END,
                (12000 + random() * 15000)::numeric(10,2),
                v_buque_ids[((i-1) % array_length(v_buque_ids, 1)) + 1],
                v_cita_vencida_ids[i],
                v_cliente_ids[i],
                'Contenedor pendiente de retiro - Cliente ' || v_cliente_ids[i]
            )
            ON CONFLICT (codigo_contenedor) DO NOTHING
            RETURNING id INTO v_contenedor_id;
            
            -- Crear ticket ACTIVO (pendiente de retiro)
            IF v_contenedor_id IS NOT NULL AND v_slot_ids IS NOT NULL AND array_length(v_slot_ids, 1) > i THEN
                INSERT INTO ticket (fecha_hora_entrada, fecha_hora_salida, estado, id_ubicacion, id_usuario, id_contenedor, observaciones)
                VALUES (
                    NOW() - INTERVAL '7 days' + (i || ' hours')::interval,
                    NULL,
                    'Activo',
                    v_slot_ids[i + 5],
                    v_operario_ids[((i-1) % array_length(v_operario_ids, 1)) + 1],
                    v_contenedor_id,
                    'Pendiente de retiro - Cita vencida'
                )
                ON CONFLICT DO NOTHING
                RETURNING id INTO v_ticket_id;
                
                -- Marcar slot como ocupado
                UPDATE ubicacion_slot SET estado = 'Ocupado' WHERE id = v_slot_ids[i + 5];
                
                -- Crear factura VENCIDA
                IF v_ticket_id IS NOT NULL THEN
                    INSERT INTO factura (fecha_emision, monto, estado, id_ticket, fecha_vencimiento, observaciones)
                    VALUES (
                        CURRENT_DATE - 7,
                        (800 + random() * 500)::numeric(10,2),
                        'Vencida',
                        v_ticket_id,
                        CURRENT_DATE - 2,
                        'Factura vencida - Cargo por almacenaje'
                    )
                    ON CONFLICT DO NOTHING;
                END IF;
            END IF;
        END IF;

        -- Contenedor con cita PROGRAMADA (próximo a llegar)
        IF v_cita_programada_ids IS NOT NULL AND i <= array_length(v_cita_programada_ids, 1) THEN
            INSERT INTO contenedor (codigo_contenedor, dimensiones, tipo, peso, id_buque, id_cita_recojo, id_cliente, descripcion_carga)
            VALUES (
                'PROG-' || v_cliente_ids[i] || '-' || LPAD(i::text, 3, '0'),
                '12.19x2.44x2.59',
                CASE WHEN random() > 0.8 THEN 'Refrigerado' ELSE 'Seco' END,
                (14000 + random() * 12000)::numeric(10,2),
                v_buque_ids[((i-1) % array_length(v_buque_ids, 1)) + 1],
                v_cita_programada_ids[i],
                v_cliente_ids[i],
                'Carga programada para recojo - Cliente ' || v_cliente_ids[i]
            )
            ON CONFLICT (codigo_contenedor) DO NOTHING;
        END IF;
    END LOOP;

    RAISE NOTICE 'Contenedores y tickets creados exitosamente';
END $$;

-- =====================================================================
-- PASO 8: CREAR PAGOS PARA FACTURAS PAGADAS
-- =====================================================================
INSERT INTO pago (numero_operacion, fecha_pago, medio_pago, monto, id_factura)
SELECT 
    'PAG-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(f.id::text, 4, '0'),
    f.fecha_emision + INTERVAL '2 days',
    CASE 
        WHEN random() > 0.6 THEN 'Transferencia'
        WHEN random() > 0.3 THEN 'Tarjeta'
        ELSE 'Efectivo'
    END,
    f.monto,
    f.id
FROM factura f
WHERE f.estado = 'Pagada'
AND NOT EXISTS (SELECT 1 FROM pago p WHERE p.id_factura = f.id);

-- =====================================================================
-- PASO 9: CREAR REPORTES DE EJEMPLO
-- =====================================================================
INSERT INTO reporte (tipo, parametros, generado_por)
SELECT 
    tipo,
    parametros::jsonb,
    (SELECT id FROM usuario WHERE id_rol = 1 LIMIT 1)
FROM (VALUES
    ('Movimientos Diarios', '{"fecha": "' || CURRENT_DATE || '", "incluir_finalizados": true}'),
    ('Ocupación de Zonas', '{"zona": "todas", "tipo_contenedor": "todos"}'),
    ('Tickets Activos', '{"estado": "Activo", "ordenar_por": "fecha"}'),
    ('Facturas Pendientes', '{"estado": ["Pendiente", "Vencida"], "monto_minimo": 500}'),
    ('Contenedores por Cliente', '{"agrupar_por": "cliente", "periodo": "mensual"}'),
    ('Rendimiento Operarios', '{"periodo": "semanal", "incluir_metricas": true}'),
    ('Análisis de Buques', '{"top": 10, "ordenar_por": "contenedores"}'),
    ('Resumen Financiero', '{"periodo": "mensual", "incluir_proyeccion": true}')
) AS t(tipo, parametros)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- PASO 10: ACTUALIZAR CONTENEDORES EXISTENTES SIN CLIENTE
-- =====================================================================
WITH clientes AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM usuario WHERE id_rol = 3
),
contenedores_sin_cliente AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM contenedor WHERE id_cliente IS NULL
)
UPDATE contenedor c
SET id_cliente = (
    SELECT cl.id 
    FROM clientes cl 
    WHERE cl.rn = ((csc.rn - 1) % (SELECT COUNT(*) FROM clientes) + 1)
)
FROM contenedores_sin_cliente csc
WHERE c.id = csc.id AND c.id_cliente IS NULL;

-- =====================================================================
-- VERIFICACIÓN FINAL
-- =====================================================================
SELECT '========== RESUMEN DE DATOS ==========' as info;

SELECT tabla, total FROM (
    SELECT 'Usuarios' as tabla, COUNT(*) as total FROM usuario
    UNION ALL SELECT 'Administradores', COUNT(*) FROM usuario WHERE id_rol = 1
    UNION ALL SELECT 'Operarios', COUNT(*) FROM usuario WHERE id_rol = 2
    UNION ALL SELECT 'Clientes', COUNT(*) FROM usuario WHERE id_rol = 3
    UNION ALL SELECT 'Zonas', COUNT(*) FROM zona
    UNION ALL SELECT 'Slots Total', COUNT(*) FROM ubicacion_slot
    UNION ALL SELECT 'Slots Vacíos', COUNT(*) FROM ubicacion_slot WHERE estado = 'Vacio'
    UNION ALL SELECT 'Slots Ocupados', COUNT(*) FROM ubicacion_slot WHERE estado = 'Ocupado'
    UNION ALL SELECT 'Buques', COUNT(*) FROM buque
    UNION ALL SELECT 'Citas Total', COUNT(*) FROM cita_recojo
    UNION ALL SELECT 'Citas Programadas', COUNT(*) FROM cita_recojo WHERE estado = 'Programada'
    UNION ALL SELECT 'Citas Completadas', COUNT(*) FROM cita_recojo WHERE estado = 'Completada'
    UNION ALL SELECT 'Citas Vencidas', COUNT(*) FROM cita_recojo WHERE estado = 'Vencida'
    UNION ALL SELECT 'Contenedores', COUNT(*) FROM contenedor
    UNION ALL SELECT 'Tickets Total', COUNT(*) FROM ticket
    UNION ALL SELECT 'Tickets Activos', COUNT(*) FROM ticket WHERE estado = 'Activo'
    UNION ALL SELECT 'Tickets Finalizados', COUNT(*) FROM ticket WHERE estado = 'Finalizado'
    UNION ALL SELECT 'Facturas Total', COUNT(*) FROM factura
    UNION ALL SELECT 'Facturas Pagadas', COUNT(*) FROM factura WHERE estado = 'Pagada'
    UNION ALL SELECT 'Facturas Pendientes', COUNT(*) FROM factura WHERE estado = 'Pendiente'
    UNION ALL SELECT 'Facturas Vencidas', COUNT(*) FROM factura WHERE estado = 'Vencida'
    UNION ALL SELECT 'Pagos', COUNT(*) FROM pago
    UNION ALL SELECT 'Reportes', COUNT(*) FROM reporte
) t ORDER BY tabla;

-- Verificar datos por cliente
SELECT '========== DATOS POR CLIENTE ==========' as info;
SELECT 
    u.nombre as cliente,
    u.email,
    COUNT(DISTINCT c.id) as contenedores,
    COUNT(DISTINCT t.id) as tickets,
    COUNT(DISTINCT f.id) as facturas
FROM usuario u
LEFT JOIN contenedor c ON c.id_cliente = u.id
LEFT JOIN ticket t ON t.id_contenedor = c.id
LEFT JOIN factura f ON f.id_ticket = t.id
WHERE u.id_rol = 3
GROUP BY u.id, u.nombre, u.email
ORDER BY u.nombre
LIMIT 10;

-- Verificar datos para operarios
SELECT '========== TICKETS POR OPERARIO ==========' as info;
SELECT 
    u.nombre as operario,
    COUNT(t.id) as tickets_procesados,
    COUNT(CASE WHEN t.estado = 'Activo' THEN 1 END) as activos,
    COUNT(CASE WHEN t.estado = 'Finalizado' THEN 1 END) as finalizados
FROM usuario u
LEFT JOIN ticket t ON t.id_usuario = u.id
WHERE u.id_rol = 2
GROUP BY u.id, u.nombre
ORDER BY tickets_procesados DESC;

-- =====================================================================
-- ✅ SISTEMA COMPLETAMENTE POBLADO
-- =====================================================================
-- Ahora cada rol debería ver datos:
-- 
-- ADMINISTRADOR:
-- - Total de tickets, usuarios, slots
-- - Reportes generados
-- - Estadísticas del sistema
--
-- OPERARIO:
-- - Tickets que ha procesado
-- - Tickets activos pendientes
-- - Tickets finalizados
--
-- CLIENTE:
-- - Sus contenedores asignados
-- - Tickets de sus contenedores
-- - Facturas asociadas
-- =====================================================================
