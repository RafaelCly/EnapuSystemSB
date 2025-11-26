-- =====================================================================
-- SCRIPT COMPLETO PARA POBLAR DATOS - SISTEMA ENAPU
-- =====================================================================
-- EJECUTA ESTE SCRIPT EN SUPABASE SQL EDITOR
-- Este script:
-- 1. Añade la columna id_cliente a contenedor (si no existe)
-- 2. Asocia contenedores con clientes
-- 3. Crea datos completos de ejemplo
-- =====================================================================

-- =====================================================================
-- PASO 1: AÑADIR COLUMNA id_cliente A CONTENEDOR
-- =====================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'contenedor' AND column_name = 'id_cliente'
    ) THEN
        ALTER TABLE contenedor ADD COLUMN id_cliente INT REFERENCES usuario(id);
        CREATE INDEX IF NOT EXISTS idx_contenedor_cliente ON contenedor(id_cliente);
        RAISE NOTICE 'Columna id_cliente añadida a contenedor';
    ELSE
        RAISE NOTICE 'Columna id_cliente ya existe';
    END IF;
END $$;

-- =====================================================================
-- PASO 2: ASIGNAR CLIENTES A CONTENEDORES EXISTENTES
-- =====================================================================
-- Asignamos cada contenedor a un cliente diferente de forma rotativa

WITH clientes AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM usuario 
    WHERE id_rol = 3  -- Solo clientes
),
contenedores_sin_cliente AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM contenedor
    WHERE id_cliente IS NULL
)
UPDATE contenedor c
SET id_cliente = (
    SELECT cl.id 
    FROM clientes cl 
    WHERE cl.rn = ((csc.rn - 1) % (SELECT COUNT(*) FROM clientes) + 1)
)
FROM contenedores_sin_cliente csc
WHERE c.id = csc.id;

-- =====================================================================
-- PASO 3: CREAR CITAS DE RECOJO ADICIONALES PARA CLIENTES
-- =====================================================================
-- Insertamos más citas para tener datos variados

INSERT INTO cita_recojo (fecha_inicio_horario, fecha_salida_horario, estado, observaciones)
SELECT * FROM (VALUES
    -- Citas para hoy y mañana (Programadas)
    (NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '10 hours', 'Programada', 'Cita programada para mañana'),
    (NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '10 hours', 'Programada', 'Cita programada'),
    (NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '10 hours', 'Programada', 'Cita programada'),
    
    -- Citas completadas recientes
    (NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '10 hours', 'Completada', 'Recojo completado'),
    (NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '10 hours', 'Completada', 'Recojo completado'),
    
    -- Citas vencidas
    (NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days' + INTERVAL '10 hours', 'Vencida', 'Cita vencida - no recogido')
) AS v(f1, f2, e, o)
WHERE NOT EXISTS (
    SELECT 1 FROM cita_recojo 
    WHERE fecha_inicio_horario::date = v.f1::date
);

-- =====================================================================
-- PASO 4: CREAR CONTENEDORES ADICIONALES PARA CLIENTES
-- =====================================================================
-- Más contenedores asociados a clientes específicos

DO $$
DECLARE
    cliente_id INT;
    cita_id INT;
    buque_id INT;
BEGIN
    -- Para cada cliente, crear 1-2 contenedores si no tiene suficientes
    FOR cliente_id IN (SELECT id FROM usuario WHERE id_rol = 3 LIMIT 5)
    LOOP
        -- Verificar si el cliente tiene menos de 2 contenedores
        IF (SELECT COUNT(*) FROM contenedor WHERE id_cliente = cliente_id) < 2 THEN
            -- Obtener una cita disponible
            SELECT id INTO cita_id FROM cita_recojo WHERE estado = 'Programada' LIMIT 1;
            -- Obtener un buque
            SELECT id INTO buque_id FROM buque LIMIT 1;
            
            IF cita_id IS NOT NULL AND buque_id IS NOT NULL THEN
                INSERT INTO contenedor (
                    codigo_contenedor, dimensiones, tipo, peso, 
                    id_buque, id_cita_recojo, id_cliente, 
                    descripcion_carga, temperatura_requerida
                ) VALUES (
                    'CLI' || cliente_id || '-' || LPAD((random() * 9999)::int::text, 4, '0'),
                    '12.19x2.44x2.59',
                    CASE WHEN random() > 0.7 THEN 'Refrigerado' ELSE 'Seco' END,
                    (random() * 20000 + 10000)::numeric(10,2),
                    buque_id,
                    cita_id,
                    cliente_id,
                    'Mercadería general del cliente ' || cliente_id,
                    CASE WHEN random() > 0.7 THEN -18.00 ELSE NULL END
                )
                ON CONFLICT (codigo_contenedor) DO NOTHING;
            END IF;
        END IF;
    END LOOP;
END $$;

-- =====================================================================
-- PASO 5: CREAR TICKETS PARA CONTENEDORES DE CLIENTES
-- =====================================================================
-- Asegurarnos de que hay tickets asociados a contenedores de clientes

DO $$
DECLARE
    cont_rec RECORD;
    slot_id INT;
    operario_id INT;
BEGIN
    -- Para cada contenedor que no tenga ticket, crear uno
    FOR cont_rec IN (
        SELECT c.id as contenedor_id, c.id_cliente, c.id_cita_recojo, cr.estado as cita_estado
        FROM contenedor c
        JOIN cita_recojo cr ON c.id_cita_recojo = cr.id
        WHERE c.id_cliente IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM ticket t WHERE t.id_contenedor = c.id)
        LIMIT 10
    )
    LOOP
        -- Obtener un slot disponible
        SELECT id INTO slot_id 
        FROM ubicacion_slot 
        WHERE estado = 'Vacio' 
        LIMIT 1;
        
        -- Obtener un operario
        SELECT id INTO operario_id 
        FROM usuario 
        WHERE id_rol = 2 
        ORDER BY random() 
        LIMIT 1;
        
        IF slot_id IS NOT NULL AND operario_id IS NOT NULL THEN
            INSERT INTO ticket (
                fecha_hora_entrada, 
                fecha_hora_salida, 
                estado, 
                id_ubicacion, 
                id_usuario, 
                id_contenedor, 
                observaciones
            ) VALUES (
                NOW() - INTERVAL '3 days',
                CASE 
                    WHEN cont_rec.cita_estado = 'Completada' THEN NOW() - INTERVAL '2 days'
                    ELSE NULL
                END,
                CASE 
                    WHEN cont_rec.cita_estado = 'Completada' THEN 'Finalizado'
                    ELSE 'Activo'
                END,
                slot_id,
                operario_id,
                cont_rec.contenedor_id,
                'Ticket generado para cliente'
            );
            
            -- Actualizar el estado del slot si el ticket está activo
            IF cont_rec.cita_estado != 'Completada' THEN
                UPDATE ubicacion_slot SET estado = 'Ocupado' WHERE id = slot_id;
            END IF;
        END IF;
    END LOOP;
