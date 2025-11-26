-- =====================================================================
-- CONSULTAS SQL ÚTILES PARA EL SISTEMA ENAPU EN SUPABASE
-- =====================================================================
-- Este archivo contiene consultas SQL útiles para administrar y consultar
-- tu base de datos ENAPU en Supabase
-- =====================================================================

-- =====================================================================
-- SECCIÓN 1: CONSULTAS DE VERIFICACIÓN Y MONITOREO
-- =====================================================================

-- 1.1. Ver resumen general del sistema
SELECT 
    'Usuarios Activos' as metrica, 
    COUNT(*) as cantidad 
FROM Usuario WHERE activo = true

UNION ALL
SELECT 'Tickets Activos', COUNT(*) FROM Ticket WHERE estado = 'Activo'

UNION ALL
SELECT 'Contenedores en Puerto', COUNT(*) 
FROM Contenedor c
JOIN Ticket t ON c.id = t.id_contenedor
WHERE t.estado = 'Activo'

UNION ALL
SELECT 'Facturas Pendientes', COUNT(*) FROM Factura WHERE estado = 'Pendiente'

UNION ALL
SELECT 'Citas Programadas', COUNT(*) FROM Cita_recojo WHERE estado = 'Programada'

UNION ALL
SELECT 'Slots Disponibles', COUNT(*) FROM Ubicacion_slot WHERE estado = 'Vacio';


-- 1.2. Ver ocupación por zona
SELECT 
    z.nombre as zona,
    z.capacidad as capacidad_total,
    COUNT(CASE WHEN us.estado = 'Ocupado' THEN 1 END) as slots_ocupados,
    COUNT(CASE WHEN us.estado = 'Vacio' THEN 1 END) as slots_disponibles,
    ROUND(
        (COUNT(CASE WHEN us.estado = 'Ocupado' THEN 1 END)::NUMERIC / z.capacidad) * 100, 
        2
    ) as porcentaje_ocupacion
FROM Zona z
LEFT JOIN Ubicacion_slot us ON z.id = us.id_zona
GROUP BY z.id, z.nombre, z.capacidad
ORDER BY porcentaje_ocupacion DESC;


-- 1.3. Ver tickets activos con detalles completos
SELECT 
    t.id,
    t.numero_ticket,
    t.fecha_hora_entrada,
    EXTRACT(DAY FROM (NOW() - t.fecha_hora_entrada)) as dias_almacenado,
    u.nombre as operario,
    u.empresa as cliente_empresa,
    c.codigo_contenedor,
    c.tipo as tipo_contenedor,
    c.peso,
    b.nombre as buque,
    z.nombre as zona,
    CONCAT('F', us.fila, '-C', us.columna, '-N', us.nivel) as ubicacion,
    cr.estado as estado_cita,
    t.observaciones
FROM Ticket t
JOIN Usuario u ON t.id_usuario = u.id
JOIN Contenedor c ON t.id_contenedor = c.id
JOIN Buque b ON c.id_buque = b.id
JOIN Cita_recojo cr ON c.id_cita_recojo = cr.id
JOIN Ubicacion_slot us ON t.id_ubicacion = us.id
JOIN Zona z ON us.id_zona = z.id
WHERE t.estado = 'Activo'
ORDER BY t.fecha_hora_entrada DESC;


-- 1.4. Ver citas vencidas (contenedores que debieron ser retirados)
SELECT 
    cr.id as cita_id,
    cr.fecha_salida_horario as fecha_debia_retirarse,
    EXTRACT(DAY FROM (NOW() - cr.fecha_salida_horario)) as dias_vencido,
    c.codigo_contenedor,
    c.tipo,
    t.numero_ticket,
    u.empresa as cliente,
    u.telefono as contacto
FROM Cita_recojo cr
JOIN Contenedor c ON c.id_cita_recojo = cr.id
JOIN Ticket t ON t.id_contenedor = c.id
LEFT JOIN Usuario u ON t.id_usuario = u.id
WHERE cr.estado = 'Vencida' 
  AND t.estado = 'Activo'
ORDER BY dias_vencido DESC;


