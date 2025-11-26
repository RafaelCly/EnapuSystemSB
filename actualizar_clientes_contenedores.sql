-- =====================================================================
-- SCRIPT PARA ASOCIAR CLIENTES CON CONTENEDORES Y CREAR TICKETS
-- =====================================================================
-- Ejecuta este script en Supabase SQL Editor
-- Este script añade la relación cliente-contenedor y crea datos de ejemplo
-- =====================================================================

-- =====================================================================
-- PASO 1: AÑADIR COLUMNA id_cliente A CONTENEDOR (SI NO EXISTE)
-- =====================================================================
-- Esta columna relaciona cada contenedor con el cliente dueño

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'contenedor' AND column_name = 'id_cliente'
    ) THEN
        ALTER TABLE contenedor ADD COLUMN id_cliente INT REFERENCES usuario(id);
        CREATE INDEX idx_contenedor_cliente ON contenedor(id_cliente);
    END IF;
END $$;

-- =====================================================================
-- PASO 2: ASIGNAR CLIENTES A CONTENEDORES EXISTENTES
-- =====================================================================
-- Asignamos contenedores a diferentes clientes (usuarios con id_rol = 3)
-- Los clientes tienen IDs del 11 al 20 según el script de migración

-- Obtener IDs de clientes dinámicamente
DO $$
DECLARE
    cliente_ids INT[];
    contenedor_rec RECORD;
    cliente_idx INT := 0;
BEGIN
    -- Obtener array de IDs de clientes
    SELECT array_agg(id ORDER BY id) INTO cliente_ids
    FROM usuario WHERE id_rol = 3;
    
    -- Si hay clientes, asignar contenedores
    IF array_length(cliente_ids, 1) > 0 THEN
        FOR contenedor_rec IN SELECT id FROM contenedor WHERE id_cliente IS NULL ORDER BY id
        LOOP
            UPDATE contenedor 
            SET id_cliente = cliente_ids[(cliente_idx % array_length(cliente_ids, 1)) + 1]
            WHERE id = contenedor_rec.id;
            cliente_idx := cliente_idx + 1;
        END LOOP;
    END IF;
END $$;

-- =====================================================================
-- PASO 3: VERIFICAR ASIGNACIONES
-- =====================================================================
SELECT 
    c.id as contenedor_id,
    c.codigo_contenedor,
    c.tipo,
    u.id as cliente_id,
    u.nombre as cliente_nombre,
    u.empresa
FROM contenedor c
LEFT JOIN usuario u ON c.id_cliente = u.id
ORDER BY c.id;

-- =====================================================================
-- PASO 4: CREAR TICKETS ADICIONALES PARA CLIENTES
-- =====================================================================
-- Algunos tickets estarán asociados a los clientes (no solo operarios)
-- Esto es para que los clientes puedan ver sus tickets

-- Primero, crear tickets nuevos si hay slots disponibles
INSERT INTO ticket (fecha_hora_entrada, fecha_hora_salida, estado, id_ubicacion, id_usuario, id_contenedor, observaciones)
SELECT 
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '4 days',
    'Finalizado',
    (SELECT id FROM ubicacion_slot WHERE estado = 'Vacio' LIMIT 1 OFFSET 0),
    (SELECT id FROM usuario WHERE id_rol = 3 LIMIT 1 OFFSET 0), -- Primer cliente
    (SELECT id FROM contenedor WHERE id_cliente = (SELECT id FROM usuario WHERE id_rol = 3 LIMIT 1 OFFSET 0) LIMIT 1),
    'Ticket de cliente - Procesado'
WHERE EXISTS (SELECT 1 FROM ubicacion_slot WHERE estado = 'Vacio')
  AND EXISTS (SELECT 1 FROM usuario WHERE id_rol = 3)
  AND NOT EXISTS (
    SELECT 1 FROM ticket t 
    JOIN usuario u ON t.id_usuario = u.id 
    WHERE u.id_rol = 3
  )
ON CONFLICT DO NOTHING;

-- =====================================================================
-- PASO 5: VERIFICAR DATOS FINALES
-- =====================================================================

-- Resumen de usuarios por rol
SELECT 
    r.rol,
    COUNT(u.id) as cantidad
FROM rol r
LEFT JOIN usuario u ON r.id = u.id_rol
GROUP BY r.id, r.rol
ORDER BY r.id;

-- Resumen de contenedores por cliente
SELECT 
    COALESCE(u.nombre, 'Sin asignar') as cliente,
    COUNT(c.id) as contenedores
FROM contenedor c
LEFT JOIN usuario u ON c.id_cliente = u.id
GROUP BY u.nombre
ORDER BY contenedores DESC;

-- Resumen de tickets por tipo de usuario
SELECT 
    r.rol as tipo_usuario,
    COUNT(t.id) as tickets
FROM ticket t
JOIN usuario u ON t.id_usuario = u.id
JOIN rol r ON u.id_rol = r.id
GROUP BY r.rol
ORDER BY tickets DESC;

-- =====================================================================
-- ✅ SCRIPT COMPLETADO
-- =====================================================================
-- Ahora cada contenedor tiene un cliente asociado (id_cliente)
-- Los clientes pueden ver sus contenedores y tickets relacionados
-- =====================================================================
