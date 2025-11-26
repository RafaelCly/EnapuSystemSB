# 🚀 Guía Rápida - Inicio del Proyecto

## ✅ Checklist de Configuración (5 minutos)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea el archivo `.env` en la raíz del proyecto:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
VITE_APP_ENV=development
```

> 💡 **¿Dónde obtengo las credenciales?**
>
> - Ve a [Supabase](https://supabase.com) → Settings → API
> - Copia `Project URL` y `anon public key`

### 3. Verificar base de datos

Abre Supabase → Table Editor y verifica que existan estas tablas:

- ✅ Usuario
- ✅ Ticket
- ✅ Contenedor
- ✅ Ubicacion_slot
- ✅ Zona
- ✅ Buque
- ✅ Factura
- ✅ Pago
- ✅ Cita_recojo
- ✅ Rol
- ✅ Nivel_acceso
- ✅ Reporte

**Si NO existen:**

1. Abre **SQL Editor** en Supabase
2. Copia todo el contenido de `supabase_migration_complete.sql`
3. Pégalo y haz clic en **Run**
4. Espera 30-60 segundos

### 4. Iniciar el proyecto

```bash
npm run dev
```

Abre tu navegador en: **http://localhost:5173**

---

## 🎯 Primeros Pasos

### Probar la conexión

1. Ve a http://localhost:5173
2. Si ves la página de inicio, ¡todo funciona! ✅
3. Si ves errores, revisa la consola del navegador (F12)

### Usuarios de prueba

El sistema viene con usuarios pre-cargados:

**Administrador**

- Email: `andrea.torres@enapu.com`
- Password: `admin123`

**Operario**

- Email: `juan.perez@enapu.com`
- Password: `oper123`

**Cliente**

- Email: `contacto@contenedoressur.com`
- Password: `cliente123`

---

## 🐛 Problemas Comunes

### ❌ "Cannot find module '@supabase/supabase-js'"

**Solución**: Instala las dependencias

```bash
npm install
```

### ❌ "VITE_SUPABASE_URL is undefined"

**Solución**: Crea el archivo `.env`

1. Verifica que existe `.env` en el root del proyecto
2. Verifica que tiene las variables correctas
3. Reinicia el servidor (`Ctrl+C` y `npm run dev`)

### ❌ "Failed to fetch from Supabase"

**Solución**: Verifica las credenciales

1. Ve a Supabase → Settings → API
2. Copia de nuevo `Project URL` y `anon public key`
3. Actualiza tu `.env`
4. Reinicia el servidor

### ❌ "relation 'Usuario' does not exist"

**Solución**: Ejecuta el script SQL

1. Ve a Supabase → SQL Editor
2. Ejecuta `supabase_migration_complete.sql`

---

## 📚 Próximos Pasos

1. **Lee el modelo de datos**: [MODELO_DATOS.md](./MODELO_DATOS.md)
2. **Explora las funciones API**: Revisa `src/lib/api.ts`
3. **Prueba crear un ticket**: Ve a la sección de Tickets
4. **Personaliza el sistema**: Edita componentes en `src/components/`

---

## 🚀 Deploy a Producción

### Vercel (Recomendado)

1. Haz push a GitHub
2. Importa en [Vercel](https://vercel.com)
3. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy ✅

---

## 📞 ¿Necesitas Ayuda?

- 📖 Ver documentación completa: [README.md](./README.md)
- 🗄️ Ver modelo de base de datos: [MODELO_DATOS.md](./MODELO_DATOS.md)
- 🔧 Ver guía de migración: [GUIA_MIGRACION_SUPABASE.md](./GUIA_MIGRACION_SUPABASE.md)

---

**¡Listo!** 🎉 Tu sistema ENAPU está configurado y funcionando.