-- 1.5. Ver facturas pendientes y vencidas
SELECT 
    f.id,
    f.numero_factura,
    f.fecha_emision,
    f.fecha_vencimiento,
    CASE 
        WHEN f.fecha_vencimiento < CURRENT_DATE THEN 'VENCIDA'
        WHEN f.fecha_vencimiento = CURRENT_DATE THEN 'VENCE HOY'
        ELSE 'PENDIENTE'
    END as urgencia,
    f.monto,
    t.numero_ticket,
    u.nombre as cliente,
    u.email,
    u.telefono
FROM Factura f
JOIN Ticket t ON f.id_ticket = t.id
JOIN Usuario u ON t.id_usuario = u.id
WHERE f.estado IN ('Pendiente', 'Vencida')
ORDER BY f.fecha_vencimiento ASC;


-- =====================================================================
-- SECCIÓN 2: CONSULTAS DE ANÁLISIS Y REPORTES
-- =====================================================================

-- 2.1. Reporte de ingresos por período
SELECT 
    DATE_TRUNC('month', p.fecha_pago) as mes,
    COUNT(DISTINCT p.id_factura) as facturas_pagadas,
    SUM(p.monto) as total_ingresos,
    COUNT(p.id) as cantidad_pagos,
    ROUND(AVG(p.monto), 2) as promedio_por_pago
FROM Pago p
GROUP BY DATE_TRUNC('month', p.fecha_pago)
ORDER BY mes DESC;


-- 2.2. Análisis de contenedores por tipo
SELECT 
    c.tipo,
    COUNT(*) as total_contenedores,
    COUNT(CASE WHEN t.estado = 'Activo' THEN 1 END) as en_puerto,
    COUNT(CASE WHEN t.estado = 'Finalizado' THEN 1 END) as procesados,
    ROUND(AVG(c.peso), 2) as peso_promedio,
    ROUND(AVG(EXTRACT(EPOCH FROM (t.fecha_hora_salida - t.fecha_hora_entrada))/86400), 2) as dias_promedio_almacenaje
FROM Contenedor c
LEFT JOIN Ticket t ON c.id = t.id_contenedor
GROUP BY c.tipo
ORDER BY total_contenedores DESC;


-- 2.3. Rendimiento de operarios
SELECT 
    u.id,
    u.nombre as operario,
    COUNT(t.id) as tickets_procesados,
    COUNT(CASE WHEN t.estado = 'Activo' THEN 1 END) as tickets_activos,
    COUNT(CASE WHEN t.estado = 'Finalizado' THEN 1 END) as tickets_finalizados,
    ROUND(
        AVG(EXTRACT(EPOCH FROM (t.fecha_hora_salida - t.fecha_hora_entrada))/3600), 
        2
    ) as horas_promedio_procesamiento
FROM Usuario u
LEFT JOIN Ticket t ON u.id = t.id_usuario
WHERE u.id_rol = 2  -- Solo operarios
GROUP BY u.id, u.nombre
ORDER BY tickets_procesados DESC;


-- 2.4. Análisis de buques
SELECT 
    b.nombre as buque,
    b.linea_naviera,
    COUNT(DISTINCT c.id) as contenedores_transportados,
    COUNT(DISTINCT t.id) as tickets_generados,
    SUM(c.peso) as peso_total_kg,
    ROUND(SUM(c.peso)/1000, 2) as peso_total_toneladas
FROM Buque b
LEFT JOIN Contenedor c ON b.id = c.id_buque
LEFT JOIN Ticket t ON c.id = t.id_contenedor
GROUP BY b.id, b.nombre, b.linea_naviera
ORDER BY contenedores_transportados DESC;


-- 2.5. Slots más utilizados
SELECT 
    CONCAT('Fila ', us.fila, ' - Col ', us.columna, ' - Nivel ', us.nivel) as ubicacion,
    z.nombre as zona,
    COUNT(t.id) as veces_utilizado,
    MAX(t.fecha_hora_entrada) as ultimo_uso
FROM Ubicacion_slot us
JOIN Zona z ON us.id_zona = z.id
LEFT JOIN Ticket t ON us.id = t.id_ubicacion
GROUP BY us.id, us.fila, us.columna, us.nivel, z.nombre
HAVING COUNT(t.id) > 0
ORDER BY veces_utilizado DESC
LIMIT 20;


-- =====================================================================
-- SECCIÓN 3: CONSULTAS DE BÚSQUEDA
-- =====================================================================