END $$;

-- =====================================================================
-- PASO 6: CREAR FACTURAS PARA TICKETS NUEVOS
-- =====================================================================
INSERT INTO factura (fecha_emision, monto, estado, id_ticket, fecha_vencimiento, observaciones)
SELECT 
    CURRENT_DATE,
    (random() * 1000 + 500)::numeric(10,2),
    CASE 
        WHEN t.estado = 'Finalizado' THEN 'Pagada'
        ELSE 'Pendiente'
    END,
    t.id,
    CURRENT_DATE + INTERVAL '15 days',
    'Factura generada automáticamente'
FROM ticket t
WHERE NOT EXISTS (SELECT 1 FROM factura f WHERE f.id_ticket = t.id)
LIMIT 10;

-- =====================================================================
-- VERIFICACIÓN FINAL
-- =====================================================================

-- Resumen de datos
SELECT '=== RESUMEN DE DATOS ===' as info;

SELECT 'Usuarios' as tabla, COUNT(*) as total FROM usuario
UNION ALL SELECT 'Roles', COUNT(*) FROM rol
UNION ALL SELECT 'Zonas', COUNT(*) FROM zona
UNION ALL SELECT 'Ubicaciones/Slots', COUNT(*) FROM ubicacion_slot
UNION ALL SELECT 'Buques', COUNT(*) FROM buque
UNION ALL SELECT 'Citas de Recojo', COUNT(*) FROM cita_recojo
UNION ALL SELECT 'Contenedores', COUNT(*) FROM contenedor
UNION ALL SELECT 'Tickets', COUNT(*) FROM ticket
UNION ALL SELECT 'Facturas', COUNT(*) FROM factura
UNION ALL SELECT 'Pagos', COUNT(*) FROM pago
ORDER BY tabla;

-- Usuarios por rol
SELECT '=== USUARIOS POR ROL ===' as info;
SELECT r.rol, COUNT(u.id) as cantidad
FROM rol r
LEFT JOIN usuario u ON r.id = u.id_rol
GROUP BY r.id, r.rol
ORDER BY r.id;

-- Contenedores por cliente
SELECT '=== CONTENEDORES POR CLIENTE ===' as info;
SELECT 
    COALESCE(u.nombre, 'SIN ASIGNAR') as cliente,
    u.email,
    COUNT(c.id) as contenedores
FROM contenedor c
LEFT JOIN usuario u ON c.id_cliente = u.id
GROUP BY u.id, u.nombre, u.email
ORDER BY contenedores DESC
LIMIT 15;

-- Tickets por estado
SELECT '=== TICKETS POR ESTADO ===' as info;
SELECT estado, COUNT(*) as cantidad
FROM ticket
GROUP BY estado;

-- Verificar tickets con contenedores de clientes
SELECT '=== TICKETS DE CLIENTES (para verificar que el sistema funciona) ===' as info;
SELECT 
    t.id as ticket_id,
    t.estado as ticket_estado,
    c.codigo_contenedor,
    cli.nombre as cliente,
    cli.email as cliente_email,
    op.nombre as operario_procesado
FROM ticket t
JOIN contenedor c ON t.id_contenedor = c.id
LEFT JOIN usuario cli ON c.id_cliente = cli.id
LEFT JOIN usuario op ON t.id_usuario = op.id
WHERE c.id_cliente IS NOT NULL
ORDER BY t.id DESC
LIMIT 20;

-- =====================================================================
-- ✅ DATOS POBLADOS CORRECTAMENTE
-- =====================================================================
-- Ahora tienes:
-- - Usuarios: Administradores, Operarios y Clientes
-- - Contenedores asociados a clientes (id_cliente)
-- - Tickets vinculados a contenedores de clientes
-- - El sistema mostrará los tickets de cada cliente basado en sus contenedores
-- =====================================================================
