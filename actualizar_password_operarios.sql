-- =====================================================================
-- ACTUALIZAR CONTRASEÑAS DE OPERARIOS
-- =====================================================================
-- Ejecuta este script en Supabase SQL Editor
-- Cambia las contraseñas de operarios de 'oper123' a 'operario123'
-- =====================================================================

-- Actualizar contraseñas de todos los operarios (id_rol = 2)
UPDATE usuario 
SET password = 'operario123' 
WHERE id_rol = 2;

-- Verificar el cambio
SELECT 
    id, 
    nombre, 
    email, 
    password,
    (SELECT rol FROM rol WHERE id = usuario.id_rol) as rol
FROM usuario 
WHERE id_rol = 2
ORDER BY id;

-- =====================================================================
-- ✅ CONTRASEÑAS ACTUALIZADAS
-- =====================================================================
-- Ahora todos los operarios tienen la contraseña: operario123
-- =====================================================================