-- 3.1. Buscar contenedor por código
SELECT 
    c.id,
    c.codigo_contenedor,
    c.tipo,
    c.peso,
    c.dimensiones,
    c.descripcion_carga,
    b.nombre as buque,
    cr.fecha_inicio_horario as fecha_cita,
    cr.estado as estado_cita,
    t.numero_ticket,
    t.estado as estado_ticket,
    t.fecha_hora_entrada,
    t.fecha_hora_salida,
    z.nombre as zona_actual,
    CONCAT('F', us.fila, '-C', us.columna, '-N', us.nivel) as ubicacion_actual
FROM Contenedor c
LEFT JOIN Buque b ON c.id_buque = b.id
LEFT JOIN Cita_recojo cr ON c.id_cita_recojo = cr.id
LEFT JOIN Ticket t ON c.id = t.id_contenedor
LEFT JOIN Ubicacion_slot us ON t.id_ubicacion = us.id
LEFT JOIN Zona z ON us.id_zona = z.id
WHERE c.codigo_contenedor = 'MSCU1234567';  -- Reemplaza con el código que buscas


-- 3.2. Buscar por empresa/cliente
SELECT 
    u.nombre as cliente,
    u.email,
    u.telefono,
    COUNT(DISTINCT t.id) as total_tickets,
    COUNT(CASE WHEN t.estado = 'Activo' THEN 1 END) as tickets_activos,
    COUNT(DISTINCT f.id) as facturas_generadas,
    COALESCE(SUM(f.monto), 0) as total_facturado,
    COALESCE(SUM(CASE WHEN f.estado = 'Pagada' THEN f.monto ELSE 0 END), 0) as total_pagado,
    COALESCE(SUM(CASE WHEN f.estado = 'Pendiente' THEN f.monto ELSE 0 END), 0) as total_pendiente
FROM Usuario u
LEFT JOIN Ticket t ON u.id = t.id_usuario
LEFT JOIN Factura f ON t.id = f.id_ticket
WHERE u.id_rol = 3  -- Solo clientes
  AND u.empresa ILIKE '%Sur%'  -- Reemplaza con el término de búsqueda
GROUP BY u.id, u.nombre, u.email, u.telefono;


-- 3.3. Buscar slots disponibles por zona
SELECT 
    z.nombre as zona,
    us.fila,
    us.columna,
    us.nivel,
    CONCAT('F', us.fila, '-C', us.columna, '-N', us.nivel) as codigo_slot,
    us.estado
FROM Ubicacion_slot us
JOIN Zona z ON us.id_zona = z.id
WHERE us.estado = 'Vacio'
  AND z.nombre = 'Estandar Seco'  -- Cambia según la zona que necesites
ORDER BY us.fila, us.columna, us.nivel;


-- =====================================================================
-- SECCIÓN 4: OPERACIONES COMUNES
-- =====================================================================

-- 4.1. Crear un nuevo ticket (ejemplo)
-- NOTA: Los valores deben ser reemplazados con datos reales
/*
INSERT INTO Ticket (
    fecha_hora_entrada,
    estado,
    id_ubicacion,
    id_usuario,
    id_contenedor,
    observaciones
) VALUES (
    NOW(),
    'Activo',
    10,  -- ID de una ubicación vacía
    3,   -- ID del operario
    15,  -- ID del contenedor
    'Ingreso contenedor refrigerado'
)
RETURNING *;
*/


-- 4.2. Finalizar un ticket
/*
UPDATE Ticket
SET 
    estado = 'Finalizado',
    fecha_hora_salida = NOW()
WHERE id = 1  -- ID del ticket a finalizar
RETURNING *;
*/


-- 4.3. Crear una factura para un ticket
/*
INSERT INTO Factura (
    fecha_emision,
    monto,
    estado,
    id_ticket,
    fecha_vencimiento
) VALUES (
    CURRENT_DATE,
    850.00,
    'Pendiente',
    1,  -- ID del ticket
    CURRENT_DATE + INTERVAL '15 days'
)
RETURNING *;
*/


-- 4.4. Registrar un pago
/*
INSERT INTO Pago (
    numero_operacion,
    fecha_pago,
    medio_pago,
    monto,
    id_factura
) VALUES (
    'OP-20251126-001',
    CURRENT_DATE,
    'Transferencia',
    850.00,
    1  -- ID de la factura
)
RETURNING *;

-- Actualizar el estado de la factura a 'Pagada'
UPDATE Factura
SET estado = 'Pagada'
WHERE id = 1;
*/


