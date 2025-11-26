
---Modificacion de tablas (añadir columna de auditoria)

-- Añade la columna 'fecha_modificacion' a las tablas principales
ALTER TABLE Usuario ADD COLUMN fecha_modificacion TIMESTAMP;
ALTER TABLE Ticket ADD COLUMN fecha_modificacion TIMESTAMP;
-- Puedes añadir esta columna a otras tablas (Factura, Cita_recojo, etc.) si lo necesitas en el futuro.


---Funciones

-- Función para actualizar la marca de tiempo de modificación automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    -- Asigna la hora actual a la nueva fila que se está insertando/actualizando
    NEW.fecha_modificacion = NOW(); 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


---Triggers

-- Se ejecuta ANTES de cualquier UPDATE en la tabla 'usuario'
CREATE TRIGGER trigger_usuario_modificacion
BEFORE UPDATE ON usuario
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Se ejecuta ANTES de cualquier UPDATE en la tabla 'ticket'
CREATE TRIGGER trigger_ticket_modificacion
BEFORE UPDATE ON ticket
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();


---Índices críticos

-- 1. Para buscar usuarios por rol (ej. encontrar todos los operarios)
CREATE INDEX idx_usuario_rol ON Usuario(id_rol);

-- 2. Para filtrar tickets por su estado (ej. buscar todos los tickets 'Activo')
CREATE INDEX idx_ticket_estado ON Ticket(estado);

-- 3. Para buscar contenedores por el buque que los trajo
CREATE INDEX idx_contenedor_buque ON Contenedor(id_buque);

-- 4. Para consultar la ocupación buscando por zona
CREATE INDEX idx_slot_zona ON Ubicacion_slot(id_zona);