-- Agregar columnas faltantes a la tabla Usuario
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS email VARCHAR(100) DEFAULT '';
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT '';
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS telefono VARCHAR(20);
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS empresa VARCHAR(100);
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;

-- Crear índice único para email
CREATE UNIQUE INDEX IF NOT EXISTS usuario_email_unique ON "Usuario"(email);

-- Actualizar registros existentes si los hay
UPDATE "Usuario" SET email = CONCAT(nombre, '@enapu.com') WHERE email = '';
UPDATE "Usuario" SET password = 'pbkdf2_sha256$600000$dummy$dummy' WHERE password = '';