-- 4.5. Actualizar estado de una cita a completada
/*
UPDATE Cita_recojo
SET estado = 'Completada'
WHERE id = 9  -- ID de la cita
RETURNING *;
*/


-- =====================================================================
-- SECCIÓN 5: CONSULTAS DE LIMPIEZA Y MANTENIMIENTO
-- =====================================================================

-- 5.1. Marcar citas como vencidas automáticamente
UPDATE Cita_recojo
SET estado = 'Vencida'
WHERE estado = 'Programada'
  AND fecha_salida_horario < NOW()
RETURNING id, fecha_salida_horario, estado;


-- 5.2. Marcar facturas como vencidas automáticamente
UPDATE Factura
SET estado = 'Vencida'
WHERE estado = 'Pendiente'
  AND fecha_vencimiento < CURRENT_DATE
RETURNING id, numero_factura, fecha_vencimiento, estado;


-- 5.3. Ver registros duplicados de contenedores (si existieran)
SELECT 
    codigo_contenedor,
    COUNT(*) as cantidad
FROM Contenedor
WHERE codigo_contenedor IS NOT NULL
GROUP BY codigo_contenedor
HAVING COUNT(*) > 1;


-- 5.4. Ver slots en estado inconsistente (ocupados sin ticket activo)
SELECT 
    us.id,
    CONCAT('F', us.fila, '-C', us.columna, '-N', us.nivel) as ubicacion,
    us.estado,
    COUNT(t.id) as tickets_activos
FROM Ubicacion_slot us
LEFT JOIN Ticket t ON us.id = t.id_ubicacion AND t.estado = 'Activo'
WHERE us.estado = 'Ocupado'
GROUP BY us.id, us.fila, us.columna, us.nivel, us.estado
HAVING COUNT(t.id) = 0;

-- Corregir inconsistencias (CUIDADO: verifica antes de ejecutar)
/*
UPDATE Ubicacion_slot
SET estado = 'Vacio'
WHERE id IN (
    SELECT us.id
    FROM Ubicacion_slot us
    LEFT JOIN Ticket t ON us.id = t.id_ubicacion AND t.estado = 'Activo'
    WHERE us.estado = 'Ocupado'
    GROUP BY us.id
    HAVING COUNT(t.id) = 0
);
*/


-- =====================================================================
-- SECCIÓN 6: FUNCIONES AUXILIARES ÚTILES
-- =====================================================================

-- 6.1. Función para calcular el costo de almacenaje
-- (basado en días y tipo de contenedor)
CREATE OR REPLACE FUNCTION calcular_costo_almacenaje(
    p_ticket_id INT
)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    v_dias_almacenaje NUMERIC;
    v_tipo_contenedor VARCHAR(20);
    v_tarifa_diaria DECIMAL(10, 2);
    v_costo_total DECIMAL(10, 2);
BEGIN
    -- Obtener días de almacenaje y tipo de contenedor
    SELECT 
        EXTRACT(DAY FROM (COALESCE(t.fecha_hora_salida, NOW()) - t.fecha_hora_entrada)),
        c.tipo
    INTO v_dias_almacenaje, v_tipo_contenedor
    FROM Ticket t
    JOIN Contenedor c ON t.id_contenedor = c.id
    WHERE t.id = p_ticket_id;
    
    -- Definir tarifas según tipo
    v_tarifa_diaria := CASE 
        WHEN v_tipo_contenedor = 'Seco' THEN 50.00
        WHEN v_tipo_contenedor = 'Refrigerado' THEN 120.00
        WHEN v_tipo_contenedor = 'Open Top' THEN 70.00
        WHEN v_tipo_contenedor = 'Flat Rack' THEN 80.00
        WHEN v_tipo_contenedor = 'Tanque' THEN 100.00
        ELSE 50.00
    END;
    
    -- Calcular costo (mínimo 1 día)
    v_costo_total := GREATEST(v_dias_almacenaje, 1) * v_tarifa_diaria;
    
    RETURN v_costo_total;
END;
$$ LANGUAGE plpgsql;

-- Uso de la función:
-- SELECT calcular_costo_almacenaje(1);


