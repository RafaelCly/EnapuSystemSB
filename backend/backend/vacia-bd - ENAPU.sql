-- Eliminar todas las restricciones en cascada (FKs)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tab.relname AS table_name, con.conname AS constraint_name
        FROM pg_constraint con
        JOIN pg_class tab ON con.conrelid = tab.oid
        JOIN pg_namespace ns ON ns.oid = tab.relnamespace
        WHERE ns.nspname = 'public'
    )
    LOOP
        EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I CASCADE', r.table_name, r.constraint_name);
    END LOOP;
END $$;

-- Eliminar todas las tablas
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE;', r.tablename);
    END LOOP;
END $$;

-- Eliminar todas las vistas
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT table_name FROM information_schema.views WHERE table_schema = 'public') LOOP
        EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE;', r.table_name);
    END LOOP;
END $$;

-- Eliminar todas las secuencias
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
        EXECUTE format('DROP SEQUENCE IF EXISTS public.%I CASCADE;', r.sequence_name);
    END LOOP;
END $$;

-- Eliminar todos los tipos definidos por el usuario
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT t.typname
        FROM pg_type t
        LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid))
        AND NOT EXISTS (
            SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid
        )
        AND n.nspname = 'public'
        AND t.typname NOT LIKE '_%'  -- evitar arrays
        AND t.typcategory NOT IN ('A', 'P') -- evitar tipos base y pseudo tipos
    )
    LOOP
        EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE;', r.typname);
    END LOOP;
END $$;

-- Eliminar todas las funciones
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT p.oid::regprocedure::text AS func_sig
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
    )
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %s CASCADE;', r.func_sig);
    END LOOP;
END $$;

-- Eliminar todo en el esquema public
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;