-- 6.2. Función para obtener slots disponibles por tipo de contenedor
CREATE OR REPLACE FUNCTION obtener_slots_disponibles(
    p_tipo_contenedor VARCHAR(20)
)
RETURNS TABLE (
    slot_id INT,
    zona_nombre VARCHAR(50),
    ubicacion TEXT,
    fila INT,
    columna INT,
    nivel INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        us.id,
        z.nombre,
        CONCAT('F', us.fila, '-C', us.columna, '-N', us.nivel)::TEXT,
        us.fila,
        us.columna,
        us.nivel
    FROM Ubicacion_slot us
    JOIN Zona z ON us.id_zona = z.id
    WHERE us.estado = 'Vacio'
      AND (
          (p_tipo_contenedor = 'Refrigerado' AND z.nombre = 'Especializada Reefer')
          OR (p_tipo_contenedor != 'Refrigerado' AND z.nombre != 'Especializada Reefer')
      )
    ORDER BY z.id, us.fila, us.columna, us.nivel;
END;
$$ LANGUAGE plpgsql;

-- Uso de la función:
-- SELECT * FROM obtener_slots_disponibles('Refrigerado');


-- =====================================================================
-- SECCIÓN 7: VISTAS ÚTILES
-- =====================================================================

-- 7.1. Vista de tickets activos con detalles
CREATE OR REPLACE VIEW vista_tickets_activos AS
SELECT 
    t.id as ticket_id,
    t.numero_ticket,
    t.fecha_hora_entrada,
    EXTRACT(DAY FROM (NOW() - t.fecha_hora_entrada))::INT as dias_almacenado,
    u.nombre as operario,
    u.empresa as cliente,
    u.email as email_cliente,
    u.telefono as telefono_cliente,
    c.codigo_contenedor,
    c.tipo as tipo_contenedor,
    c.peso,
    c.descripcion_carga,
    b.nombre as buque,
    b.linea_naviera,
    z.nombre as zona,
    CONCAT('F', us.fila, '-C', us.columna, '-N', us.nivel) as ubicacion,
    cr.fecha_salida_horario as fecha_retiro_programada,
    cr.estado as estado_cita,
    t.observaciones
FROM Ticket t
JOIN Usuario u ON t.id_usuario = u.id
JOIN Contenedor c ON t.id_contenedor = c.id
JOIN Buque b ON c.id_buque = b.id
JOIN Cita_recojo cr ON c.id_cita_recojo = cr.id
JOIN Ubicacion_slot us ON t.id_ubicacion = us.id
JOIN Zona z ON us.id_zona = z.id
WHERE t.estado = 'Activo';

-- Uso: SELECT * FROM vista_tickets_activos;


-- 7.2. Vista de estado financiero
CREATE OR REPLACE VIEW vista_estado_financiero AS
SELECT 
    u.id as cliente_id,
    u.nombre as cliente,
    u.empresa,
    COUNT(DISTINCT f.id) as total_facturas,
    COUNT(CASE WHEN f.estado = 'Pendiente' THEN 1 END) as facturas_pendientes,
    COUNT(CASE WHEN f.estado = 'Pagada' THEN 1 END) as facturas_pagadas,
    COUNT(CASE WHEN f.estado = 'Vencida' THEN 1 END) as facturas_vencidas,
    COALESCE(SUM(f.monto), 0) as total_facturado,
    COALESCE(SUM(CASE WHEN f.estado = 'Pagada' THEN f.monto ELSE 0 END), 0) as total_pagado,
    COALESCE(SUM(CASE WHEN f.estado IN ('Pendiente', 'Vencida') THEN f.monto ELSE 0 END), 0) as saldo_pendiente
FROM Usuario u
LEFT JOIN Ticket t ON u.id = t.id_usuario
LEFT JOIN Factura f ON t.id = f.id_ticket
WHERE u.id_rol = 3
GROUP BY u.id, u.nombre, u.empresa;

-- Uso: SELECT * FROM vista_estado_financiero WHERE saldo_pendiente > 0;


-- =====================================================================
-- FIN DEL ARCHIVO
-- =====================================================================
-- Para ejecutar cualquiera de estas consultas:
-- 1. Abre el SQL Editor en Supabase
-- 2. Copia la consulta que necesites
-- 3. Haz clic en "Run"
-- 
-- Recuerda ajustar los parámetros según tus necesidades
-- =====================================================================
